import json
import uuid
import random
import os
import shutil

elements = []

def make_id():
    return str(uuid.uuid4())[:8]

def add_rect(x, y, w, h, stroke_color="#e0e0e0", bg_color="transparent", fill_style="solid", stroke_width=1, stroke_style="solid", roughness=1):
    el_id = make_id()
    el = {
        "id": el_id,
        "type": "rectangle",
        "x": x,
        "y": y,
        "width": w,
        "height": h,
        "angle": 0,
        "strokeColor": stroke_color,
        "backgroundColor": bg_color,
        "fillStyle": fill_style,
        "strokeWidth": stroke_width,
        "strokeStyle": stroke_style,
        "roughness": roughness,
        "opacity": 100,
        "groupIds": [],
        "frameId": None,
        "roundness": {"type": 3},
        "seed": random.randint(1000, 99999),
        "version": 1,
        "versionNonce": 1,
        "isDeleted": False,
        "boundElements": None,
        "updated": 1,
        "link": None,
        "locked": False
    }
    elements.append(el)
    return el_id

def add_ellipse(x, y, w, h, stroke_color="#e0e0e0", bg_color="transparent", fill_style="solid", stroke_width=1):
    el_id = make_id()
    el = {
        "id": el_id,
        "type": "ellipse",
        "x": x,
        "y": y,
        "width": w,
        "height": h,
        "angle": 0,
        "strokeColor": stroke_color,
        "backgroundColor": bg_color,
        "fillStyle": fill_style,
        "strokeWidth": stroke_width,
        "strokeStyle": "solid",
        "roughness": 1,
        "opacity": 100,
        "groupIds": [],
        "frameId": None,
        "roundness": None,
        "seed": random.randint(1000, 99999),
        "version": 1,
        "versionNonce": 1,
        "isDeleted": False,
        "boundElements": None,
        "updated": 1,
        "link": None,
        "locked": False
    }
    elements.append(el)
    return el_id

def add_text(x, y, text, font_size=15, stroke_color="#ffffff", align="left"):
    lines = text.split('\n')
    line_h = font_size * 1.3
    h = len(lines) * line_h
    max_len = max(len(l) for l in lines)
    w = max_len * (font_size * 0.6)
    
    el_id = make_id()
    el = {
        "id": el_id,
        "type": "text",
        "x": x,
        "y": y,
        "width": w,
        "height": h,
        "angle": 0,
        "strokeColor": stroke_color,
        "backgroundColor": "transparent",
        "fillStyle": "solid",
        "strokeWidth": 1,
        "strokeStyle": "solid",
        "roughness": 1,
        "opacity": 100,
        "groupIds": [],
        "frameId": None,
        "roundness": None,
        "seed": random.randint(1000, 99999),
        "version": 1,
        "versionNonce": 1,
        "isDeleted": False,
        "text": text,
        "fontSize": font_size,
        "fontFamily": 1,
        "textAlign": align,
        "verticalAlign": "top",
        "baseline": font_size,
        "containerId": None,
        "originalText": text,
        "lineHeight": 1.25
    }
    elements.append(el)
    return el_id

def add_arrow(start_x, start_y, end_x, end_y, stroke_color="#94a3b8", stroke_style="solid", stroke_width=1.5):
    el_id = make_id()
    dx = end_x - start_x
    dy = end_y - start_y
    el = {
        "id": el_id,
        "type": "arrow",
        "x": start_x,
        "y": start_y,
        "width": abs(dx),
        "height": abs(dy),
        "angle": 0,
        "strokeColor": stroke_color,
        "backgroundColor": "transparent",
        "fillStyle": "solid",
        "strokeWidth": stroke_width,
        "strokeStyle": stroke_style,
        "roughness": 1,
        "opacity": 100,
        "groupIds": [],
        "frameId": None,
        "roundness": {"type": 2},
        "seed": random.randint(1000, 99999),
        "version": 1,
        "versionNonce": 1,
        "isDeleted": False,
        "points": [[0, 0], [dx, dy]],
        "lastCommittedPoint": None,
        "startBinding": None,
        "endBinding": None,
        "startArrowhead": None,
        "endArrowhead": "arrow"
    }
    elements.append(el)
    return el_id

# ==============================================================================
# MASTER EXCALIDRAW CANVAS GENERATION
# ==============================================================================

# Canvas Big Banner Header
add_rect(100, 40, 4100, 90, "#38bdf8", "#0f172a", "solid", stroke_width=2)
add_text(130, 65, "🏥 AI-POWERED RURAL HEALTHCARE SYSTEM — COMPLETE INTERACTIVE UI/UX WORKFLOW & CONNECTION MAP", 24, "#38bdf8")
add_text(3400, 70, "Every Screen, Dashboard, Button, Modal & Cross-Flow Route", 16, "#94a3b8")

# ==============================================================================
# SECTION 1: PUBLIC & AUTHENTICATION FLOW (X: 100 to 800)
# ==============================================================================
add_rect(100, 160, 720, 2200, "#3b82f6", "#111827", "solid", stroke_width=2, stroke_style="dashed")
add_rect(120, 180, 680, 45, "#1d4ed8", "#1e40af", "solid")
add_text(140, 192, "SECTION 1: PUBLIC ENTRY, LANGUAGE & AUTHENTICATION GATEWAY", 17, "#ffffff")

# 1.1 Landing Page Wireframe
add_rect(130, 250, 660, 480, "#d1d5db", "#18181b", "solid", stroke_width=1.5)
add_rect(130, 250, 660, 45, "#4b5563", "#27272a", "solid")
add_text(150, 262, "🏠 Landing Page (/)  |  Swasthya Sahayak AI", 15, "#60a5fa")
add_text(600, 262, "🌐 Language: Hindi ▼", 13, "#fbbf24")

# Landing Page Content & Buttons
add_rect(150, 315, 620, 120, "#3b82f6", "#1e293b", "solid")
add_text(170, 330, "AI Healthcare Companion for Rural Communities", 16, "#ffffff")
add_text(170, 355, "Voice-first rural medicine assistant, prescription translation, and\nseamless ASHA-to-Doctor field triage.", 13, "#94a3b8")
# Buttons
add_rect(170, 400, 130, 30, "#2563eb", "#1d4ed8", "solid")
add_text(185, 407, "Get Started ➔", 13, "#ffffff")
add_rect(315, 400, 140, 30, "#475569", "#334155", "solid")
add_text(330, 407, "How It Works ➔", 13, "#cbd5e1")
add_rect(470, 400, 120, 30, "#059669", "#047857", "solid")
add_text(485, 407, "Login / Sign In", 13, "#ffffff")

# Landing Features Grid (3 cards)
add_rect(150, 455, 195, 130, "#475569", "#1e293b", "solid")
add_text(160, 470, "🎙️ Multilingual AI", 13, "#38bdf8")
add_text(160, 495, "Speak in native dialect\n(Hindi, Tamil, Telugu)\nGet spoken guidance.", 11, "#94a3b8")

add_rect(360, 455, 195, 130, "#475569", "#1e293b", "solid")
add_text(370, 470, "📄 Vision OCR", 13, "#a78bfa")
add_text(370, 495, "Upload messy doctor Rx\nAuto-converts to voice\nmedication alarms.", 11, "#94a3b8")

add_rect(570, 455, 200, 130, "#475569", "#1e293b", "solid")
add_text(580, 470, "🩺 ASHA Field Sync", 13, "#34d399")
add_text(580, 495, "Offline door-to-door\nhealth registry & instant\ndoctor tele-referrals.", 11, "#94a3b8")

