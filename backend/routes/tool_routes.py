from http.client import HTTPException
from fastapi import APIRouter
from pydantic import BaseModel
import models.db as models
from fastapi import Depends
from sqlalchemy.orm import Session
from utils.db import get_db
from oauth2.Oauth2Manger import OAuth2Manager
from oauth2.oauth2_providers import PROVIDERS
import logging

logger = logging.getLogger(__name__)

tool_router = APIRouter(prefix='/tool', tags=['Tools'])

class TokenRequest(BaseModel):
    tool_id: int
    goof_user_id: int

"""
Endpoint the MCP server calls to get an access token for a tool.
If the tool uses OAuth2, this will retrieve the stored token for the user,
refreshing it if necessary.
"""

@tool_router.post('/token')
def get_tool_token(request: TokenRequest, db: Session = Depends(get_db)):
    tool = db.query(models.Tool).filter(models.Tool.id == request.tool_id).first()
    if not tool:
        raise HTTPException(status_code=404, detail='Tool not found')
    
    # If tool has OAuth provider, retrieve stored token with auto-refresh
    if tool.provider:
        provider_name = tool.provider.name
        logger.info("Retrieving OAuth token for tool_id=%s provider='%s' user_id=%s", request.tool_id, provider_name, request.goof_user_id)
        
        try:
            manager = OAuth2Manager(db, PROVIDERS)
            # This will return access token, auto-refreshing if expired
            access_token = manager.get_valid_access_token(request.goof_user_id, provider_name, request.tool_id)
            logger.info("Successfully retrieved access token for tool_id=%s", request.tool_id)
            return {"access_token": access_token, "provider": provider_name}
        except Exception as e:
            logger.error("Error retrieving OAuth token for tool_id=%s: %s", request.tool_id, str(e))
            raise HTTPException(status_code=401, detail=str(e))
    else:
        raise HTTPException(status_code=400, detail='Tool does not support OAuth2')
