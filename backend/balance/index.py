import hashlib
import json
import os
import smtplib
import psycopg2
from email.mime.text import MIMEText
from urllib.parse import parse_qs

S = 't_p38899835_cloud_sync_6'


def esc(val):
    if val is None:
        return 'NULL'
    return "'" + str(val).replace("'", "''") + "'"


def send_withdrawal_email(req_id, user_name, user_email, amount, sbp_phone, sbp_bank):
    admin_email = os.environ.get('ADMIN_EMAIL', '')
    if not admin_email:
        return
    admin_url = os.environ.get('ADMIN_SITE_URL', 'https://your-site.ru/admin')
    body = f"""Новая заявка на вывод средств!

ID заявки: #{req_id}
Пользователь: {user_name} ({user_email})
Сумма: {amount} руб.
Телефон СБП: {sbp_phone}
Банк: {sbp_bank}

Перейти в админ-панель для подтверждения:
{admin_url}

---
Это автоматическое письмо, не отвечайте на него.
"""
    msg = MIMEText(body, 'plain', 'utf-8')
    msg['Subject'] = f'[Вывод #{req_id}] {user_name} — {amount} руб.'
    msg['From'] = 'noreply@poehali.dev'
    msg['To'] = admin_email
    try:
        with smtplib.SMTP('smtp.poehali.dev', 587, timeout=10) as s:
            s.sendmail('noreply@poehali.dev', [admin_email], msg.as_string())
    except Exception:
        pass


def get_db():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def handler(event: dict, context) -> dict:
    """Управление балансом: пополнение, вывод, история транзакций. Также принимает webhook от ЮМани."""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token, X-Session-Id', 'Access-Control-Max-Age': '86400'}, 'body': ''}

    headers = {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}

    content_type = ''
    for k, v in (event.get('headers') or {}).items():
        if k.lower() == 'content-type':
            content_type = v.lower()
            break

    if 'application/x-www-form-urlencoded' in content_type:
        return handle_yoomoney_webhook(event, headers)

    body = json.loads(event.get('body', '{}'))
    action = body.get('action')

    conn = get_db()
    cur = conn.cursor()

    if action == 'get_balance':
        user_id = int(body.get('user_id'))
        cur.execute(f"SELECT balance, total_earned FROM {S}.users WHERE id = {user_id}")
        row = cur.fetchone()
        cur.close(); conn.close()
        if not row:
            return {'statusCode': 404, 'headers': headers, 'body': json.dumps({'error': 'Не найден'})}
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'balance': float(row[0] or 0), 'total_earned': float(row[1] or 0)})}

    elif action == 'request_withdrawal':
        user_id = int(body.get('user_id'))
        amount = float(body.get('amount', 0))
        sbp_phone = body.get('sbp_phone', '').strip()
        sbp_bank = body.get('sbp_bank', '').strip()

        if amount <= 0 or not sbp_phone:
            cur.close(); conn.close()
            return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Укажите сумму и номер телефона СБП'})}

        cur.execute(f"SELECT balance, name, email FROM {S}.users WHERE id = {user_id}")
        row = cur.fetchone()
        if not row or float(row[0]) < amount:
            cur.close(); conn.close()
            return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Недостаточно средств'})}

        user_name, user_email = row[1], row[2]
        cur.execute(f"UPDATE {S}.users SET balance = balance - {amount} WHERE id = {user_id}")
        cur.execute(
            f"INSERT INTO {S}.withdrawal_requests (user_id, amount, sbp_phone, sbp_bank, status) VALUES ({user_id}, {amount}, {esc(sbp_phone)}, {esc(sbp_bank)}, 'pending') RETURNING id"
        )
        req_id = cur.fetchone()[0]
        cur.execute(
            f"INSERT INTO {S}.transactions (user_id, type, amount, status, description) VALUES ({user_id}, 'withdrawal', {amount}, 'pending', {esc(f'Заявка на вывод #{req_id}')})"
        )
        conn.commit()
        cur.close(); conn.close()
        send_withdrawal_email(req_id, user_name, user_email, amount, sbp_phone, sbp_bank)
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'request_id': req_id, 'success': True})}

    elif action == 'get_transactions':
        user_id = int(body.get('user_id'))
        cur.execute(f"""
            SELECT id, type, amount, status, description, created_at
            FROM {S}.transactions WHERE user_id = {user_id} ORDER BY created_at DESC LIMIT 50
        """)
        rows = cur.fetchall()
        txs = [{'id': r[0], 'type': r[1], 'amount': float(r[2]), 'status': r[3], 'description': r[4], 'created_at': str(r[5])} for r in rows]
        cur.close(); conn.close()
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'transactions': txs})}

    elif action == 'topup_balance':
        user_id = int(body.get('user_id'))
        amount = float(body.get('amount', 0))
        payment_id = body.get('payment_id', '')

        if amount <= 0:
            cur.close(); conn.close()
            return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Неверная сумма'})}

        cur.execute(f"UPDATE {S}.users SET balance = balance + {amount} WHERE id = {user_id}")
        cur.execute(
            f"INSERT INTO {S}.transactions (user_id, type, amount, status, description, payment_id) VALUES ({user_id}, 'topup', {amount}, 'completed', 'Пополнение баланса', {esc(payment_id)})"
        )
        conn.commit()
        cur.close(); conn.close()
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'success': True})}

    elif action == 'get_stats':
        cur.execute(f"SELECT COUNT(*) FROM {S}.users")
        users_count = cur.fetchone()[0]
        cur.execute(f"SELECT COALESCE(SUM(amount), 0) FROM {S}.transactions WHERE type = 'withdrawal' AND status = 'completed'")
        total_paid = float(cur.fetchone()[0])
        cur.execute(f"SELECT COUNT(*) FROM {S}.users WHERE created_at::date = CURRENT_DATE")
        new_today = cur.fetchone()[0]
        cur.close(); conn.close()
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'users_count': users_count, 'total_paid': total_paid, 'new_today': new_today})}

    elif action == 'get_referrals':
        user_id = int(body.get('user_id'))
        cur.execute(f"""
            SELECT u.name, u.created_at,
                   (SELECT COUNT(*) FROM {S}.user_matrices um WHERE um.user_id = u.id) as matrix_count
            FROM {S}.users u WHERE u.referred_by = {user_id} ORDER BY u.created_at DESC
        """)
        rows = cur.fetchall()
        referrals = [{'name': r[0], 'joined': str(r[1]), 'matrices': r[2]} for r in rows]
        cur.close(); conn.close()
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'referrals': referrals, 'count': len(referrals)})}

    cur.close(); conn.close()
    return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Неизвестное действие'})}


