from fastapi import APIRouter, HTTPException
from app.schemas.subscription import (
    SubscriptionCreate,
    SubscriptionResponse
)
from app.services import subscription_service
from typing import List

router = APIRouter()


# --- GET /subscriptions/ ---
@router.get("/", response_model=List[SubscriptionResponse])
def list_subscriptions():
    subscriptions = subscription_service.get_subscriptions()
    return subscriptions


# --- POST /subscriptions/ ---
@router.post("/", status_code=201)
def create_subscription(data: SubscriptionCreate):
    new_id = subscription_service.add_subscription(data)

    if new_id is None:
        raise HTTPException(
            status_code=500,
            detail="Failed to create subscription"
        )

    return {
        "message": "Subscription created",
        "id": new_id
    }


# --- PUT /subscriptions/{subscription_id} ---
@router.put("/{subscription_id}")
def modify_subscription(subscription_id: int, data: SubscriptionCreate):
    success, error = subscription_service.update_subscription(subscription_id, data)

    if error is not None:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to update subscription: {error}"
        )

    if not success:
        raise HTTPException(
            status_code=404,
            detail="Subscription not found"
        )

    return {
        "message": "Subscription updated"
    }


# --- DELETE /subscriptions/{subscription_id} ---
@router.delete("/{subscription_id}", status_code=204)
def remove_subscription(subscription_id: int):
    success = subscription_service.delete_subscription(subscription_id)

    if not success:
        raise HTTPException(
            status_code=404,
            detail="Subscription not found"
        )