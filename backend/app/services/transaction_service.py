# backend/app/services/transaction_service.py
from app.config.db import get_db_connection
from app.schemas.transaction import TransactionCreate
import oracledb

def create_transaction_in_db(user_id: int, tx: TransactionCreate):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        status_var = cursor.var(str)
        cursor.callproc(
            "add_transaction_proc",
            [
                user_id,
                tx.account_id,
                tx.title,
                tx.category,
                tx.amount,
                tx.transaction_type,
                status_var,
            ]
        )
        conn.commit()
        
        return {"status": status_var.getvalue() or "FAILED"}
    except Exception as e:
        return {"status": "ERROR", "message": str(e)}
    finally:
        cursor.close()
        conn.close()

def get_user_transactions_from_db(user_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        result = cursor.var(oracledb.DB_TYPE_CURSOR)
        cursor.callproc("get_user_transactions_proc", [user_id, result])

        result_cursor = result.getvalue()
        try:
            rows = result_cursor.fetchall()
        finally:
            result_cursor.close()
        
        return [{
            "id": r[0],
            "user_id": r[1],
            "account_id": r[2],
            "title": r[3],
            "category": r[4],
            "amount": float(r[5]),
            "transaction_type": r[6],
            "transaction_date": r[7]
        } for r in rows]
    except Exception as e:
        print(f"Error fetching transactions: {e}")
        return []
    finally:
        cursor.close()
        conn.close()
