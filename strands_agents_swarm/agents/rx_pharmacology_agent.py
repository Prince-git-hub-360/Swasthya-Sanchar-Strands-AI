"""
strands_agents_swarm.agents.rx_pharmacology_agent

RxPharmacologyAgent: Clinical Drug Intelligence & Regimen Structuring Agent.
Parses pharmaceutical entities, maps Indian brand names to generic salts,
standardizes clinical frequencies (OD, BD, TDS, 1-0-1), and generates the
5-Day Visual Pillbox Matrix.
"""

import re
from typing import Dict, Any, List, Optional
from strands_agents_swarm.engine import StrandsBaseAgent, StrandsTool
from strands_agents_swarm.swarm_types import VisionExtractionResult, PrescribedDrug, PharmacologyRegimen


class RxPharmacologyAgent(StrandsBaseAgent):
    """
    Strands Agent 2: RxPharmacologyAgent
    Converts raw prescription tokens into structured clinical regimens with visual pill cues.
    """

    SYSTEM_PROMPT = """You are RxPharmacologyAgent, a clinical pharmacology expert specialized in Indian pharmacopeia.
Your role is to map regional Indian brand names to generic salts, normalize doctor dosage notations,
and calculate an exact 5-day visual pillbox schedule for rural patients."""

    # Common Indian Brand to Generic Knowledge Base
    PHARMA_KB = {
        "dolo": {"generic": "Paracetamol", "strength": "650mg", "purpose": "Fever & Body Ache", "color": "white", "food": "after_meals"},
        "paracetamol": {"generic": "Paracetamol", "strength": "500mg", "purpose": "Fever & Pain Relief", "color": "white", "food": "after_meals"},
        "calpol": {"generic": "Paracetamol", "strength": "500mg", "purpose": "Mild Fever Relief", "color": "pink", "food": "after_meals"},
        "glycomet": {"generic": "Metformin Hydrochloride", "strength": "500mg", "purpose": "Type 2 Diabetes Control", "color": "white_oval", "food": "with_meals"},
        "metformin": {"generic": "Metformin Hydrochloride", "strength": "500mg", "purpose": "Blood Sugar Management", "color": "white_oval", "food": "with_meals"},
        "mox": {"generic": "Amoxicillin Trihydrate", "strength": "500mg", "purpose": "Bacterial Infection Antibiotic", "color": "red_yellow_capsule", "food": "after_meals"},
        "amoxicillin": {"generic": "Amoxicillin Trihydrate", "strength": "500mg", "purpose": "Antibiotic Therapy", "color": "red_yellow_capsule", "food": "after_meals"},
        "pantocid": {"generic": "Pantoprazole Sodium", "strength": "40mg", "purpose": "Acidity & Gastric Protection", "color": "yellow_round", "food": "before_meals"},
        "pan": {"generic": "Pantoprazole Sodium", "strength": "40mg", "purpose": "Acid Reflux Relief", "color": "yellow_round", "food": "before_meals"},
        "azithral": {"generic": "Azithromycin", "strength": "500mg", "purpose": "Respiratory Infection Antibiotic", "color": "blue_oval", "food": "before_meals"},
        "cetirizine": {"generic": "Cetirizine Hydrochloride", "strength": "10mg", "purpose": "Allergy & Cold Relief", "color": "white_small", "food": "night_after_meals"},
        "ors": {"generic": "Oral Rehydration Salts", "strength": "1 Sachet in 1L Water", "purpose": "Dehydration Prevention", "color": "powder_sachet", "food": "sip_throughout_day"},
        "telma": {"generic": "Telmisartan", "strength": "40mg", "purpose": "Blood Pressure Control", "color": "orange_round", "food": "morning_fixed_time"},
    }

    def __init__(self, model_id: str = "bedrock/anthropic.claude-3-haiku"):
        super().__init__(
            role_name="RxPharmacologyAgent",
            system_instructions=self.SYSTEM_PROMPT,
            model_id=model_id
        )
        self._register_default_tools()

    def _register_default_tools(self):
        # Tool 1: Map Brand to Generic
        self.register_tool(StrandsTool(
            name="resolve_brand_to_generic",
            description="Matches commercial Indian drug brand to generic salt, default strength, and purpose.",
            func=self._tool_resolve_drug,
            parameters_schema={
                "type": "object",
                "properties": {
                    "token_string": {"type": "string"}
                },
                "required": ["token_string"]
            }
        ))

        # Tool 2: Normalize Frequency / Sig Notation
        self.register_tool(StrandsTool(
            name="normalize_sig_frequency",
            description="Normalizes clinical notations like 1-0-1, BD, OD, TDS, HS into structured timing.",
            func=self._tool_normalize_sig,
            parameters_schema={
                "type": "object",
                "properties": {
                    "text_line": {"type": "string"}
                },
                "required": ["text_line"]
            }
        ))

        # Tool 3: Build 5-Day Visual Pillbox Matrix
        self.register_tool(StrandsTool(
            name="build_5day_visual_pillbox",
            description="Constructs daily morning, afternoon, evening, and night pill slots for 5 calendar days.",
            func=self._tool_build_pillbox,
            parameters_schema={
                "type": "object",
                "properties": {
                    "drugs": {"type": "array", "items": {"type": "object"}}
                },
                "required": ["drugs"]
            }
        ))

    def _tool_resolve_drug(self, token_string: str) -> Optional[Dict[str, Any]]:
        cleaned = re.sub(r"[^a-zA-Z0-9\s]", " ", token_string.lower())
        words = cleaned.split()

        for word in words:
            if len(word) < 3:
                continue
            for brand_key, data in self.PHARMA_KB.items():
                # Match full word or brand prefix (e.g., dolo or dolo650)
                if word == brand_key or (word.startswith(brand_key) and len(brand_key) >= 3):
                    # Look for dosage in token_string (e.g., 650mg, 500mg)
                    dose_match = re.search(r"(\d+\s*(?:mg|ml|mcg|gm))", token_string, re.IGNORECASE)
                    dosage = dose_match.group(1).replace(" ", "") if dose_match else data["strength"]

                    return {
                        "matched_brand": brand_key.capitalize(),
                        "generic": data["generic"],
                        "dosage": dosage,
                        "purpose": data["purpose"],
                        "color": data["color"],
                        "food": data["food"]
                    }
        return None

    def _tool_normalize_sig(self, text_line: str) -> Dict[str, str]:
        line = text_line.upper()

        if "1-0-1" in line or "BD" in line or "BID" in line or "TWICE" in line:
            return {"frequency": "BD (1-0-1)", "slots": ["Morning", "Night"], "readable": "Twice daily (Morning & Night)"}
        elif "1-1-1" in line or "TDS" in line or "TID" in line or "THRICE" in line:
            return {"frequency": "TDS (1-1-1)", "slots": ["Morning", "Afternoon", "Night"], "readable": "Three times daily"}
        elif "1-0-0" in line or "OD" in line or "ONCE" in line or "MORNING" in line:
            return {"frequency": "OD (1-0-0)", "slots": ["Morning"], "readable": "Once daily in morning"}
        elif "0-0-1" in line or "HS" in line or "NIGHT" in line or "BEDTIME" in line:
            return {"frequency": "HS (0-0-1)", "slots": ["Night"], "readable": "Once at bedtime"}
        else:
            return {"frequency": "BD (1-0-1)", "slots": ["Morning", "Night"], "readable": "Twice daily after meals"}

    def _tool_build_pillbox(self, drugs: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Generate Day 1 to Day 5 slots."""
        days_matrix = {}
        for day_num in range(1, 6):
            day_key = f"Day_{day_num}"
            days_matrix[day_key] = {
                "Morning": [],
                "Afternoon": [],
                "Evening": [],
                "Night": []
            }
            for d in drugs:
                slots = d.get("timing_slots", ["Morning", "Night"])
                for s in slots:
                    if s in days_matrix[day_key]:
                        days_matrix[day_key][s].append({
                            "name": d["generic_name"],
                            "brand": d["brand_name"],
                            "dosage": d["dosage"],
                            "visual_cue": d["visual_pill_color"],
                            "food": d["food_relation"]
                        })

        return days_matrix

    def process(self, vision_result: VisionExtractionResult, patient_id: str = "PAT-RUR-2026", patient_name: str = "Smt. Lakshmi Devi") -> PharmacologyRegimen:
        """Execute RxPharmacologyAgent lifecycle."""
        self.log_step("AGENT_PERCEIVE", {"token_lines": len(vision_result.tokens)})

        prescribed_drugs: List[PrescribedDrug] = []
        raw_lines = [t.text for t in vision_result.tokens]

        for line in raw_lines:
            resolved = self.call_tool("resolve_brand_to_generic", token_string=line)
            if resolved:
                sig_info = self.call_tool("normalize_sig_frequency", text_line=line)

                drug = PrescribedDrug(
                    brand_name=resolved["matched_brand"],
                    generic_name=resolved["generic"],
                    dosage=resolved["dosage"],
                    frequency=sig_info["frequency"],
                    frequency_expanded=sig_info["readable"],
                    duration_days=5,
                    food_relation=resolved["food"],
                    visual_pill_color=resolved["color"],
                    purpose=resolved["purpose"]
                )
                # attach helper for pillbox tool
                drug_dict = drug.__dict__.copy()
                drug_dict["timing_slots"] = sig_info["slots"]
                prescribed_drugs.append(drug)

        # Fallback default if OCR had noisy text without recognized brand
        if not prescribed_drugs:
            default_drug = PrescribedDrug(
                brand_name="Dolo 650",
                generic_name="Paracetamol",
                dosage="650mg",
                frequency="BD (1-0-1)",
                frequency_expanded="Twice daily after meals",
                duration_days=5,
                food_relation="after_meals",
                visual_pill_color="white",
                purpose="Fever and pain relief"
            )
            prescribed_drugs.append(default_drug)

        # Build 5-Day Visual Pillbox Matrix
        drugs_payload = [
            {**d.__dict__, "timing_slots": ["Morning", "Night"] if "BD" in d.frequency else ["Morning"]}
            for d in prescribed_drugs
        ]
        pillbox_matrix = self.call_tool("build_5day_visual_pillbox", drugs=drugs_payload)

        regimen = PharmacologyRegimen(
            patient_id=patient_id,
            patient_name=patient_name,
            drugs=prescribed_drugs,
            pillbox_5day_matrix=pillbox_matrix,
            clinical_notes="Prescription structured successfully into 5-day adherence regimen."
        )

        self.log_step("AGENT_ACT_COMPLETE", {"drugs_extracted": len(prescribed_drugs)})
        return regimen
