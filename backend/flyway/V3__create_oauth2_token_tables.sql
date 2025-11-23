CREATE TABLE IF NOT EXISTS oauth_tokens (
    id BIGSERIAL PRIMARY KEY,

    user_id BIGINT NOT NULL,
    provider VARCHAR(50) NOT NULL,

    access_token TEXT,
    refresh_token TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,

    token_type VARCHAR(50),
    scope TEXT,
    id_token TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT uq_user_provider UNIQUE (user_id, provider),

    CONSTRAINT fk_oauth_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- Trigger for updated_at (PostgreSQL)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_oauth_tokens_updated_at ON oauth_tokens;

CREATE TRIGGER update_oauth_tokens_updated_at
BEFORE UPDATE ON oauth_tokens
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
