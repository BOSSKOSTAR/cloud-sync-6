import json
import os
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


def json_response(status, data, extra_headers=None):
    headers = {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}
    if extra_headers:
        headers.update(extra_headers)
    return {
        'statusCode': status,
        'headers': headers,
        'body': json.dumps(data, ensure_ascii=False, default=str),
    }


def escape(val):
    if val is None:
        return 'NULL'
    return "'" + str(val).replace("'", "''") + "'"


def get_user_id(event):
    hdrs = event.get('headers') or {}
    return hdrs.get('X-User-Id') or hdrs.get('x-user-id')


def handler(event: dict, context) -> dict:
    """Управление тизерами: список, создание, обновление, клики, просмотры и статистика"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    path = event.get('path', '/')

    # Нормализуем путь
    if path != '/' and path.endswith('/'):
        path = path.rstrip('/')

    # Маршруты:
    # GET  /            — публичный список одобренных тизеров
    # GET  /my          — тизеры текущего пользователя
    # GET  /stats/{id}  — статистика тизера (только владелец)
    # POST /            — создать тизер
    # PUT  /{id}        — обновить тизер (только свой)
    # POST /click/{id}  — зафиксировать клик
    # POST /view/{id}   — зафиксировать просмотр

    parts = [p for p in path.split('/') if p]

    conn = None
    try:
        conn = get_db()
        cur = conn.cursor()

        # ── GET / — публичный список одобренных активных тизеров ──────────────
        if method == 'GET' and len(parts) == 0:
            params = event.get('queryStringParameters') or {}
            category = params.get('category', '')
            try:
                limit = min(int(params.get('limit', 20)), 100)
                offset = max(int(params.get('offset', 0)), 0)
            except (ValueError, TypeError):
                limit, offset = 20, 0

            where = "WHERE is_approved = TRUE AND is_active = TRUE"
            if category:
                where += f" AND category = {escape(category)}"

            cur.execute(
                f"""SELECT id, user_id, title, description, image_url, target_url,
                           category, views, clicks, created_at
                    FROM {S}.teasers
                    {where}
                    ORDER BY created_at DESC
                    LIMIT {int(limit)} OFFSET {int(offset)}"""
            )
            rows = cur.fetchall()
            teasers = [
                {
                    'id': r[0], 'user_id': r[1], 'title': r[2], 'description': r[3],
                    'image_url': r[4], 'target_url': r[5], 'category': r[6],
                    'views': r[7] or 0, 'clicks': r[8] or 0, 'created_at': str(r[9]),
                }
                for r in rows
            ]
            cur.close(); conn.close()
            return json_response(200, {'teasers': teasers})

        # ── GET /my — тизеры текущего пользователя ────────────────────────────
        if method == 'GET' and len(parts) == 1 and parts[0] == 'my':
            user_id = get_user_id(event)
            if not user_id:
                cur.close(); conn.close()
                return json_response(401, {'error': 'Требуется X-User-Id'})

            cur.execute(
                f"""SELECT id, title, description, image_url, target_url,
                           category, is_approved, is_active, views, clicks, created_at
                    FROM {S}.teasers
                    WHERE user_id = {int(user_id)}
                    ORDER BY created_at DESC"""
            )
            rows = cur.fetchall()
            teasers = [
                {
                    'id': r[0], 'title': r[1], 'description': r[2], 'image_url': r[3],
                    'target_url': r[4], 'category': r[5],
                    'is_approved': r[6], 'is_active': r[7],
                    'views': r[8] or 0, 'clicks': r[9] or 0, 'created_at': str(r[10]),
                }
                for r in rows
            ]
            cur.close(); conn.close()
            return json_response(200, {'teasers': teasers})

        # ── GET /stats/{id} — статистика тизера ───────────────────────────────
        if method == 'GET' and len(parts) == 2 and parts[0] == 'stats':
            teaser_id = int(parts[1])
            user_id = get_user_id(event)
            if not user_id:
                cur.close(); conn.close()
                return json_response(401, {'error': 'Требуется X-User-Id'})

            cur.execute(
                f"SELECT id, user_id, title, views, clicks FROM {S}.teasers WHERE id = {teaser_id}"
            )
            row = cur.fetchone()
            if not row:
                cur.close(); conn.close()
                return json_response(404, {'error': 'Тизер не найден'})
            if str(row[1]) != str(user_id):
                cur.close(); conn.close()
                return json_response(403, {'error': 'Нет доступа'})

            views = row[3] or 0
            clicks = row[4] or 0
            ctr = round(clicks / views * 100, 2) if views > 0 else 0.0

            cur.close(); conn.close()
            return json_response(200, {
                'id': row[0], 'title': row[2],
                'views': views, 'clicks': clicks, 'ctr': ctr,
            })

        # ── POST / — создать тизер ─────────────────────────────────────────────
        if method == 'POST' and len(parts) == 0:
            user_id = get_user_id(event)
            if not user_id:
                cur.close(); conn.close()
                return json_response(401, {'error': 'Требуется X-User-Id'})

            body = json.loads(event.get('body') or '{}')
            title = body.get('title', '').strip()
            description = body.get('description', '').strip()
            image_url = body.get('image_url', '').strip()
            target_url = body.get('target_url', '').strip()
            category = body.get('category', 'general').strip()

            if not title or not target_url:
                cur.close(); conn.close()
                return json_response(400, {'error': 'title и target_url обязательны'})

            cur.execute(
                f"""INSERT INTO {S}.teasers
                       (user_id, title, description, image_url, target_url,
                        category, is_active, is_approved, views, clicks)
                    VALUES
                       ({int(user_id)}, {escape(title)}, {escape(description)},
                        {escape(image_url)}, {escape(target_url)},
                        {escape(category)}, TRUE, FALSE, 0, 0)
                    RETURNING id"""
            )
            teaser_id = cur.fetchone()[0]
            conn.commit()
            cur.close(); conn.close()
            return json_response(201, {'id': teaser_id, 'is_approved': False})

        # ── PUT /{id} — обновить тизер ────────────────────────────────────────
        if method == 'PUT' and len(parts) == 1:
            teaser_id = int(parts[0])
            user_id = get_user_id(event)
            if not user_id:
                cur.close(); conn.close()
                return json_response(401, {'error': 'Требуется X-User-Id'})

            cur.execute(f"SELECT user_id FROM {S}.teasers WHERE id = {teaser_id}")
            row = cur.fetchone()
            if not row:
                cur.close(); conn.close()
                return json_response(404, {'error': 'Тизер не найден'})
            if str(row[0]) != str(user_id):
                cur.close(); conn.close()
                return json_response(403, {'error': 'Нет доступа'})

            body = json.loads(event.get('body') or '{}')
            fields = []
            allowed_str = ['title', 'description', 'image_url', 'target_url', 'category']
            for key in allowed_str:
                if key in body:
                    fields.append(f"{key} = {escape(body[key])}")
            if 'is_active' in body:
                fields.append(f"is_active = {'TRUE' if body['is_active'] else 'FALSE'}")

            if not fields:
                cur.close(); conn.close()
                return json_response(400, {'error': 'Нет полей для обновления'})

            # При редактировании сбрасываем одобрение на повторную модерацию
            fields.append("is_approved = FALSE")
            cur.execute(f"UPDATE {S}.teasers SET {', '.join(fields)} WHERE id = {teaser_id}")
            conn.commit()
            cur.close(); conn.close()
            return json_response(200, {'success': True, 'is_approved': False})

        # ── POST /click/{id} — зафиксировать клик ────────────────────────────
        if method == 'POST' and len(parts) == 2 and parts[0] == 'click':
            teaser_id = int(parts[1])
            cur.execute(
                f"SELECT id, target_url FROM {S}.teasers WHERE id = {teaser_id} AND is_active = TRUE"
            )
            row = cur.fetchone()
            if not row:
                cur.close(); conn.close()
                return json_response(404, {'error': 'Тизер не найден'})

            target_url = row[1]
            hdrs = event.get('headers') or {}
            ip = hdrs.get('X-Forwarded-For', hdrs.get('x-forwarded-for', ''))
            user_agent = hdrs.get('User-Agent', hdrs.get('user-agent', ''))
            referer = hdrs.get('Referer', hdrs.get('referer', ''))

            cur.execute(
                f"""INSERT INTO {S}.teaser_clicks (teaser_id, ip_address, user_agent, referer)
                    VALUES ({teaser_id}, {escape(ip[:45] if ip else '')},
                            {escape(user_agent[:500] if user_agent else '')},
                            {escape(referer[:500] if referer else '')})"""
            )
            cur.execute(f"UPDATE {S}.teasers SET clicks = clicks + 1 WHERE id = {teaser_id}")
            conn.commit()
            cur.close(); conn.close()
            return json_response(200, {'target_url': target_url})

        # ── POST /view/{id} — зафиксировать просмотр ─────────────────────────
        if method == 'POST' and len(parts) == 2 and parts[0] == 'view':
            teaser_id = int(parts[1])
            cur.execute(
                f"SELECT id FROM {S}.teasers WHERE id = {teaser_id} AND is_active = TRUE"
            )
            row = cur.fetchone()
            if not row:
                cur.close(); conn.close()
                return json_response(404, {'error': 'Тизер не найден'})

            hdrs = event.get('headers') or {}
            ip = hdrs.get('X-Forwarded-For', hdrs.get('x-forwarded-for', ''))

            cur.execute(
                f"""INSERT INTO {S}.teaser_views (teaser_id, ip_address)
                    VALUES ({teaser_id}, {escape(ip[:45] if ip else '')})"""
            )
            cur.execute(f"UPDATE {S}.teasers SET views = views + 1 WHERE id = {teaser_id}")
            conn.commit()
            cur.close(); conn.close()
            return json_response(200, {'success': True})

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
