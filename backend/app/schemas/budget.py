# backend/app/schemas/budget.py
from pydantic import BaseModel
from datetime import datetime


class BudgetCreate(BaseModel):
    category: str
    monthly_limit: float


class BudgetResponse(BaseModel):
    id: int
    category: str
    monthly_limit: float
    spent: float
    created_at: datetime

    class Config:
        from_attributes = True