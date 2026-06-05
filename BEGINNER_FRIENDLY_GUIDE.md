# 🎓 BudgetMate - Beginner-Friendly Development Guide

This guide is designed to help team members with less technical background understand how the application operates and complete their tasks step-by-step.

---

## 🍽️ The Restaurant Analogy (How our App works)

To understand how our three systems work together, think of a restaurant:
1. **Frontend (React)** = **The Customer Table & Menu**. This is what the user sees, touches, and interacts with. It looks premium and holds the forms where the user enters data.
2. **Backend (FastAPI)** = **The Waiter**. The frontend hands the waiter a request (e.g., "Add $50 transaction"). The waiter brings this request to the kitchen (Database), gets the confirmation, and returns to the table with the result.
3. **Database (Oracle Cloud)** = **The Kitchen**. This is where the food (data) is stored and cooked (organized). 
   * **Tables** = Storage cabinets (where we keep lists of Users, Accounts, and Transactions).
   * **Stored Procedures** = Recipe scripts. Instead of writing complex queries in Python, we write "recipes" directly in the database (e.g., "Add transaction recipe"). The waiter just asks the kitchen to "run recipe X".
   * **Triggers** = Automatic helper chefs. If a helper chef sees a new Expense transaction being recorded in the transaction cabinet, they automatically run over to the Account cabinet and subtract the money from the account balance.

---

## 💡 Code Templates: Copy, Paste & Customize!

### 🗄️ Template 1: Writing an Oracle Stored Procedure (PL/SQL)
```sql
CREATE OR REPLACE PROCEDURE ADD_ITEM_PROC (
    p_user_id      IN  NUMBER,
    p_item_name    IN  VARCHAR2,
    p_amount       IN  NUMBER,
    p_status       OUT VARCHAR2
) AS
BEGIN
    INSERT INTO ITEMS_TABLE (USER_ID, ITEM_NAME, AMOUNT)
    VALUES (p_user_id, p_item_name, p_amount);
    
    p_status := 'SUCCESS';
EXCEPTION
    WHEN OTHERS THEN
        p_status := 'ERROR: ' || SQLERRM;
END;
/
```

### 🐍 Template 2: Writing a FastAPI Endpoint (Python)
```python
from fastapi import APIRouter, Depends, HTTPException
from app.config.db import get_db_connection
from app.utils.security import get_current_user_id  # Dependency created in PR 2

router = APIRouter(tags=["Items"])

@router.post("/items")
def add_item(name: str, amount: float, current_user_id: int = Depends(get_current_user_id)):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        p_status = cursor.var(str)
        cursor.callproc("ADD_ITEM_PROC", [current_user_id, name, amount, p_status])
        conn.commit()
        status = p_status.getvalue()
        if status == "SUCCESS":
            return {"message": "Item added successfully!"}
        raise HTTPException(status_code=400, detail=status)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        cursor.close()
        conn.close()
```

### ⚛️ Template 3: Sending Data from React (Frontend JavaScript)
```javascript
import API from '../services/api';
import toast from 'react-hot-toast';

const handleFormSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Saving...");
    try {
        const response = await API.post('/items', { 
            name: "Item Name", 
            amount: 50.00 
        });
        if (response.status === 200 || response.status === 201) {
            toast.success("Saved successfully!", { id: loadingToast });
            // Do state updates or page reload here...
        }
    } catch (error) {
        const errMsg = error.response?.data?.detail || "Failed to save.";
        toast.error(errMsg, { id: loadingToast });
    }
};
```

---

## 👥 Teammate Guide: Step-by-Step Instructions

* **PR 1: Anjana (Database Setup & Registration Verification)**: Initialize all tables. Create a stored procedure `CHECK_EMAIL_EXISTS_PROC`, a FastAPI `/auth/check-email` endpoint, and integrate inline verification into the registration frontend modal.
* **PR 2: Dinesh (Auth Session & Protected Routes)**: Secure user pages. Set up FastAPI authentication security middleware to parse tokens, connect Login/Forgot-Password modals to the backend APIs, and configure frontend Protected Router guards.
* **PR 3: Bhashitha (Wallet & Accounts Management)**: Build wallet CRUD operations. Create procedures (`CREATE_ACCOUNT_PROC`, etc.), API routes `/accounts`, and update `MyWallet.jsx` pages to dynamic rendering.
* **PR 4: Dishan (Transaction Ledger & Balance Trigger)**: Automate account balances. Write the database trigger `TRG_UPDATE_ACCOUNT_BALANCE` (provided in assignments), API routes `/transactions`, and connect dashboard transactions listings and creation fields.
* **PR 5: Omashi (Expense Categories & Budgets)**: Build limits tracker. Write the database trigger `TRG_UPDATE_BUDGET_SPENT`, API routes `/budgets`, and connect progress bars and budget spent warnings.
* **PR 6: Rasanjalee (Recurring Bills Manager)**: Track repeating invoices. Write DB procedures, API routes `/bills` and `/bills/{id}/pay`, and link bill cards to toggle paid status.
* **PR 7: Investment Portfolio Tracker (Rasodya)**: Show stock/crypto totals. Write DB procedures, APIs `/investments`, and holdings calculations.
* **PR 8: Divya (Analytics & aggregate Queries)**: Write aggregate queries (`SUM`, `GROUP BY`), APIs `/analytics/category-breakdown`, and render charts using Recharts.
* **PR 9: Vijan (Dashboard Summary Page)**: Aggregate overall details. Write `GET_DASHBOARD_SUMMARY_PROC`, APIs `/dashboard/summary`, and update dashboard headers.
* **PR 10: Kavinda (Settings & Profile - Easy Task)**: Connect forms. Write update procedures, APIs `/settings` and `/settings/reset` (wipe data), and build forms and warning alerts.
