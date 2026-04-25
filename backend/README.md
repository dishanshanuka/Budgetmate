# Budgetmate Backend

This is the Python (Flask) backend for the Budgetmate expense tracking system. It connects to an Oracle Cloud Autonomous Database.

## Setup Instructions for Teammates

### 1. Set up your Python Environment
Open a terminal in this `backend/` directory and install the required dependencies:
```bash
pip install -r requirements.txt
```

### 2. Configure the Oracle Cloud Wallet
Because the wallet contains sensitive connection certificates, it is ignored by Git. 
1. Ask the project lead for the `Wallet_ZYHS69EYEV1FQDXG.zip` file.
2. Create a folder named `wallet` inside this `backend/` directory.
3. Extract all the files from the zip into `backend/wallet/`.

### 3. Set up Environment Variables
Because passwords are also ignored by Git, you need to create your own local `.env` file:
1. Copy the `backend/.env.example` file and rename the copy to `.env`.
2. Open the new `.env` file and replace `YOUR_USERNAME_HERE` and `YOUR_PASSWORD_HERE` with the actual database credentials (ask the team lead).

### 4. Run the Server
Start the development server:
```bash
python app.py
```

### 5. Verify Database Connection
Once the server is running, visit:
[http://127.0.0.1:5000/test-db](http://127.0.0.1:5000/test-db)
If it responds with a success message, you are officially connected to the Oracle Cloud database!
