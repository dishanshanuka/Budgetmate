# backend/app/routes/budget.py
from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.budget import BudgetCreate, BudgetResponse
from app.services.budget_service import (
    set_budget_in_db,
    get_budgets_from_db,
    delete_budget_from_db,
)
from app.utils.security import get_current_user
from typing import List

router = APIRouter(tags=["Budgets"])


@router.get("/", response_model=List[BudgetResponse])
def get_budgets(current_user: dict = Depends(get_current_user)):
    """
    Returns all budget categories for the logged-in user,
    each with the amount already spent this calendar month.
    """
    user_id = current_user["user_id"]
    return get_budgets_from_db(user_id)


@router.post("/", status_code=status.HTTP_201_CREATED)
def set_budget(budget: BudgetCreate, current_user: dict = Depends(get_current_user)):
    """
    Create a new budget limit or update an existing one for a category.
    The stored procedure handles the upsert logic.
    """
    user_id = current_user["user_id"]
    result = set_budget_in_db(user_id, budget)

    if result["status"] not in ("CREATED", "UPDATED"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to save budget limit",
        )

    action = "created" if result["status"] == "CREATED" else "updated"
    return {"message": f"Budget limit {action} successfully"}


@router.delete("/{budget_id}", status_code=status.HTTP_200_OK)
def delete_budget(budget_id: int, current_user: dict = Depends(get_current_user)):
    """
    Delete a budget category by ID (only if it belongs to the current user).
    """
    user_id = current_user["user_id"]
    result = delete_budget_from_db(budget_id, user_id)

    if result["status"] == "NOT_FOUND":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Budget not found or does not belong to this user",
        )
    elif result["status"] != "DELETED":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to delete budget",
        )

    return {"message": "Budget deleted successfully"}