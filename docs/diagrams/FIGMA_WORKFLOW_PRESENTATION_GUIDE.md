# 🏥 AI-Powered Rural Healthcare Assistant — Mentor Presentation & Figma Workflow Guide

This document is the complete **Screen-by-Screen Workflow and Architecture Map** of your project. It is structured to help you build the wireframes in **Figma / FigJam** or present directly to your mentor.

---

## 🎨 Fast-Track: How to use this in Figma right now
1. An editable vector file has been generated in your project root:  
   👉 **[`Healthcare_Assistant_Figma_Workflow.svg`](./Healthcare_Assistant_Figma_Workflow.svg)**
2. **Open Figma** $\rightarrow$ Open any project canvas.
3. **Drag & Drop** `Healthcare_Assistant_Figma_Workflow.svg` straight onto the Figma canvas.
4. It will immediately unpack into **fully editable native Figma frames, shapes, text boxes, and connector arrows**!

---

## 🗺️ Master Mermaid Workflow Diagram (Ready for Figma / GitHub / Excalidraw)

```mermaid
flowchart TD
    %% Global Entry
    Landing["🏠 Public Landing Page (/)<br/>• Multilingual Hero<br/>• Language Selector (Hindi/Tamil/Telugu/English)<br/>• How It Works"]
    Login["🔐 Auth Gateway (/login, /register)<br/>• ABHA / Phone OTP Auth<br/>• Role Guard Classifier"]
    EmergCard["🚨 Public Emergency Card (/emergency-card/*)<br/>• Zero Login Required<br/>• Scannable QR for Ambulance/First Responders"]

    Landing --> Login
    Landing -.-> EmergCard

    %% Role Branching
    Login --> RoleRouter{"🔀 Role Router"}

    %% ASHA Worker Journey
    subgraph ASHA_PORTAL ["🟠 1. ASHA / Rural Healthcare Worker Portal"]
        A_Dash["🩺 ASHA Field Dashboard (/app/asha)<br/>• Offline Cache Indicator (IndexedDB)<br/>• High-Risk Patient Count (🔴 3 Alerts)<br/>• Today's Scheduled Visits"]
        A_Reg["👥 Village Registry (/app/asha/patients)<br/>• Household Roster<br/>• Filter: Pregnant / Diabetic / Child<br/>• Risk Badges (🔴 High / 🟢 Stable)"]
        
        M_ABHA["🪪 Modal: [AbhaRegistrationModal]<br/>• Doorstep Aadhaar OTP verification<br/>• Generates 14-digit ABHA ID"]
        M_Vitals["💓 Modal: [RecordVitalsModal]<br/>• BP, Sugar, SpO2, Pulse, Temp<br/>• Voice Memo Note<br/>• Auto-flags BP > 140/90"]
        M_Route["🗺️ Modal: [VisitRouteMapModal]<br/>• GPS-Optimized village walking path<br/>• Sequential house-to-house pins"]
        M_Refer["🚑 Modal: [CreateReferralModal]<br/>• Case Summary + Urgency Level<br/>• Tele-Chat Coordination with PHC Doctor"]

        A_Dash --> A_Reg
        A_Dash --> M_Route
        A_Reg --> M_ABHA
        A_Reg --> M_Vitals
        A_Reg --> M_Refer
    end

    %% Patient Journey
    subgraph PATIENT_PORTAL ["🟢 2. Patient Empowerment Portal"]
        P_Dash["📱 Patient Dashboard (/app/patient)<br/>• Zero-Literacy Visual Layout<br/>• Today's Dosage Tracker (☀️/🌤️/🌙)<br/>• Audio readout buttons on all cards"]
        P_Voice["🎙️ Modal: [SwasthyaMitrChatModal]<br/>• Speech-to-Speech in Local Village Dialects<br/>• Symptom triage & dosage explanations"]
        P_OCR["📄 Prescription Scanner (/app/patient/translate)<br/>• Gemini & Groq Vision OCR<br/>• Handwritten Rx Digitizer<br/>• Audio dosage instructions"]
        P_Vault["📂 Medical Vault (/app/patient/vault)<br/>• ABDM / ABHA Health Record sync<br/>• PDF / Report Locker"]
        P_Map["🗺️ My Health Map & Generic Store Finder<br/>• Nearest PHC / Jan Aushadhi Kendra GPS"]

        P_Dash --> P_Voice
        P_Dash --> P_OCR
        P_Dash --> P_Vault
        P_Dash --> P_Map
    end

    %% Doctor Journey
    subgraph DOCTOR_PORTAL ["🟣 3. Doctor & PHC Tele-Consultation Hub"]
        D_Dash["👨‍⚕️ Doctor Dashboard (/app/doctor)<br/>• Tele-Triage Patient Queue<br/>• Priority Sort (P1 Critical ➔ P3 Routine)<br/>• Review ASHA Vitals & Audio Memos"]
        D_Rx["💊 Digital Prescription Generator<br/>• Autocomplete Medicines<br/>• Auto-syncs to Patient Reminders"]
        D_Chat["💬 Doctor-ASHA Tele-Chat (/app/doctor/prescriptions)<br/>• Real-time video/voice consultation advice"]

        D_Dash --> D_Rx
        D_Dash --> D_Chat
    end

    %% Caregiver Journey
    subgraph CAREGIVER_PORTAL ["🤝 4. Caregiver Portal"]
        C_Dash["Caregiver Dashboard (/app/caregiver)<br/>• Elderly Adherence Tracking<br/>• Missed Dosage Alerts"]
    end

    %% Cross-Platform Data Sync
    RoleRouter -->|Role: Healthcare Worker| A_Dash
    RoleRouter -->|Role: Patient| P_Dash
    RoleRouter -->|Role: Doctor| D_Dash
    RoleRouter -->|Role: Caregiver| C_Dash

    M_Refer ==>|Escalates Rural Patient| D_Dash
    D_Rx ==>|Pushes Digital Rx| P_Vault
    P_OCR -.->|Sets Alarms| P_Dash
    P_Dash -.->|Adherence Data| C_Dash
```

