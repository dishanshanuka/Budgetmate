from app.config.db import get_db_connection
from app.utils.security import hash_password, verify_password, create_access_token, send_reset_email
import secrets
from datetime import datetime, timedelta
import logging

# Logging setup
logger = logging.getLogger(__name__)

# --- 1. User Registration ---
def register_user(full_name, email, password):
    clean_email = email.strip().lower()
    hashed_pw = hash_password(password)
    
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        sql = """
        DECLARE @status VARCHAR(50);
        EXEC register_user_proc ?, ?, ?, @status OUTPUT;
        SELECT @status;
        """
        cursor.execute(sql, (full_name, clean_email, hashed_pw))
        row = cursor.fetchone()
        status = row[0] if row else "ERROR"
        
        conn.commit()
        return status
    except Exception as e:
        logger.error(f"[ERROR] Registration Error: {str(e)}")
        return "ERROR"
    finally:
        if conn:
            cursor.close()
            conn.close()

# --- 2. User Login ---
def authenticate_user(email, password):
    clean_email = email.strip().lower()
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        sql = """
        DECLARE @password_hash VARCHAR(255), @id INT, @full_name VARCHAR(100), @status VARCHAR(50);
        EXEC login_user_proc ?, @password_hash OUTPUT, @id OUTPUT, @full_name OUTPUT, @status OUTPUT;
        SELECT @password_hash, @id, @full_name, @status;
        """
        cursor.execute(sql, (clean_email,))
        row = cursor.fetchone()
        
        if row:
            db_hash, db_id, db_name, db_status = row
            if db_status == "SUCCESS" and db_hash and verify_password(password, db_hash):
                token = create_access_token({"sub": clean_email, "user_id": db_id})
                return {"access_token": token, "token_type": "bearer", "user": db_name}, "SUCCESS"
        
        return None, "FAILED"
    except Exception as e:
        logger.error(f"[ERROR] Login Error: {str(e)}")
        return "ERROR"
    finally:
        if conn:
            cursor.close()
            conn.close()

# --- 3. Forgot Password (OTP Logic) ---
def forgot_password_logic(email: str) -> str:
    clean_email = email.strip().lower()
    
    #  generate a secure 6-digit OTP
    otp = str(secrets.randbelow(900000) + 100000)
    expiry = datetime.now() + timedelta(minutes=10)
    
    print(f"[DEBUG] Generated OTP: {otp} for '{clean_email}'")
    
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        sql = """
        DECLARE @status VARCHAR(50), @error_msg VARCHAR(255);
        EXEC STORE_RESET_TOKEN_PROC ?, ?, ?, @status OUTPUT, @error_msg OUTPUT;
        SELECT @status, @error_msg;
        """
        cursor.execute(sql, (clean_email, otp, expiry))
        row = cursor.fetchone()
        
        status = "FAILED"
        if row:
            status, error_msg = row
            
        if status == "SUCCESS":
            if send_reset_email(clean_email, otp):
                conn.commit()
                print(f"[DEBUG] OTP sent to {clean_email}")
                return "SUCCESS"
            else:
                return "EMAIL_FAILED"
        
        return "FAILED"
    except Exception as e:
        print(f"[DEBUG] Error in Forgot Password: {str(e)}")
        return "INTERNAL_ERROR"
    finally:
        if conn:
            cursor.close()
            conn.close()

# --- 4. Reset Password ---
def reset_password_logic(email, otp, new_password):
    clean_email = email.strip().lower()
    # hash the new password before sending it to the database
    hashed_pw = hash_password(new_password)
    
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        sql = """
        DECLARE @status VARCHAR(50);
        EXEC reset_password_proc ?, ?, ?, @status OUTPUT;
        SELECT @status;
        """
        cursor.execute(sql, (clean_email, otp, hashed_pw))
        row = cursor.fetchone()
        status = row[0] if row else "ERROR"
        
        print(f"[DEBUG] Reset Status from DB: {status}")
        
        conn.commit()
        return status
    except Exception as e:
        print(f"[DEBUG] Critical Reset Error - {str(e)}")
        return "ERROR"
    finally:
        if conn:
            cursor.close()
            conn.close()