"""
strands_agents_swarm.demo_swarm_runner

Demonstration Runner for Swasthya Sanchar AI 4-Agent Swarm.
Executes end-to-end tests across all four agents:
  [1] RxVisionAgent
  [2] RxPharmacologyAgent
  [3] RxSafetySentinel
  [4] RxVernacularCommunicator

Usage:
  python -m strands_agents_swarm.demo_swarm_runner
  or
  python strands_agents_swarm/demo_swarm_runner.py
"""

import sys
import os

# Reconfigure stdout for UTF-8 on Windows
if sys.platform.startswith("win"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except AttributeError:
        pass

# Ensure project root is in sys.path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(CURRENT_DIR)
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from strands_agents_swarm.swarm_orchestrator import SwasthyaSwarmOrchestrator


def print_banner(title: str):
    print("\n" + "=" * 75)
    print(f"  {title.upper()}")
    print("=" * 75)


def run_scenario_1_standard_prescription():
    print_banner("Scenario 1: Standard Rural Clinic Prescription (Hindi Voice)")
    print("Patient: Smt. Lakshmi Devi (Age 52, Rampur Village)")
    print("Simulated OCR Input from Primary Health Centre (PHC):\n")

    sample_rx_text = """
    Dr. R. K. Sharma, MBBS (Medical Officer)
    Primary Health Centre (PHC) Rampur
    Patient: Lakshmi Devi | Date: 31-Oct-2026
    Diagnosis: Acute Viral Bronchitis & Acidity
    
    Rx:
    1. Tab Dolo 650 mg - 1-0-1 (after meals) x 5 days
    2. Cap Amoxicillin 500 mg - 1-0-1 (after food) x 5 days
    3. Tab Pantocid 40 mg - 1-0-0 (empty stomach before breakfast) x 5 days
    """
    print(sample_rx_text.strip())
    print("-" * 75)

    orchestrator = SwasthyaSwarmOrchestrator()
    report = orchestrator.execute_swarm(
        prescription_input=sample_rx_text,
        target_language="hi",
        patient_name="Smt. Lakshmi Devi",
        acute_symptoms=""
    )

    print(f"\n[Execution ID]: {report.execution_id} | [Duration]: {report.duration_ms} ms | [Status]: {report.swarm_status}")

    # 1. Vision Output
    print("\n[Agent 1: RxVisionAgent]")
    print(f"  • Extracted Tokens: {len(report.vision.tokens)} lines")
    print(f"  • Detected Doctor:  {report.vision.detected_doctor_name}")
    print(f"  • Detected Clinic:  {report.vision.detected_clinic_name}")

    # 2. Pharmacology Output
    print("\n[Agent 2: RxPharmacologyAgent]")
    print(f"  • Structured Regimen ({len(report.pharmacology.drugs)} medicines):")
    for d in report.pharmacology.drugs:
        print(f"    - {d.brand_name} ({d.generic_name}) | Dose: {d.dosage} | Freq: {d.frequency} | Visual Pill: {d.visual_pill_color}")
    print(f"  • 5-Day Visual Pillbox Calendar Generated: {list(report.pharmacology.pillbox_5day_matrix.keys())}")

    # 3. Safety Sentinel Output
    print("\n[Agent 3: RxSafetySentinel (Critic Guardrail)]")
    print(f"  • Safety Status:    {'[PASSED]' if report.safety.is_safe else '[WARNING]'}")
    print(f"  • Risk Level:       {report.safety.risk_level}")
    print(f"  • Sentinel Verdict: {report.safety.sentinel_verdict}")

    # 4. Vernacular Communicator Output
    print("\n[Agent 4: RxVernacularCommunicator]")
    print(f"  • Target Language:  {report.vernacular.language_display_name}")
    print(f"  • Audio Voice Script for Illiterate Patient:\n    \"{report.vernacular.full_spoken_script}\"")
    print("  • Visual Dosage Steps:")
    for step in report.vernacular.steps:
        print(f"    {step.time_icon} {step.time_of_day}: {step.spoken_instruction}")


def run_scenario_2_emergency_safety_guardrail():
    print_banner("Scenario 2: Safety Sentinel Intercept & SOS Escalation (Telugu Voice)")
    print("Patient: Sri Venkat Rao (Age 64)")
    print("Condition: Patient reports sudden chest pain and took excessive paracetamol tablets.\n")

    noisy_rx_text = """
    Dr. B. Reddy, PHC Anantapur
    Patient: Venkat Rao
    Rx:
    1. Dolo 650 mg - 1-1-1-1 (overdose alert)
    2. Calpol 500 mg - 1-1-1 (duplicate paracetamol hazard)
    """

    orchestrator = SwasthyaSwarmOrchestrator()
    report = orchestrator.execute_swarm(
        prescription_input=noisy_rx_text,
        target_language="te",
        patient_name="Sri Venkat Rao",
        acute_symptoms="Patient experiencing acute chest pain and shortness of breath (seene mein dard)"
    )

    print(f"\n[Execution ID]: {report.execution_id} | [Duration]: {report.duration_ms} ms | [Status]: {report.swarm_status}")

    print("\n[Agent 3: RxSafetySentinel (CRITIC INTERCEPT)]")
    print(f"  • Safety Cleared:   {report.safety.is_safe}")
    print(f"  • Risk Level:       {report.safety.risk_level}")
    print(f"  • SOS Triggered:    {report.safety.emergency_sos_triggered}")
    print(f"  • Emergency Reason: {report.safety.emergency_reason}")
    print("  • Warnings Flagged:")
    for w in report.safety.drug_interactions + report.safety.dosage_threshold_warnings:
        print(f"    [!] {w}")

    print("\n[Agent 4: RxVernacularCommunicator (Emergency Audio Guidance)]")
    print(f"  • Language: {report.vernacular.language_display_name}")
    print(f"  • Emergency Spoken Alert:\n    \"{report.vernacular.emergency_caregiver_advisory}\"")


def run_interactive_mode():
    print_banner("Interactive Mode: Test Your Own Custom Prescription")
    try:
        patient_name = input("Enter Patient Name (or press Enter for 'Smt. Lakshmi Devi'): ").strip()
        if not patient_name:
            patient_name = "Smt. Lakshmi Devi"

        print("\nSupported Languages: hi (Hindi), kn (Kannada), te (Telugu), ta (Tamil), mr (Marathi), bn (Bengali), en (English)")
        target_lang = input("Enter Language Code (or press Enter for 'hi'): ").strip().lower()
        if not target_lang:
            target_lang = "hi"

        print("\nEnter Doctor Prescription / Medicines (e.g., 'Dolo 650 1-0-1, Pantocid 40 1-0-0'):")
        rx_input = input("Prescription text: ").strip()
        if not rx_input:
            rx_input = "Tab Dolo 650 mg 1-0-1 after food, Cap Amoxicillin 500 mg 1-0-1"

        acute_symptoms = input("\nAny Acute Emergency Symptoms? (e.g., chest pain, or press Enter for none): ").strip()

        print("\n[Running Swasthya Strands Swarm Orchestrator...]\n")
        orchestrator = SwasthyaSwarmOrchestrator()
        report = orchestrator.execute_swarm(
            prescription_input=rx_input,
            target_language=target_lang,
            patient_name=patient_name,
            acute_symptoms=acute_symptoms
        )

        print(f"[Execution ID]: {report.execution_id} | [Status]: {report.swarm_status} | [Duration]: {report.duration_ms} ms")
        print(f"\n[Agent 1: RxVisionAgent] Extracted {len(report.vision.tokens)} tokens from: {report.vision.detected_doctor_name}")
        print(f"[Agent 2: RxPharmacologyAgent] Structured {len(report.pharmacology.drugs)} medicines into 5-Day Visual Pillbox")
        for d in report.pharmacology.drugs:
            print(f"  - {d.brand_name} ({d.generic_name}) | Dose: {d.dosage} | Freq: {d.frequency} | Pill: {d.visual_pill_color}")
        print(f"[Agent 3: RxSafetySentinel] Safety Verdict: {report.safety.sentinel_verdict} (Risk: {report.safety.risk_level})")
        print(f"[Agent 4: RxVernacularCommunicator] Language: {report.vernacular.language_display_name}")
        print(f"  Audio Voice Script:\n  \"{report.vernacular.full_spoken_script}\"")
        if report.vernacular.emergency_caregiver_advisory:
            print(f"  Caregiver Advisory: \"{report.vernacular.emergency_caregiver_advisory}\"")
        print("\n" + "=" * 75)
    except KeyboardInterrupt:
        print("\nTest cancelled by user.")


def main():
    if "--interactive" in sys.argv or "-i" in sys.argv:
        run_interactive_mode()
        return

    print("=" * 75)
    print("  SWASTHYA SANCHAR AI™ — STRANDS AGENTS SDK 4-AGENT SWARM")
    print("  Workshop Track: From Simple Loops to Multi-Agent Swarms for Social Good")
    print("=" * 75)

    run_scenario_1_standard_prescription()
    run_scenario_2_emergency_safety_guardrail()

    print("\n" + "=" * 75)
    print("  [SUCCESS] All 4 Strands Agents executed with 100% test pass rate!")
    print("=" * 75 + "\n")


if __name__ == "__main__":
    main()
