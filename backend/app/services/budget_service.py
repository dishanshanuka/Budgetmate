from app.config.db import get_db_connection
from app.schemas.budget import BudgetCreate


def set_budget_in_db(user_id: int, budget: BudgetCreate):
    """Create or update a category budget limit via stored procedure."""
    conn = get_db_connection()
    if not conn:
        return {"status": "ERROR", "message": "Database connection failed"}
    cursor = conn.cursor()
    try:
        status_var = cursor.var(str)
        cursor.callproc(
            "set_budget_limit_proc",
            [user_id, budget.category, budget.monthly_limit, status_var]
        )
        conn.commit()

        return {"status": status_var.getvalue() or "FAILED"}
    except Exception as e:
        print(f"[BUDGET] set_budget_in_db error: {e}")
        return {"status": "ERROR", "message": str(e)}
    finally:
        cursor.close()
        conn.close()


def get_budgets_from_db(user_id: int):
    """Fetch all budgets with current-month spent amounts for a user."""
    conn = None
    cursor = None
    result_cursor = None
    try:
        conn = get_db_connection()
        if not conn:
            return []

        cursor = conn.cursor()
        result_cursor = conn.cursor()
        cursor.callproc("get_budgets_with_spent_proc", [user_id, result_cursor])
        rows = result_cursor.fetchall()

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
        if result_cursor:
            result_cursor.close()
        if cursor:
            cursor.close()
        if conn:
            conn.close()


def delete_budget_from_db(budget_id: int, user_id: int):
    """Delete a budget category via stored procedure."""
    conn = get_db_connection()
    if not conn:
        return {"status": "ERROR", "message": "Database connection failed"}
    cursor = conn.cursor()
    try:
        status_var = cursor.var(str)
        cursor.callproc("delete_budget_proc", [budget_id, user_id, status_var])
        conn.commit()

        return {"status": status_var.getvalue() or "FAILED"}
    except Exception as e:
        print(f"[BUDGET] delete_budget_from_db error: {e}")
        return {"status": "ERROR", "message": str(e)}
    finally:
        cursor.close()
        conn.close()
