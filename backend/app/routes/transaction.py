# backend/app/routes/transaction.py
from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.transaction import TransactionCreate, TransactionResponse
from app.services.transaction_service import create_transaction_in_db, get_user_transactions_from_db
from app.utils.security import get_current_user
from typing import List

router = APIRouter(tags=["Transactions"])

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_transaction(tx: TransactionCreate, current_user: dict = Depends(get_current_user)):
    """
    Creates a new transaction for the authenticated user and updates the account balance.
    """
    user_id = current_user["user_id"]
    result = create_transaction_in_db(user_id, tx)
    
    if result["status"] == "ACCOUNT_NOT_FOUND":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Account not found or does not belong to this user"
        )
    elif result["status"] != "SUCCESS":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Transaction failed to process"
        )
        
    return {"message": "Transaction recorded successfully and balance updated"}


@router.get("/", response_model=List[TransactionResponse])
def get_transactions(current_user: dict = Depends(get_current_user)):
    """
    Retrieves the transaction history for the authenticated user.
    """
    user_id = current_user["user_id"]
    return get_user_transactions_from_db(user_id)