-- Add tool_id foreign key to oauth_tokens table
ALTER TABLE oauth_tokens
ADD COLUMN tool_id INTEGER REFERENCES tools(id) ON DELETE CASCADE;

-- Update unique constraint to include tool_id
ALTER TABLE oauth_tokens
DROP CONSTRAINT uq_user_provider;

ALTER TABLE oauth_tokens
ADD CONSTRAINT uq_user_provider_tool UNIQUE (user_id, provider, tool_id);
