


def server_selection_prompt(servers: list[dict], instruction: str = "", context: str = "") -> str:
    return f"""
        You are an advanced AI agent. You are given an instruction, a list of servers, and last executed context.
        Your task is to select the most appropriate server based on last executed context and instruction.
        You must only respond with the server ID of the selected server.
        If no server is suitable return None;
        If all the instructions are completed and you believe that you should conclude the execution and no further steps are to be taken
        then return -1

        Servers:
        {servers}
        Last Executed Context:
        {context}
        Instruction:
        {instruction}

        
    """

def tool_selection_prompt(goof_user_id: int, tools, instruction, context):
    return f"""
        You are an AI agent with access to the following tools:

        GOOF_USER_ID:
        {goof_user_id}

        TOOLS:
        {tools}

        You must decide which tool to call based on:
        - The given instruction
        - The last executed context        

        CONTEXT:
        {context}

        INSTRUCTION:
        {instruction}
    """

def generation_prompt(instruction, context):
    return f"""
        You are given instruction and context.
        You should respond as per the instruction, and the latest context.

        If further tool calling is not required and instruction is catered then return the response else return None.

        Instruction:
        {instruction}

        context:
        {context}
    """