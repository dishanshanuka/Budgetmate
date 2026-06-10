from app.config.db import get_db_connection
from app.schemas.budget import BudgetCreate


def set_budget_in_db(user_id: int, budget: BudgetCreate):
    """Create or update a category budget limit via stored procedure."""
    conn = get_db_connection()
    if not conn:
        return {"status": "ERROR", "message": "Database connection failed"}
    cursor = conn.cursor()
    try:
        sql = """
        DECLARE @status VARCHAR(50);
        EXEC set_budget_limit_proc ?, ?, ?, @status OUTPUT;
        SELECT @status;
        """
        cursor.execute(sql, (user_id, budget.category, budget.monthly_limit))
        result = cursor.fetchone()
        conn.commit()

        status = result[0] if result else "FAILED"
        return {"status": status}
    except Exception as e:
        print(f"[BUDGET] set_budget_in_db error: {e}")
        return {"status": "ERROR", "message": str(e)}
    finally:
        cursor.close()
        conn.close()


def get_budgets_from_db(user_id: int):
    """Fetch all budgets with current-month spent amounts for a user."""
    conn = get_db_connection()
    if not conn:
        return []
    cursor = conn.cursor()
    try:
        cursor.execute("EXEC get_budgets_with_spent_proc ?", (user_id,))
        rows = cursor.fetchall()

        return [
            {
                "id": r[0],
                "category": r[1],
                "monthly_limit": float(r[2]),
                "spent": float(r[3]),
                "created_at": r[4],
            }
            for r in rows
        ]
    except Exception as e:
        print(f"[BUDGET] get_budgets_from_db error: {e}")
        return []
    finally:
        cursor.close()
        conn.close()


def delete_budget_from_db(budget_id: int, user_id: int):
    """Delete a budget category via stored procedure."""
    conn = get_db_connection()
    if not conn:
        return {"status": "ERROR", "message": "Database connection failed"}
    cursor = conn.cursor()
    try:
        sql = """
        DECLARE @status VARCHAR(50);
        EXEC delete_budget_proc ?, ?, @status OUTPUT;
        SELECT @status;
        """
        cursor.execute(sql, (budget_id, user_id))
        result = cursor.fetchone()
        conn.commit()

        status = result[0] if result else "FAILED"
        return {"status": status}
    except Exception as e:
        print(f"[BUDGET] delete_budget_from_db error: {e}")
        return {"status": "ERROR", "message": str(e)}
    finally:
        cursor.close()
        conn.close()