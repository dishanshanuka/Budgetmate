from app.config.db import get_db_connection
import logging

logger = logging.getLogger(__name__)


# --- 1. Get all subscriptions for a user ---
def get_subscriptions(user_id: int):
    conn = None
    cursor = None
    result_cursor = None
    try:
        conn = get_db_connection()
        if not conn:
            return []

        cursor = conn.cursor()
        result_cursor = conn.cursor()
        cursor.callproc("get_subscriptions_proc", [user_id, result_cursor])
        rows = result_cursor.fetchall()

        return [
            {
                "id": r[0],
                "name": r[1],
                "amount": float(r[2] or 0),
                "billing_type": normalize_billing_type(r[3]),
                "due_day": r[4],
                "due_month": r[5],
                "icon_url": r[6],
                "bg_color": r[7],
            }
            for r in rows
        ]

    except Exception as e:
        logger.error(f"[ERROR] get_subscriptions: {str(e)}")
        return []
    finally:
        if result_cursor:
            result_cursor.close()
        if cursor:
            cursor.close()
        if conn:
            conn.close()


# --- 2. Add a subscription ---
def add_subscription(user_id: int, data):
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        if not conn:
            return None

        cursor = conn.cursor()
        new_id = cursor.var(int)

        cursor.callproc(
            "add_subscription_proc",
            [
                user_id,
                data.name,
                data.amount,
                normalize_billing_type(data.billing_type),
                data.due_day,
                data.due_month,
                data.icon_url,
                data.bg_color,
                new_id,
            ]
        )

        conn.commit()
        return new_id.getvalue() is not None

    except Exception as e:
        logger.error(f"[ERROR] add_subscription: {str(e)}")
        return None
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


# --- 3. Update a subscription ---
def update_subscription(subscription_id: int, user_id: int, data):
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        if not conn:
            return False, "Database connection failed"

        cursor = conn.cursor()
        rows_affected = cursor.var(int)

        cursor.callproc(
            "update_subscription_proc",
            [
                subscription_id,
                user_id,
                data.name,
                data.amount,
                normalize_billing_type(data.billing_type),
                data.due_day,
                data.due_month,
                data.icon_url,
                data.bg_color,
                rows_affected,
            ]
        )

        conn.commit()
        return (rows_affected.getvalue() or 0) > 0, None

    except Exception as e:
        logger.error(f"[ERROR] update_subscription: {str(e)}")
        return False, str(e)
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


# --- 4. Delete a subscription ---
def delete_subscription(subscription_id: int, user_id: int):
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        if not conn:
            return False

        cursor = conn.cursor()
        rows_affected = cursor.var(int)

        cursor.callproc(
            "delete_subscription_proc",
            [subscription_id, user_id, rows_affected]
        )

        conn.commit()
        return (rows_affected.getvalue() or 0) > 0

    except Exception as e:
        logger.error(f"[ERROR] delete_subscription: {str(e)}")
        return False
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


def normalize_billing_type(value):
    normalized = (value or "").strip().upper()
    if normalized in {"MONTHLY", "MONTH"}:
        return "Monthly"
    if normalized in {"YEARLY", "ANNUAL", "YEAR"}:
        return "Annual"
    return value or "Monthly"
