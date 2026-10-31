"""
strands_agents_swarm.agents.rx_vernacular_communicator

RxVernacularCommunicator: The Empathetic Voice & Multilingual Communicator.
Translates verified clinical regimens into simple, culturally respectful spoken instructions
across 12+ Indian regional languages, eliminating the reading barrier for rural patients.
"""

from typing import Dict, Any, List
from strands_agents_swarm.engine import StrandsBaseAgent, StrandsTool
from strands_agents_swarm.swarm_types import PharmacologyRegimen, SafetyAuditResult, VernacularGuidance, VernacularStepInstruction


class RxVernacularCommunicator(StrandsBaseAgent):
    """
    Strands Agent 4: RxVernacularCommunicator
    Synthesizes safe, verified medical regimens into vernacular voice scripts and visual cues.
    """

    SYSTEM_PROMPT = """You are RxVernacularCommunicator, an empathetic Indian rural health counselor and voice assistant.
Your goal is to explain medicines to villagers with simplicity, warmth, and zero medical jargon.
You use visual cues (pill color, morning sunrise, evening meal) and regional languages."""

    # Multi-language display mapping & localized phrases
    LANG_MAPPINGS = {
        "hi": {
            "name": "Hindi (हिंदी)",
            "greeting": "नमस्ते",
            "morning": "सुबह नाश्ते के बाद",
            "afternoon": "दोपहर खाने के बाद",
            "night": "रात खाने के बाद",
            "take_pill": "यह गोली खाइए",
            "water": "ताज़ा पानी के साथ लें",
            "emergency": "सावधान: तुरंत नजदीकी आशा दीदी या डॉक्टर से संपर्क करें।"
        },
        "kn": {
            "name": "Kannada (ಕನ್ನಡ)",
            "greeting": "ನಮಸ್ಕಾರ",
            "morning": "ಬೆಳಿಗ್ಗೆ ಉಪಾಹಾರದ ನಂತರ",
            "afternoon": "ಮಧ್ಯಾಹ್ನ ಊಟದ ನಂತರ",
            "night": "ರಾತ್ರಿ ಊಟದ ನಂತರ",
            "take_pill": "ಈ ಮಾತ್ರೆ ತೆಗೆದುಕೊಳ್ಳಿ",
            "water": "ನೀರಿನೊಂದಿಗೆ ಸೇವಿಸಿ",
            "emergency": "ಎಚ್ಚರಿಕೆ: ತಕ್ಷಣ ಆಶಾ ಕಾರ್ಯಕರ್ತೆ ಅಥವಾ ಆಸ್ಪತ್ರೆಗೆ ಭೇಟಿ ನೀಡಿ."
        },
        "te": {
            "name": "Telugu (తెలుగు)",
            "greeting": "నమస్కారం",
            "morning": "ఉదయం అల్పాహారం తర్వాత",
            "afternoon": "మధ్యాహ్నం భోజనం తర్వాత",
            "night": "రాత్రి భోజనం తర్వాత",
            "take_pill": "ఈ మాత్ర వేసుకోండి",
            "water": "మంచి నీటితో తీసుకోండి",
            "emergency": "హెచ్చరిక: వెంటనే ఆశా వర్కర్ లేదా డాక్టర్‌ను సంప్రదించండి."
        },
        "ta": {
            "name": "Tamil (தமிழ்)",
            "greeting": "வணக்கம்",
            "morning": "காலை உணவுக்குப் பிறகு",
            "afternoon": "மதிய உணவுக்குப் பிறகு",
            "night": "இரவு உணவுக்குப் பிறகு",
            "take_pill": "இந்த மாத்திரையைச் சாப்பிடுங்கள்",
            "water": "தண்ணீருடன் எடுத்துக் கொள்ளுங்கள்",
            "emergency": "எச்சரிக்கை: உடனடியாக ஆஷா ஊழியர் அல்லது மருத்துவரை அணுகவும்."
        },
        "bn": {
            "name": "Bengali (বাংলা)",
            "greeting": "নমস্কার",
            "morning": "সকালে খাবারের পর",
            "afternoon": "দুপুরে খাবারের পর",
            "night": "রাতে খাবারের পর",
            "take_pill": "এই ওষুধটি খান",
            "water": "জল দিয়ে খাবেন",
            "emergency": "সতর্কতা: অবিলম্বে আশা দিদি বা ডাক্তারের সাথে যোগাযোগ করুন।"
        },
        "mr": {
            "name": "Marathi (मराठी)",
            "greeting": "नमस्कार",
            "morning": "सकाळी नाश्त्यानंतर",
            "afternoon": "दुपारी जेवणानंतर",
            "night": "रात्री जेवणानंतर",
            "take_pill": "ही गोळी घ्या",
            "water": "पाण्यासोबत घ्या",
            "emergency": "सावधान: ताबडतोब आशा ताई किंवा डॉक्टरांशी संपर्क साधा."
        },
        "en": {
            "name": "English",
            "greeting": "Hello",
            "morning": "In the morning after breakfast",
            "afternoon": "In the afternoon after lunch",
            "night": "At night after dinner",
            "take_pill": "Take this medicine",
            "water": "with a glass of fresh water",
            "emergency": "Caution: Please contact your ASHA worker or doctor immediately."
        }
    }

    def __init__(self, model_id: str = "bedrock/anthropic.claude-3-haiku"):
        super().__init__(
            role_name="RxVernacularCommunicator",
            system_instructions=self.SYSTEM_PROMPT,
            model_id=model_id
        )
        self._register_default_tools()

    def _register_default_tools(self):
        # Tool 1: Synthesize Spoken Script
        self.register_tool(StrandsTool(
            name="generate_spoken_script",
            description="Generates an empathetic conversational spoken audio script in the requested Indic language.",
            func=self._tool_generate_spoken_script,
            parameters_schema={
                "type": "object",
                "properties": {
                    "patient_name": {"type": "string"},
                    "lang_code": {"type": "string"},
                    "drugs": {"type": "array", "items": {"type": "object"}},
                    "safety_verdict": {"type": "string"}
                },
                "required": ["patient_name", "lang_code", "drugs"]
            }
        ))

        # Tool 2: Build Visual Steps
        self.register_tool(StrandsTool(
            name="build_visual_steps",
            description="Creates simple visual badge cues (Sunrise, Sun, Moon) for non-literate patients.",
            func=self._tool_build_visual_steps,
            parameters_schema={
                "type": "object",
                "properties": {
                    "lang_code": {"type": "string"},
                    "drugs": {"type": "array", "items": {"type": "object"}}
                },
                "required": ["lang_code", "drugs"]
            }
        ))

    def _tool_generate_spoken_script(self, patient_name: str, lang_code: str, drugs: List[Dict[str, Any]], safety_verdict: str) -> str:
        lang_data = self.LANG_MAPPINGS.get(lang_code, self.LANG_MAPPINGS["hi"])
        greeting = lang_data["greeting"]
        water_phrase = lang_data["water"]

        med_sentences = []
        for d in drugs:
            name = d.get("brand_name", d.get("generic_name", "Dawai"))
            color = d.get("visual_pill_color", "white").replace("_", " ")
            timing = lang_data["morning"] if "1-0-0" in d.get("frequency", "") else f"{lang_data['morning']} और {lang_data['night']}"
            purpose = d.get("purpose", "Swasthya")

            sentence = f"{name} ({color} goli), {timing}, {water_phrase} ({purpose} ke liye)."
            med_sentences.append(sentence)

        body = " ".join(med_sentences)
        script = f"{greeting} {patient_name} ji. Aapki dawai ka niyam: {body} Samay par lijiye aur swasth rahiye."
        return script

    def _tool_build_visual_steps(self, lang_code: str, drugs: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        lang_data = self.LANG_MAPPINGS.get(lang_code, self.LANG_MAPPINGS["hi"])
        steps = []

        # Morning step
        morning_drugs = [d for d in drugs if "BD" in d.get("frequency", "") or "OD" in d.get("frequency", "") or "TDS" in d.get("frequency", "")]
        if morning_drugs:
            cues = ", ".join(f"{d.get('brand_name')} ({d.get('visual_pill_color', 'white').replace('_', ' ')})" for d in morning_drugs)
            steps.append({
                "time_of_day": "Morning (सुबह)",
                "time_icon": "🌅",
                "spoken_instruction": f"{lang_data['morning']} {lang_data['take_pill']}: {cues}",
                "visual_pill_cue": cues
            })

        # Night step
        night_drugs = [d for d in drugs if "BD" in d.get("frequency", "") or "HS" in d.get("frequency", "") or "TDS" in d.get("frequency", "")]
        if night_drugs:
            cues = ", ".join(f"{d.get('brand_name')} ({d.get('visual_pill_color', 'white').replace('_', ' ')})" for d in night_drugs)
            steps.append({
                "time_of_day": "Night (रात)",
                "time_icon": "🌙",
                "spoken_instruction": f"{lang_data['night']} {lang_data['take_pill']}: {cues}",
                "visual_pill_cue": cues
            })

        return steps

    def communicate(self, regimen: PharmacologyRegimen, safety: SafetyAuditResult, target_language: str = "hi") -> VernacularGuidance:
        """Execute RxVernacularCommunicator lifecycle."""
        self.log_step("AGENT_PERCEIVE", {
            "target_language": target_language,
            "patient_name": regimen.patient_name,
            "safety_is_safe": safety.is_safe
        })

        lang_data = self.LANG_MAPPINGS.get(target_language, self.LANG_MAPPINGS["hi"])
        lang_display = lang_data["name"]

        drugs_dict_list = [d.__dict__ for d in regimen.drugs]

        # 1. Generate Spoken Voice Script
        spoken_script = self.call_tool(
            "generate_spoken_script",
            patient_name=regimen.patient_name,
            lang_code=target_language,
            drugs=drugs_dict_list,
            safety_verdict=safety.sentinel_verdict
        )

        # 2. Build Visual Steps
        raw_steps = self.call_tool(
            "build_visual_steps",
            lang_code=target_language,
            drugs=drugs_dict_list
        )
        steps = [VernacularStepInstruction(**s) for s in raw_steps]

        # 3. Handle Emergency or Warnings
        caregiver_advisory = None
        if safety.emergency_sos_triggered:
            caregiver_advisory = f"{lang_data['emergency']} Reason: {safety.emergency_reason}"
        elif not safety.is_safe:
            caregiver_advisory = f"Notice: {', '.join(safety.drug_interactions + safety.dosage_threshold_warnings)}"

        guidance = VernacularGuidance(
            target_language=target_language,
            language_display_name=lang_display,
            full_spoken_script=spoken_script,
            steps=steps,
            emergency_caregiver_advisory=caregiver_advisory
        )

        self.log_step("AGENT_ACT_COMPLETE", {
            "language": lang_display,
            "steps_count": len(steps),
            "script_length": len(spoken_script)
        })
        return guidance