# Public Emergency Card button on Landing Page
add_rect(150, 605, 620, 50, "#ef4444", "#450a0a", "solid", stroke_width=1.5)
add_text(170, 620, "🚨 Emergency Patient Card Scanner (Public Emergency Access)", 14, "#fca5a5")
add_rect(640, 615, 110, 30, "#dc2626", "#991b1b", "solid")
add_text(655, 622, "Scan QR ➔", 12, "#ffffff")

# Landing Page Annotations
add_text(130, 745, "ANNOTATION: Landing Page Navigation Triggers\n• Click 'Get Started' or 'Login' ➔ Opens Auth Gateway (/login)\n• Click 'How It Works' ➔ Smooth scrolls to system pipeline\n• Click 'Scan QR' ➔ Opens Public Emergency Card without login", 12, "#93c5fd")

# 1.2 Auth & Register Screen (/login, /register)
add_rect(130, 830, 660, 530, "#d1d5db", "#18181b", "solid", stroke_width=1.5)
add_rect(130, 830, 660, 45, "#4b5563", "#27272a", "solid")
add_text(150, 842, "🔐 Auth Gateway & Role Classifier (/login, /register)", 15, "#fbbf24")

# Login Form Inputs
add_text(160, 895, "Enter Phone Number / ABHA ID / Email:", 13, "#ffffff")
add_rect(160, 920, 600, 38, "#6b7280", "#27272a", "solid")
add_text(175, 930, "+91 98765 43210  |  14-Digit ABHA ID", 13, "#9ca3af")

add_text(160, 975, "Select Your Portal Role:", 14, "#ffffff")
# 4 Role Selectors
add_rect(160, 1005, 135, 75, "#10b981", "#064e3b", "solid", stroke_width=2)
add_text(175, 1020, "📱 Patient", 14, "#34d399")
add_text(175, 1045, "Voice & Health Vault", 10, "#a7f3d0")

add_rect(315, 1005, 140, 75, "#f59e0b", "#78350f", "solid", stroke_width=2)
add_text(325, 1020, "🩺 ASHA Worker", 14, "#fbbf24")
add_text(325, 1045, "Field Registry & Vitals", 10, "#fde68a")

add_rect(470, 1005, 135, 75, "#8b5cf6", "#4c1d95", "solid", stroke_width=2)
add_text(485, 1020, "👨‍⚕️ Doctor", 14, "#c084fc")
add_text(485, 1045, "Tele-Triage & Rx", 10, "#ddd6fe")

add_rect(620, 1005, 140, 75, "#ec4899", "#831843", "solid", stroke_width=2)
add_text(635, 1020, "🤝 Caregiver", 14, "#f472b6")
add_text(635, 1045, "Family Adherence", 10, "#fbcfe8")

# OTP & Submit Button
add_rect(160, 1100, 600, 38, "#6b7280", "#27272a", "solid")
add_text(175, 1110, "Enter 6-Digit OTP received on Mobile...", 13, "#9ca3af")

add_rect(160, 1155, 600, 45, "#2563eb", "#1d4ed8", "solid")
add_text(370, 1168, "Verify OTP & Enter Portal ➔", 15, "#ffffff")

# Role Guard Routing Logic Box
add_rect(160, 1220, 600, 120, "#334155", "#0f172a", "solid")
add_text(175, 1235, "🔀 Auth Guard (routes.jsx) Redirection Logic:", 13, "#38bdf8")
add_text(175, 1260, "• If Role == 'patient' ➔ Redirects to /app/patient (PatientDashboard)\n• If Role == 'healthcare_worker' ➔ Redirects to /app/asha (AshaDashboard)\n• If Role == 'doctor' ➔ Redirects to /app/doctor (DoctorDashboard)\n• If Role == 'caregiver' ➔ Redirects to /app/caregiver (CaregiverDashboard)", 12, "#cbd5e1")

# 1.3 Public Emergency Health Card (/emergency-card/:id)
add_rect(130, 1420, 660, 420, "#ef4444", "#18181b", "solid", stroke_width=2)
add_rect(130, 1420, 660, 45, "#991b1b", "#7f1d1d", "solid")
add_text(150, 1432, "🚨 Public Emergency Card (/emergency-card/:id) — No Login Required", 15, "#fca5a5")

add_rect(155, 1485, 140, 140, "#ffffff", "#ffffff", "solid")
add_text(175, 1540, "[QR CODE]", 16, "#000000")

add_rect(315, 1485, 445, 140, "#1e293b", "#0f172a", "solid")
add_text(330, 1500, "Patient: Ramesh Kumar  |  Age: 58  |  Blood: O+", 14, "#ffffff")
add_text(330, 1525, "⚠️ Critical Conditions: Type 2 Diabetes, Hypertension", 12, "#f87171")
add_text(330, 1545, "🚫 Drug Allergies: Penicillin, Sulfa", 12, "#fca5a5")
add_text(330, 1565, "📞 Emergency Contact: +91 98765 11223 (Son)", 12, "#34d399")
add_text(330, 1585, "🏥 Assigned PHC: Rampur Primary Health Center", 12, "#38bdf8")

add_rect(155, 1645, 290, 40, "#dc2626", "#b91c1c", "solid")
add_text(180, 1657, "📞 Call 108 Ambulance", 14, "#ffffff")

add_rect(470, 1645, 290, 40, "#2563eb", "#1d4ed8", "solid")
add_text(495, 1657, "📍 Share Live Location", 14, "#ffffff")

add_text(130, 1720, "ANNOTATION: Emergency Access Protocol\n• First responders/neighbors scan the QR on the patient's card\n• Instantly reveals life-saving allergies, medications, and blood group\n• Zero authentication barriers during critical golden-hour emergencies", 12, "#fca5a5")

# Auth Arrows to Sections
add_arrow(760, 1025, 950, 400, "#f59e0b", "solid", 2.5) # Auth to ASHA
add_arrow(760, 1010, 2150, 400, "#10b981", "solid", 2.5) # Auth to Patient
add_arrow(760, 1040, 3350, 400, "#8b5cf6", "solid", 2.5) # Auth to Doctor

# ==============================================================================
# SECTION 2: ASHA HEALTHCARE WORKER PORTAL (X: 900 to 2050)
# ==============================================================================
add_rect(880, 160, 1180, 2200, "#f59e0b", "#111827", "solid", stroke_width=2, stroke_style="dashed")
add_rect(900, 180, 1140, 45, "#b45309", "#92400e", "solid")
add_text(920, 192, "SECTION 2: ASHA / RURAL HEALTHCARE WORKER FIELD PORTAL (EVERY PAGE & MODAL)", 17, "#ffffff")

# 2.1 ASHA Field Dashboard (/app/asha)
add_rect(910, 250, 540, 460, "#d1d5db", "#18181b", "solid", stroke_width=1.5)
add_rect(910, 250, 540, 45, "#4b5563", "#27272a", "solid")
add_text(925, 262, "🩺 ASHA Field Dashboard (/app/asha)", 15, "#fbbf24")
add_text(1310, 262, "🟢 Offline Sync Ready", 12, "#34d399")

# Stats Metric Row
add_rect(930, 310, 115, 65, "#3b82f6", "#1e3a8a", "solid")
add_text(940, 325, "Total Patients", 11, "#bfdbfe")
add_text(940, 350, "48", 20, "#ffffff")

add_rect(1060, 310, 115, 65, "#ef4444", "#7f1d1d", "solid")
add_text(1070, 325, "High-Risk", 11, "#fecaca")
add_text(1070, 350, "🔴 3 Alerts", 15, "#ffffff")

