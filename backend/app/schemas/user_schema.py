from pydantic import BaseModel, EmailStr
from typing import Optional

class UserData(BaseModel):
    name: str
    email: str

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: Optional[UserData] = None
