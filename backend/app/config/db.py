import os
import pyodbc
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
base_dir = Path(__file__).resolve().parent.parent.parent
env_path = base_dir / '.env'
load_dotenv(dotenv_path=env_path)

def get_db_connection():
    try:
        driver = os.getenv('DB_DRIVER', '{ODBC Driver 17 for SQL Server}')
        server = os.getenv('DB_SERVER')
        database = os.getenv('DB_DATABASE')
        user = os.getenv('DB_USER')
        password = os.getenv('DB_PASSWORD')
        
        conn_str = (
            f"Driver={driver};"
            f"Server={server};"
            f"Database={database};"
            f"Uid={user};"
            f"Pwd={password};"
            "Encrypt=yes;"
            "TrustServerCertificate=no;"
            "Connection Timeout=30;"
        )
        
        return pyodbc.connect(conn_str)
    except Exception as e:
        print(f"[DB] Database Connection Error: {e}")
        return None

def init_db():
    print("[DB] Initializing Database...")
    conn = get_db_connection()
    if conn:
        print("[DB] Successfully connected to Azure SQL Database!")
        conn.close()
    else:
        print("[DB] Connection failed!")