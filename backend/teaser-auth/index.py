import json
import os
import hashlib
import psycopg2

S = 't_p38899835_cloud_sync_6'

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token, X-Session-Id',
    'Access-Control-Max-Age': '86400',
}


def get_db():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def json_response(status, data):
    return {
        'statusCode': status,
        'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
        'body': json.dumps(data, ensure_ascii=False, default=str),
    }


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode('utf-8')).hexdigest()


def escape(val):
    if val is None:
        return 'NULL'
    return "'" + str(val).replace("'", "''") + "'"


def handler(event: dict, context) -> dict:
    """Аутентификация пользователей тизерной сети: регистрация, вход, профиль"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    path = event.get('path', '/')

    if path != '/' and path.endswith('/'):
        path = path.rstrip('/')

    parts = [p for p in path.split('/') if p]

    conn = None
    try:
        conn = get_db()
        cur = conn.cursor()

        # ── POST /register — регистрация ──────────────────────────────────────
        # Используем существующую таблицу users (name, email, password_hash, referral_code обязателен)
        if method == 'POST' and len(parts) == 1 and parts[0] == 'register':
            body = json.loads(event.get('body') or '{}')
            name = body.get('name', '').strip()
            email = body.get('email', '').strip().lower()
            password = body.get('password', '').strip()

            if not name or not email or not password:
                cur.close(); conn.close()
                return json_response(400, {'error': 'name, email и password обязательны'})

            cur.execute(f"SELECT id FROM {S}.users WHERE email = {escape(email)}")
            if cur.fetchone():
                cur.close(); conn.close()
                return json_response(400, {'error': 'Email уже зарегистрирован'})

            cur.execute(f"SELECT id FROM {S}.users WHERE name = {escape(name)}")
            if cur.fetchone():
                cur.close(); conn.close()
                return json_response(400, {'error': 'Имя уже занято'})

            pw_hash = hash_password(password)
            # referral_code — генерируем уникальный из первых 8 символов хеша email+name
            ref_code = hashlib.sha256((email + name).encode()).hexdigest()[:8].upper()

            cur.execute(
                f"""INSERT INTO {S}.users (name, email, password_hash, referral_code)
                    VALUES ({escape(name)}, {escape(email)}, {escape(pw_hash)}, {escape(ref_code)})
                    RETURNING id"""
            )
            user_id = cur.fetchone()[0]
            conn.commit()
            cur.close(); conn.close()

            # Токен — строка user_id (упрощённая авторизация)
            token = str(user_id)
            return json_response(201, {
                'user_id': user_id, 'name': name, 'email': email,
                'referral_code': ref_code, 'token': token,
            })

        # ── POST /login — вход ────────────────────────────────────────────────
        if method == 'POST' and len(parts) == 1 and parts[0] == 'login':
            body = json.loads(event.get('body') or '{}')
            email = body.get('email', '').strip().lower()
            password = body.get('password', '').strip()

            if not email or not password:
                cur.close(); conn.close()
                return json_response(400, {'error': 'email и password обязательны'})

            pw_hash = hash_password(password)
            cur.execute(
                f"""SELECT id, name, email, referral_code
                    FROM {S}.users
                    WHERE email = {escape(email)} AND password_hash = {escape(pw_hash)}"""
            )
            row = cur.fetchone()
            cur.close(); conn.close()

            if not row:
                return json_response(401, {'error': 'Неверный email или пароль'})

            user_id, name, user_email, ref_code = row
            token = str(user_id)
            return json_response(200, {
                'user_id': user_id, 'name': name, 'email': user_email,
                'referral_code': ref_code, 'token': token,
            })

        # ── GET /me — профиль текущего пользователя ───────────────────────────
        if method == 'GET' and len(parts) == 1 and parts[0] == 'me':
            hdrs = event.get('headers') or {}
            user_id = hdrs.get('X-User-Id') or hdrs.get('x-user-id')
            if not user_id:
                cur.close(); conn.close()
                return json_response(200, {'error': 'Требуется X-User-Id'})

            cur.execute(
                f"""SELECT id, name, email, referral_code, created_at
                    FROM {S}.users WHERE id = {int(user_id)}"""
            )
            row = cur.fetchone()
            cur.close(); conn.close()

            if not row:
                return json_response(404, {'error': 'Пользователь не найден'})

            return json_response(200, {
                'user_id': row[0], 'name': row[1], 'email': row[2],
                'referral_code': row[3], 'created_at': str(row[4]),
            })

        cur.close(); conn.close()
        return json_response(404, {'error': 'Маршрут не найден'})

    except Exception as e:
        if conn:
            try:
                conn.rollback()
                conn.close()
            except Exception:
                pass
        import traceback
        return json_response(500, {'error': str(e), 'trace': traceback.format_exc()})
