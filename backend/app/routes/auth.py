from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.user_schema import UserCreate, UserLogin, TokenResponse
from app.services.auth_service import (
    create_user,
    authenticate_user,
    create_token
)

router = APIRouter(prefix="/auth", tags=["Authentication"])


# ======================================
# REGISTER
# ======================================
@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    new_user = create_user(db, user.name, user.email, user.password)

    if not new_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    return {
        "message": "User registered successfully",
        "user_id": new_user.id
    }


# ======================================
# LOGIN
# ======================================
@router.post("/login", response_model=TokenResponse)
def login(user: UserLogin, db: Session = Depends(get_db)):
    authenticated_user = authenticate_user(db, user.email, user.password)

    if not authenticated_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_token({"sub": authenticated_user.email})

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }
