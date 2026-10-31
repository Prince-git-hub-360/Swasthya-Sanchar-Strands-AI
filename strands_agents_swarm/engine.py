"""
strands_agents_swarm.engine

Strands-compliant Agent Core Runtime Loop & Tool Dispatcher.
Implements the ReAct (Perceive -> Reason -> Act / Tool Call) cycle,
supporting Amazon Bedrock, Groq, and a local Deterministic Clinical Fallback
for resilient edge computing in rural clinics.
"""

import os
import json
import time
import logging
from typing import Dict, Any, List, Callable, Optional

logger = logging.getLogger("StrandsSwarmEngine")


class StrandsTool:
    """Encapsulates a callable tool registered with an agent."""

    def __init__(self, name: str, description: str, func: Callable, parameters_schema: Dict[str, Any]):
        self.name = name
        self.description = description
        self.func = func
        self.parameters_schema = parameters_schema

    def execute(self, **kwargs) -> Any:
        return self.func(**kwargs)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "name": self.name,
            "description": self.description,
            "parameters": self.parameters_schema
        }


def strands_tool(name: str, description: str, parameters_schema: Dict[str, Any]):
    """Decorator to define a Strands agent tool."""
    def decorator(fn: Callable):
        tool = StrandsTool(name=name, description=description, func=fn, parameters_schema=parameters_schema)
        fn._strands_tool = tool
        return fn
    return decorator


class StrandsBaseAgent:
    """
    Base Agent in the Strands multi-agent architecture.
    Maintains role identity, system instructions, registered tools, and step trace.
    """

    def __init__(self, role_name: str, system_instructions: str, model_id: str = "bedrock/anthropic.claude-3-haiku"):
        self.role_name = role_name
        self.system_instructions = system_instructions
        self.model_id = model_id
        self.tools: Dict[str, StrandsTool] = {}
        self.execution_log: List[Dict[str, Any]] = []

    def register_tool(self, tool: StrandsTool):
        """Register a tool with this agent."""
        self.tools[tool.name] = tool
        logger.info("[%s] Registered tool: %s", self.role_name, tool.name)

    def log_step(self, step_type: str, details: Dict[str, Any]):
        """Record an audit entry into the agent's step trace."""
        entry = {
            "timestamp": time.time(),
            "agent": self.role_name,
            "step_type": step_type,
            "details": details
        }
        self.execution_log.append(entry)

    def call_tool(self, tool_name: str, **kwargs) -> Any:
        """Invoke a registered tool safely."""
        if tool_name not in self.tools:
            raise KeyError(f"Tool '{tool_name}' is not registered with agent {self.role_name}")
        self.log_step("TOOL_INVOCATION_START", {"tool": tool_name, "args": kwargs})
        result = self.tools[tool_name].execute(**kwargs)
        self.log_step("TOOL_INVOCATION_COMPLETE", {"tool": tool_name, "result_summary": str(result)[:150]})
        return result

