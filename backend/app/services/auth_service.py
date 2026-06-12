from datetime import datetime, timedelta
import logging
import secrets

from app.config.db import get_db_connection
from app.utils.security import (
    create_access_token,
    hash_password,
    send_reset_email,
    verify_password,
)

logger = logging.getLogger(__name__)


def register_user(full_name, email, password):
    clean_email = email.strip().lower()
    hashed_pw = hash_password(password)

    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        if not conn:
            return "ERROR"

        cursor = conn.cursor()
        status_var = cursor.var(str)

        cursor.callproc(
            "register_user_proc",
            [full_name, clean_email, hashed_pw, status_var],
        )
        conn.commit()
        return status_var.getvalue() or "ERROR"
    except Exception as e:
        logger.error("[ERROR] Registration failed: %s", e)
        return "ERROR"
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


def authenticate_user(email, password):
    clean_email = email.strip().lower()

    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        if not conn:
            return None, "ERROR"

        cursor = conn.cursor()
        password_hash_var = cursor.var(str)
        user_id_var = cursor.var(int)
        full_name_var = cursor.var(str)
        status_var = cursor.var(str)

        cursor.callproc(
            "login_user_proc",
            [
                clean_email,
                password_hash_var,
                user_id_var,
                full_name_var,
                status_var,
            ],
        )

        stored_hash = password_hash_var.getvalue()
        user_id = user_id_var.getvalue()

        if (
            status_var.getvalue() == "SUCCESS"
            and stored_hash
            and verify_password(password, stored_hash)
        ):
            token = create_access_token({"sub": clean_email, "user_id": user_id})
            return {
                "access_token": token,
                "token_type": "bearer",
                "user": full_name_var.getvalue(),
            }, "SUCCESS"

        return None, "FAILED"
    except Exception as e:
        logger.error("[ERROR] Login failed: %s", e)
        return None, "ERROR"
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


def forgot_password_logic(email: str) -> str:
    clean_email = email.strip().lower()
    otp = str(secrets.randbelow(900000) + 100000)
    expiry = datetime.now() + timedelta(minutes=10)

    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        if not conn:
            return "INTERNAL_ERROR"

        cursor = conn.cursor()
        status_var = cursor.var(str)
        error_msg_var = cursor.var(str)

        cursor.callproc(
            "store_reset_token_proc",
            [clean_email, otp, expiry, status_var, error_msg_var],
        )

        if status_var.getvalue() != "SUCCESS":
            logger.warning(
                "Password reset token was not stored for %s: %s",
                clean_email,
                error_msg_var.getvalue(),
            )
            return "FAILED"

        if not send_reset_email(clean_email, otp):
            return "EMAIL_FAILED"

        conn.commit()
        return "SUCCESS"
    except Exception as e:
        logger.error("[ERROR] Forgot password failed: %s", e)
        return "INTERNAL_ERROR"
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


def reset_password_logic(email, otp, new_password):
    clean_email = email.strip().lower()
    hashed_pw = hash_password(new_password)

    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        if not conn:
            return "ERROR"

        cursor = conn.cursor()
        status_var = cursor.var(str)

        cursor.callproc(
            "reset_password_proc",
            [clean_email, otp, hashed_pw, status_var],
        )

        conn.commit()
        return status_var.getvalue() or "ERROR"
    except Exception as e:
        logger.error("[ERROR] Reset password failed: %s", e)
        return "ERROR"
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
