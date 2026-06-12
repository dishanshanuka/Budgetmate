from app.config.db import get_db_connection
import oracledb
import logging

logger = logging.getLogger(__name__)


# --- 1. Get all accounts for a user ---
def get_user_accounts(user_id: int):
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        result = cursor.var(oracledb.DB_TYPE_CURSOR)

        cursor.callproc("get_user_accounts_proc", [user_id, result])

        result_cursor = result.getvalue()
        try:
            rows = result_cursor.fetchall()
        finally:
            result_cursor.close()

        return [
            {
                "id": r[0],
                "account_name": r[1],
                "account_type": r[2],
                "balance": float(r[3] or 0),
                "card_number": r[4],
                "expiry_date": r[5],
                "color_theme": r[6],
                "created_at": r[7],
            }
            for r in rows
        ]

    except Exception as e:
        logger.error(f"[ERROR] get_user_accounts: {str(e)}")
        return []
    finally:
        if conn:
            cursor.close()
            conn.close()


# --- 2. Add a new account ---
def add_account(user_id: int, data):
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        new_id = cursor.var(int)

        cursor.callproc(
            "add_account_proc",
            [
                user_id,
                data.account_name,
                data.account_type,
                data.balance,
                data.card_number,
                data.expiry_date,
                data.color_theme,
                new_id,
            ]
        )

        conn.commit()
        return new_id.getvalue()

    except Exception as e:
        logger.error(f"[ERROR] add_account: {str(e)}")
        return None
    finally:
        if conn:
            cursor.close()
            conn.close()


# --- 3. Delete an account (only if it belongs to this user) ---
def delete_account(account_id: int, user_id: int):
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        rows_affected = cursor.var(int)

        cursor.callproc(
            "delete_account_proc",
            [account_id, user_id, rows_affected]
        )
        conn.commit()
        return (rows_affected.getvalue() or 0) > 0

    except Exception as e:
        logger.error(f"[ERROR] delete_account: {str(e)}")
        return False
    finally:
        if conn:
            cursor.close()
            conn.close()


# --- 4. Update an account (only if it belongs to this user) ---
def update_account(account_id: int, user_id: int, data):
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        rows_affected = cursor.var(int)

        cursor.callproc(
            "update_account_proc",
            [
                account_id,
                user_id,
                data.account_name,
                data.account_type,
                data.balance,
                data.card_number,
                data.expiry_date,
                data.color_theme,
                rows_affected,
            ]
        )
        success = (rows_affected.getvalue() or 0) > 0

        conn.commit()
        return success

    except Exception as e:
        logger.error(f"[ERROR] update_account: {str(e)}")
        return False
    finally:
        if conn:
            cursor.close()
            conn.close()
