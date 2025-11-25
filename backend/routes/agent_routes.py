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
def create_agent(agent: schemas.AgentIn, db: Session = Depends(get_db), current_user: Annotated[schemas.UserResponse, Depends(get_current_user)] = None):
    if agent.is_scheduled and not agent.frequency:
        raise ValueError("Scheduled agents must have a frequency set")
    db_agent = models.Agent(
        name=agent.name,
        base_prompt=agent.base_prompt,
        is_scheduled=agent.is_scheduled,
        owner_id=current_user.id
    )
    if agent.frequency and agent.is_scheduled:
        db_agent.frequency = agent.frequency
    db.add(db_agent)
    db.commit()
    db.refresh(db_agent)
    return db_agent

@agent_router.put("/{agent_id}", response_model=schemas.AgentOut)
def add_tool_to_agent(agent_id: int, tool_ids: List[int], db: Session = Depends(get_db), current_user: Annotated[schemas.UserResponse, Depends(get_current_user)] = None):
    db_agent = db.query(models.Agent).filter(models.Agent.id == agent_id).first()
    if not db_agent:
        raise ValueError("Agent not found")
    
    for tool_id in tool_ids:
        tool = db.query(models.Tool).filter(models.Tool.id == tool_id).first()
        if tool and tool not in db_agent.tools:
            db_agent.tools.append(tool)
    
    db.commit()
    db.refresh(db_agent)
    return db_agent

@agent_router.put("/{agent_id}/{is_active}", response_model=schemas.AgentOut)
def update_agent_status(agent_id: int, is_active: bool, db: Session = Depends(get_db), current_user: Annotated[schemas.UserResponse, Depends(get_current_user)] = None):
    db_agent = db.query(models.Agent).filter(models.Agent.id == agent_id).first()
    if not db_agent:
        raise ValueError("Agent not found")
    
    db_agent.active = is_active
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

