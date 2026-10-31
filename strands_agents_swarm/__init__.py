"""
strands_agents_swarm

Swasthya Sanchar AI™ Multi-Agent Swarm (Powered by Strands Agents SDK).
A domain-driven 4-Agent Swarm for rural healthcare equity:
- RxVisionAgent: Prescription OCR & Computer Vision
- RxPharmacologyAgent: Clinical Drug Extraction & 5-Day Visual Pillbox
- RxSafetySentinel: Pharmacovigilance Guardrail & SOS Emergency Engine
- RxVernacularCommunicator: Multilingual Voice & Low-Literacy Guidance
"""

from strands_agents_swarm.swarm_types import (
    VisionExtractionResult,
    PharmacologyRegimen,
    PrescribedDrug,
    SafetyAuditResult,
    VernacularGuidance,
    VernacularStepInstruction,
    SwarmExecutionReport,
)
from strands_agents_swarm.engine import StrandsBaseAgent, StrandsTool, strands_tool
from strands_agents_swarm.agents.rx_vision_agent import RxVisionAgent
from strands_agents_swarm.agents.rx_pharmacology_agent import RxPharmacologyAgent
from strands_agents_swarm.agents.rx_safety_sentinel import RxSafetySentinel
from strands_agents_swarm.agents.rx_vernacular_communicator import RxVernacularCommunicator
from strands_agents_swarm.swarm_orchestrator import SwasthyaSwarmOrchestrator

__all__ = [
    "RxVisionAgent",
    "RxPharmacologyAgent",
    "RxSafetySentinel",
    "RxVernacularCommunicator",
    "SwasthyaSwarmOrchestrator",
    "VisionExtractionResult",
    "PharmacologyRegimen",
    "PrescribedDrug",
    "SafetyAuditResult",
    "VernacularGuidance",
    "VernacularStepInstruction",
    "SwarmExecutionReport",
    "StrandsBaseAgent",
    "StrandsTool",
    "strands_tool",
]

