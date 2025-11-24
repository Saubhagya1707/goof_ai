from typing import Optional
import os
import logging
from typing import Optional
from fastmcp import FastMCP
from pydantic import BaseModel
import os
import requests
import os
from dotenv import load_dotenv
import json
from service import GmailClient

load_dotenv()

SERVER_NAME = os.getenv("SERVER_NAME", "goof-gmail-mcp-server-http")
SERVER_ID = int(os.getenv("SERVER_ID", "1"))
AUTH_URI = os.getenv("GOOF_AI_AUTH_URI", "http://localhost:8000/goof-ai/token/")

logger = logging.getLogger("gmail.mcp")
# Enable debug logging for development/troubleshooting
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger.info(f"Initializing {SERVER_NAME} with SERVER_ID={SERVER_ID}, AUTH_URI={AUTH_URI}")
server = FastMCP(name="gmail", version="0.1.0")


def authorize(goof_user_id: int):
    try:
        logger.info(f"Attempting authorization for goof_user_id={goof_user_id}, tool_id={SERVER_ID}")
        response = requests.post(AUTH_URI, json={"tool_id": SERVER_ID, "goof_user_id": goof_user_id})
        response.raise_for_status()
        data = response.json()
        token = data.get("access_token")
        refresh_token = data.get("refresh_token")
        if token:
            logger.info(f"Authorization successful for goof_user_id={goof_user_id}")
            return token, refresh_token
        else:
            logger.error(f"Authorization failed for goof_user_id={goof_user_id}: No token received")
            return None
    except requests.RequestException as e:
        logger.error(f"Authorization failed for goof_user_id={goof_user_id}: {e}")
        return None

# -----------------------------
# Tool Input Models
# -----------------------------


class RecentEmailsInput(BaseModel):
    max_results: int = 10
    unread_only: bool = False
    goof_user_id: int


class EmailBodyChunkInput(BaseModel):
    message_id: Optional[str] = None
    thread_id: Optional[str] = None
    offset: int = 0
    goof_user_id: int


class SendEmailInput(BaseModel):
    to: str
    subject: str
    body: str
    html_body: Optional[str] = None
    goof_user_id: int


# -----------------------------
# Tools
# -----------------------------
@server.tool
def gmail_get_recent_emails(input: RecentEmailsInput) -> str:
    """Get recent Gmail emails."""
    try:
        logger.info(f"gmail_get_recent_emails called: goof_user_id={input.goof_user_id}, max_results={input.max_results}, unread_only={input.unread_only}")
        token, refresh_token = authorize(input.goof_user_id)
        if not token:
            logger.error(f"Failed to authorize user {input.goof_user_id}")
            return "Error: Authorization failed"
        
        gmail = GmailClient(access_token=token, refresh_token=refresh_token)
        result = gmail.get_recent_emails(
            max_results=input.max_results,
            unread_only=input.unread_only,
        )
        logger.info(f"Successfully retrieved recent emails for goof_user_id={input.goof_user_id}")
        return result
    except Exception as e:
        logger.exception(f"Error getting recent emails for goof_user_id={input.goof_user_id}")
        return f"Error: {e}"


@server.tool
def gmail_get_email_body_chunk(input: EmailBodyChunkInput) -> str:
    """Get a chunk of an email body."""
    try:
        logger.info(f"gmail_get_email_body_chunk called: goof_user_id={input.goof_user_id}, message_id={input.message_id}, thread_id={input.thread_id}, offset={input.offset}")
        token, refresh_token = authorize(input.goof_user_id)
        if not token:
            logger.error(f"Failed to authorize user {input.goof_user_id}")
            return "Error: Authorization failed"
        
        gmail = GmailClient(access_token=token, refresh_token=refresh_token)

        if not input.message_id and not input.thread_id:
            logger.error(f"Invalid request from goof_user_id={input.goof_user_id}: Neither message_id nor thread_id provided")
            raise ValueError("Either message_id or thread_id must be provided")

        result = gmail.get_email_body_chunk(
            message_id=input.message_id,
            thread_id=input.thread_id,
            offset=input.offset,
        )
        logger.info(f"Successfully retrieved email body chunk for goof_user_id={input.goof_user_id}")
        return result
    except Exception as e:
        logger.exception(f"Error getting email body chunk for goof_user_id={input.goof_user_id}")
        return f"Error: {e}"


@server.tool
def gmail_send_email(input: SendEmailInput) -> str:
    """Send an email via Gmail."""
    try:
        logger.info(f"gmail_send_email called: goof_user_id={input.goof_user_id}, to={input.to}, subject={input.subject}")
        token, refresh_token = authorize(input.goof_user_id)
        if not token:
            logger.error(f"Failed to authorize user {input.goof_user_id}")
            return "Error: Authorization failed"
        
        gmail = GmailClient(access_token=token, refresh_token=refresh_token)

        result = gmail.send_email(
            to=input.to,
            subject=input.subject,
            body=input.body,
            html_body=input.html_body,
        )
        logger.info(f"Successfully sent email for goof_user_id={input.goof_user_id} to {input.to}")
        return result
    except Exception as e:
        logger.exception(f"Error sending email for goof_user_id={input.goof_user_id} to {input.to}")
        return f"Error: {e}"


# -----------------------------
# Run Server (STDIO)
# -----------------------------s

if __name__ == "__main__":
    logger.info(f"Starting {SERVER_NAME} MCP server on http://0.0.0.0:8010")
    server.run(transport="http", host="0.0.0.0", port=8010)