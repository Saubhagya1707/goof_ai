from sqlalchemy import ( 
    Column, Integer, String, ForeignKey, Boolean, Text, BigInteger, TIMESTAMP, func, UniqueConstraint
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

    access_token = Column(Text)
    refresh_token = Column(Text)
    expires_at = Column(TIMESTAMP(timezone=True))

    token_type = Column(String(50))
    scope = Column(Text)
    id_token = Column(Text)

    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="oauth_tokens")

    __table_args__ = (
        # Makes sure one user cannot have duplicate provider entries
        UniqueConstraint('user_id', 'provider', name='uq_user_provider'),
    )

