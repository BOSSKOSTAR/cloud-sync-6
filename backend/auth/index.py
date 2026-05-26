import json
import os
import hashlib
import random
import string
import psycopg2

S = 't_p38899835_cloud_sync_6'

def get_db():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def generate_referral_code():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))

def esc(val):
    if val is None:
        return 'NULL'
    return "'" + str(val).replace("'", "''") + "'"

def handler(event: dict, context) -> dict:
    """Регистрация и вход пользователей"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token, X-Session-Id', 'Access-Control-Max-Age': '86400'}, 'body': ''}

    headers = {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}
    body = json.loads(event.get('body', '{}'))
    action = body.get('action')

    conn = get_db()
    cur = conn.cursor()

    if action == 'register':
        name = body.get('name', '').strip()
        password = body.get('password', '').strip()
        email = body.get('email', '').strip()
        ref_code = body.get('ref_code', '').strip()

        if not name or not password or not email:
            cur.close(); conn.close()
            return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Имя, email и пароль обязательны'})}

        cur.execute(f"SELECT id FROM {S}.users WHERE email = {esc(email)}")
        if cur.fetchone():
            cur.close(); conn.close()
            return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Email уже зарегистрирован'})}

        referrer_id = None
        if ref_code:
            cur.execute(f"SELECT id FROM {S}.users WHERE referral_code = {esc(ref_code)}")
            row = cur.fetchone()
            if row:
                referrer_id = row[0]

        my_code = generate_referral_code()
        ref_id_sql = str(referrer_id) if referrer_id else 'NULL'
        cur.execute(
            f"INSERT INTO {S}.users (name, password_hash, referral_code, referred_by, email) VALUES ({esc(name)}, {esc(hash_password(password))}, {esc(my_code)}, {ref_id_sql}, {esc(email)}) RETURNING id"
        )
        user_id = cur.fetchone()[0]

        conn.commit()
        cur.close(); conn.close()
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'user_id': user_id, 'referral_code': my_code, 'name': name, 'email': email})}

    elif action == 'login':
        name = body.get('name', '').strip()
        password = body.get('password', '').strip()

        cur.execute(f"SELECT id, name, referral_code, balance, total_earned FROM {S}.users WHERE name = {esc(name)} AND password_hash = {esc(hash_password(password))}")
        row = cur.fetchone()
        cur.close(); conn.close()

        if not row:
            return {'statusCode': 401, 'headers': headers, 'body': json.dumps({'error': 'Неверное имя или пароль'})}

        return {'statusCode': 200, 'headers': headers, 'body': json.dumps({
            'user_id': row[0], 'name': row[1], 'referral_code': row[2],
            'balance': float(row[3] or 0), 'total_earned': float(row[4] or 0)
        })}

    elif action == 'get_user':
        user_id = body.get('user_id')
        cur.execute(f"SELECT id, name, referral_code, balance, total_earned, created_at FROM {S}.users WHERE id = {int(user_id)}")
        row = cur.fetchone()
        cur.close(); conn.close()
        if not row:
            return {'statusCode': 404, 'headers': headers, 'body': json.dumps({'error': 'Пользователь не найден'})}
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps({
            'user_id': row[0], 'name': row[1], 'referral_code': row[2],
            'balance': float(row[3] or 0), 'total_earned': float(row[4] or 0), 'created_at': str(row[5])
        })}

    cur.close(); conn.close()
    return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Неизвестное действие'})}