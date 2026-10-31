"""
strands_agents_swarm.swarm_orchestrator

SwasthyaSwarmOrchestrator: The Central Multi-Agent Swarm Coordinator.
Implements the multi-agent orchestration architecture from the AWS workshop:
"Building AI Agents with Strands SDK: From Simple Loops to Multi-Agent Swarms"

Orchestrates:
1. RxVisionAgent (Perception & Tokenization)
2. RxPharmacologyAgent (Clinical Entity Extraction & 5-Day Visual Pillbox)
3. RxSafetySentinel (Critic-Refiner Pattern, Safety Intercept & SOS Alerting)
4. RxVernacularCommunicator (Vernacular Synthesis, Voice Script & Visual Cues)
"""

import time
import uuid
import logging
from typing import Dict, Any, Optional

from strands_agents_swarm.swarm_types import SwarmExecutionReport
from strands_agents_swarm.agents.rx_vision_agent import RxVisionAgent
from strands_agents_swarm.agents.rx_pharmacology_agent import RxPharmacologyAgent
from strands_agents_swarm.agents.rx_safety_sentinel import RxSafetySentinel
from strands_agents_swarm.agents.rx_vernacular_communicator import RxVernacularCommunicator

logger = logging.getLogger("SwasthyaSwarmOrchestrator")


class SwasthyaSwarmOrchestrator:
    """
    Coordinates the 4-agent swarm using Strands SDK principles.
    Manages shared state, agent-to-agent handoffs, guardrails, and audit tracing.
    """

    def __init__(self, model_id: str = "bedrock/anthropic.claude-3-haiku"):
        self.model_id = model_id

        # Instantiate the 4 specialized agents
        self.vision_agent = RxVisionAgent(model_id=model_id)
        self.pharmacology_agent = RxPharmacologyAgent(model_id=model_id)
        self.safety_sentinel = RxSafetySentinel(model_id=model_id)
        self.vernacular_communicator = RxVernacularCommunicator(model_id=model_id)

    def execute_swarm(
        self,
        prescription_input: str,
        target_language: str = "hi",
        patient_id: str = "PAT-RUR-2026",
        patient_name: str = "Smt. Lakshmi Devi",
        acute_symptoms: str = ""
    ) -> SwarmExecutionReport:
        """
        Execute the end-to-end 4-agent swarm workflow.
        """
        start_time = time.time()
        exec_id = f"SWARM-{uuid.uuid4().hex[:8].upper()}"
        audit_trail = []

        def log_event(agent_name: str, phase: str, payload: Dict[str, Any]):
            audit_trail.append({
                "timestamp": time.time(),
                "agent": agent_name,
                "phase": phase,
                "data": payload
            })

        # --- STEP 1: RxVisionAgent (Perception) ---
        log_event("RxVisionAgent", "SWARM_HANDOFF_START", {"status": "Digitizing prescription"})
        vision_res = self.vision_agent.process(prescription_input)
        log_event("RxVisionAgent", "SWARM_HANDOFF_COMPLETE", {
            "tokens_extracted": len(vision_res.tokens),
            "doctor": vision_res.detected_doctor_name,
            "clinic": vision_res.detected_clinic_name
        })

        # --- STEP 2: RxPharmacologyAgent (Reasoning & Pillbox) ---
        log_event("RxPharmacologyAgent", "SWARM_HANDOFF_START", {"status": "Structuring pharmaceutical regimen"})
        pharma_res = self.pharmacology_agent.process(
            vision_result=vision_res,
            patient_id=patient_id,
            patient_name=patient_name
        )
        log_event("RxPharmacologyAgent", "SWARM_HANDOFF_COMPLETE", {
            "drugs_count": len(pharma_res.drugs),
            "drugs": [d.brand_name for d in pharma_res.drugs],
            "pillbox_days": len(pharma_res.pillbox_5day_matrix)
        })

        # --- STEP 3: RxSafetySentinel (Critic & Guardrail) ---
        log_event("RxSafetySentinel", "SWARM_HANDOFF_START", {"status": "Auditing interactions and dosage thresholds"})
        safety_res = self.safety_sentinel.audit(
            regimen=pharma_res,
            acute_symptoms_text=acute_symptoms
        )
        log_event("RxSafetySentinel", "SWARM_HANDOFF_COMPLETE", {
            "is_safe": safety_res.is_safe,
            "risk_level": safety_res.risk_level,
            "sos_triggered": safety_res.emergency_sos_triggered,
            "verdict": safety_res.sentinel_verdict
        })

        # --- STEP 4: RxVernacularCommunicator (Synthesis & Voice) ---
        log_event("RxVernacularCommunicator", "SWARM_HANDOFF_START", {"status": "Generating regional voice guidance"})
        vernacular_res = self.vernacular_communicator.communicate(
            regimen=pharma_res,
            safety=safety_res,
            target_language=target_language
        )
        log_event("RxVernacularCommunicator", "SWARM_HANDOFF_COMPLETE", {
            "language": vernacular_res.language_display_name,
            "steps_count": len(vernacular_res.steps)
        })

        # Determine overall swarm status
        swarm_status = "SUCCESS"
        if safety_res.emergency_sos_triggered:
            swarm_status = "SOS_ESCALATED"
        elif not safety_res.is_safe:
            swarm_status = "WARNING_ATTACHED"

        duration = (time.time() - start_time) * 1000

        report = SwarmExecutionReport(
            execution_id=exec_id,
            input_source="Prescription Document / Clinical Notes",
            target_language=target_language,
            vision=vision_res,
            pharmacology=pharma_res,
            safety=safety_res,
            vernacular=vernacular_res,
            swarm_status=swarm_status,
            audit_trail=audit_trail,
            duration_ms=round(duration, 2)
        )

        return report

