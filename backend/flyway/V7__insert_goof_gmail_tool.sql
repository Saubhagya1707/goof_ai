-- Flyway migration script to insert a new tool 'goof-gmail-tool'

INSERT INTO tools (id, name, description, provider, scopes, url)
VALUES (
    1,
    'gmail-tool',
    'generate yourself',
    1,
    '{"https://www.googleapis.com/auth/gmail.readonly","https://www.googleapis.com/auth/gmail.send"}',
    'http://localhost:8010/mcp/'
);