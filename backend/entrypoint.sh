#!/bin/bash
set -e

echo "Running Flyway migrations..."
echo "  Host: $DB_HOST"
echo "  Port: $DB_PORT"
echo "  DB:   $DB_NAME"

flyway \
  -url="jdbc:postgresql://${DB_HOST}:${DB_PORT}/${DB_NAME}" \
  -user="${DB_USER}" \
  -password="${DB_PASSWORD}" \
  -locations=filesystem:/app/flyway \
  migrate

echo "Starting FastAPI..."
exec "$@"
