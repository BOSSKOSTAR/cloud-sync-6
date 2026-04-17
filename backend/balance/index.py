import hashlib
import json
import os
import psycopg2
from urllib.parse import parse_qs


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
        user_id = body.get('user_id')
        cur.execute("SELECT balance, total_earned FROM users WHERE id = %s", (user_id,))
        row = cur.fetchone()
        cur.close(); conn.close()
        if not row:
            return {'statusCode': 404, 'headers': headers, 'body': json.dumps({'error': 'Не найден'})}
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'balance': float(row[0]), 'total_earned': float(row[1])})}

    elif action == 'request_withdrawal':
        user_id = body.get('user_id')
        amount = float(body.get('amount', 0))
        sbp_phone = body.get('sbp_phone', '').strip()
        sbp_bank = body.get('sbp_bank', '').strip()

        if amount <= 0 or not sbp_phone:
            cur.close(); conn.close()
            return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Укажите сумму и номер телефона СБП'})}

        cur.execute("SELECT balance FROM users WHERE id = %s", (user_id,))
        row = cur.fetchone()
        if not row or float(row[0]) < amount:
            cur.close(); conn.close()
            return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Недостаточно средств'})}

        cur.execute("UPDATE users SET balance = balance - %s WHERE id = %s", (amount, user_id))
        cur.execute(
            "INSERT INTO withdrawal_requests (user_id, amount, sbp_phone, sbp_bank, status) VALUES (%s, %s, %s, %s, 'pending') RETURNING id",
            (user_id, amount, sbp_phone, sbp_bank)
        )
        req_id = cur.fetchone()[0]
        cur.execute(
            "INSERT INTO transactions (user_id, type, amount, status, description) VALUES (%s, 'withdrawal', %s, 'pending', %s)",
            (user_id, amount, f'Заявка на вывод #{req_id}')
        )
        conn.commit()
        cur.close(); conn.close()
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'request_id': req_id, 'success': True})}

    elif action == 'get_transactions':
        user_id = body.get('user_id')
        cur.execute("""
            SELECT id, type, amount, status, description, created_at
            FROM transactions WHERE user_id = %s ORDER BY created_at DESC LIMIT 50
        """, (user_id,))
        rows = cur.fetchall()
        txs = [{'id': r[0], 'type': r[1], 'amount': float(r[2]), 'status': r[3], 'description': r[4], 'created_at': str(r[5])} for r in rows]
        cur.close(); conn.close()
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'transactions': txs})}

    elif action == 'topup_balance':
        user_id = body.get('user_id')
        amount = float(body.get('amount', 0))
        payment_id = body.get('payment_id', '')

        if amount <= 0:
            cur.close(); conn.close()
            return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Неверная сумма'})}

        cur.execute("UPDATE users SET balance = balance + %s WHERE id = %s", (amount, user_id))
        cur.execute(
            "INSERT INTO transactions (user_id, type, amount, status, description, payment_id) VALUES (%s, 'topup', %s, 'completed', 'Пополнение баланса', %s)",
            (user_id, amount, payment_id)
        )
        conn.commit()
        cur.close(); conn.close()
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'success': True})}

    elif action == 'get_referrals':
        user_id = body.get('user_id')
        cur.execute("""
            SELECT u.name, u.created_at,
                   (SELECT COUNT(*) FROM user_matrices um WHERE um.user_id = u.id) as matrix_count
            FROM users u WHERE u.referred_by = %s ORDER BY u.created_at DESC
        """, (user_id,))
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

    cur.execute("SELECT id FROM users WHERE id = %s", (user_id,))
    if not cur.fetchone():
        cur.close(); conn.close()
        return {'statusCode': 404, 'headers': headers, 'body': json.dumps({'error': 'user not found'})}

    try:
        cur.execute(
            "INSERT INTO transactions (user_id, type, amount, status, description, payment_id) VALUES (%s, 'topup', %s, 'completed', 'Пополнение через ЮМани', %s)",
            (user_id, amount_float, operation_id)
        )
        cur.execute("UPDATE users SET balance = balance + %s WHERE id = %s", (amount_float, user_id))
        conn.commit()
    except Exception as e:
        conn.rollback()
        if 'unique' in str(e).lower():
            cur.close(); conn.close()
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'ok': True, 'skipped': 'duplicate'})}
        raise

    cur.close(); conn.close()
    return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'ok': True, 'credited': amount_float})}
