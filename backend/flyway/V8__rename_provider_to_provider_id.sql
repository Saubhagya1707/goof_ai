-- Flyway migration script to rename the 'provider' column to 'provider_id' in the 'tools' table

ALTER TABLE tools
RENAME COLUMN provider TO provider_id;