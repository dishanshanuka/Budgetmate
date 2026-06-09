from pydantic import BaseModel
from typing import Optional


class SubscriptionCreate(BaseModel):
    name: str
    amount: float
    billing_type: str
    due_day: int
    due_month: Optional[int] = None
    icon_url: Optional[str] = None
    bg_color: Optional[str] = None


class SubscriptionResponse(BaseModel):
    id: int
    name: str
    amount: float
    billing_type: str
    due_day: int
    due_month: Optional[int] = None
    icon_url: Optional[str] = None
    bg_color: Optional[str] = None