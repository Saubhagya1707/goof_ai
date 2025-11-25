from enum import Enum
from pydantic import BaseModel
from datetime import datetime

class ServerSelectionResponse(BaseModel):
    server_id: int | None
    success: bool
    message: str

class GenerationResponse(BaseModel):
    response: str


class EVENT_TYPE(str, Enum):
    SERVER_SELECTION_INIT = "SERVER_SELECTION_INIT"
    SERVER_SELECTED = "SERVER_SELECTED"
    TOOL_SELECTION_INIT = "TOOL_SELECTION_INIT"
    TOOL_SELECTED = "TOOL_SELECTED"
    TOOL_RESULT = "TOOL_RESULT"
    RESPONSE_GENERATION_INIT = "RESPONSE_GENERATION_INIT"
    RESPONSE_GENERATED = "RESPONSE_GENERATED"
    GENERATION_SKIPPED = "GENERATION_SKIPPED"

class Log(BaseModel):
    event: EVENT_TYPE
    time: datetime
    message: str
    success: bool


class Server(BaseModel):
    id: int
    url: str
    description: str
    name: str