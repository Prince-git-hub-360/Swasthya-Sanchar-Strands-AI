import json
import uuid
import random

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

def add_text(x, y, text, font_size=16, stroke_color="#ffffff", align="left"):
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
        "fontFamily": 1,  # Virgil hand-drawn font in Excalidraw
        "textAlign": align,
        "verticalAlign": "top",
        "baseline": font_size,
        "containerId": None,
        "originalText": text,
        "lineHeight": 1.25
    }
    elements.append(el)
    return el_id

def add_arrow(start_x, start_y, end_x, end_y, stroke_color="#94a3b8", stroke_style="solid", stroke_width=1):
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

# ================= BUILD EXCALIDRAW WIREFRAME CANVAS =================

# 1. Main Title Top Annotation
add_text(520, 80, "After login the user must land on this page\n(Role: ASHA Field Worker Dashboard)", 18, "#ffffff", "center")

# 2. Main Dashboard Window Frame
add_rect(300, 150, 680, 560, "#d1d5db", "transparent", stroke_width=2)

# Top Navigation Bar
add_rect(300, 150, 680, 50, "#9ca3af", "transparent", stroke_width=1.5)

# Logo & Tabs
add_rect(315, 160, 100, 30, "#3b82f6", "#1e3a8a", "solid", stroke_width=1)
add_text(325, 166, "Swasthya App", 13, "#ffffff")

add_rect(425, 160, 75, 30, "#6b7280", "transparent", stroke_width=1)
add_text(435, 167, "Patients", 13, "#e5e7eb")

add_rect(508, 160, 65, 30, "#6b7280", "transparent", stroke_width=1)
add_text(518, 167, "Visits", 13, "#e5e7eb")

add_rect(581, 160, 75, 30, "#6b7280", "transparent", stroke_width=1)
add_text(591, 167, "Referrals", 13, "#e5e7eb")

# Search Bar
add_rect(670, 160, 220, 30, "#6b7280", "transparent", stroke_width=1)
add_text(685, 167, "🔍 Search by Name / ABHA...", 12, "#9ca3af")

# Profile Avatar (Red/Coral dot in header like in screenshot)
add_ellipse(920, 162, 26, 26, "#f87171", "#ef4444", "solid", stroke_width=1)

# Secondary Sub-Header: Action Bar
add_rect(315, 215, 110, 28, "#8b5cf6", "#6d28d9", "solid", stroke_width=1)
add_text(325, 221, "+ Add ABHA", 12, "#ffffff")

add_rect(435, 215, 110, 28, "#10b981", "#065f46", "solid", stroke_width=1)
add_text(445, 221, "🗺️ Route Map", 12, "#ffffff")

add_rect(555, 215, 120, 28, "#f59e0b", "#92400e", "solid", stroke_width=1)
add_text(565, 221, "💓 Record Vitals", 12, "#ffffff")

# 3. Patient Cards Grid (3x3 grid like the user's Excalidraw screenshot)
card_xs = [325, 540, 755]
card_ys = [260, 405, 550]
patients = [
    ("Sunita Devi", "Age: 32 | Preg T3", "#ef4444"), # Red (High Risk)
    ("Ramesh Kumar", "Age: 58 | Diabetes", "#f59e0b"), # Yellow (Follow-up)
    ("Ananya Sharma", "Age: 4 | Vaccine", "#10b981"), # Green (Normal)
    ("Pooja Patel", "Age: 27 | Anemia", "#f59e0b"),
    ("Vikas Yadav", "Age: 62 | BP/Heart", "#ef4444"),
    ("Meena Bai", "Age: 45 | Checkup", "#10b981"),
    ("Rajesh Singh", "Age: 51 | Post-Op", "#10b981"),
    ("Geeta Devi", "Age: 38 | Antenatal", "#ef4444"),
    ("Amit Verma", "Age: 19 | Fever", "#10b981")
]

