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
server = FastMCP(name="gmail", version="0.1.0")


def authorize(goof_user_id: int):
    try:
        response = requests.post(AUTH_URI, json={"tool_id": SERVER_ID, "goof_user_id": goof_user_id})
        response.raise_for_status()
        data = response.json()
        token = data.get("access_token")
        refresh_token = data.get("refresh_token")
        if token:
            logger.info("Authorization successful")
            return token, refresh_token
        else:
            logger.error("Authorization failed: No token received")
            return None
    except requests.RequestException as e:
        logger.error(f"Authorization failed: {e}")
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
        token, refresh_token = authorize(input.goof_user_id)
        gmail = GmailClient(access_token=token, refresh_token=refresh_token)

        return gmail.get_recent_emails(
            max_results=input.max_results,
            unread_only=input.unread_only,
        )
    except Exception as e:
        logger.exception("Error getting recent emails")
        return f"Error: {e}"


@server.tool
def gmail_get_email_body_chunk(input: EmailBodyChunkInput) -> str:
    """Get a chunk of an email body."""
    try:
        token, refresh_token = authorize(input.goof_user_id)
        gmail = GmailClient(access_token=token, refresh_token=refresh_token)

        if not input.message_id and not input.thread_id:
            raise ValueError("Either message_id or thread_id must be provided")

        return gmail.get_email_body_chunk(
            message_id=input.message_id,
            thread_id=input.thread_id,
            offset=input.offset,
        )
    except Exception as e:
        logger.exception("Error getting email body chunk")
        return f"Error: {e}"


@server.tool
def gmail_send_email(input: SendEmailInput) -> str:
    """Send an email via Gmail."""
    try:
        token, refresh_token = authorize(input.goof_user_id)
        gmail = GmailClient(access_token=token, refresh_token=refresh_token)

        return gmail.send_email(
            to=input.to,
            subject=input.subject,
            body=input.body,
            html_body=input.html_body,
        )
    except Exception as e:
        logger.exception("Error sending email")
        return f"Error: {e}"


# -----------------------------
# Run Server (STDIO)
# -----------------------------

if __name__ == "__main__":
    server.run(transport="http", port=8010)
