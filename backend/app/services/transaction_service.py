# backend/app/services/transaction_service.py
from app.config.db import get_db_connection
from app.schemas.transaction import TransactionCreate

def create_transaction_in_db(user_id: int, tx: TransactionCreate):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        sql = """
        DECLARE @status VARCHAR(50);
        EXEC add_transaction_proc ?, ?, ?, ?, ?, ?, @status OUTPUT;
        SELECT @status;
        """
        cursor.execute(sql, (
            user_id,
            tx.account_id,
            tx.title,
            tx.category,
            tx.amount,
            tx.transaction_type
        ))
        result = cursor.fetchone()
        conn.commit()
        
        status = result[0] if result else "FAILED"
        return {"status": status}
    except Exception as e:
        return {"status": "ERROR", "message": str(e)}
    finally:
        cursor.close()
        conn.close()

def get_user_transactions_from_db(user_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("EXEC get_user_transactions_proc ?", (user_id,))
        rows = cursor.fetchall()
        
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