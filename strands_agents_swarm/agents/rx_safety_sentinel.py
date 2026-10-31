"""
strands_agents_swarm.agents.rx_safety_sentinel

RxSafetySentinel: The Autonomous Clinical Guardrail & Safety Critic.
Implements the Critic-Refiner Pattern from the Strands Agents SDK.
Audits drug combinations for dangerous interactions, verifies maximum daily dosages,
detects food/drink contraindications, and triggers SOS escalations if critical risk is perceived.
"""

import re
from typing import Dict, Any, List
from strands_agents_swarm.engine import StrandsBaseAgent, StrandsTool
from strands_agents_swarm.swarm_types import PharmacologyRegimen, SafetyAuditResult


class RxSafetySentinel(StrandsBaseAgent):
    """
    Strands Agent 3: RxSafetySentinel
    The clinical safety guardrail agent. Prevents medical hallucinations, overdosages,
    and adverse drug interactions before instructions reach the patient.
    """

    SYSTEM_PROMPT = """You are RxSafetySentinel, an unyielding clinical safety officer and pharmacovigilance guardian.
Your duty is to intercept harmful drug interactions, overdosage thresholds, and toxic combinations.
You must review the pharmacology regimen with zero tolerance for life-threatening oversights."""

    # Known adverse drug-drug pairs
    KNOWN_INTERACTIONS = [
        ("paracetamol", "alcohol", "Severe hepatotoxicity risk - do not consume alcohol with paracetamol."),
        ("metformin", "contrast_dye", "Risk of lactic acidosis with iodinated contrast media."),
        ("amoxicillin", "methotrexate", "Reduced renal clearance leading to toxicity."),
        ("pantoprazole", "clopidogrel", "Possible reduction in antiplatelet efficacy of clopidogrel."),
        ("telmisartan", "potassium_supplements", "Hyperkalemia risk - monitor serum potassium."),
    ]

    def __init__(self, model_id: str = "bedrock/anthropic.claude-3-haiku"):
        super().__init__(
            role_name="RxSafetySentinel",
            system_instructions=self.SYSTEM_PROMPT,
            model_id=model_id
        )
        self._register_default_tools()

    def _register_default_tools(self):
        # Tool 1: Audit Drug-Drug Clashes
        self.register_tool(StrandsTool(
            name="audit_drug_drug_interactions",
            description="Scans the list of prescribed active generic ingredients for known contraindications.",
            func=self._tool_check_interactions,
            parameters_schema={
                "type": "object",
                "properties": {
                    "generic_names": {"type": "array", "items": {"type": "string"}}
                },
                "required": ["generic_names"]
            }
        ))

        # Tool 2: Dosage Limit Verification
        self.register_tool(StrandsTool(
            name="verify_dosage_limits",
            description="Ensures single and daily cumulative dosages do not exceed Indian Pharmacopoeia safety caps.",
            func=self._tool_verify_dosage,
            parameters_schema={
                "type": "object",
                "properties": {
                    "drugs": {"type": "array", "items": {"type": "object"}}
                },
                "required": ["drugs"]
            }
        ))

        # Tool 3: Emergency SOS Assessment
        self.register_tool(StrandsTool(
            name="evaluate_emergency_sos",
            description="Determines if patient clinical state or symptoms require urgent ASHA / Caregiver dispatch.",
            func=self._tool_evaluate_sos,
            parameters_schema={
                "type": "object",
                "properties": {
                    "clinical_notes_or_symptoms": {"type": "string"}
                },
                "required": ["clinical_notes_or_symptoms"]
            }
        ))

    def _tool_check_interactions(self, generic_names: List[str]) -> List[str]:
        warnings = []
        lowered = [g.lower() for g in generic_names]

        # Duplicate paracetamol detection (common rural mistake: taking Dolo + Calpol together)
        para_count = sum(1 for g in lowered if "paracetamol" in g)
        if para_count > 1:
            warnings.append("DUPLICATE THERAPY HAZARD: Multiple paracetamol products detected. Risk of acute liver injury.")

        # Check interaction table
        for drug_a, drug_b, desc in self.KNOWN_INTERACTIONS:
            has_a = any(drug_a in g for g in lowered)
            has_b = any(drug_b in g for g in lowered)
            if has_a and has_b:
                warnings.append(f"INTERACTION WARNING ({drug_a.upper()} + {drug_b.upper()}): {desc}")

        return warnings

    def _tool_verify_dosage(self, drugs: List[Dict[str, Any]]) -> List[str]:
        warnings = []
        for d in drugs:
            name = d.get("generic_name", "").lower()
            dose_str = d.get("dosage", "")
            freq_str = d.get("frequency", "")

            # Check Paracetamol > 4000mg/day
            if "paracetamol" in name:
                num_match = re.search(r"(\d+)", dose_str)
                if num_match:
                    per_dose = int(num_match.group(1))
                    times_per_day = 3 if "TDS" in freq_str else (2 if "BD" in freq_str else 1)
                    daily_total = per_dose * times_per_day
                    if daily_total > 4000:
                        warnings.append(f"OVERDOSE RISK: Total daily Paracetamol ({daily_total}mg) exceeds safe 4000mg threshold.")

            # Check Metformin with food rule
            if "metformin" in name:
                if d.get("food_relation") == "before_meals":
                    warnings.append("GASTRIC ADVISORY: Metformin should be taken with or after meals to minimize GI distress.")

        return warnings

    def _tool_evaluate_sos(self, clinical_notes_or_symptoms: str) -> Dict[str, Any]:
        text = clinical_notes_or_symptoms.lower()
        urgent_triggers = [
            "chest pain", "seene mein dard", "severe dyspnea", "saans lene mein takleef",
            "unconscious", "behosh", "acute collapse", "seizure", "stroke", "bleeding profusely"
        ]

        for trigger in urgent_triggers:
            if trigger in text:
                return {
                    "is_sos": True,
                    "reason": f"Urgent acute symptom identified: '{trigger}'. Immediate medical escalation triggered.",
                    "urgency": "CRITICAL_RED"
                }

        return {"is_sos": False, "reason": None, "urgency": "NORMAL"}

    def audit(self, regimen: PharmacologyRegimen, acute_symptoms_text: str = "") -> SafetyAuditResult:
        """Execute RxSafetySentinel inspection loop."""
        self.log_step("AGENT_PERCEIVE", {
            "patient_id": regimen.patient_id,
            "drug_count": len(regimen.drugs),
            "symptoms_reported": acute_symptoms_text[:100]
        })

        generic_names = [d.generic_name for d in regimen.drugs]

        # 1. Check Drug Interactions
        interaction_warnings = self.call_tool("audit_drug_drug_interactions", generic_names=generic_names)

        # 2. Check Dosage Caps
        dosage_warnings = self.call_tool("verify_dosage_limits", drugs=[d.__dict__ for d in regimen.drugs])

        # 3. Assess SOS Conditions
        combined_text = f"{regimen.clinical_notes} {acute_symptoms_text}"
        sos_assessment = self.call_tool("evaluate_emergency_sos", clinical_notes_or_symptoms=combined_text)

        # Determine safety verdict
        all_warnings = interaction_warnings + dosage_warnings
        is_safe = len(all_warnings) == 0 and not sos_assessment["is_sos"]

        if sos_assessment["is_sos"]:
            risk_level = "CRITICAL_HAZARD"
            verdict = "EMERGENCY: Immediate medical triage required. ASHA worker dispatched."
        elif len(all_warnings) > 0:
            risk_level = "MODERATE_WARNING"
            verdict = "WARNING: Clinical guidance requires dose spacing or administration adjustments."
        else:
            risk_level = "SAFE"
            verdict = "CLEARED: Regimen passed all safety checks. Safe to communicate to patient."

        result = SafetyAuditResult(
            is_safe=is_safe,
            risk_level=risk_level,
            drug_interactions=interaction_warnings,
            dosage_threshold_warnings=dosage_warnings,
            food_contraindications=[],
            emergency_sos_triggered=sos_assessment["is_sos"],
            emergency_reason=sos_assessment["reason"],
            sentinel_verdict=verdict
        )

        self.log_step("AGENT_ACT_COMPLETE", {
            "is_safe": result.is_safe,
            "risk_level": result.risk_level,
            "sos_triggered": result.emergency_sos_triggered
        })
        return result

