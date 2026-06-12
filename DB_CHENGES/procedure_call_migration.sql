--------------------------------------------------------
-- Procedure-call migration for backend service reads
-- Run this in Oracle before using the updated Python code.
--------------------------------------------------------
SET DEFINE OFF;

--------------------------------------------------------
-- Transactions
--------------------------------------------------------

CREATE OR REPLACE PROCEDURE get_user_transactions_proc (
    p_user_id IN NUMBER,
    p_result  OUT SYS_REFCURSOR
) AS
BEGIN
    OPEN p_result FOR
        SELECT transaction_id AS id,
               user_id,
               account_id,
               description AS title,
               category,
               amount,
               type AS transaction_type,
               transaction_date
        FROM transactions
        WHERE user_id = p_user_id
        ORDER BY transaction_date DESC, transaction_id DESC;
END;
/

--------------------------------------------------------
-- Budgets
--------------------------------------------------------

CREATE OR REPLACE PROCEDURE get_budgets_with_spent_proc (
    p_user_id IN NUMBER,
    p_result  OUT SYS_REFCURSOR
) AS
BEGIN
    OPEN p_result FOR
        SELECT b.id,
               b.category,
               b.monthly_limit,
               NVL(SUM(t.amount), 0) AS spent,
               b.created_at
        FROM budgets b
        LEFT JOIN transactions t
            ON t.user_id = b.user_id
           AND t.category = b.category
           AND t.type = 'EXPENSE'
           AND EXTRACT(MONTH FROM t.transaction_date) = EXTRACT(MONTH FROM CURRENT_DATE)
           AND EXTRACT(YEAR FROM t.transaction_date) = EXTRACT(YEAR FROM CURRENT_DATE)
        WHERE b.user_id = p_user_id
        GROUP BY b.id, b.category, b.monthly_limit, b.created_at
        ORDER BY b.created_at;
END;
/
