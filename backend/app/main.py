import sys
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

backend_root = Path(__file__).resolve().parent.parent
if str(backend_root) not in sys.path:
    sys.path.insert(0, str(backend_root))

from app.config.db import init_db
from app.routes.transaction import router as transaction_router
from app.routes import auth, account, subscription
from app.routes.budget import router as budget_router
from app.routes.settings import router as settings_router
from app.routes.investment import router as investment_router 

app = FastAPI(title="BudgetMate API - Professional Mode")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, 
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

# Registering our route modules
app.include_router(auth.router, prefix="/auth")

app.include_router(transaction_router, prefix="/transactions")
app.include_router(account.router, prefix="/accounts")
app.include_router(subscription.router, prefix="/subscriptions")
app.include_router(budget_router, prefix="/budgets")  
app.include_router(settings_router, prefix="/settings")
app.include_router(investment_router, prefix="/investments")

@app.on_event("startup")
async def startup():
    print("[SERVER] Server is starting up...")
    init_db()

@app.get("/")
def home():
    return {"status": "Backend is running"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)