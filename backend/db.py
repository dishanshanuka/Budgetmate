import os
import oracledb
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def get_db_connection():
    try:
        db_user = os.getenv('DB_USER')
        db_password = os.getenv('DB_PASSWORD')
        db_dsn = os.getenv('DB_DSN')
        wallet_location = os.getenv('WALLET_LOCATION')
        
        if not all([db_user, db_password, db_dsn, wallet_location]):
            raise ValueError("Database connection variables are missing in .env")

        # Connect to Oracle Autonomous Database using Thin mode and Wallet
        connection = oracledb.connect(
            user=db_user,
            password=db_password,
            dsn=db_dsn,
            config_dir=wallet_location,
            wallet_location=wallet_location,
            wallet_password=None # ewallet.p12 won't be used, cwallet.sso will be used automatically
        )
        return connection
    except Exception as e:
        print(f"Error establishing database connection: {e}")
        return None
