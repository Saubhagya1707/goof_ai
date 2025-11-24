import requests
import logging
from urllib.parse import urlencode
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from models.db import OAuthToken

logger = logging.getLogger(__name__)


def mask(s: str, visible: int = 4):
    """Mask sensitive tokens for logs."""
    if not s:
        return s
    return s[:visible] + "..."


class OAuth2Manager:
    def __init__(self, db: Session, providers_config: dict):
        self.db = db
        self.providers = providers_config
        logger.info("OAuth2Manager initialized with providers: %s", list(providers_config.keys()))

    # ----------------------------
    # Provider Config
    # ----------------------------
    def get_provider(self, provider_name: str):
        logger.debug("Fetching provider config for '%s'", provider_name)

        if provider_name not in self.providers:
            logger.error("Provider '%s' not configured", provider_name)
            raise Exception(f"OAuth provider '{provider_name}' not configured")

        return self.providers[provider_name]

    # ----------------------------
    # Authorization URL
    # ----------------------------
    def generate_oauth_url(self, provider: str) -> str:
        logger.info("Generating OAuth URL for provider='%s'", provider)

        config = self.get_provider(provider)

        params = {
            "client_id": config["client_id"],
            "redirect_uri": config["redirect_uri"],
            "response_type": "code",
            "scope": " ".join(config["scope"]),
            "access_type": "offline",
            "prompt": "consent",
        }

        url = f"{config['auth_uri']}?{urlencode(params)}"
        logger.debug("Generated OAuth URL: %s", url)

        return url

    # ----------------------------
    # Exchange code for token
    # ----------------------------
    def exchange_code_for_token(self, provider: str, code: str) -> dict:
        logger.info("Exchanging authorization code for provider='%s'", provider)

        config = self.get_provider(provider)

        data = {
            "client_id": config["client_id"],
            "client_secret": config["client_secret"],
            "code": code,
            "grant_type": "authorization_code",
            "redirect_uri": config["redirect_uri"],
        }

        logger.debug("Sending token exchange request to %s", config["token_uri"])

        response = requests.post(config["token_uri"], data=data, headers={"Accept": "application/json"})
        logger.debug("Token exchange HTTP status: %s", response.status_code)

        response.raise_for_status()
        token_data = response.json()

        logger.info("Token exchange successful for provider='%s'", provider)
        logger.debug("Received token: access=%s refresh=%s",
                     mask(token_data.get("access_token")),
                     mask(token_data.get("refresh_token")))

        token_data["expires_at"] = datetime.now(timezone.utc) + timedelta(seconds=token_data.get("expires_in", 3600))
        return token_data

    # ----------------------------
    # Refresh token
    # ----------------------------
    def refresh_token(self, provider: str, refresh_token: str) -> dict:
        logger.info("Refreshing access token for provider='%s'", provider)
        logger.debug("Using refresh token: %s", mask(refresh_token))

        config = self.get_provider(provider)

        data = {
            "client_id": config["client_id"],
            "client_secret": config["client_secret"],
            "refresh_token": refresh_token,
            "grant_type": "refresh_token",
        }

        response = requests.post(config["token_uri"], data=data, headers={"Accept": "application/json"})
        logger.debug("Refresh HTTP status: %s", response.status_code)

        response.raise_for_status()
        token_data = response.json()

        logger.info("Token refreshed successfully for provider='%s'", provider)
        logger.debug("New access token=%s", mask(token_data.get("access_token")))

        token_data["expires_at"] = datetime.now(timezone.utc) + timedelta(seconds=token_data.get("expires_in", 3600))
        return token_data

    # ----------------------------
    # Save tokens in DB
    # ----------------------------
    def save_tokens(self, user_id: int, provider: str, token_data: dict, tool_id: int = None):
        logger.info("Saving OAuth token for user=%s provider='%s' tool_id=%s", user_id, provider, tool_id)

        existing = (
            self.db.query(OAuthToken)
            .filter_by(user_id=user_id, provider=provider, tool_id=tool_id)
            .first()
        )

        if existing:
            logger.debug("Existing token found. Updating...")
            existing.access_token = token_data.get("access_token")
            existing.refresh_token = token_data.get("refresh_token", existing.refresh_token)
            existing.expires_at = token_data.get("expires_in")
            existing.token_type = token_data.get("token_type")
            existing.scope = token_data.get("scope")
            existing.id_token = token_data.get("id_token")
        else:
            logger.debug("No existing token. Creating new token record.")
            new_token = OAuthToken(
                user_id=user_id,
                provider=provider,
                tool_id=tool_id,
                access_token=token_data.get("access_token"),
                refresh_token=token_data.get("refresh_token"),
                expires_at=token_data.get("expires_in"),
                token_type=token_data.get("token_type"),
                scope=token_data.get("scope"),
                id_token=token_data.get("id_token"),
            )
            self.db.add(new_token)

        self.db.commit()
        logger.info("OAuth token saved for user=%s provider='%s' tool_id=%s", user_id, provider, tool_id)

    # ----------------------------
    # Load tokens from DB
    # ----------------------------
    def load_tokens(self, user_id: int, provider: str, tool_id: int = None):
        logger.debug("Loading tokens for user=%s provider='%s' tool_id=%s", user_id, provider, tool_id)
        token = (
            self.db.query(OAuthToken)
            .filter_by(user_id=user_id, provider=provider, tool_id=tool_id)
            .first()
        )
        if token:
            logger.debug("Token loaded. Expires at: %s", token.expires_at)
        else:
            logger.warning("No token found for user=%s provider='%s' tool_id=%s", user_id, provider, tool_id)
        return token

    # ----------------------------
    # Get usable access token (auto-refresh)
    # ----------------------------
    def get_valid_access_token(self, user_id: int, provider: str, tool_id: int = None) -> str:
        logger.info("Fetching valid access token for user=%s provider='%s' tool_id=%s", user_id, provider, tool_id)

        token: OAuthToken = self.load_tokens(user_id, provider, tool_id)
        if not token:
            logger.error("User %s has no stored token for provider '%s' tool_id=%s", user_id, provider, tool_id)
            raise Exception("No OAuth token stored for user")

        # Still valid?
        if token.expires_at and token.expires_at > datetime.now(timezone.utc):
            logger.info("Access token for user=%s provider='%s' tool_id=%s is still valid", user_id, provider, tool_id)
            return token.access_token

        # Refresh
        if not token.refresh_token:
            logger.error("Missing refresh token for user=%s provider='%s' tool_id=%s. Reauthorization required.", user_id, provider, tool_id)
            raise Exception("Refresh token missing, user must reauthorize")

        logger.info("Access token expired. Refreshing... user=%s provider='%s' tool_id=%s", user_id, provider, tool_id)

        new_token = self.refresh_token(provider, token.refresh_token)
        self.save_tokens(user_id, provider, new_token, tool_id)

        logger.info("Token refreshed for user=%s provider='%s' tool_id=%s", user_id, provider, tool_id)
        return new_token["access_token"]
