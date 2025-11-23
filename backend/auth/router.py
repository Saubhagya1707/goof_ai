from schemas.pydantic import UserRegister, UserResponse
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

from models import db as Models 

from utils.db import get_db
from auth.security import (
    authenticate_user,
    create_access_token,
    get_current_user,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    hash_password
)

user_admin_router = APIRouter(prefix="/admin", tags=["User Admin"])


@user_admin_router.post("/token")
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = authenticate_user(form_data.username, form_data.password, db)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )

    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    return {"access_token": access_token, "token_type": "bearer"}


@user_admin_router.get("/me")
def read_users_me(current_user=Depends(get_current_user)):
    return {"email": current_user.email, "id": current_user.id}


@user_admin_router.post("/register", response_model=UserResponse)
def register_user(payload: UserRegister, db: Session = Depends(get_db)):

    # Check if email already exists
    existing_user = db.query(Models.User).filter(Models.User.email == payload.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    # Hash password
    password_hashed = hash_password(payload.password)

    # Create new user
    new_user = Models.User(
        email=payload.email,
        name=payload.name,
        password_hash=password_hashed,
        is_active=True,
        is_superuser=False,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user