idx = 0
for r in range(3):
    for c in range(3):
        x = card_xs[c]
        y = card_ys[r]
        name, info, status_color = patients[idx]
        
        # Card Container
        add_rect(x, y, 200, 125, "#9ca3af", "#18181b", "solid", stroke_width=1)
        
        # Inner Avatar Box
        add_rect(x + 12, y + 15, 45, 45, "#6b7280", "#27272a", "solid", stroke_width=1)
        add_text(x + 20, y + 25, "👤", 20, "#ffffff")
        
        # Patient Name & Info
        add_text(x + 65, y + 16, name, 13, "#ffffff")
        add_text(x + 65, y + 36, info, 10, "#9ca3af")
        
        # Status Indicator Dot (top-right of card like screenshot)
        add_ellipse(x + 175, y + 12, 14, 14, status_color, status_color, "solid", stroke_width=1)
        
        # Mini Action Buttons inside card
        add_rect(x + 12, y + 80, 80, 25, "#3b82f6", "transparent", stroke_width=1)
        add_text(x + 20, y + 86, "Vitals", 11, "#93c5fd")
        
        add_rect(x + 102, y + 80, 85, 25, "#8b5cf6", "transparent", stroke_width=1)
        add_text(x + 112, y + 86, "History", 11, "#c4b5fd")
        
        idx += 1

# ================= SIDE COMPONENTS & ANNOTATIONS (EXACTLY LIKE SCREENSHOT) =================

# --- 1. Left Top Annotation ---
add_text(20, 220, "Make these cards clickable, and on click,\nthe patient full medical information &\nvitals modal should open in a\nview-only / edit mode.", 14, "#e5e7eb")
add_arrow(230, 260, 320, 300, "#cbd5e1", "solid", 1.5)

# --- 2. User Profile Dropdown (Right side like screenshot) ---
add_text(1050, 130, "User Profile Picture (Avatar)", 14, "#ffffff")
add_arrow(1040, 145, 955, 175, "#f87171", "solid", 1.5)

add_rect(1060, 190, 160, 100, "#9ca3af", "#18181b", "solid", stroke_width=1.5)
add_text(1085, 208, "My Profile", 14, "#ffffff")
add_rect(1060, 240, 160, 1, "#6b7280", "transparent", stroke_width=1)
add_text(1085, 258, "Log Out", 14, "#f87171")

add_text(1050, 320, "Clicking the profile picture (avatar) should open a\ndropdown menu with options: My Profile, and Log Out.", 13, "#9ca3af")
add_arrow(1050, 335, 955, 190, "#9ca3af", "dashed", 1)

# --- 3. Check-In & Vitals Logging Box (Right side bottom like screenshot) ---
add_rect(1060, 420, 180, 140, "#6b7280", "#18181b", "solid", stroke_width=1.5)
add_rect(1080, 440, 140, 35, "#10b981", "transparent", stroke_width=1)
add_text(1105, 450, "Check IN ➔", 14, "#34d399")

add_rect(1080, 500, 140, 35, "#f59e0b", "transparent", stroke_width=1)
add_text(1100, 510, "Check OUT ➔", 14, "#fbbf24")

add_text(1270, 435, "Upon successful Check IN / Vitals Log,\nthe red status dot changes\nto green 🟢", 13, "#34d399")
add_arrow(1260, 450, 1225, 455, "#34d399", "solid", 1.5)

add_text(1060, 590, "ASHA workers can mark their village house visit\nusing the Check In/Check Out system, and users\ncan view their attendance and logged vitals\nthrough the Visits module.", 13, "#9ca3af")
add_arrow(1120, 585, 1140, 545, "#9ca3af", "dashed", 1)

# --- 4. Bottom Left Status Indicator Legend ---
add_text(20, 580, "Settings / Indicator Legend:\n\nEach card displays the patient's photo, age & condition.\nAt the top-right corner of each card, an indicator dot shows status:\n\n🟢 Green dot: Vitals normal, up to date\n🟡 Yellow dot: Follow-up due (medicine/routine checkup)\n🔴 Red dot: High Risk (BP > 140/90, Glucose high, or Urgent Referral)", 13, "#cbd5e1")

