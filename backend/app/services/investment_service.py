from app.config.db import get_db_connection
import logging

logger = logging.getLogger(__name__)


def get_portfolio_history(user_id: int, timeframe: str):
    conn = None
    cursor = None
    result_cursor = None

    try:
        conn = get_db_connection()
        if not conn:
            return []

        cursor = conn.cursor()
        result_cursor = conn.cursor()

        cursor.callproc(
            "get_portfolio_history_proc",
            [user_id, timeframe, result_cursor]
        )

        rows = result_cursor.fetchall()

        return [
            {
                "record_date": str(row[0]),
                "portfolio_value": float(row[1] or 0)
            }
            for row in rows
        ]

    except Exception as e:
        logger.error(f"[ERROR] get_portfolio_history: {str(e)}")
        return []

    finally:
        if result_cursor:
            result_cursor.close()

        if conn:
            if cursor:
                cursor.close()
            conn.close()