from pydantic import BaseModel


class ServerSelectionResponse(BaseModel):
    server_id: int | None
    success: bool
    message: str

class GenerationResponse(BaseModel):
    response: str