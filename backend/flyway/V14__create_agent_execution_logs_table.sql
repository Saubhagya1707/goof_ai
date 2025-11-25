-- Create agent_execution_logs table with event enum
CREATE TYPE execution_event_type AS ENUM (
    'SERVER_SELECTION_INIT',
    'SERVER_SELECTED',
    'TOOL_SELECTION_INIT',
    'TOOL_SELECTED',
    'TOOL_RESULT',
    'RESPONSE_GENERATION_INIT',
    'RESPONSE_GENERATED',
    'GENERATION_SKIPPED'
);

CREATE TABLE agent_execution_logs (
    id SERIAL PRIMARY KEY,
    agent_execution_id INTEGER NOT NULL,
    event execution_event_type NOT NULL,
    message TEXT,
    time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    FOREIGN KEY (agent_execution_id) REFERENCES agent_execution(id) ON DELETE CASCADE
);

-- Create index on agent_execution_id for faster queries
CREATE INDEX idx_agent_execution_logs_execution_id ON agent_execution_logs(agent_execution_id);
CREATE INDEX idx_agent_execution_logs_time ON agent_execution_logs(time);
