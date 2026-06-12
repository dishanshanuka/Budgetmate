import os
import oracledb
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
base_dir = Path(__file__).resolve().parent.parent.parent
env_path = base_dir / '.env'
load_dotenv(dotenv_path=env_path)

# Global Pool Variable
pool = None

def get_pool():
    global pool
    if pool is None:
        try:
            db_user = os.getenv('DB_USER')
            db_password = os.getenv('DB_PASSWORD')
            db_dsn = os.getenv('DB_DSN')
            wallet_location = os.getenv('WALLET_LOCATION')

            # Connection Pool creation
            pool = oracledb.create_pool(
                user=db_user,
                password=db_password,
                dsn=db_dsn,
                config_dir=wallet_location,
                wallet_location=wallet_location,
                wallet_password=db_password,
                min=2, 
                max=10, 
                increment=1
            )
            print("📦 Database Connection Pool Created!")
        except Exception as e:
            print(f"❌ Pool Creation Error: {e}")
    return pool

def get_db_connection():
    try:
        pool = get_pool()
        if pool:
            return pool.acquire()
        return None
    except Exception as e:
        print(f"❌ Connection Error: {e}")
        return None

def init_db():
    print("🔄 Initializing Database...")
    pool = get_pool()
    if pool:
        print("✅ Successfully connected to Oracle Cloud Database with Pooling!")
    else:
        print("❌ Connection failed!")