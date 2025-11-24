FROM python:3.11-slim AS base

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Install the project into /app
COPY . /app
WORKDIR /app

# Allow statements and log messages to immediately appear in the logs
ENV PYTHONUNBUFFERED=1
ENV PYO3_USE_ABI3_FORWARD_COMPATIBILITY=1
# Runtime environment variables (will be replaced by --env-file)
ENV SERVER_NAME=""
ENV SERVER_ID=""
ENV GOOF_AI_AUTH_URI=""

# Install dependencies
RUN uv sync

EXPOSE 8010

# Run the FastMCP server
CMD ["uv", "run", "main.py"]