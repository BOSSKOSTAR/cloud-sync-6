"""
Админ-панель: управление баннерами, новостями, отзывами и пользователями.
"""
import json
import os
import psycopg2

ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "admin123")

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Admin-Token",
}


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def resp(data, status=200):
    return {"statusCode": status, "headers": {**CORS_HEADERS, "Content-Type": "application/json"}, "body": json.dumps(data, default=str)}


def err(msg, status=400):
    return resp({"error": msg}, status)


def check_auth(event):
    token = event.get("headers", {}).get("X-Admin-Token", "")
    return token == ADMIN_PASSWORD


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    if not check_auth(event):
        return err("Unauthorized", 401)

    method = event.get("httpMethod", "GET")
    path = event.get("path", "/")
    body = {}
    if event.get("body"):
        body = json.loads(event["body"])

    if "/banners" in path:
        return handle_banners(method, path, body, event.get("queryStringParameters") or {})

    if "/news" in path:
        return handle_news(method, path, body, event.get("queryStringParameters") or {})

    if "/reviews" in path:
        return handle_reviews(method, path, body, event.get("queryStringParameters") or {})

    if "/users" in path:
        return handle_users(method, path, event.get("queryStringParameters") or {})

    return resp({"status": "ok", "message": "Admin API"})


def handle_banners(method, path, body, params):
    conn = get_conn()
    cur = conn.cursor()
    item_id = extract_id(path, "banners")

    if method == "GET":
        cur.execute("SELECT id, title, subtitle, image_url, button_text, button_link, is_active, sort_order, created_at FROM t_p38899835_cloud_sync_6.banners ORDER BY sort_order, id")
        rows = cur.fetchall()
        keys = ["id", "title", "subtitle", "image_url", "button_text", "button_link", "is_active", "sort_order", "created_at"]
        return resp([dict(zip(keys, r)) for r in rows])

    if method == "POST":
        cur.execute(
            "INSERT INTO t_p38899835_cloud_sync_6.banners (title, subtitle, image_url, button_text, button_link, is_active, sort_order) VALUES (%s,%s,%s,%s,%s,%s,%s) RETURNING id",
            (body.get("title"), body.get("subtitle"), body.get("image_url"), body.get("button_text"), body.get("button_link"), body.get("is_active", True), body.get("sort_order", 0))
        )
        new_id = cur.fetchone()[0]
        conn.commit()
        return resp({"id": new_id, "message": "Баннер создан"})

    if method == "PUT" and item_id:
        cur.execute(
            "UPDATE t_p38899835_cloud_sync_6.banners SET title=%s, subtitle=%s, image_url=%s, button_text=%s, button_link=%s, is_active=%s, sort_order=%s WHERE id=%s",
            (body.get("title"), body.get("subtitle"), body.get("image_url"), body.get("button_text"), body.get("button_link"), body.get("is_active", True), body.get("sort_order", 0), item_id)
        )
        conn.commit()
        return resp({"message": "Баннер обновлён"})

    if method == "DELETE" and item_id:
        cur.execute("DELETE FROM t_p38899835_cloud_sync_6.banners WHERE id=%s", (item_id,))
        conn.commit()
        return resp({"message": "Баннер удалён"})

    return err("Неверный запрос")


def handle_news(method, path, body, params):
    conn = get_conn()
    cur = conn.cursor()
    item_id = extract_id(path, "news")

    if method == "GET":
        cur.execute("SELECT id, title, content, image_url, is_published, created_at, updated_at FROM t_p38899835_cloud_sync_6.news ORDER BY created_at DESC")
        rows = cur.fetchall()
        keys = ["id", "title", "content", "image_url", "is_published", "created_at", "updated_at"]
        return resp([dict(zip(keys, r)) for r in rows])

    if method == "POST":
        cur.execute(
            "INSERT INTO t_p38899835_cloud_sync_6.news (title, content, image_url, is_published) VALUES (%s,%s,%s,%s) RETURNING id",
            (body.get("title"), body.get("content"), body.get("image_url"), body.get("is_published", False))
        )
        new_id = cur.fetchone()[0]
        conn.commit()
        return resp({"id": new_id, "message": "Новость создана"})

    if method == "PUT" and item_id:
        cur.execute(
            "UPDATE t_p38899835_cloud_sync_6.news SET title=%s, content=%s, image_url=%s, is_published=%s, updated_at=now() WHERE id=%s",
            (body.get("title"), body.get("content"), body.get("image_url"), body.get("is_published", False), item_id)
        )
        conn.commit()
        return resp({"message": "Новость обновлена"})

    if method == "DELETE" and item_id:
        cur.execute("DELETE FROM t_p38899835_cloud_sync_6.news WHERE id=%s", (item_id,))
        conn.commit()
        return resp({"message": "Новость удалена"})

    return err("Неверный запрос")


def handle_reviews(method, path, body, params):
    conn = get_conn()
    cur = conn.cursor()
    item_id = extract_id(path, "reviews")

    if method == "GET":
        cur.execute("SELECT id, author_name, author_email, text, rating, is_approved, created_at FROM t_p38899835_cloud_sync_6.reviews ORDER BY created_at DESC")
        rows = cur.fetchall()
        keys = ["id", "author_name", "author_email", "text", "rating", "is_approved", "created_at"]
        return resp([dict(zip(keys, r)) for r in rows])

    if method == "POST":
        cur.execute(
            "INSERT INTO t_p38899835_cloud_sync_6.reviews (author_name, author_email, text, rating, is_approved) VALUES (%s,%s,%s,%s,%s) RETURNING id",
            (body.get("author_name"), body.get("author_email"), body.get("text"), body.get("rating", 5), body.get("is_approved", False))
        )
        new_id = cur.fetchone()[0]
        conn.commit()
        return resp({"id": new_id, "message": "Отзыв добавлен"})

    if method == "PUT" and item_id:
        cur.execute(
            "UPDATE t_p38899835_cloud_sync_6.reviews SET author_name=%s, text=%s, rating=%s, is_approved=%s WHERE id=%s",
            (body.get("author_name"), body.get("text"), body.get("rating", 5), body.get("is_approved", False), item_id)
        )
        conn.commit()
        return resp({"message": "Отзыв обновлён"})

    if method == "DELETE" and item_id:
        cur.execute("DELETE FROM t_p38899835_cloud_sync_6.reviews WHERE id=%s", (item_id,))
        conn.commit()
        return resp({"message": "Отзыв удалён"})

    return err("Неверный запрос")


def handle_users(method, path, params):
    conn = get_conn()
    cur = conn.cursor()

    if method == "GET":
        cur.execute("""
            SELECT u.id, u.name, u.email, u.balance, u.total_earned, u.created_at,
                   COUNT(DISTINCT t.id) as tx_count,
                   MAX(t.created_at) as last_activity
            FROM t_p38899835_cloud_sync_6.users u
            LEFT JOIN t_p38899835_cloud_sync_6.transactions t ON t.user_id = u.id
            GROUP BY u.id, u.name, u.email, u.balance, u.total_earned, u.created_at
            ORDER BY u.created_at DESC
        """)
        rows = cur.fetchall()
        keys = ["id", "name", "email", "balance", "total_earned", "created_at", "tx_count", "last_activity"]
        return resp([dict(zip(keys, r)) for r in rows])

    return err("Неверный запрос")


def extract_id(path, resource):
    parts = path.strip("/").split("/")
    try:
        idx = parts.index(resource)
        if idx + 1 < len(parts):
            return int(parts[idx + 1])
    except (ValueError, IndexError):
        pass
    return None
