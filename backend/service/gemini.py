import os
from typing import Any, List
from google import genai
from google.genai import types
import logging

class GeminiFunctions:
    def __init__(self, api_key: str | None = None):
        if not api_key:
            api_key = os.getenv("GEMINI_API_KEY")
        self.client = genai.Client(api_key=api_key)
        self.model = os.getenv("GEMINI_MODEL", 'gemini-2.0-flash')
        logging.basicConfig()
        self.logger = logging.getLogger(__name__)

    def generate_text(self, prompt: str) -> str:
        response = self.client.generate_text(
            model=self.model,
            prompt=types.TextPrompt(text=prompt)
        )
        return response.text
    
    def get_function_calls(self, prompt: str, tools: List[types.Tool]):
        response = self.client.models.generate_content(
            model=self.model,
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0,
                tools=tools,
            ),
        )
        
        self.logger.info(f"tools: {tools}")

        candidate = response.candidates[0]
        self.logger.info(f"get function calls response: {candidate}")

        if candidate.content.parts[-1].function_call:
            function_call = response.candidates[0].content.parts[-1].function_call
            self.logger.info(f"get function call: {function_call}")
            tool_name =  function_call.name
            args = function_call.args
            return tool_name, args
        else:
            return None, None
        

    
    def generate_structured(self, prompt: str, schema: Any) -> dict:
        response = self.client.models.generate_content(
            model=self.model,
            contents=prompt,
            config={
                "response_mime_type": "application/json",
                "response_json_schema": schema.model_json_schema(),
            },
        )
        try:
            response = schema.model_validate_json(response.text)
            return response
        except Exception as e:
            raise ValueError(f"Failed to validate response against schema: {e}")
        