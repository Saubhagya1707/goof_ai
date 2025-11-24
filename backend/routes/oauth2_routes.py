import json
import os
import logging
from utils.db import get_db
from typing import Annotated
from sqlalchemy.orm import Session
from auth.security import get_current_user
from schemas.pydantic import ConnectResponse
from oauth2.oauth2_providers import PROVIDERS
from oauth2.Oauth2Manger import OAuth2Manager

from fastapi import APIRouter, Depends, HTTPException
import models.db as models, schemas.pydantic as schemas

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

oauth2_router = APIRouter(prefix='/oauth2', tags=['OAuth2'])

@oauth2_router.get('/auth/{tool_id}/login', response_model=ConnectResponse)
def oauth_login(tool_id: int, db: Session = Depends(get_db)):
    tool = db.query(models.Tool).filter(models.Tool.id == tool_id).first()
    if not tool:
        raise HTTPException(status_code=404, detail='Tool not found')
    
    if tool.provider:
        provider = tool.provider
        provider_name = provider.name
        tool_scopes = tool.scopes or []
        logger.info("OAuth login requested for provider='%s' providers='%s'", provider_name, json.dumps(PROVIDERS))
        # providers config uses key 'scope'
        PROVIDERS[provider_name]['scope'] = tool_scopes
        manager = OAuth2Manager(db, PROVIDERS)
        try:
            url = manager.generate_oauth_url(provider_name)
            return {"auth_url": url}
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))
    else:
        raise HTTPException(status_code=400, detail='Tool does not support OAuth2')


@oauth2_router.get('/auth/{tool_id}/callback')
def oauth_callback(tool_id: int, code: str = None, db: Session = Depends(get_db), current_user: Annotated[schemas.UserResponse, Depends(get_current_user)] = None):
    if not code:
        raise HTTPException(status_code=400, detail='No code provided')

    tool = db.query(models.Tool).filter(models.Tool.id == tool_id).first()
    if not tool:
        raise HTTPException(status_code=404, detail='Tool not found')
    
    if tool.provider:
        provider = tool.provider
        provider_name = provider.name
        tool_scopes = tool.scopes or []
        logger.info("OAuth callback received for provider='%s' tool_id=%s", provider_name, tool_id)
        PROVIDERS[provider_name]['scope'] = tool_scopes
        manager = OAuth2Manager(db, PROVIDERS)
        token_data = manager.exchange_code_for_token(provider_name, code)
        manager.save_tokens(current_user.id, provider_name, token_data, tool_id)

        return {"status": "connected", "provider": provider_name, "tokens": token_data}
    else:
        raise HTTPException(status_code=400, detail='Tool does not support OAuth2')


@oauth2_router.post('/auth/{tool_id}/disconnect')
def disconnect(tool_id: int, db: Session = Depends(get_db), user_id: int = 1):
    tool = db.query(models.Tool).filter(models.Tool.id == tool_id).first()
    if not tool:
        raise HTTPException(status_code=404, detail='Tool not found')
    
    if tool.provider:
        provider_name = tool.provider.name
        token = db.query(models.OAuthToken).filter_by(user_id=user_id, provider=provider_name, tool_id=tool_id).first()
        if token:
            db.delete(token)
            db.commit()
            return {"status": "disconnected"}
    else:
        raise HTTPException(status_code=400, detail='Tool does not support OAuth2')