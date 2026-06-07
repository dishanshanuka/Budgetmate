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
