from typing import List
from pydantic import BaseModel

class ToolOut(BaseModel):
    name: str
    description: str
    class Config:
        from_attributes = True

class AgentOut(BaseModel):
    name: str
    prompt: str
    is_scheduled: bool
    tools: List[ToolOut] = []

    class Config:
        from_attributes = True