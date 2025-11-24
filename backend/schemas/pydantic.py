from datetime import datetime
from typing import List, Optional
from enum import Enum

from pydantic import BaseModel, EmailStr


class FrequencyEnum(str, Enum):
    every_minute = "every_minute"
    hourly = "hourly"
    daily = "daily"
    weekly = "weekly"

class ToolOut(BaseModel):
    name: str
    description: str
    class Config:
        from_attributes = True

class UserBasic(BaseModel):
    id: int
    email: EmailStr
    name: str | None = None

    class Config:
        from_attributes = True

class AgentOut(BaseModel):
    name: str
    base_prompt: str
    is_scheduled: bool
    frequency: FrequencyEnum | None = None
    owner_id: int | None = None
    owner: UserBasic | None = None
    tools: List[ToolOut] = []

    class Config:
        from_attributes = True


class AgentIn(BaseModel):
    name: str
    base_prompt: str
    is_scheduled: bool
    frequency: FrequencyEnum | None = None
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