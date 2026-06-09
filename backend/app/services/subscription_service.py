from app.config.db import get_db_connection
import logging

logger = logging.getLogger(__name__)


# --- 1. Get all subscriptions ---
def get_subscriptions():
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("EXEC get_subscriptions_proc")

        rows = cursor.fetchall()
        columns = [col[0] for col in cursor.description]

        subscriptions = [dict(zip(columns, row)) for row in rows]
        return subscriptions

    except Exception as e:
        logger.error(f"[ERROR] get_subscriptions: {str(e)}")
        return []
    finally:
        if conn:
            cursor.close()
            conn.close()


# --- 2. Add a subscription ---
def add_subscription(data):
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute(
            "EXEC add_subscription_proc ?, ?, ?, ?, ?, ?, ?",
            (
                data.name,
                data.amount,
                data.billing_type,
                data.due_day,
                data.due_month,
                data.icon_url,
                data.bg_color,
            )
        )

        row = cursor.fetchone()
        new_id = row[0] if row else None

        conn.commit()
        return new_id

    except Exception as e:
        logger.error(f"[ERROR] add_subscription: {str(e)}")
        return None
    finally:
        if conn:
            cursor.close()
            conn.close()


# --- 3. Update a subscription ---
def update_subscription(subscription_id: int, data):
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute(
            "UPDATE Subscriptions SET name = ?, amount = ?, billing_type = ?, due_day = ?, due_month = ?, icon_url = ?, bg_color = ? WHERE id = ?",
            (
                data.name,
                data.amount,
                data.billing_type,
                data.due_day,
                data.due_month,
                data.icon_url,
                data.bg_color,
                subscription_id,
            )
        )

        rows_affected = cursor.rowcount
        conn.commit()
        return rows_affected > 0, None

    except Exception as e:
        logger.error(f"[ERROR] update_subscription: {str(e)}")
        return False, str(e)
    finally:
        if conn:
            cursor.close()
            conn.close()


# --- 4. Delete a subscription ---
def delete_subscription(subscription_id: int):
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute(
            "EXEC delete_subscription_proc ?",
            (subscription_id,)
        )

        conn.commit()
        return True

    except Exception as e:
        logger.error(f"[ERROR] delete_subscription: {str(e)}")
        return False
    finally:
        if conn:
            cursor.close()
            conn.close()