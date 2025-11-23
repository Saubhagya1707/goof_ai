from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr

class ToolOut(BaseModel):
    name: str
    description: str
    class Config:
        from_attributes = True

class AgentOut(BaseModel):
    name: str
    base_prompt: str
    is_scheduled: bool
    tools: List[ToolOut] = []

    class Config:
        from_attributes = True

# OAuth2 Token schema

class TokenData(BaseModel):
    access_token: Optional[str]
    refresh_token: Optional[str]
    expires_at: Optional[datetime]
    token_type: Optional[str]
    scope: Optional[str]
    id_token: Optional[str]

class ConnectResponse(BaseModel):
    auth_url: str


# User schema for authentication responses

# ---------- Request Model ----------
class UserRegister(BaseModel):
    email: EmailStr
    name: str | None = None
    password: str


# ---------- Response Model ----------
class UserResponse(BaseModel):
    id: int
    email: EmailStr
    name: str | None = None
    is_active: bool
    is_superuser: bool

    class Config:
        orm_mode = True