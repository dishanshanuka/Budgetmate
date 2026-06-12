from app.config.db import get_db_connection
from app.schemas.settings import ProfileUpdate
from app.utils.security import hash_password, verify_password
import oracledb
import logging

logger = logging.getLogger(__name__)


def get_profile(user_id: int):
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        if not conn:
            return "ERROR"

        cursor = conn.cursor()
        full_name = cursor.var(str)
        email = cursor.var(str)
        profile_photo = cursor.var(oracledb.DB_TYPE_CLOB)
        status = cursor.var(str)

        cursor.callproc(
            "get_profile_proc",
            [user_id, full_name, email, profile_photo, status]
        )

        if status.getvalue() == "NOT_FOUND":
            return None
        if status.getvalue() != "SUCCESS":
            return "ERROR"

        profile_photo_value = profile_photo.getvalue()
        if hasattr(profile_photo_value, "read"):
            profile_photo_value = profile_photo_value.read()

        return {
            "full_name": full_name.getvalue(),
            "email": email.getvalue(),
            "profile_photo": profile_photo_value,
        }
    except Exception as e:
        logger.error(f"[ERROR] Load profile failed: {str(e)}")
        return "ERROR"
    finally:
        if conn:
            if cursor:
                cursor.close()
            conn.close()


def update_profile(user_id: int, data: ProfileUpdate):
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        if not conn:
            return False

        cursor = conn.cursor()
        rows_affected = cursor.var(int)
        cursor.callproc(
            "update_profile_proc",
            [user_id, data.full_name, data.profile_photo, rows_affected]
        )
        conn.commit()
        return (rows_affected.getvalue() or 0) > 0
    except Exception as e:
        logger.error(f"[ERROR] Update profile failed: {str(e)}")
        return False
    finally:
        if conn:
            if cursor:
                cursor.close()
            conn.close()


def change_password(user_id: int, current_password: str, new_password: str):
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        if not conn:
            return "ERROR"

        cursor = conn.cursor()
        current_hash = cursor.var(str)
        status = cursor.var(str)
        cursor.callproc(
            "get_user_password_hash_proc",
            [user_id, current_hash, status]
        )

        if status.getvalue() == "NOT_FOUND":
            return "NOT_FOUND"
        if status.getvalue() != "SUCCESS":
            return "ERROR"

        stored_hash = current_hash.getvalue()
        if not verify_password(current_password, stored_hash):
            return "INVALID_CURRENT_PASSWORD"

        new_hash = hash_password(new_password)
        update_status = cursor.var(str)
        cursor.callproc("change_password_proc", [user_id, new_hash, update_status])
        conn.commit()
        return update_status.getvalue() or "ERROR"
    except Exception as e:
        logger.error(f"[ERROR] Change password failed: {str(e)}")
        return "ERROR"
    finally:
        if conn:
            if cursor:
                cursor.close()
            conn.close()
