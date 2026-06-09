from app.config.db import get_db_connection
import logging

logger = logging.getLogger(__name__)


# --- 1. Get all accounts for a user ---
def get_user_accounts(user_id: int):
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute(
            "EXEC get_user_accounts_proc ?",
            (user_id,)
        )
        rows = cursor.fetchall()
        columns = [col[0] for col in cursor.description]

        accounts = [dict(zip(columns, row)) for row in rows]
        return accounts

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

        cursor.execute(
            "EXEC add_account_proc ?, ?, ?, ?, ?, ?, ?",
            (
                user_id,
                data.account_name,
                data.account_type,
                data.balance,
                data.card_number,
                data.expiry_date,
                data.color_theme,
            )
        )
        row = cursor.fetchone()
        new_id = row[0] if row else None

        conn.commit()
        return new_id

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

        cursor.execute(
            "EXEC delete_account_proc ?, ?",
            (account_id, user_id)
        )
        conn.commit()
        return True

    except Exception as e:
        logger.error(f"[ERROR] delete_account: {str(e)}")
        return False
    finally:
        if conn:
            cursor.close()
            conn.close()