---

# 📖 Screen-by-Screen Mentor Pitch Points

When you walk your mentor through the Figma wireframe, explain these **4 Key Capabilities**:

### 1. The Doorstep ASHA Worker Workflow
* **Challenge Addressed:** Rural areas lack doctors; ASHA workers are the frontline healthcare providers.
* **The Solution:**
  1. ASHA worker logs into the **ASHA Field Dashboard** (`/app/asha`).
  2. Runs **100% offline** in remote villages using **IndexedDB caching**.
  3. When visiting a house, clicks **`[+ Register ABHA]`** to issue government ABHA health IDs on the spot.
  4. Clicks **`[Record Vitals]`** $\rightarrow$ logs BP and Sugar. If BP is critical (e.g. 150/100), the app automatically changes the patient badge to **🔴 High Risk**.
  5. Clicks **`[Refer to Doctor]`** $\rightarrow$ packages vitals and audio notes directly to the Primary Health Center (PHC) doctor.

### 2. Zero-Literacy Patient Experience (SwasthyaMitr AI)
* **Challenge Addressed:** Illiterate villagers cannot read handwritten doctor prescriptions or navigate complex web apps.
* **The Solution:**
  1. High-contrast icon layout with voice readouts on every card.
  2. Floating **SwasthyaMitr AI** button: Patients speak naturally in Hindi, Tamil, Telugu, etc., and receive audio responses explaining dosages and precautions.
  3. **Prescription Scanner:** Uses **Gemini 1.5 & Groq Vision OCR** to read messy doctor handwriting and automatically sets up morning/night WhatsApp & voice alarms.

### 3. Closed-Loop Doctor Tele-Triage
* **Challenge Addressed:** PHC doctors are overwhelmed and need prioritized patient data.
* **The Solution:**
  1. Doctor sees pre-triaged queues sorted by priority (`P1 Critical` to `P3 Routine`).
  2. Review AI-synthesized summaries of ASHA field notes.
  3. One-click digital prescription generation pushes directly into the patient's vault.

### 4. Public QR Emergency Card
* **Challenge Addressed:** First responders and ambulance drivers cannot unlock a patient's phone during an accident or emergency.
* **The Solution:**
  1. Public route `/emergency-card/*` accessible via a printable QR sticker or lock-screen card.
  2. Shows blood group, critical allergies, chronic conditions, and emergency contacts with zero login required.