add_rect(1190, 310, 115, 65, "#10b981", "#064e3b", "solid")
add_text(1200, 325, "Visits Today", 11, "#a7f3d0")
add_text(1200, 350, "6 Done", 18, "#ffffff")

add_rect(1320, 310, 115, 65, "#8b5cf6", "#4c1d95", "solid")
add_text(1330, 325, "Pending Rx", 11, "#ddd6fe")
add_text(1330, 350, "2 Due", 18, "#ffffff")

# ASHA Fast Action Buttons (Every Button Mapped)
add_text(930, 395, "ASHA Fast Action Bar (Clickable Triggers):", 13, "#ffffff")

add_rect(930, 420, 240, 40, "#8b5cf6", "#6d28d9", "solid")
add_text(945, 432, "➕ Register New ABHA ➔", 13, "#ffffff")

add_rect(1190, 420, 245, 40, "#059669", "#047857", "solid")
add_text(1205, 432, "🗺️ Open Village Route Map ➔", 13, "#ffffff")

add_rect(930, 475, 240, 40, "#d97706", "#b45309", "solid")
add_text(945, 487, "💓 Record Patient Vitals ➔", 13, "#ffffff")

add_rect(1190, 475, 245, 40, "#dc2626", "#991b1b", "solid")
add_text(1205, 487, "🚑 Emergency Doctor Referral ➔", 13, "#ffffff")

# Scheduled Visits Today
add_rect(930, 530, 505, 120, "#334155", "#0f172a", "solid")
add_text(945, 545, "📅 Today's Village House Visits (Rampur Sector 4):", 12, "#38bdf8")
add_text(945, 568, "1. Sunita Devi (House #12) — Trimester 3 BP Check ➔ [Check IN]", 11, "#fca5a5")
add_text(945, 588, "2. Ramesh Kumar (House #18) — Sugar Test & Rx Delivery", 11, "#fde68a")
add_text(945, 608, "3. Ananya (House #24) — Polio Booster Immunization", 11, "#a7f3d0")

add_text(910, 675, "ANNOTATION: ASHA Dashboard Features\n• IndexedDB caches all 48 village patient records offline\n• Clicking any action button immediately opens full modal overlay", 11, "#fbbf24")

# 2.2 Village Registry Page (/app/asha/patients)
add_rect(1480, 250, 560, 460, "#d1d5db", "#18181b", "solid", stroke_width=1.5)
add_rect(1480, 250, 560, 45, "#4b5563", "#27272a", "solid")
add_text(1495, 262, "👥 Village Registry (/app/asha/patients)", 15, "#fbbf24")

# Search and filter tabs
add_rect(1500, 310, 320, 35, "#6b7280", "#27272a", "solid")
add_text(1515, 320, "🔍 Search Name, ABHA, House #...", 12, "#9ca3af")
add_rect(1835, 310, 95, 35, "#ef4444", "#7f1d1d", "solid")
add_text(1845, 320, "🔴 High-Risk", 11, "#ffffff")
add_rect(1940, 310, 85, 35, "#10b981", "#064e3b", "solid")
add_text(1950, 320, "All (48)", 11, "#ffffff")

# Patient Cards inside Registry (3 rows)
add_rect(1500, 360, 525, 60, "#475569", "#1e293b", "solid")
add_text(1515, 375, "👤 Sunita Devi | Age: 32 (Preg T3)", 13, "#ffffff")
add_text(1515, 395, "BP: 145/95 🔴 High Risk", 11, "#f87171")
add_rect(1840, 370, 80, 30, "#d97706", "#b45309", "solid")
add_text(1850, 378, "Log Vitals", 11, "#ffffff")
add_rect(1930, 370, 80, 30, "#3b82f6", "#1e3a8a", "solid")
add_text(1940, 378, "Details ➔", 11, "#ffffff")

add_rect(1500, 430, 525, 60, "#475569", "#1e293b", "solid")
add_text(1515, 445, "👤 Ramesh Kumar | Age: 58 (Diabetic)", 13, "#ffffff")
add_text(1515, 465, "Glucose: 160 mg/dL 🟡 Follow-up Due", 11, "#fde68a")
add_rect(1840, 440, 80, 30, "#d97706", "#b45309", "solid")
add_text(1850, 448, "Log Vitals", 11, "#ffffff")
add_rect(1930, 440, 80, 30, "#3b82f6", "#1e3a8a", "solid")
add_text(1940, 448, "Details ➔", 11, "#ffffff")

add_rect(1500, 500, 525, 60, "#475569", "#1e293b", "solid")
add_text(1515, 515, "👤 Ananya Sharma | Age: 4 (Immunization)", 13, "#ffffff")
add_text(1515, 535, "Vitals: Normal 🟢 Up to Date", 11, "#a7f3d0")
add_rect(1840, 510, 80, 30, "#d97706", "#b45309", "solid")
add_text(1850, 518, "Log Vitals", 11, "#ffffff")
add_rect(1930, 510, 80, 30, "#3b82f6", "#1e3a8a", "solid")
add_text(1940, 518, "Details ➔", 11, "#ffffff")

# Registry Action Buttons
add_rect(1500, 580, 255, 40, "#8b5cf6", "#6d28d9", "solid")
add_text(1520, 592, "+ Register New Patient (ABHA)", 12, "#ffffff")
add_rect(1770, 580, 255, 40, "#059669", "#047857", "solid")
add_text(1790, 592, "📲 Scan ABHA QR Code", 12, "#ffffff")

add_text(1480, 645, "ANNOTATION: Village Registry Actions\n• Clicking 'Details ➔' opens PatientDetailModal with complete history\n• Clicking 'Log Vitals' opens RecordVitalsModal", 11, "#fbbf24")

# 2.3 ASHA MODALS CLUSTER (Every Modal Mapped)
# Modal 1: AbhaRegistrationModal
add_rect(910, 750, 360, 270, "#8b5cf6", "#18181b", "solid", stroke_width=1.5)
add_rect(910, 750, 360, 35, "#6d28d9", "#5b21b6", "solid")
add_text(925, 760, "🪪 Modal: [AbhaRegistrationModal]", 13, "#ffffff")
add_text(925, 800, "1. Enter 12-Digit Aadhaar / Mobile", 12, "#cbd5e1")
add_rect(925, 820, 330, 30, "#6b7280", "#27272a", "solid")
add_text(935, 828, "XXXX - XXXX - 4829", 12, "#9ca3af")
add_text(925, 865, "2. Request Aadhaar OTP ➔ Enter OTP", 12, "#cbd5e1")
add_rect(925, 885, 330, 30, "#6b7280", "#27272a", "solid")
add_text(935, 893, "OTP: 8 4 9 2 0 1", 12, "#34d399")
add_rect(925, 930, 330, 40, "#10b981", "#059669", "solid")
add_text(945, 942, "✓ Issue 14-Digit ABHA Card & Save", 13, "#ffffff")
add_text(925, 985, "• Auto-links to ABDM Gateway and village roster", 10, "#a7f3d0")

