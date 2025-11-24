-- V10__add_frequency_column_to_agents.sql
ALTER TABLE agents ADD COLUMN frequency VARCHAR(10) CHECK (frequency IN ('hourly', 'daily', 'weekly', 'every_minute'));
