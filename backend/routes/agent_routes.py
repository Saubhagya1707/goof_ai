from typing import Annotated, List
from auth.security import get_current_user
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import select
from utils.db import get_db
import models.db as models, schemas.pydantic as schemas

agent_router = APIRouter(prefix="/agents", tags=["agents"])

@agent_router.get("/", response_model=List[schemas.AgentOut])
def get_agents(db: Session = Depends(get_db), current_user: Annotated[schemas.UserResponse, Depends(get_current_user)] = None):
    results = db.execute(select(models.Agent)).scalars().all()
    return results
    
@agent_router.get("/{agent_id}", response_model=schemas.AgentOut)
def get_agent(agent_id: int, db: Session = Depends(get_db), current_user: Annotated[schemas.UserResponse, Depends(get_current_user)] = None):
    result = db.query(models.Agent).filter(models.Agent.id == agent_id).first()
    return result

@agent_router.post("/", response_model=schemas.AgentOut)
def create_agent(agent: schemas.AgentOut, db: Session = Depends(get_db), current_user: Annotated[schemas.UserResponse, Depends(get_current_user)] = None):
    db_agent = models.Agent(
        name=agent.name,
        base_prompt=agent.base_prompt,
        is_scheduled=agent.is_scheduled
    )
    db.add(db_agent)
    db.commit()
    db.refresh(db_agent)
    return db_agent

@agent_router.delete("/{agent_id}")
def delete_agent(agent_id: int, db: Session = Depends(get_db), current_user: Annotated[schemas.UserResponse, Depends(get_current_user)] = None):
    db_agent = db.query(models.Agent).filter(models.Agent.id == agent_id).first()
    if db_agent:
        db.delete(db_agent)
        db.commit()
        return {"detail": "Agent deleted"}
    return {"detail": "Agent not found"}

