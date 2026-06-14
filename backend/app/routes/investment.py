from fastapi import APIRouter
from app.services.investment_service import get_portfolio_history

router = APIRouter()

@router.get("/history")
def investment_history(timeframe: str):
    return get_portfolio_history(1, timeframe)