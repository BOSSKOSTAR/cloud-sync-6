"""
ЮМани — создание платежа и обработка webhook-уведомлений.
POST /       — создать платёж (вернуть URL формы оплаты)
POST /notify — webhook от ЮМани (зачислить показы после оплаты)
"""

import os
import json
import hashlib
import urllib.parse
import psycopg2

RECEIVER = "4100119513299590"
S = os.environ.get("MAIN_DB_SCHEMA", "public")


def get_db():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def escape(v):
    return "'" + str(v).replace("'", "''") + "'"


def json_response(status, body, headers=None):
    h = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    }
    if headers:
        h.update(headers)
    return {"statusCode": status, "headers": h, "body": json.dumps(body, ensure_ascii=False)}


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, X-User-Id",
                "Access-Control-Max-Age": "86400",
            },
            "body": "",
        }

    path = event.get("path", "/").rstrip("/") or "/"
    method = event.get("httpMethod", "GET")

    # ── POST /notify — webhook от ЮМани ─────────────────────────────────────
    if method == "POST" and path.endswith("/notify"):
        body_raw = event.get("body") or ""
        params = dict(urllib.parse.parse_qsl(body_raw))

        notification_type = params.get("notification_type", "")
        operation_id      = params.get("operation_id", "")
        amount            = params.get("amount", "0")
        currency          = params.get("currency", "643")
        datetime_str      = params.get("datetime", "")
        sender            = params.get("sender", "")
        codepro           = params.get("codepro", "false")
        label             = params.get("label", "")
        sha1_hash         = params.get("sha1_hash", "")

        secret = os.environ.get("YOOMONEY_SECRET", "")
        check_str = "&".join([
            notification_type, operation_id, amount, currency,
            datetime_str, sender, codepro, secret, label,
        ])
        expected = hashlib.sha1(check_str.encode("utf-8")).hexdigest()

        if expected != sha1_hash:
            return {"statusCode": 400, "headers": {"Access-Control-Allow-Origin": "*"}, "body": "bad signature"}

        if codepro == "true":
            return {"statusCode": 200, "headers": {"Access-Control-Allow-Origin": "*"}, "body": "ok"}

        # label формат: "pkg_{package_id}_user_{user_id}_teaser_{teaser_id}"
        try:
            parts = label.split("_")
            pkg_idx     = parts.index("pkg") + 1
            user_idx    = parts.index("user") + 1
            teaser_idx  = parts.index("teaser") + 1

            package_id = int(parts[pkg_idx])
            user_id    = int(parts[user_idx])
            teaser_id  = int(parts[teaser_idx]) if parts[teaser_idx] != "0" else None
        except Exception:
            return {"statusCode": 200, "headers": {"Access-Control-Allow-Origin": "*"}, "body": "ok"}

        conn = get_db()
        cur = conn.cursor()

        cur.execute(f"SELECT views_count, price FROM {S}.teaser_packages WHERE id = {package_id}")
        pkg = cur.fetchone()
        if not pkg:
            cur.close(); conn.close()
            return {"statusCode": 200, "headers": {"Access-Control-Allow-Origin": "*"}, "body": "ok"}

        views_count = pkg[0]
        price       = float(pkg[1])

        cur.execute(
            f"""INSERT INTO {S}.teaser_purchases
                   (user_id, teaser_id, package_id, views_count, amount, payment_id, status)
                VALUES ({user_id}, {'NULL' if not teaser_id else teaser_id},
                        {package_id}, {views_count}, {price},
                        {escape(operation_id)}, 'completed')"""
        )

        if teaser_id:
            cur.execute(
                f"UPDATE {S}.teasers SET views_limit = views_limit + {views_count} WHERE id = {teaser_id} AND user_id = {user_id}"
            )

        conn.commit()
        cur.close(); conn.close()
        return {"statusCode": 200, "headers": {"Access-Control-Allow-Origin": "*"}, "body": "ok"}

    # ── POST / — создать платёж ──────────────────────────────────────────────
    if method == "POST":
        body = json.loads(event.get("body") or "{}")
        package_id = int(body.get("package_id", 0))
        user_id    = int(body.get("user_id", 0))
        teaser_id  = body.get("teaser_id") or 0

        conn = get_db()
        cur = conn.cursor()
        cur.execute(f"SELECT views_count, price, name FROM {S}.teaser_packages WHERE id = {package_id} AND is_active = TRUE")
        pkg = cur.fetchone()
        cur.close(); conn.close()

        if not pkg:
            return json_response(404, {"error": "Пакет не найден"})

        views_count, price, pkg_name = pkg[0], float(pkg[1]), pkg[2]
        label   = f"pkg_{package_id}_user_{user_id}_teaser_{teaser_id}"
        comment = urllib.parse.quote(f"Тизерная реклама: {pkg_name}", safe="")

        payment_url = (
            f"https://yoomoney.ru/quickpay/confirm.xml?"
            f"receiver={RECEIVER}"
            f"&quickpay-form=shop"
            f"&targets={comment}"
            f"&paymentType=AC"
            f"&sum={price}"
            f"&label={label}"
            f"&need-fio=false"
            f"&need-email=false"
            f"&need-phone=false"
            f"&need-address=false"
        )

        return json_response(200, {
            "payment_url": payment_url,
            "label": label,
            "amount": price,
            "package_name": pkg_name,
            "views_count": views_count,
        })

    return json_response(405, {"error": "Method not allowed"})