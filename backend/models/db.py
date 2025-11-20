from sqlalchemy import ( 
    Column, Integer, String, ForeignKey, Boolean
)
from sqlalchemy.orm import relationship
from utils.db import Base

class Tool(Base):
    __tablename__ = "tools"

    id = Column(Integer, primary_key=True, index=True)
    command = Column(String, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(String, index=True)

    agents = relationship("Agent", secondary="agent_tools", back_populates="tools")

class Agent(Base):
    __tablename__ = "agents"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    base_prompt = Column(String, index=True)
    is_scheduled = Column(Boolean, default=False)
    tools = relationship("Tool", secondary="agent_tools", back_populates="agents")

class AgentTool(Base):
    __tablename__ = "agent_tools"

    agent_id = Column(Integer, ForeignKey("agents.id"), primary_key=True)
    tool_id = Column(Integer, ForeignKey("tools.id"), primary_key=True)

