-- 1. Create Users Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Users')
BEGIN
    CREATE TABLE Users (
        id INT IDENTITY(1,1) PRIMARY KEY,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        otp_code VARCHAR(6) NULL,
        otp_expiry DATETIME NULL,
        created_at DATETIME DEFAULT GETDATE()
    );
END
GO

-- 2. Create Register User Procedure
CREATE OR ALTER PROCEDURE register_user_proc
    @full_name VARCHAR(100),
    @email VARCHAR(100),
    @password_hash VARCHAR(255),
    @status VARCHAR(50) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM Users WHERE email = @email)
    BEGIN
        SET @status = 'EMAIL_EXISTS';
    END
    ELSE
    BEGIN
        INSERT INTO Users (full_name, email, password_hash)
        VALUES (@full_name, @email, @password_hash);
        SET @status = 'SUCCESS';
    END
END
GO

-- 3. Create Login User Procedure
CREATE OR ALTER PROCEDURE login_user_proc
    @email VARCHAR(100),
    @password_hash VARCHAR(255) OUTPUT,
    @id INT OUTPUT,
    @full_name VARCHAR(100) OUTPUT,
    @status VARCHAR(50) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM Users WHERE email = @email)
    BEGIN
        SELECT 
            @password_hash = password_hash,
            @id = id,
            @full_name = full_name,
            @status = 'SUCCESS'
        FROM Users
        WHERE email = @email;
    END
    ELSE
    BEGIN
        SET @status = 'FAILED';
    END
END
GO

-- 4. Create Store Reset Token Procedure
CREATE OR ALTER PROCEDURE STORE_RESET_TOKEN_PROC
    @email VARCHAR(100),
    @otp VARCHAR(6),
    @expiry DATETIME,
    @status VARCHAR(50) OUTPUT,
    @error_msg VARCHAR(255) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM Users WHERE email = @email)
    BEGIN
        UPDATE Users
        SET otp_code = @otp,
            otp_expiry = @expiry
        WHERE email = @email;
        SET @status = 'SUCCESS';
        SET @error_msg = '';
    END
    ELSE
    BEGIN
        SET @status = 'FAILED';
        SET @error_msg = 'Email not found';
    END
END
GO

-- 5. Create Reset Password Procedure
CREATE OR ALTER PROCEDURE reset_password_proc
    @email VARCHAR(100),
    @otp VARCHAR(6),
    @password_hash VARCHAR(255),
    @status VARCHAR(50) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM Users WHERE email = @email AND otp_code = @otp AND otp_expiry >= GETDATE())
    BEGIN
        UPDATE Users
        SET password_hash = @password_hash,
            otp_code = NULL,
            otp_expiry = NULL
        WHERE email = @email;
        SET @status = 'SUCCESS';
    END
    ELSE
    BEGIN
        SET @status = 'FAILED';
    END
END
GO

-- 6. Create Update Account Procedure
CREATE OR ALTER PROCEDURE update_account_proc
  @account_id   INT,
  @user_id      INT,
  @account_name VARCHAR(100) = NULL,
  @account_type VARCHAR(50) = NULL,
  @balance      DECIMAL(18,2) = NULL,
  @card_number  VARCHAR(20) = NULL,
  @expiry_date  VARCHAR(5) = NULL,
  @color_theme  VARCHAR(50) = NULL
AS
BEGIN
  SET NOCOUNT ON

  UPDATE Accounts
  SET account_name = COALESCE(@account_name, account_name),
      account_type = COALESCE(@account_type, account_type),
      balance      = COALESCE(@balance, balance),
      card_number  = COALESCE(@card_number, card_number),
      expiry_date  = COALESCE(@expiry_date, expiry_date),
      color_theme  = COALESCE(@color_theme, color_theme)
  WHERE id      = @account_id
    AND user_id = @user_id

  SELECT @@ROWCOUNT AS rows_affected
END
GO

-- 7. Create Subscription table
IF NOT EXISTS (
    SELECT *
    FROM sys.tables
    WHERE name = 'Subscriptions'
)
BEGIN
    CREATE TABLE Subscriptions (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        billing_type VARCHAR(20) NOT NULL,
        due_day INT NOT NULL,
        due_month INT NULL,
        icon_url VARCHAR(255) NULL,
        bg_color VARCHAR(50) NULL,
        created_at DATETIME DEFAULT GETDATE()
    );
END
GO

-- 8. Create Get Subscriptions Procedure
CREATE OR ALTER PROCEDURE get_subscriptions_proc
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        id,
        name,
        amount,
        billing_type,
        due_day,
        due_month,
        icon_url,
        bg_color,
        created_at
    FROM Subscriptions
    ORDER BY due_day;
END
GO

-- 9. Create Add Subscription Procedure
CREATE OR ALTER PROCEDURE add_subscription_proc
    @name VARCHAR(100),
    @amount DECIMAL(10,2),
    @billing_type VARCHAR(20),
    @due_day INT,
    @due_month INT = NULL,
    @icon_url VARCHAR(255) = NULL,
    @bg_color VARCHAR(50) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO Subscriptions
    (
        name,
        amount,
        billing_type,
        due_day,
        due_month,
        icon_url,
        bg_color
    )
    VALUES
    (
        @name,
        @amount,
        @billing_type,
        @due_day,
        @due_month,
        @icon_url,
        @bg_color
    );

    SELECT SCOPE_IDENTITY() AS subscription_id;
END
GO

-- 10. Create Update Subscription Procedure
CREATE OR ALTER PROCEDURE update_subscription_proc
    @id INT,
    @name VARCHAR(100),
    @amount DECIMAL(10,2),
    @billing_type VARCHAR(20),
    @due_day INT,
    @due_month INT = NULL,
    @icon_url VARCHAR(255) = NULL,
    @bg_color VARCHAR(50) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Subscriptions
    SET
        name = @name,
        amount = @amount,
        billing_type = @billing_type,
        due_day = @due_day,
        due_month = @due_month,
        icon_url = @icon_url,
        bg_color = @bg_color
    WHERE id = @id;
END
GO

-- 11. Create Delete Subscription Procedure
CREATE OR ALTER PROCEDURE delete_subscription_proc
    @id INT
AS
BEGIN
    SET NOCOUNT ON;

    DELETE FROM Subscriptions
    WHERE id = @id;
END
GO

