-- Create "tools" table
CREATE TABLE tools (
    id SERIAL PRIMARY KEY,
    command VARCHAR(255),
    name VARCHAR(255) UNIQUE,
    description TEXT,
    CONSTRAINT tools_name_idx UNIQUE (name)
);

CREATE INDEX tools_command_idx ON tools (command);
CREATE INDEX tools_name_index ON tools (name);
CREATE INDEX tools_description_idx ON tools (description);

------------------------------------------------------------

-- Create "agents" table
CREATE TABLE agents (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE,
    base_prompt TEXT,
    is_scheduled BOOLEAN DEFAULT FALSE,
    CONSTRAINT agents_name_idx UNIQUE (name)
);

CREATE INDEX agents_name_index ON agents (name);
CREATE INDEX agents_base_prompt_idx ON agents (base_prompt);
CREATE INDEX agents_is_scheduled_idx ON agents (is_scheduled);

------------------------------------------------------------

-- Create "agent_tools" join table
CREATE TABLE agent_tools (
    agent_id INTEGER NOT NULL,
    tool_id INTEGER NOT NULL,
    PRIMARY KEY (agent_id, tool_id),
    CONSTRAINT fk_agent
        FOREIGN KEY (agent_id) REFERENCES agents (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_tool
        FOREIGN KEY (tool_id) REFERENCES tools (id)
        ON DELETE CASCADE
);

------------------------------------------------------------
