from fastapi import APIRouter, Depends, HTTPException
from app.schemas.account import AccountCreate, AccountOut
from app.services import account_service
from app.utils.security import get_current_user
from typing import List

router = APIRouter()


# --- GET /accounts/ → return all accounts for logged-in user ---
@router.get("/", response_model=List[AccountOut])
def list_accounts(current_user: dict = Depends(get_current_user)):
    user_id = current_user["user_id"]
    accounts = account_service.get_user_accounts(user_id)
    return accounts


# --- POST /accounts/ → add a new account ---
@router.post("/", status_code=201)
def create_account(
    data: AccountCreate,
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user["user_id"]
    new_id = account_service.add_account(user_id, data)

    if new_id is None:
        raise HTTPException(status_code=500, detail="Failed to create account")

    return {"message": "Account created", "id": new_id}


# --- DELETE /accounts/{account_id} → delete an account ---
@router.delete("/{account_id}", status_code=204)
def remove_account(
    account_id: int,
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user["user_id"]
    success = account_service.delete_account(account_id, user_id)

    if not success:
        raise HTTPException(status_code=404, detail="Account not found or not yours")