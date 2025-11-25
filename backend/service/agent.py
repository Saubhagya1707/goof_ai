from datetime import datetime
from enum import Enum
from typing import List
import models.db as Models
import logging
from fastmcp import Client
from schemas.agent_execution import ServerSelectionResponse, GenerationResponse, Log, Server, EVENT_TYPE
from service.prompt_service import server_selection_prompt, tool_selection_prompt, generation_prompt
from service.gemini import GeminiFunctions
from google.genai import types
from pydantic import BaseModel

class AgentExecutor:
    def __init__(self, db, agent: Models.Agent):
        self.agent = agent
        self.db = db
        self.logs: List[Log] = []
        self.logger = logging.getLogger(__name__)

    def init_execution(self):
        execution = Models.AgentExecution(
            agent_id=self.agent.id,
        )
        self.db.add(execution)
        self.db.commit()
        self.db.refresh(execution)
        self.execution = execution

    def save_logs(self):
        db_logs: List[Models.AgentExecutionLog] = []
        for log in self.logs:
            db_logs.append(Models.AgentExecutionLog(
                agent_execution_id=self.execution.id,
                event=log.event,
                message=log.message,
                time=log.time
            ))
        self.db.add_all(db_logs)
        self.db.commit()
        for log in db_logs:
            self.db.refresh(log)
        self.execution.completed_at = datetime.now()
        self.db.add(self.execution)
        self.db.commit()
        self.db.refresh(self.execution)

    def clean_schema(self,schema: dict) -> dict:
        """Remove $ref and inline $defs definitions for Gemini compatibility."""
        import copy
        schema = copy.deepcopy(schema)

        defs = schema.pop("$defs", {})

        def replace_refs(node):
            if isinstance(node, dict):
                if "$ref" in node:
                    ref = node["$ref"]
                    ref_name = ref.split("/")[-1]
                    if ref_name in defs:
                        return replace_refs(defs[ref_name])
                    return {}
                return {k: replace_refs(v) for k, v in node.items()}
            elif isinstance(node, list):
                return [replace_refs(x) for x in node]
            return node

        cleaned = replace_refs(schema)
        return cleaned

    async def process(self):
        # Logic to execute the agent's tasks
        prompt = self.agent.base_prompt
        db_servers = self.agent.tools
        servers = [Server(
            id=s.id,
            url=s.url,
            description=s.description,
            name=s.name
        ) for s in db_servers]
        self.logger.info(f"Executing agent '{self.agent.name}' with prompt: {prompt} and servers: {servers}")

        gemini = GeminiFunctions()
        
        self.logs.append(Log(
            event=EVENT_TYPE.SERVER_SELECTION_INIT,
            time=datetime.now(),
            message=f"Started execution of {self.agent.name}",
            success=True
        ))
        # Execution loop
        while True:
            server_selection: ServerSelectionResponse = gemini.generate_structured(
                prompt=server_selection_prompt(servers, prompt, str(self.logs)),
                schema=ServerSelectionResponse
            )
            if server_selection.server_id == -1:
                self.logger.info(f"Agent '{self.agent.name}' decided to conclude execution")
                break
            
            self.logger.info(f"Agent '{self.agent.name}' selected server ID: {server_selection.server_id}")
            if server_selection.server_id is None:
                self.logger.info(
                    f"""Agent '{self.agent.name}' decided to stop execution.
                        success: '{server_selection.success}' message: '{server_selection.message}'
                    """)
                break
            self.logger.info(f"Servers available: {[ (s.id, s.name) for s in servers ]}")
            self.logger.info(f"Looking for server ID: {server_selection.server_id}")

            selected_server = next((s for s in servers if s.id == server_selection.server_id), None)
            if not selected_server:
                self.logger.info(f"Selected server ID '{server_selection.server_id}' not found. Stopping execution.")
                break
            self.logs.append(Log(
                event=EVENT_TYPE.SERVER_SELECTED,
                time=datetime.now(),
                message=f"Selected server: {selected_server.name}",
                success=True
            ))
            self.logger.info(f"Connecting to server: {selected_server.name} at {selected_server.url}")
            client = Client(selected_server.url)
            async with client:
                selected_server_tools = await client.list_tools()
                selected_server_tools = [
                    types.Tool(
                        function_declarations=[
                            {
                                "name": tool.name,
                                "description": tool.description,
                                "parameters": self.clean_schema(tool.inputSchema)
                            }
                        ]
                    )
                    for tool in selected_server_tools
                ]

                self.logs.append(Log(
                    event=EVENT_TYPE.TOOL_SELECTION_INIT,
                    time=datetime.now(),
                    message=f"Identifying appropriate tool...",
                    success=True
                ))
                
                tool_name, args = gemini.get_function_calls(tool_selection_prompt(self.agent.owner_id,selected_server_tools, prompt, str(self.logs)), selected_server_tools)
                self.logger.info(f"Function call detected: {tool_name} with args: {args}")
                
                self.logs.append(Log(
                    event=EVENT_TYPE.TOOL_SELECTED,
                    time=datetime.now(),
                    message=f"Selected tool: {tool_name} with arguments: {args}",
                    success=True
                ))
                result = await client.call_tool(tool_name, arguments=args)

                
                self.logs.append(Log(
                    event=EVENT_TYPE.TOOL_RESULT,
                    time=datetime.now(),
                    message=f"Tool result: {result}",
                    success=True
                ))
                self.logger.info(f"Tool '{tool_name}' executed")

                self.logs.append(Log(
                    event=EVENT_TYPE.RESPONSE_GENERATION_INIT,
                    time=datetime.now(),
                    message=f"Generating response...",
                    success=True
                ))

                res: GenerationResponse = gemini.generate_structured(generation_prompt(prompt, str(self.logs)), GenerationResponse)

                if res.response:
                    self.logs.append(Log(
                        event=EVENT_TYPE.RESPONSE_GENERATED,
                        time=datetime.now(),
                        message=f"{res.response}",
                        success=True
                    ))
                    self.logger.info(f"Agent Execution Completed Id: {self.execution.id} saving logs...")
                    break
                self.logs.append(Log(
                    event=EVENT_TYPE.GENERATION_SKIPPED,
                    time=datetime.now(),
                    message=f"Skipping generation. Further actions are required.",
                    success=True
                )) 

    async def execute(self):
        try:
            self.init_execution()
            await self.process()
        except Exception as e:
            raise e
        finally:
            self.save_logs()
            self.logger.info(f"Logs saved successfully..")