# Modal 2: RecordVitalsModal
add_rect(1300, 750, 360, 270, "#d97706", "#18181b", "solid", stroke_width=1.5)
add_rect(1300, 750, 360, 35, "#b45309", "#92400e", "solid")
add_text(1315, 760, "💓 Modal: [RecordVitalsModal]", 13, "#ffffff")
add_text(1315, 795, "Patient: Sunita Devi (House #12)", 12, "#ffffff")
add_text(1315, 820, "Systolic / Diastolic BP: [ 145 ] / [ 95 ] mmHg", 11, "#f87171")
add_text(1315, 845, "Blood Glucose: [ 110 ] mg/dL  |  SpO2: [ 98% ]", 11, "#cbd5e1")
add_text(1315, 870, "Temperature: [ 98.6 F ]  |  Pulse: [ 82 bpm ]", 11, "#cbd5e1")
add_rect(1315, 895, 330, 30, "#475569", "#334155", "solid")
add_text(1330, 903, "🎙️ Record Voice Memo (Audio Notes)", 11, "#38bdf8")
add_rect(1315, 940, 330, 40, "#d97706", "#b45309", "solid")
add_text(1345, 952, "Save Vitals & Sync to Cloud ➔", 13, "#ffffff")
add_text(1315, 995, "⚡ If BP > 140/90, triggers High-Risk Flag", 10, "#fca5a5")

# Modal 3: VisitRouteMapModal
add_rect(1690, 750, 350, 270, "#059669", "#18181b", "solid", stroke_width=1.5)
add_rect(1690, 750, 350, 35, "#047857", "#064e3b", "solid")
add_text(1705, 760, "🗺️ Modal: [VisitRouteMapModal]", 13, "#ffffff")
add_rect(1705, 795, 320, 100, "#334155", "#0f172a", "solid")
add_text(1720, 810, "📍 GPS Village Navigation Map:", 11, "#38bdf8")
add_text(1720, 830, "Pin 1: Sunita Devi ➔ Pin 2: Ramesh ➔ Pin 3: Ananya", 10, "#ffffff")
add_text(1720, 855, "Walking distance: 1.4 km  |  Est. Time: 45 min", 10, "#fbbf24")
add_text(1720, 875, "✓ Offline Map tiles cached in device", 10, "#34d399")
add_rect(1705, 910, 155, 35, "#10b981", "#059669", "solid")
add_text(1725, 920, "Check IN ➔", 12, "#ffffff")
add_rect(1870, 910, 155, 35, "#f59e0b", "#92400e", "solid")
add_text(1885, 920, "Check OUT ➔", 12, "#ffffff")
add_text(1705, 965, "Upon Check IN: records GPS timestamp", 10, "#9ca3af")
add_text(1705, 985, "Upon Check OUT: changes red dot to green 🟢", 10, "#34d399")

# 2.4 ASHA Additional Pages: Visits, Tasks, Referrals, Coordination
# Visits Page
add_rect(910, 1060, 540, 280, "#d1d5db", "#18181b", "solid", stroke_width=1.5)
add_rect(910, 1060, 540, 35, "#4b5563", "#27272a", "solid")
add_text(925, 1072, "📍 Visits Page (/app/asha/visits)", 14, "#fbbf24")
add_text(925, 1110, "• Active Visit Timeline & Check-in History", 12, "#ffffff")
add_text(925, 1135, "• Filter: Completed (6)  |  Pending (3)  |  Missed (0)", 11, "#9ca3af")
add_text(925, 1160, "• Direct button to re-open [VisitRouteMapModal]", 11, "#38bdf8")
add_rect(925, 1190, 505, 40, "#10b981", "#047857", "solid")
add_text(1050, 1202, "Start Next Scheduled Visit ➔", 13, "#ffffff")
add_text(925, 1245, "Logs GPS coordinates for verified doorstep healthcare delivery", 10, "#a7f3d0")

# Tasks & Follow-ups Page (ASHAWorkerTaskManager.jsx)
add_rect(1480, 1060, 560, 280, "#d1d5db", "#18181b", "solid", stroke_width=1.5)
add_rect(1480, 1060, 560, 35, "#4b5563", "#27272a", "solid")
add_text(1495, 1072, "📋 Tasks & Follow-Ups (/app/asha/follow-ups)", 14, "#fbbf24")
add_text(1495, 1110, "• ASHA Daily Task Manager (Vaccines, Refills, Antenatal)", 12, "#ffffff")
add_text(1495, 1135, "• Task 1: Deliver Metformin 500mg to Ramesh Kumar ➔ [Mark Done]", 11, "#fde68a")
add_text(1495, 1160, "• Task 2: Check Sunita Devi BP follow-up ➔ [Schedule Visit]", 11, "#fca5a5")
add_text(1495, 1185, "• Task 3: Polio Camp announcement in Sector 4 ➔ [Complete]", 11, "#a7f3d0")
add_rect(1495, 1220, 525, 40, "#3b82f6", "#1e3a8a", "solid")
add_text(1640, 1232, "+ Create Custom Task / Reminder", 13, "#ffffff")

# Referrals Page & Coordination Page
add_rect(910, 1370, 540, 320, "#dc2626", "#18181b", "solid", stroke_width=1.5)
add_rect(910, 1370, 540, 35, "#991b1b", "#7f1d1d", "solid")
add_text(925, 1382, "🚑 Referrals Page & Modal (/app/asha/referrals)", 14, "#fca5a5")
add_text(925, 1420, "Active Referrals Sent to PHC Medical Officer:", 12, "#ffffff")
add_text(925, 1445, "• Sunita Devi (Urgency: Critical BP 145/95) ➔ Status: In Doctor Queue", 11, "#fca5a5")
add_text(925, 1470, "• Ramesh Kumar (Urgency: Moderate) ➔ Status: Rx Approved ✓", 11, "#a7f3d0")
add_rect(925, 1500, 505, 40, "#dc2626", "#b91c1c", "solid")
add_text(1020, 1512, "➕ Open [CreateReferralModal] ➔", 13, "#ffffff")
add_text(925, 1555, "Inside CreateReferralModal:\n• Select Symptoms, Attach Vitals + Voice Note\n• Urgency: Normal / Urgent / Emergency\n• Select Receiving PHC / CHC Hospital", 11, "#cbd5e1")

add_rect(1480, 1370, 560, 320, "#8b5cf6", "#18181b", "solid", stroke_width=1.5)
add_rect(1480, 1370, 560, 35, "#6d28d9", "#5b21b6", "solid")
add_text(1495, 1382, "💬 Doctor Coordination & Tele-Chat (/app/asha/coordination)", 14, "#ddd6fe")
add_text(1495, 1420, "Direct Link to PHC Medical Officer (Dr. Sharma):", 12, "#ffffff")
add_text(1495, 1445, "• Doctor: 'Give Sunita Labetalol 100mg immediately and keep resting.'", 11, "#34d399")
add_text(1495, 1470, "• ASHA: 'Logged vitals, BP re-checked at 138/88.'", 11, "#cbd5e1")
add_rect(1495, 1500, 525, 40, "#8b5cf6", "#6d28d9", "solid")
add_text(1600, 1512, "📞 Open [DoctorTeleChatModal] (Call/Chat)", 13, "#ffffff")
add_text(1495, 1555, "• Live audio/video and text tele-consultation\n• Doctor sends verified digital advice directly to ASHA tablet", 11, "#ddd6fe")

# ASHA Profile Page
add_rect(910, 1720, 1130, 150, "#475569", "#18181b", "solid", stroke_width=1.5)
add_rect(910, 1720, 1130, 35, "#334155", "#1e293b", "solid")
add_text(925, 1732, "⚙️ ASHA Worker Profile & Settings (/app/asha/profile)", 14, "#ffffff")
add_text(925, 1770, "Worker: Smt. Pushpa Devi  |  ASHA ID: ASHA-UP-8492  |  Assigned Village: Rampur (Pop: 1,420)", 12, "#cbd5e1")
add_text(925, 1795, "Sync Settings: Cloud Auto-Sync [ON]  |  Offline Database Size: 4.2 MB  |  Last Sync: 2 mins ago", 12, "#34d399")
add_rect(925, 1820, 200, 35, "#2563eb", "#1d4ed8", "solid")
add_text(950, 1830, "🔄 Force Cloud Sync Now", 12, "#ffffff")
add_rect(1140, 1820, 180, 35, "#dc2626", "#991b1b", "solid")
add_text(1180, 1830, "🚪 Log Out", 12, "#ffffff")

