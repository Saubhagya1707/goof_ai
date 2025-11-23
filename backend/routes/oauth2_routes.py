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

@oauth2_router.get('/auth/{provider}/login', response_model=ConnectResponse)
def oauth_login(provider: str, db: Session = Depends(get_db)):
    logger.info("OAuth login requested for provider='%s'", provider)
    manager = OAuth2Manager(db, PROVIDERS)
    try:
        url = manager.generate_oauth_url(provider)
        return {"auth_url": url}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@oauth2_router.get('/auth/{provider}/callback')
def oauth_callback(provider: str, code: str = None, db: Session = Depends(get_db), current_user: Annotated[schemas.UserResponse, Depends(get_current_user)] = None):
    if not code:
        raise HTTPException(status_code=400, detail='No code provided')

    manager = OAuth2Manager(db, PROVIDERS)
    token_data = manager.exchange_code_for_token(provider, code)
    manager.save_tokens(current_user.id, provider, token_data)

    return {"status": "connected", "provider": provider, "tokens": token_data}


@oauth2_router.post('/auth/{provider}/disconnect')
def disconnect(provider: str, db: Session = Depends(get_db), user_id: int = 1):
    token = db.query("oauth_tokens").filter_by(user_id=user_id, provider=provider).first()
    if token:
        db.delete(token)
        db.commit()
        return {"status": "disconnected"}