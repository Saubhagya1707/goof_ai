from sqlalchemy import ( 
    Column, Integer, String, ForeignKey, Boolean, Text, BigInteger, TIMESTAMP, func, UniqueConstraint, Enum
)
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import ARRAY
from utils.db import Base
from enum import Enum as PyEnum


class ExecutionEventType(PyEnum):
    SERVER_SELECTION_INIT = "SERVER_SELECTION_INIT"
    SERVER_SELECTED = "SERVER_SELECTED"
    TOOL_SELECTION_INIT = "TOOL_SELECTION_INIT"
    TOOL_SELECTED = "TOOL_SELECTED"
    TOOL_RESULT = "TOOL_RESULT"
    RESPONSE_GENERATION_INIT = "RESPONSE_GENERATION_INIT"
    RESPONSE_GENERATED = "RESPONSE_GENERATED"
    GENERATION_SKIPPED = "GENERATION_SKIPPED"


class Tool(Base):
    __tablename__ = "tools"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, index=True)  # Renamed from 'command'
    name = Column(String, unique=True, index=True)
    description = Column(String, index=True)
    provider_id = Column(Integer, ForeignKey("oauth_provider.id"), nullable=True)  # Renamed for clarity
    provider = relationship("OAuthProvider", back_populates="tools")  # Define the relationship
    scopes = Column(ARRAY(String), nullable=True)

    agents = relationship("Agent", secondary="agent_tools", back_populates="tools")

class Agent(Base):
    __tablename__ = "agents"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    base_prompt = Column(String, index=True)
    is_scheduled = Column(Boolean, default=False)
    frequency = Column(String(10), nullable=True)  # Enum: 'hourly', 'daily', 'weekly'
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    active = Column(Boolean, default=True, nullable=False)
    
    owner = relationship("User", foreign_keys=[owner_id])
    tools = relationship("Tool", secondary="agent_tools", back_populates="agents")
    executions = relationship("AgentExecution", back_populates="agent", cascade="all, delete")


class AgentTool(Base):
    __tablename__ = "agent_tools"

    agent_id = Column(Integer, ForeignKey("agents.id"), primary_key=True)
    tool_id = Column(Integer, ForeignKey("tools.id"), primary_key=True)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    # Basic identity fields
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=True)

    # Optional auth fields
    password_hash = Column(String, nullable=True)  # leave null for OAuth-only accounts
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)

    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())

    # OAuth token relationship
    oauth_tokens = relationship(
        "OAuthToken",
        back_populates="user",
        cascade="all, delete"
    )

class OAuthToken(Base):
    __tablename__ = "oauth_tokens"

    id = Column(BigInteger, primary_key=True, autoincrement=True)

    user_id = Column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    provider = Column(String(50), nullable=False)
    tool_id = Column(Integer, ForeignKey("tools.id", ondelete="CASCADE"), nullable=True)

    access_token = Column(Text)
    refresh_token = Column(Text)
    expires_at = Column(TIMESTAMP(timezone=True))

    token_type = Column(String(50))
    scope = Column(Text)
    id_token = Column(Text)

    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="oauth_tokens")
    tool = relationship("Tool")

    __table_args__ = (
        # Makes sure one user cannot have duplicate provider+tool entries
        UniqueConstraint('user_id', 'provider', 'tool_id', name='uq_user_provider_tool'),
    )

class OAuthProvider(Base):
    __tablename__ = "oauth_provider"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    tools = relationship("Tool", back_populates="provider")  # Define the reverse relationship


class AgentExecution(Base):
    __tablename__ = "agent_execution"

    id = Column(Integer, primary_key=True, index=True)
    agent_id = Column(Integer, ForeignKey("agents.id", ondelete="CASCADE"), nullable=False)
    started_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    completed_at = Column(TIMESTAMP(timezone=True), nullable=True)
    status = Column(Boolean, default=False, nullable=False)

    agent = relationship("Agent", back_populates="executions")
    logs = relationship("AgentExecutionLog", back_populates="execution", cascade="all, delete")


class AgentExecutionLog(Base):
    __tablename__ = "agent_execution_logs"

    id = Column(Integer, primary_key=True, index=True)
    agent_execution_id = Column(Integer, ForeignKey("agent_execution.id", ondelete="CASCADE"), nullable=False)
    event = Column(Enum(ExecutionEventType, name="execution_event_type"), nullable=False)
    message = Column(Text, nullable=True)
    time = Column(TIMESTAMP(timezone=True), server_default=func.now())

    execution = relationship("AgentExecution", back_populates="logs")

