import json
import os
import psycopg2

SCHEMA = "t_p38899835_cloud_sync_6"


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def handler(event: dict, context) -> dict:
    """Таблица лидеров казино — получить топ и сохранить результат"""
    cors = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors, "body": ""}

    method = event.get("httpMethod", "GET")
    conn = get_conn()
    cur = conn.cursor()

    if method == "GET":
        cur.execute(
            "SELECT nickname, coins, updated_at FROM "
            + SCHEMA
            + ".casino_leaderboard ORDER BY coins DESC LIMIT 20"
        )
        rows = cur.fetchall()
        result = [
            {"nickname": r[0], "coins": r[1], "updated_at": r[2].isoformat()}
            for r in rows
        ]
        conn.close()
        return {"statusCode": 200, "headers": cors, "body": json.dumps({"leaders": result})}

    if method == "POST":
        body = json.loads(event.get("body") or "{}")
        nickname = str(body.get("nickname", "")).strip()[:32]
        coins = int(body.get("coins", 0))

        if not nickname or coins < 0:
            conn.close()
            return {"statusCode": 400, "headers": cors, "body": json.dumps({"error": "Invalid data"})}

        cur.execute(
            "SELECT id, coins FROM " + SCHEMA + ".casino_leaderboard WHERE nickname = '" + nickname.replace("'", "''") + "'"
        )
        existing = cur.fetchone()

        if existing:
            if coins > existing[1]:
                cur.execute(
                    "UPDATE " + SCHEMA + ".casino_leaderboard SET coins = " + str(coins) + ", updated_at = NOW() WHERE id = " + str(existing[0])
                )
        else:
            cur.execute(
                "INSERT INTO " + SCHEMA + ".casino_leaderboard (nickname, coins) VALUES ('" + nickname.replace("'", "''") + "', " + str(coins) + ")"
            )

        conn.commit()
        conn.close()
        return {"statusCode": 200, "headers": cors, "body": json.dumps({"ok": True})}

    conn.close()
    return {"statusCode": 405, "headers": cors, "body": json.dumps({"error": "Method not allowed"})}
