--------------------------------------------------------
-- Subscription procedure fixes
-- Run this in Oracle after the main schema script.
-- The backend calls these procedures; no inline procedure creation is used.
--------------------------------------------------------
SET DEFINE OFF;

CREATE OR REPLACE PROCEDURE get_subscriptions_proc (
    p_user_id IN NUMBER,
    p_result  OUT SYS_REFCURSOR
) AS
BEGIN
    OPEN p_result FOR
        SELECT subscription_id AS id,
               name,
               amount,
               CASE UPPER(TRIM(billing_type))
                   WHEN 'MONTHLY' THEN 'Monthly'
                   WHEN 'MONTH' THEN 'Monthly'
                   WHEN 'YEARLY' THEN 'Annual'
                   WHEN 'ANNUAL' THEN 'Annual'
                   WHEN 'YEAR' THEN 'Annual'
                   ELSE NVL(billing_type, 'Monthly')
               END AS billing_type,
               due_day,
               due_month,
               icon_url,
               bg_color
        FROM subscriptions
        WHERE user_id = p_user_id
        ORDER BY due_day, subscription_id;
END;
/

CREATE OR REPLACE PROCEDURE add_subscription_proc (
    p_user_id          IN  NUMBER,
    p_name             IN  VARCHAR2,
    p_amount           IN  NUMBER,
    p_billing_type     IN  VARCHAR2,
    p_due_day          IN  NUMBER,
    p_due_month        IN  NUMBER DEFAULT NULL,
    p_icon_url         IN  VARCHAR2 DEFAULT NULL,
    p_bg_color         IN  VARCHAR2 DEFAULT NULL,
    p_subscription_id  OUT NUMBER
) AS
BEGIN
    INSERT INTO subscriptions
        (user_id, name, amount, billing_type, due_day, due_month, icon_url, bg_color)
    VALUES
        (
            p_user_id,
            p_name,
            p_amount,
            CASE UPPER(TRIM(p_billing_type))
                WHEN 'YEARLY' THEN 'Annual'
                WHEN 'ANNUAL' THEN 'Annual'
                WHEN 'YEAR' THEN 'Annual'
                ELSE 'Monthly'
            END,
            p_due_day,
            p_due_month,
            p_icon_url,
            p_bg_color
        )
    RETURNING subscription_id INTO p_subscription_id;

    COMMIT;
END;
/

CREATE OR REPLACE PROCEDURE update_subscription_proc (
    p_id            IN  NUMBER,
    p_user_id       IN  NUMBER,
    p_name          IN  VARCHAR2,
    p_amount        IN  NUMBER,
    p_billing_type  IN  VARCHAR2,
    p_due_day       IN  NUMBER,
    p_due_month     IN  NUMBER DEFAULT NULL,
    p_icon_url      IN  VARCHAR2 DEFAULT NULL,
    p_bg_color      IN  VARCHAR2 DEFAULT NULL,
    p_rows_affected OUT NUMBER
) AS
BEGIN
    UPDATE subscriptions
    SET name = p_name,
        amount = p_amount,
        billing_type = CASE UPPER(TRIM(p_billing_type))
            WHEN 'YEARLY' THEN 'Annual'
            WHEN 'ANNUAL' THEN 'Annual'
            WHEN 'YEAR' THEN 'Annual'
            ELSE 'Monthly'
        END,
        due_day = p_due_day,
        due_month = p_due_month,
        icon_url = p_icon_url,
        bg_color = p_bg_color
    WHERE subscription_id = p_id
      AND user_id = p_user_id;

    p_rows_affected := SQL%ROWCOUNT;
    COMMIT;
END;
/

CREATE OR REPLACE PROCEDURE delete_subscription_proc (
    p_id            IN  NUMBER,
    p_user_id       IN  NUMBER,
    p_rows_affected OUT NUMBER
) AS
BEGIN
    DELETE FROM subscriptions
    WHERE subscription_id = p_id
      AND user_id = p_user_id;

    p_rows_affected := SQL%ROWCOUNT;
    COMMIT;
END;
/
