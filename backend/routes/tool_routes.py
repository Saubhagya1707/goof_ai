from typing import Annotated, List
from auth.security import get_current_user
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import select
from utils.db import get_db
import models.db as models, schemas.pydantic as schemas

tool_router = APIRouter(prefix="/tools", tags=["tools"])

@tool_router.get("/", response_model=List[schemas.ToolOut])
def get_tools(db: Session = Depends(get_db), current_user: Annotated[schemas.UserResponse, Depends(get_current_user)] = None):
    results = db.execute(select(models.Tool)).scalars().all()
    return results