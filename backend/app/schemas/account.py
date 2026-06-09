from pydantic import BaseModel
from typing import Optional
from datetime import datetime


# --- Request: what frontend sends when creating an account ---
class AccountCreate(BaseModel):
    account_name: str
    account_type: str
    balance: float = 0.00
    card_number: Optional[str] = None
    expiry_date: Optional[str] = None
    color_theme: Optional[str] = "bg-blue-600"


# --- Response: what backend sends back to frontend ---
class AccountOut(BaseModel):
    id: int
    account_name: str
    account_type: str
    balance: float
    card_number: Optional[str]
    expiry_date: Optional[str]
    color_theme: Optional[str]
    created_at: Optional[datetime]

    class Config:
        from_attributes = True