def handle_yoomoney_webhook(event: dict, headers: dict) -> dict:
    raw_body = event.get('body', '')
    if event.get('isBase64Encoded'):
        import base64
        raw_body = base64.b64decode(raw_body).decode('utf-8')

    params = {k: v[0] for k, v in parse_qs(raw_body).items() if v}

    notification_type = params.get('notification_type', '')
    operation_id = params.get('operation_id', '')
    amount = params.get('amount', '0')
    currency = params.get('currency', '643')
    datetime_val = params.get('datetime', '')
    sender = params.get('sender', '')
    codepro = params.get('codepro', 'false')
    label = params.get('label', '')
    sha1_hash = params.get('sha1_hash', '')

    secret = os.environ.get('YOOMONEY_SECRET', '')
    check_str = '&'.join([notification_type, operation_id, amount, currency, datetime_val, sender, codepro, secret, label])
    expected_hash = hashlib.sha1(check_str.encode('utf-8')).hexdigest()

    if expected_hash != sha1_hash:
        return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'invalid signature'})}

    if codepro == 'true':
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'ok': True, 'skipped': 'codepro'})}

    amount_float = float(amount)
    if amount_float <= 0:
        return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'invalid amount'})}

    user_id = None
    if label:
        try:
            user_id = int(label)
        except ValueError:
            pass

    if not user_id:
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'ok': True, 'skipped': 'no label'})}

    conn = get_db()
    cur = conn.cursor()

    cur.execute(f"SELECT id FROM {S}.users WHERE id = {user_id}")
    if not cur.fetchone():
        cur.close(); conn.close()
        return {'statusCode': 404, 'headers': headers, 'body': json.dumps({'error': 'user not found'})}

    try:
        cur.execute(
            f"INSERT INTO {S}.transactions (user_id, type, amount, status, description, payment_id) VALUES ({user_id}, 'topup', {amount_float}, 'completed', 'Пополнение через ЮМани', {esc(operation_id)})"
        )
        cur.execute(f"UPDATE {S}.users SET balance = balance + {amount_float} WHERE id = {user_id}")
        conn.commit()
    except Exception as e:
        conn.rollback()
        if 'unique' in str(e).lower():
            cur.close(); conn.close()
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'ok': True, 'skipped': 'duplicate'})}
        raise

    cur.close(); conn.close()
    return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'ok': True})}