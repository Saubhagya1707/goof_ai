-- Add owner_id column to agents table as a foreign key to users
ALTER TABLE agents ADD COLUMN owner_id INTEGER;

-- Add foreign key constraint
ALTER TABLE agents ADD CONSTRAINT fk_agents_owner_id FOREIGN KEY (owner_id) REFERENCES users(id);
