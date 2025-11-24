-- Alter Tool table to add provider and scopes columns
ALTER TABLE tools
ADD COLUMN provider INT REFERENCES oauth_provider(id),
ADD COLUMN scopes TEXT[];