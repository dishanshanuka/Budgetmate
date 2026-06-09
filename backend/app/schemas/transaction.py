# backend/app/schemas/transaction.py
from pydantic import BaseModel
from datetime import datetime
from typing import Literal

# Validates data coming from the frontend request
class TransactionCreate(BaseModel):
    account_id: int
    title: str
    category: str
    amount: float
    transaction_type: Literal['INCOME', 'EXPENSE']

# Validates data going out to the frontend response
class TransactionResponse(BaseModel):
    id: int
    user_id: int
    account_id: int
    title: str
    category: str
    amount: float
    transaction_type: str
    transaction_date: datetime

    class Config:
        from_attributes = True