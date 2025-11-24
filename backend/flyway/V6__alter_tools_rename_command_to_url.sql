-- Flyway migration script to rename column 'command' to 'url' in 'tools' table

ALTER TABLE tools
RENAME COLUMN command TO url;