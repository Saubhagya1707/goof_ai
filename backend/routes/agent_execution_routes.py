from http.client import HTTPException
from typing import Annotated, List
from auth.security import get_current_user
from fastapi import APIRouter, Depends
from utils.db import get_db
import models.db as Models
from sqlalchemy.orm import Session
import schemas.pydantic as schemas

agent_execution_router = APIRouter(prefix="/agent-execution")

@agent_execution_router.get("/agent/{agent_id}", response_model=List[schemas.AgentExecutionOut])
def get_all_executions_for_agent(agent_id: int, db: Session = Depends(get_db), current_user: Annotated[schemas.UserResponse, Depends(get_current_user)] = None):
    agent = (
        db.query(Models.Agent)
        .filter(Models.Agent.id == agent_id, Models.Agent.owner_id == current_user.id)
        .first()
    )
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    executions = db.query(Models.AgentExecution).filter(Models.AgentExecution.agent_id == agent_id).all()
    return executions

@agent_execution_router.get("/{agent_execution_id}/logs", response_model=List[schemas.AgentExecutionLog])
def get_all_logs_for_an_execution(agent_execution_id: int, db: Session = Depends(get_db), current_user: Annotated[schemas.UserResponse, Depends(get_current_user)] = None):
    agent_execution = db.query(Models.AgentExecution).filter(Models.AgentExecution.id == agent_execution_id).first()
    if not agent_execution:
        raise HTTPException(status_code=404, detail="Execution not found")
    logs = (
        db.query(Models.AgentExecutionLog).filter(Models.AgentExecutionLog.agent_execution_id == agent_execution_id)
        .order_by(Models.AgentExecutionLog.time.asc()).all()
    )
    return logs