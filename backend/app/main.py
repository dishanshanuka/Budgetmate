from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware 
from app.config.db import init_db
from app.routes import auth 
import uvicorn

app = FastAPI(title="BudgetMate API - Professional Mode")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

app.include_router(auth.router, prefix="/auth")

@app.on_event("startup")
async def startup():
    print("[SERVER] Server is starting up...")
    init_db()

@app.get("/")
def home():
    return {"status": "Backend is running"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)