# Connector Arrows from ASHA to Doctor & Patient
add_arrow(1440, 1520, 3350, 600, "#dc2626", "solid", 2.5) # Referral to Doctor Queue
add_arrow(1440, 955, 2150, 900, "#34d399", "solid", 2.0) # Vitals Sync to Patient Vault

# ==============================================================================
# SECTION 3: PATIENT EMPOWERMENT PORTAL (X: 2100 to 3250)
# ==============================================================================
add_rect(2080, 160, 1180, 2200, "#10b981", "#111827", "solid", stroke_width=2, stroke_style="dashed")
add_rect(2100, 180, 1140, 45, "#047857", "#064e3b", "solid")
add_text(2120, 192, "SECTION 3: PATIENT EMPOWERMENT PORTAL (VOICE ASSISTANT, OCR & HEALTH VAULT)", 17, "#ffffff")

# 3.1 Patient Dashboard (/app/patient, /app/patient/care)
add_rect(2110, 250, 540, 480, "#d1d5db", "#18181b", "solid", stroke_width=1.5)
add_rect(2110, 250, 540, 45, "#4b5563", "#27272a", "solid")
add_text(2125, 262, "📱 Patient Dashboard (/app/patient)", 15, "#34d399")
add_text(2510, 262, "🌐 Hindi (हिंदी) ▼", 12, "#fbbf24")

# Patient Greeting & Health Score
add_rect(2130, 310, 500, 75, "#065f46", "#022c22", "solid")
add_text(2145, 325, "नमस्ते Ramesh Kumar! Your Health Score: 85%", 14, "#34d399")
add_text(2145, 350, "ASHA Worker Last Visit: Yesterday (BP 128/84 Normal ✓)", 11, "#a7f3d0")

# Big Voice Mic Action (SwasthyaMitr AI Launcher)
add_rect(2130, 395, 500, 110, "#3b82f6", "#1e293b", "solid", stroke_width=2)
add_ellipse(2150, 410, 55, 55, "#38bdf8", "#0284c7", "solid")
add_text(2165, 422, "🎙️", 24, "#ffffff")
add_text(2220, 415, "SwasthyaMitr AI Voice Assistant", 15, "#38bdf8")
add_text(2220, 440, "Tap to ask in Hindi, Tamil, Telugu, Marathi\n'Dawaai kab leni hai?' / 'Dard ho raha hai'", 11, "#cbd5e1")
add_rect(2500, 445, 115, 30, "#2563eb", "#1d4ed8", "solid")
add_text(2515, 452, "Speak Now ➔", 11, "#ffffff")

# Today's Medication Schedule
add_text(2130, 520, "Today's Dosage Tracker (Morning / Noon / Night):", 13, "#ffffff")

add_rect(2130, 545, 240, 80, "#10b981", "#064e3b", "solid")
add_text(2145, 558, "☀️ Morning Dose", 12, "#34d399")
add_text(2145, 580, "Metformin 500mg (1 Tab)\n✓ Taken at 8:30 AM", 10, "#cbd5e1")

add_rect(2390, 545, 240, 80, "#f59e0b", "#78350f", "solid")
add_text(2405, 558, "🌙 Night Dose", 12, "#fbbf24")
add_text(2405, 580, "Amlodipine 5mg (1 Tab)\n⏳ Due at 9:00 PM", 10, "#cbd5e1")

# Quick Navigation Grid
add_rect(2130, 640, 115, 40, "#8b5cf6", "#6d28d9", "solid")
add_text(2145, 652, "📄 Scan Rx", 12, "#ffffff")

add_rect(2255, 640, 115, 40, "#059669", "#047857", "solid")
add_text(2270, 652, "📂 Vault", 12, "#ffffff")

add_rect(2380, 640, 115, 40, "#d97706", "#b45309", "solid")
add_text(2395, 652, "🗺️ Health Map", 12, "#ffffff")

add_rect(2505, 640, 125, 40, "#dc2626", "#991b1b", "solid")
add_text(2520, 652, "🚨 Emergency SOS", 12, "#ffffff")

add_text(2110, 705, "ANNOTATION: Patient Dashboard Logic\n• Voice-first design with audio readout icon on every dosage card\n• Large touch targets tailored for rural illiterate & elderly users", 11, "#34d399")

# 3.2 SwasthyaMitr AI Voice Modal (SwasthyaMitrChatModal.jsx)
add_rect(2680, 250, 560, 480, "#3b82f6", "#18181b", "solid", stroke_width=2)
add_rect(2680, 250, 560, 45, "#1d4ed8", "#1e40af", "solid")
add_text(2695, 262, "🎙️ Modal: SwasthyaMitr AI Multilingual Assistant", 15, "#ffffff")

# Chat Dialogue
add_rect(2700, 310, 520, 65, "#334155", "#1e293b", "solid")
add_text(2715, 322, "🗣️ Patient (Voice in Hindi):", 12, "#93c5fd")
add_text(2715, 342, "'Mera sar dard ho raha hai aur chakkar aa rahe hain, kya karun?'", 11, "#ffffff")

add_rect(2700, 385, 520, 95, "#065f46", "#064e3b", "solid")
add_text(2715, 397, "🤖 SwasthyaMitr AI (Spoken Audio + Text):", 12, "#34d399")
add_text(2715, 417, "'Aapka BP pichli baar 145/95 tha. Pehle paani piyein aur araam karein.\nAapki ASHA didi Pushpa ko alert bhej diya gaya hai.'", 11, "#a7f3d0")
add_rect(2715, 448, 140, 25, "#10b981", "#059669", "solid")
add_text(2730, 454, "🔊 Listen to Voice", 11, "#ffffff")

# AI Capabilities Box
add_rect(2700, 490, 520, 110, "#1e293b", "#0f172a", "solid")
add_text(2715, 505, "AI Logic Engine (Bhashini + Groq Llama-3-70B):", 12, "#fbbf24")
add_text(2715, 525, "• Speech-to-Text: Converts local dialect audio to structured text\n• Medical Triage LLM: Analyzes symptoms with strict clinical safety bounds\n• Text-to-Speech: Generates clear, compassionate voice guidance", 10, "#cbd5e1")
add_text(2715, 570, "• Escalation Trigger: Automatically notifies ASHA if red-flag symptoms detected", 10, "#fca5a5")

add_rect(2700, 615, 250, 40, "#dc2626", "#991b1b", "solid")
add_text(2730, 627, "Alert ASHA Worker Now", 12, "#ffffff")
add_rect(2970, 615, 250, 40, "#475569", "#334155", "solid")
add_text(3040, 627, "Close Assistant", 12, "#cbd5e1")

# 3.3 Prescription OCR & Translation Page (/app/patient/translate)
add_rect(2110, 760, 540, 440, "#8b5cf6", "#18181b", "solid", stroke_width=1.5)
add_rect(2110, 760, 540, 35, "#6d28d9", "#5b21b6", "solid")
add_text(2125, 772, "📄 Prescription OCR & Audio Translator (/app/patient/translate)", 14, "#ffffff")

add_rect(2130, 810, 240, 120, "#475569", "#334155", "solid")
add_text(2175, 850, "📷 Upload / Camera\nDoctor Rx Photo", 13, "#cbd5e1", "center")
add_rect(2145, 890, 210, 30, "#8b5cf6", "#6d28d9", "solid")
add_text(2170, 898, "Select Image from Phone", 11, "#ffffff")

