# BudgetMate Backend

This is the Python (FastAPI) backend for the BudgetMate expense tracking system. It provides RESTful APIs, handles authentication with JWT, and connects to an Azure SQL Database.

## Setup Instructions for Teammates

### 1. Set up your Python Environment
It is recommended to use a virtual environment. Open a terminal in this `backend/` directory:

```bash
# Create a virtual environment (optional but recommended)
python -m venv venv
# Activate it (Windows)
.\venv\Scripts\activate

# Install the required dependencies
pip install -r requirements.txt
```

### 2. Install ODBC Driver
This project uses `pyodbc` to connect to Azure SQL Database. You need the **ODBC Driver 17 for SQL Server** installed on your machine.
- Download it from: [Microsoft ODBC Driver for SQL Server](https://learn.microsoft.com/en-us/sql/connect/odbc/download-odbc-driver-for-sql-server)
- Most Windows machines with SQL Server tools already have this installed.

### 3. Set up Environment Variables
Because passwords are ignored by Git, you need to create your own local `.env` file:
1. Copy the `backend/.env.example` file and rename the copy to `.env`.
2. Open the new `.env` file and fill in your actual database credentials, JWT secret, and email configurations (ask the team lead if unsure).

### 4. Set up the Database
If the Azure SQL Database tables and stored procedures have not been created yet, run the setup script:
1. Open `database_setup.sql` in **Microsoft SQL Server Management Studio (SSMS)**.
2. Connect to the Azure SQL Server (`budgetmate-db-server-bhashitha.database.windows.net`).
3. Execute the script against the `BudgetMate` database.

### 5. Run the Server
Start the development server using the main module:
```bash
python -m app.main
```

Alternatively, you can run it directly with Uvicorn:
```bash
uvicorn app.main:app --reload
```

### 6. Verify API Connection
Once the server is running, visit:
[http://localhost:8000/docs](http://localhost:8000/docs)
This will open the interactive Swagger UI where you can explore and test all available API endpoints!