# ================= SECOND FRAME: PATIENT SWASTHYAMITR VOICE & SCANNER =================
# Add Patient App View below the main frame
add_text(480, 790, "Patient Companion Screen (SwasthyaMitr AI Voice & Rx OCR)", 18, "#34d399", "center")

add_rect(300, 830, 680, 440, "#10b981", "transparent", stroke_width=2)

# Patient Header
add_rect(300, 830, 680, 45, "#047857", "#064e3b", "solid", stroke_width=1)
add_text(320, 842, "नमस्ते Ramesh Kumar | Hindi (हिंदी) ▼", 14, "#ffffff")
add_ellipse(935, 842, 22, 22, "#34d399", "#10b981", "solid")

# Big Voice Mic Hero Card
add_rect(330, 895, 300, 160, "#3b82f6", "#1e293b", "solid", stroke_width=1.5)
add_ellipse(450, 915, 60, 60, "#38bdf8", "#0284c7", "solid", stroke_width=2)
add_text(468, 930, "🎙️", 28, "#ffffff")
add_text(360, 990, "Tap to Speak (SwasthyaMitr AI)", 14, "#38bdf8")
add_text(345, 1015, "Voice assistant in Hindi/Tamil/Telugu", 11, "#94a3b8")

# Prescription OCR Card
add_rect(650, 895, 300, 160, "#8b5cf6", "#1e293b", "solid", stroke_width=1.5)
add_rect(765, 915, 70, 55, "#a78bfa", "#4c1d95", "solid", stroke_width=1.5)
add_text(788, 930, "📄", 24, "#ffffff")
add_text(690, 990, "Scan Doctor's Prescription", 14, "#c084fc")
add_text(675, 1015, "Gemini & Groq OCR converts to audio alarm", 11, "#94a3b8")

# Daily Dosage Pills
add_rect(330, 1075, 620, 160, "#6b7280", "#18181b", "solid", stroke_width=1)
add_text(350, 1090, "Today's Medication Schedule", 14, "#ffffff")

add_rect(350, 1120, 180, 90, "#10b981", "#064e3b", "solid", stroke_width=1)
add_text(365, 1135, "☀️ Morning Dose", 13, "#34d399")
add_text(365, 1160, "Metformin 500mg (1 Tab)\n✓ Taken at 8:30 AM", 11, "#cbd5e1")

add_rect(550, 1120, 180, 90, "#f59e0b", "#78350f", "solid", stroke_width=1)
add_text(565, 1135, "🌙 Night Dose", 13, "#fbbf24")
add_text(565, 1160, "Amlodipine 5mg (1 Tab)\n⏳ Due at 9:00 PM", 11, "#cbd5e1")

add_rect(750, 1120, 180, 90, "#ef4444", "#7f1d1d", "solid", stroke_width=1)
add_text(765, 1135, "🚨 SOS Emergency", 13, "#f87171")
add_text(765, 1160, "Public QR Card\nZero Login Required", 11, "#cbd5e1")

# Left Annotation for Patient Voice Screen
add_text(20, 920, "SwasthyaMitr AI Voice Interaction:\n\n• Zero-literacy elderly patients tap the large mic.\n• They can speak in their regional dialect (Hindi, Tamil, etc.).\n• AI replies with voice instructions on when & how\nto take medicines.", 13, "#38bdf8")
add_arrow(230, 960, 325, 960, "#38bdf8", "solid", 1.5)

# Save Excalidraw JSON
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

with open("Healthcare_Assistant_Excalidraw_Workflow.excalidraw", "w", encoding="utf-8") as f:
    json.dump(excalidraw_data, f, indent=2)

print("Excalidraw file generated successfully! Total elements:", len(elements))