add_rect(2385, 810, 245, 120, "#1e293b", "#0f172a", "solid")
add_text(2395, 822, "⚡ AI Extraction (Gemini/Groq):", 11, "#fbbf24")
add_text(2395, 842, "1. Metformin 500mg — 1-0-0 (Morning)", 10, "#34d399")
add_text(2395, 862, "2. Amlodipine 5mg — 0-0-1 (Night)", 10, "#34d399")
add_text(2395, 882, "3. Paracetamol 650mg — SOS Fever", 10, "#cbd5e1")
add_text(2395, 902, "Confidence Score: 98.4% ✓", 10, "#a7f3d0")

add_rect(2130, 945, 500, 70, "#065f46", "#064e3b", "solid")
add_text(2145, 960, "🔊 Spoken Hindi Instructions Generated:", 12, "#34d399")
add_text(2145, 980, "'Metformin subah naashte ke baad ek goli, Amlodipine raat ko sone se pehle.'", 11, "#ffffff")

add_rect(2130, 1025, 240, 40, "#10b981", "#059669", "solid")
add_text(2150, 1037, "✓ Add to Daily Reminders", 12, "#ffffff")
add_rect(2390, 1025, 240, 40, "#2563eb", "#1d4ed8", "solid")
add_text(2410, 1037, "💾 Save to Medical Vault", 12, "#ffffff")

add_text(2110, 1080, "ANNOTATION: Prescription Pipeline\n• Converts messy handwritten doctor slips into structured schedule\n• Automatically pushes reminder alarms to WhatsApp & phone speaker", 11, "#c084fc")

# 3.4 Medical Vault Page (/app/patient/vault)
add_rect(2680, 760, 560, 440, "#059669", "#18181b", "solid", stroke_width=1.5)
add_rect(2680, 760, 560, 35, "#047857", "#064e3b", "solid")
add_text(2695, 772, "📂 Medical Vault & ABDM Health Records (/app/patient/vault)", 14, "#ffffff")

add_rect(2700, 810, 520, 60, "#334155", "#1e293b", "solid")
add_text(2715, 825, "🪪 Ayushman Bharat Health Account (ABHA Linked): 14-8492-3019-4820", 12, "#34d399")
add_text(2715, 845, "Status: Verified Government Health Locker ✓", 10, "#a7f3d0")

add_text(2700, 885, "Stored Medical Records & Lab Reports:", 12, "#ffffff")

add_rect(2700, 905, 520, 50, "#475569", "#1e293b", "solid")
add_text(2715, 915, "📄 Dr. Sharma Prescription (PHC Rampur) — 15 Sept 2026", 11, "#ffffff")
add_text(2715, 935, "Verified Digital Rx with Doctor Signature", 10, "#9ca3af")
add_rect(3120, 915, 85, 28, "#2563eb", "#1d4ed8", "solid")
add_text(3135, 922, "View PDF", 10, "#ffffff")

add_rect(2700, 965, 520, 50, "#475569", "#1e293b", "solid")
add_text(2715, 975, "🧪 Blood Glucose & Lipid Profile Report — 02 Sept 2026", 11, "#ffffff")
add_text(2715, 995, "Fasting Blood Sugar: 110 mg/dL (Normal)", 10, "#34d399")
add_rect(3120, 975, 85, 28, "#2563eb", "#1d4ed8", "solid")
add_text(3135, 982, "View PDF", 10, "#ffffff")

add_rect(2700, 1025, 250, 40, "#8b5cf6", "#6d28d9", "solid")
add_text(2730, 1037, "+ Upload New Medical File", 12, "#ffffff")
add_rect(2970, 1025, 250, 40, "#059669", "#047857", "solid")
add_text(3000, 1037, "🔗 Share Vault with Doctor", 12, "#ffffff")

add_text(2680, 1080, "ANNOTATION: Medical Vault\n• Complies with ABDM M1/M2 specifications for FHIR records\n• Patients own their health data and can share temporary OTP access", 11, "#34d399")

# 3.5 My Health Map & Medication Reminders Pages
# Health Map
add_rect(2110, 1240, 540, 320, "#d97706", "#18181b", "solid", stroke_width=1.5)
add_rect(2110, 1240, 540, 35, "#b45309", "#92400e", "solid")
add_text(2125, 1252, "🗺️ My Health Map & Pharmacy Finder (/app/patient/map)", 14, "#ffffff")
add_rect(2130, 1290, 500, 110, "#334155", "#0f172a", "solid")
add_text(2145, 1305, "📍 GPS Locator for Rural Health Facilities:", 12, "#38bdf8")
add_text(2145, 1325, "1. Pradhan Mantri Jan Aushadhi Kendra (0.8 km) ➔ [Get Directions]", 11, "#34d399")
add_text(2145, 1345, "2. Rampur Primary Health Center (2.1 km) ➔ [Call PHC]", 11, "#fbbf24")
add_text(2145, 1365, "3. Community Health Center CHC (8.5 km) ➔ [Emergency Route]", 11, "#f87171")
add_rect(2130, 1410, 240, 40, "#059669", "#047857", "solid")
add_text(2150, 1422, "Check Generic Medicine Stock", 11, "#ffffff")
add_rect(2390, 1410, 240, 40, "#2563eb", "#1d4ed8", "solid")
add_text(2410, 1422, "Find Nearest Jan Aushadhi", 11, "#ffffff")

# Medication Reminders Page
add_rect(2680, 1240, 560, 320, "#3b82f6", "#18181b", "solid", stroke_width=1.5)
add_rect(2680, 1240, 560, 35, "#1d4ed8", "#1e40af", "solid")
add_text(2695, 1252, "⏰ Medication Reminders & Adherence (/app/patient/reminders)", 14, "#ffffff")
add_text(2700, 1290, "Active Dose Alarms & Notifications:", 12, "#ffffff")
add_rect(2700, 1310, 520, 45, "#1e293b", "#0f172a", "solid")
add_text(2715, 1320, "⏰ 08:30 AM: Metformin 500mg ➔ [Mark Taken ✓] [Snooze 10m]", 11, "#34d399")
add_rect(2700, 1365, 520, 45, "#1e293b", "#0f172a", "solid")
add_text(2715, 1375, "⏰ 09:00 PM: Amlodipine 5mg ➔ [Mark Taken ✓] [Snooze 10m]", 11, "#fbbf24")
add_rect(2700, 1420, 250, 40, "#10b981", "#059669", "solid")
add_text(2730, 1432, "Enable WhatsApp Alerts", 12, "#ffffff")
add_rect(2970, 1420, 250, 40, "#8b5cf6", "#6d28d9", "solid")
add_text(3000, 1432, "Enable Audio Voice Call", 12, "#ffffff")
add_text(2700, 1475, "Adherence Ring: 92% Doses Taken on Time this week!", 11, "#34d399")

# 3.6 Emergency Help Page & Patient Profile
add_rect(2110, 1600, 540, 270, "#ef4444", "#18181b", "solid", stroke_width=1.5)
add_rect(2110, 1600, 540, 35, "#991b1b", "#7f1d1d", "solid")
add_text(2125, 1612, "🚨 Emergency Help Page (/app/patient/emergency)", 14, "#fca5a5")
add_rect(2130, 1650, 500, 60, "#dc2626", "#7f1d1d", "solid")
add_text(2150, 1665, "🔴 ONE-TOUCH SOS: Call 108 Ambulance + Alert ASHA", 14, "#ffffff")
add_text(2150, 1685, "Sends live GPS coordinates via SMS to registered caregiver & ASHA", 10, "#fecaca")
add_rect(2130, 1725, 500, 50, "#334155", "#1e293b", "solid")
add_text(2145, 1740, "🪪 View Public Emergency Health Card (/emergency-card/rem-92)", 12, "#38bdf8")
add_rect(2500, 1735, 115, 30, "#2563eb", "#1d4ed8", "solid")
add_text(2515, 1742, "Open Card ➔", 11, "#ffffff")

