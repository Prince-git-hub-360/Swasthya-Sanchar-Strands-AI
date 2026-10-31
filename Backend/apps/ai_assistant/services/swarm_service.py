"""
ai_assistant.services.swarm_service

Production Bridge between Strands Agents SDK Swarm and Django ORM.
Connects:
  - RxVisionAgent
  - RxPharmacologyAgent -> writes Medication & Reminder (Pillbox) records
  - RxSafetySentinel -> writes EmergencySession SOS records
  - RxVernacularCommunicator -> generates localized audio guidance
"""

import sys
import uuid
import logging
from pathlib import Path
from datetime import date, timedelta
from typing import Dict, Any, Optional

# Ensure project root is available to import strands_agents_swarm
BACKEND_DIR = Path(__file__).resolve().parent.parent.parent
WORKSPACE_ROOT = BACKEND_DIR.parent
if str(WORKSPACE_ROOT) not in sys.path:
    sys.path.insert(0, str(WORKSPACE_ROOT))

from django.utils import timezone
from strands_agents_swarm import SwasthyaSwarmOrchestrator

logger = logging.getLogger(__name__)


class SwasthyaSwarmService:
    """
    Live Django Service Wrapper for the 4-Agent Strands Swarm.
    Persists parsed medications, pillbox schedules, and safety escalations directly to PostgreSQL.
    """

    @classmethod
    def run_live_swarm(
        cls,
        prescription_text: str,
        target_language: str = "hi",
        patient=None,
        acute_symptoms: str = "",
        save_to_db: bool = True
    ) -> Dict[str, Any]:
        patient_name = patient.user.get_full_name() or patient.user.username if patient and hasattr(patient, "user") else "Rural Patient"
        patient_id = str(patient.id) if patient else "GUEST-PATIENT"

        # 1. Execute the 4-Agent Swarm Orchestrator
        orchestrator = SwasthyaSwarmOrchestrator()
        report = orchestrator.execute_swarm(
            prescription_input=prescription_text,
            target_language=target_language,
            patient_id=patient_id,
            patient_name=patient_name,
            acute_symptoms=acute_symptoms
        )

        db_sync_summary = {
            "medications_created": 0,
            "reminders_created": 0,
            "emergency_session_id": None
        }

        # 2. Persist to PostgreSQL if a patient is linked and save_to_db is enabled
        if patient and save_to_db:
            try:
                from medications.models import Medication, FrequencyChoices, SourceChoices
                from reminders.models import Reminder, FrequencyChoices as RemFreqChoices, DoseStatusChoices

                today = timezone.localdate()
                end_5day = today + timedelta(days=5)

                for drug in report.pharmacology.drugs:
                    freq_choice = FrequencyChoices.TWICE_DAILY if "BD" in drug.frequency else (
                        FrequencyChoices.ONCE_DAILY if "OD" in drug.frequency else FrequencyChoices.OTHER
                    )

                    is_morning = "Morning" in drug.frequency_expanded or "BD" in drug.frequency or "OD" in drug.frequency
                    is_night = "Night" in drug.frequency_expanded or "BD" in drug.frequency or "HS" in drug.frequency
                    is_after = drug.food_relation == "after_meals"
                    is_before = drug.food_relation == "before_meals"

                    # Create or update Medication entry
                    med_obj, created = Medication.objects.get_or_create(
                        patient=patient,
                        name=drug.brand_name,
                        defaults={
                            "generic_name": drug.generic_name,
                            "dosage_text": drug.frequency,
                            "strength": drug.dosage,
                            "frequency": freq_choice,
                            "before_food": is_before,
                            "after_food": is_after,
                            "morning": is_morning,
                            "night": is_night,
                            "start_date": today,
                            "end_date": end_5day,
                            "source": SourceChoices.EXTRACTED,
                            "confidence": 0.95
                        }
                    )
                    if created:
                        db_sync_summary["medications_created"] += 1

                    # Create Morning Reminder if applicable
                    if is_morning:
                        Reminder.objects.get_or_create(
                            patient=patient,
                            medication=med_obj,
                            title=f"{drug.brand_name} - Morning Dose",
                            defaults={
                                "notes": f"{drug.dosage} ({drug.visual_pill_color} pill) - {drug.food_relation}",
                                "start_date": today,
                                "end_date": end_5day,
                                "frequency": RemFreqChoices.DAILY,
                                "dose_status": DoseStatusChoices.PENDING
                            }
                        )
                        db_sync_summary["reminders_created"] += 1

                    # Create Night Reminder if applicable
                    if is_night:
                        Reminder.objects.get_or_create(
                            patient=patient,
                            medication=med_obj,
                            title=f"{drug.brand_name} - Night Dose",
                            defaults={
                                "notes": f"{drug.dosage} ({drug.visual_pill_color} pill) - {drug.food_relation}",
                                "start_date": today,
                                "end_date": end_5day,
                                "frequency": RemFreqChoices.DAILY,
                                "dose_status": DoseStatusChoices.PENDING
                            }
                        )
                        db_sync_summary["reminders_created"] += 1

                # 3. Check for Emergency SOS from RxSafetySentinel
                if report.safety.emergency_sos_triggered:
                    from medical.models import EmergencySession, EmergencySessionStatusChoices
                    sos_session = EmergencySession.objects.create(
                        patient=patient,
                        token=uuid.uuid4().hex[:32],
                        status=EmergencySessionStatusChoices.ACTIVE,
                        emergency_type=report.safety.emergency_reason or "Critical Drug Safety Escalation",
                        address_text="Detected via Swasthya Strands Swarm Clinical Audit",
                        expires_at=timezone.now() + timedelta(hours=2)
                    )
                    db_sync_summary["emergency_session_id"] = sos_session.id
                    logger.warning("[SWARM SOS] Created EmergencySession #%s for patient %s", sos_session.id, patient_id)

            except Exception as e:
                logger.error("Error persisting swarm output to database: %s", e, exc_info=True)
                db_sync_summary["error"] = str(e)

        # 4. Serialize the comprehensive Swarm output
        return {
            "success": True,
            "execution_id": report.execution_id,
            "swarm_status": report.swarm_status,
            "duration_ms": report.duration_ms,
            "vision": {
                "detected_doctor": report.vision.detected_doctor_name,
                "detected_clinic": report.vision.detected_clinic_name,
                "token_count": len(report.vision.tokens),
                "raw_text": report.vision.raw_text
            },
            "pharmacology": {
                "drugs_count": len(report.pharmacology.drugs),
                "drugs": [
                    {
                        "brand_name": d.brand_name,
                        "generic_name": d.generic_name,
                        "dosage": d.dosage,
                        "frequency": d.frequency,
                        "frequency_expanded": d.frequency_expanded,
                        "visual_pill_color": d.visual_pill_color,
                        "food_relation": d.food_relation,
                        "purpose": d.purpose
                    }
                    for d in report.pharmacology.drugs
                ],
                "pillbox_5day_matrix": report.pharmacology.pillbox_5day_matrix
            },
            "safety": {
                "is_safe": report.safety.is_safe,
                "risk_level": report.safety.risk_level,
                "sentinel_verdict": report.safety.sentinel_verdict,
                "drug_interactions": report.safety.drug_interactions,
                "dosage_threshold_warnings": report.safety.dosage_threshold_warnings,
                "emergency_sos_triggered": report.safety.emergency_sos_triggered,
                "emergency_reason": report.safety.emergency_reason
            },
            "vernacular": {
                "language_code": report.vernacular.target_language,
                "language_name": report.vernacular.language_display_name,
                "spoken_script": report.vernacular.full_spoken_script,
                "steps": [
                    {
                        "time_of_day": s.time_of_day,
                        "time_icon": s.time_icon,
                        "spoken_instruction": s.spoken_instruction,
                        "visual_pill_cue": s.visual_pill_cue
                    }
                    for s in report.vernacular.steps
                ],
                "emergency_caregiver_advisory": report.vernacular.emergency_caregiver_advisory
            },
            "database_sync": db_sync_summary
        }

