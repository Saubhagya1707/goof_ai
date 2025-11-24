-- Create oauth_provider table
CREATE TABLE oauth_provider (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Insert initial data
INSERT INTO oauth_provider (name) VALUES ('google');