add_rect(2680, 1600, 560, 270, "#475569", "#18181b", "solid", stroke_width=1.5)
add_rect(2680, 1600, 560, 35, "#334155", "#1e293b", "solid")
add_text(2695, 1612, "👤 Patient Profile & Settings (/app/patient/profile)", 14, "#ffffff")
add_text(2700, 1650, "Name: Ramesh Kumar  |  ABHA ID: 14-8492-3019-4820", 12, "#ffffff")
add_text(2700, 1675, "Assigned ASHA Worker: Pushpa Devi (+91 98765 43210)", 12, "#fbbf24")
add_text(2700, 1700, "Preferred Language: Hindi (Audio Readout Enabled ✓)", 12, "#34d399")
add_rect(2700, 1730, 250, 40, "#2563eb", "#1d4ed8", "solid")
add_text(2730, 1742, "Edit Profile & Allergies", 12, "#ffffff")
add_rect(2970, 1730, 250, 40, "#dc2626", "#991b1b", "solid")
add_text(3040, 1742, "Log Out", 12, "#ffffff")

# ==============================================================================
# SECTION 4: DOCTOR & CAREGIVER PORTALS (X: 3300 to 4150)
# ==============================================================================
add_rect(3280, 160, 880, 2200, "#8b5cf6", "#111827", "solid", stroke_width=2, stroke_style="dashed")
add_rect(3300, 180, 840, 45, "#6d28d9", "#5b21b6", "solid")
add_text(3320, 192, "SECTION 4: DOCTOR TELE-TRIAGE HUB & CAREGIVER ADHERENCE PORTAL", 17, "#ffffff")

# 4.1 Doctor Dashboard (/app/doctor)
add_rect(3310, 250, 820, 480, "#d1d5db", "#18181b", "solid", stroke_width=1.5)
add_rect(3310, 250, 820, 45, "#4b5563", "#27272a", "solid")
add_text(3325, 262, "👨‍⚕️ Doctor Dashboard & Tele-Triage Queue (/app/doctor)", 15, "#c084fc")
add_text(3950, 262, "Dr. Sharma (MBBS, PHC Rampur)", 12, "#93c5fd")

# Triage Queue Table
add_text(3330, 310, "Incoming Rural Patient Tele-Triage Queue (Sorted by Urgency):", 13, "#ffffff")

add_rect(3330, 335, 780, 75, "#7f1d1d", "#450a0a", "solid", stroke_width=1.5)
add_text(3345, 350, "🔴 P1 CRITICAL: Sunita Devi (Age: 32) — Referred by ASHA Pushpa", 13, "#fca5a5")
add_text(3345, 370, "Vitals: BP 145/95 | SpO2: 98% | Audio Memo: 'Severe headache, 3rd trimester pregnancy'", 11, "#cbd5e1")
add_rect(3950, 345, 140, 35, "#dc2626", "#b91c1c", "solid")
add_text(3965, 355, "Review Case ➔", 12, "#ffffff")

add_rect(3330, 420, 780, 75, "#78350f", "#451a03", "solid", stroke_width=1.5)
add_text(3345, 435, "🟡 P2 MODERATE: Ramesh Kumar (Age: 58) — Diabetic Rx Refill Request", 13, "#fde68a")
add_text(3345, 455, "Vitals: Fasting Sugar 160 mg/dL | Last Rx: Metformin 500mg (Expired)", 11, "#cbd5e1")
add_rect(3950, 430, 140, 35, "#d97706", "#b45309", "solid")
add_text(3965, 440, "Review Case ➔", 12, "#ffffff")

add_rect(3330, 505, 780, 75, "#064e3b", "#022c22", "solid", stroke_width=1.5)
add_text(3345, 520, "🟢 P3 ROUTINE: Vikas Yadav (Age: 62) — Routine Post-Op Checkup", 13, "#a7f3d0")
add_text(3345, 540, "Vitals: BP 122/80 Normal | Wound healing well as per ASHA visit", 11, "#cbd5e1")
add_rect(3950, 515, 140, 35, "#059669", "#047857", "solid")
add_text(3965, 525, "Review Case ➔", 12, "#ffffff")

add_rect(3330, 595, 380, 40, "#8b5cf6", "#6d28d9", "solid")
add_text(3360, 607, "💊 Open Doctor Prescription Wizard ➔", 13, "#ffffff")
add_rect(3730, 595, 380, 40, "#0284c7", "#0369a1", "solid")
add_text(3760, 607, "💬 Open ASHA Tele-Chat Coordination", 13, "#ffffff")

add_text(3310, 655, "ANNOTATION: Doctor Tele-Triage Logic\n• Synthesizes raw field vitals from ASHA into clinical summary\n• Doctor can issue legally compliant ABDM e-prescriptions in 30 seconds", 11, "#c084fc")

# 4.2 Doctor Prescription Wizard & Tele-Chat
add_rect(3310, 760, 820, 460, "#8b5cf6", "#18181b", "solid", stroke_width=1.5)
add_rect(3310, 760, 820, 35, "#6d28d9", "#5b21b6", "solid")
add_text(3325, 772, "💊 Doctor Prescription Wizard (DoctorPrescriptionWizard.jsx)", 14, "#ffffff")

add_text(3330, 810, "Patient: Sunita Devi | ABHA ID: 14-8492-3019-4820", 12, "#34d399")

# Medicine Search & Dosing
add_rect(3330, 835, 450, 35, "#6b7280", "#27272a", "solid")
add_text(3345, 845, "🔍 Search Drug: Labetalol 100mg...", 12, "#ffffff")
add_rect(3790, 835, 150, 35, "#475569", "#334155", "solid")
add_text(3805, 845, "Frequency: 1-0-1", 12, "#cbd5e1")
add_rect(3950, 835, 160, 35, "#475569", "#334155", "solid")
add_text(3965, 845, "Duration: 7 Days", 12, "#cbd5e1")

# Drug Safety & Interaction Check
add_rect(3330, 885, 780, 50, "#065f46", "#064e3b", "solid")
add_text(3345, 897, "✓ Drug Safety Check Passed: Safe for 3rd Trimester Pregnancy | No Allergic Conflicts", 11, "#34d399")

add_text(3330, 950, "Special Instructions for ASHA Worker & Patient (in Hindi):", 12, "#ffffff")
add_rect(3330, 970, 780, 45, "#334155", "#1e293b", "solid")
add_text(3345, 982, "'Subah shaam khana khane ke baad lein. 2 din baad ASHA didi se BP dobara check karwayein.'", 11, "#cbd5e1")

# Submit & Sync buttons
add_rect(3330, 1030, 380, 45, "#10b981", "#059669", "solid")
add_text(3360, 1045, "✍️ Sign & Push Digital Rx to Patient ➔", 13, "#ffffff")
add_rect(3730, 1030, 380, 45, "#2563eb", "#1d4ed8", "solid")
add_text(3760, 1045, "💬 Send Order Directly to ASHA Chat", 13, "#ffffff")

