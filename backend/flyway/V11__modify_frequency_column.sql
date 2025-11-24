-- Change column type if needed, then update the check constraint for allowed values
ALTER TABLE agents ALTER COLUMN frequency TYPE VARCHAR(20);

-- Remove any existing check constraint with a known name (if present) to avoid duplicate-constraint errors
ALTER TABLE agents DROP CONSTRAINT IF EXISTS agents_frequency_check;

-- Add a CHECK constraint that enforces allowed frequency values
ALTER TABLE agents ADD CONSTRAINT agents_frequency_check CHECK (frequency IN ('hourly', 'daily', 'weekly', 'every_minute'));