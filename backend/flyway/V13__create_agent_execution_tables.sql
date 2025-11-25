-- Create agent_execution table
CREATE TABLE agent_execution (
    id SERIAL PRIMARY KEY,
    agent_id INTEGER NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE
);

-- Create index on agent_id for faster queries
CREATE INDEX idx_agent_execution_agent_id ON agent_execution(agent_id);
CREATE INDEX idx_agent_execution_started_at ON agent_execution(started_at);