add_text(3310, 1100, "ANNOTATION: One-Click Sync Pipeline\n• Digitally signed prescription pushes instantly to Patient's Medical Vault\n• Automatically creates morning/night voice reminder alarms on Patient phone\n• Dispatches follow-up task to ASHA Worker's daily visit checklist", 11, "#a78bfa")

# 4.3 Caregiver Portal (/app/caregiver)
add_rect(3310, 1260, 820, 380, "#ec4899", "#18181b", "solid", stroke_width=1.5)
add_rect(3310, 1260, 820, 35, "#be185d", "#9d174d", "solid")
add_text(3325, 1272, "🤝 Caregiver Dashboard (/app/caregiver) — Remote Family Monitoring", 14, "#fbcfe8")

add_text(3330, 1310, "Linked Family Members (Elderly Parents / Relatives):", 12, "#ffffff")

add_rect(3330, 335 + 1000, 780, 70, "#334155", "#1e293b", "solid")
add_text(3345, 350 + 1000, "👤 Father: Ramesh Kumar (Age: 58, Rampur Village)", 13, "#ffffff")
add_text(3345, 370 + 1000, "Today's Adherence: ☀️ Morning Dose Taken ✓  |  🌙 Night Dose: Pending", 11, "#34d399")
add_rect(3950, 345 + 1000, 140, 30, "#059669", "#047857", "solid")
add_text(3970, 352 + 1000, "Adherence: 95%", 11, "#ffffff")

add_rect(3330, 415 + 1000, 780, 70, "#334155", "#1e293b", "solid")
add_text(3345, 430 + 1000, "👤 Mother: Geeta Devi (Age: 54, Rampur Village)", 13, "#ffffff")
add_text(3345, 450 + 1000, "Today's Adherence: ⚠️ Missed Morning BP Medicine (Alert Sent to WhatsApp)", 11, "#f87171")
add_rect(3950, 425 + 1000, 140, 30, "#dc2626", "#991b1b", "solid")
add_text(3970, 432 + 1000, "Send Reminder", 11, "#ffffff")

add_rect(3330, 1510, 380, 40, "#ec4899", "#be185d", "solid")
add_text(3380, 1522, "📞 Call Assigned ASHA Worker", 12, "#ffffff")
add_rect(3730, 1510, 380, 40, "#2563eb", "#1d4ed8", "solid")
add_text(3780, 1522, "📊 View 30-Day Health Trends", 12, "#ffffff")

add_text(3310, 1570, "ANNOTATION: Caregiver Peace of Mind\n• Enables migrant children working in cities to monitor parents in rural villages\n• Automatic SMS/WhatsApp alerts if elderly parents miss doses", 11, "#f472b6")

# 4.4 Doctor & Caregiver Profiles
add_rect(3310, 1680, 820, 180, "#475569", "#18181b", "solid", stroke_width=1.5)
add_rect(3310, 1680, 820, 35, "#334155", "#1e293b", "solid")
add_text(3325, 1692, "⚙️ Doctor & Caregiver Profiles (/app/doctor/profile, /app/caregiver/profile)", 14, "#ffffff")
add_text(3330, 1730, "Doctor Credentials: MCI-Reg: 84920-A  |  Hospital: PHC Rampur  |  Digital Signature: Active ✓", 12, "#cbd5e1")
add_text(3330, 1755, "Caregiver Link: Verified OTP Proxy for Ramesh Kumar & Geeta Devi", 12, "#34d399")
add_rect(3330, 1785, 200, 35, "#2563eb", "#1d4ed8", "solid")
add_text(3360, 1795, "Update Clinic Settings", 11, "#ffffff")
add_rect(3550, 1785, 180, 35, "#dc2626", "#991b1b", "solid")
add_text(3600, 1795, "Log Out", 11, "#ffffff")

# Connector Arrows from Doctor to Patient
add_arrow(3330, 1045, 2680, 920, "#10b981", "solid", 2.5) # Rx Push to Patient Vault
add_arrow(3330, 1055, 1440, 1440, "#8b5cf6", "solid", 2.0) # Rx Advice to ASHA Chat

# ==============================================================================
# SECTION 5: BACKEND AI, ABDM & OFFLINE ENGINE (Y: 2420 to 2650)
# ==============================================================================
add_rect(100, 2420, 4100, 220, "#334155", "#0f172a", "solid", stroke_width=2)
add_rect(120, 2435, 4060, 40, "#1e293b", "#0f172a", "solid")
add_text(140, 2448, "⚡ BACKEND AI ENGINES, GOVERNMENT ABDM STANDARDS & RURAL OFFLINE PROTOCOLS", 17, "#38bdf8")

add_rect(140, 2495, 960, 120, "#1e293b", "#111827", "solid")
add_text(160, 2515, "1. Gemini 1.5 & Groq Llama-Vision OCR Pipeline", 14, "#fbbf24")
add_text(160, 2540, "• Scans doctor handwriting with 98%+ accuracy across rural regional prescriptions\n• Extracts Drug Name, Strength (mg/ml), Frequency, and Duration\n• Auto-generates structured JSON for dosage alarm schedulers", 11, "#cbd5e1")

add_rect(1140, 2495, 960, 120, "#1e293b", "#111827", "solid")
add_text(1160, 2515, "2. Bhashini & Whisper Multilingual Speech Engine", 14, "#34d399")
add_text(1160, 2540, "• Supports 12+ Indian languages & rural village dialects (Hindi, Tamil, Telugu, Bhojpuri)\n• Conversational AI Assistant with zero-latency speech streaming\n• Generates spoken dosage instructions for illiterate elderly patients", 11, "#cbd5e1")

add_rect(2140, 2495, 960, 120, "#1e293b", "#111827", "solid")
add_text(2160, 2515, "3. ABDM / ABHA M1 & M2 Government Gateway", 14, "#60a5fa")
add_text(2160, 2540, "• M1: Aadhaar OTP-based doorstep ABHA Card generation by ASHA workers\n• M2: Seamless FHIR-compliant Electronic Health Record (EHR) linking\n• Privacy-first consent management for sharing records with doctors", 11, "#cbd5e1")

add_rect(3140, 2495, 960, 120, "#1e293b", "#111827", "solid")
add_text(3160, 2515, "4. IndexedDB Offline-First Sync Architecture", 14, "#c084fc")
add_text(3160, 2540, "• Complete local cache of patient roster, GPS map tiles, and vital logs on device\n• ASHA workers can visit remote, zero-connectivity villages with zero data loss\n• Background sync automatically pushes records to cloud upon detecting network", 11, "#cbd5e1")

# SAVE MASTER EXCALIDRAW FILE
excalidraw_data = {
    "type": "excalidraw",
    "version": 2,
    "source": "https://excalidraw.com",
    "elements": elements,
    "appState": {
        "gridSize": None,
        "viewBackgroundColor": "#121212"
    },
    "files": {}
}

output_filename_base = "Healthcare_Assistant_Master_Workflow"
out1 = f"{output_filename_base}.excalidraw"
out2 = f"{output_filename_base}.excalidraw.json"

with open(out1, "w", encoding="utf-8") as f:
    json.dump(excalidraw_data, f, indent=2)

with open(out2, "w", encoding="utf-8") as f:
    json.dump(excalidraw_data, f, indent=2)

# Copy to user's Downloads folder
dest_dir = r"C:\Users\kumar\Downloads"
shutil.copy(out1, os.path.join(dest_dir, out1))
shutil.copy(out2, os.path.join(dest_dir, out2))

print(f"MASTER EXCALIDRAW GENERATED! Total Elements: {len(elements)}")
print(f"Saved to project: {out1} & {out2}")
print(f"Copied to Downloads: {os.path.join(dest_dir, out2)}")
