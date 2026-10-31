import os
import shutil

svg_content = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3800 2400" width="100%" height="100%" style="background-color: #090D16; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <defs>
    <!-- Gradients -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#090D16"/>
      <stop offset="100%" stop-color="#0F172A"/>
    </linearGradient>
    <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3B82F6"/>
      <stop offset="100%" stop-color="#1D4ED8"/>
    </linearGradient>
    <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#10B981"/>
      <stop offset="100%" stop-color="#047857"/>
    </linearGradient>
    <linearGradient id="amberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F59E0B"/>
      <stop offset="100%" stop-color="#B45309"/>
    </linearGradient>
    <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8B5CF6"/>
      <stop offset="100%" stop-color="#6D28D9"/>
    </linearGradient>
    <linearGradient id="pinkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#EC4899"/>
      <stop offset="100%" stop-color="#BE185D"/>
    </linearGradient>
    <linearGradient id="redGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#EF4444"/>
      <stop offset="100%" stop-color="#B91C1C"/>
    </linearGradient>
    <linearGradient id="darkCard" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E293B"/>
      <stop offset="100%" stop-color="#0F172A"/>
    </linearGradient>

    <!-- Drop Shadows -->
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="10" stdDeviation="8" flood-color="#000000" flood-opacity="0.5"/>
    </filter>

    <!-- Arrow Markers -->
    <marker id="arr-blue" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38BDF8"/>
    </marker>
    <marker id="arr-green" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#34D399"/>
    </marker>
    <marker id="arr-amber" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#FBBF24"/>
    </marker>
    <marker id="arr-purple" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#C084FC"/>
    </marker>
    <marker id="arr-pink" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#F472B6"/>
    </marker>
  </defs>

  <!-- ================= CANVAS MASTER HEADER ================= -->
  <g transform="translate(80, 50)" filter="url(#shadow)">
    <rect x="0" y="0" width="3640" height="100" rx="16" fill="url(#darkCard)" stroke="#334155" stroke-width="2"/>
    <text x="40" y="60" fill="#38BDF8" font-size="28" font-weight="800">🏥 SWASTHYA SAHAYAK AI — COMPLETE END-TO-END FIGMA WORKFLOW &amp; DATA ENGINE BLUEPRINT</text>
    <text x="2700" y="60" fill="#94A3B8" font-size="16" font-weight="600">Prescription OCR • 14-Digit ABHA Lifecycle • ASHA Field Tracking • Gyan Kendra • Doctor &amp; Caregiver Sync</text>
  </g>

  <!-- ================= LANE 1: AUTH & 14-DIGIT ABHA CREATION (X: 80 - 750) ================= -->
  <g transform="translate(80, 180)">
    <rect x="0" y="0" width="670" height="1950" rx="20" fill="#0F172A" fill-opacity="0.8" stroke="#3B82F6" stroke-width="2" stroke-dasharray="8,8"/>
    <rect x="20" y="20" width="630" height="50" rx="10" fill="url(#blueGrad)"/>
    <text x="40" y="52" fill="#FFFFFF" font-size="18" font-weight="700">1. PUBLIC ENTRY, AUTH &amp; 14-DIGIT ABHA CREATION</text>

    <!-- Card 1.1: Landing Page -->
    <g transform="translate(25, 90)" filter="url(#shadow)">
      <rect x="0" y="0" width="620" height="230" rx="14" fill="url(#darkCard)" stroke="#3B82F6" stroke-width="1.5"/>
      <text x="25" y="35" fill="#60A5FA" font-size="16" font-weight="700">🏠 Landing Page (/)</text>
      <text x="440" y="35" fill="#FBBF24" font-size="13">🌐 Hindi / Regional ▼</text>
      <line x1="25" y1="48" x2="595" y2="48" stroke="#334155" stroke-width="1"/>
      <text x="25" y="75" fill="#FFFFFF" font-size="15" font-weight="600">Voice-First AI Healthcare for Rural Communities</text>
      <text x="25" y="100" fill="#94A3B8" font-size="13">• Zero-literacy spoken dialect interface &amp; handwritten Rx reader</text>
      <text x="25" y="125" fill="#94A3B8" font-size="13">• Seamless ASHA doorstep registration &amp; doctor tele-consultations</text>
      <!-- Buttons -->
      <rect x="25" y="155" width="160" height="40" rx="8" fill="#2563EB"/>
      <text x="50" y="180" fill="#FFFFFF" font-size="13" font-weight="600">Get Started ➔</text>
      <rect x="200" y="155" width="160" height="40" rx="8" fill="#10B981"/>
      <text x="235" y="180" fill="#FFFFFF" font-size="13" font-weight="600">Login / OTP</text>
      <rect x="375" y="155" width="220" height="40" rx="8" fill="#EF4444"/>
      <text x="390" y="180" fill="#FFFFFF" font-size="13" font-weight="600">🚨 Public Emergency QR</text>
    </g>

    <!-- Card 1.2: Auth & Role Gateway -->
    <g transform="translate(25, 345)" filter="url(#shadow)">
      <rect x="0" y="0" width="620" height="310" rx="14" fill="url(#darkCard)" stroke="#3B82F6" stroke-width="1.5"/>
      <text x="25" y="35" fill="#60A5FA" font-size="16" font-weight="700">🔐 Auth Gateway &amp; Role Classifier (/login)</text>
      <line x1="25" y1="48" x2="595" y2="48" stroke="#334155" stroke-width="1"/>
      <text x="25" y="75" fill="#CBD5E1" font-size="13">Enter Mobile / 14-Digit ABHA ID + 6-Digit OTP</text>
      <!-- 4 Role Selector Badges -->
      <rect x="25" y="95" width="135" height="60" rx="8" fill="#064E3B" stroke="#10B981" stroke-width="1.5"/>
      <text x="40" y="120" fill="#34D399" font-size="13" font-weight="700">📱 Patient</text>
      <text x="35" y="140" fill="#A7F3D0" font-size="10">Voice &amp; Rx Vault</text>

      <rect x="170" y="95" width="135" height="60" rx="8" fill="#78350F" stroke="#F59E0B" stroke-width="1.5"/>
      <text x="180" y="120" fill="#FBBF24" font-size="13" font-weight="700">🩺 ASHA Worker</text>
      <text x="180" y="140" fill="#FDE68A" font-size="10">Field Registry</text>

      <rect x="315" y="95" width="135" height="60" rx="8" fill="#4C1D95" stroke="#8B5CF6" stroke-width="1.5"/>
      <text x="335" y="120" fill="#C084FC" font-size="13" font-weight="700">👨‍⚕️ Doctor</text>
      <text x="330" y="140" fill="#DDD6FE" font-size="10">Tele-Triage &amp; Rx</text>

      <rect x="460" y="95" width="135" height="60" rx="8" fill="#831843" stroke="#EC4899" stroke-width="1.5"/>
      <text x="475" y="120" fill="#F472B6" font-size="13" font-weight="700">🤝 Caregiver</text>
      <text x="470" y="140" fill="#FBCFE8" font-size="10">Family Tracking</text>

      <rect x="25" y="175" width="570" height="42" rx="8" fill="#2563EB"/>
      <text x="180" y="202" fill="#FFFFFF" font-size="15" font-weight="700">Verify OTP &amp; Auto-Route to Portal ➔</text>
      <text x="25" y="245" fill="#94A3B8" font-size="12">🔀 Auth Guard: Routes dynamically to role dashboards (/app/patient, /app/asha, etc.)</text>
      <text x="25" y="275" fill="#38BDF8" font-size="12">✓ Persistent local auth token with encrypted biometric/PIN fallback</text>
    </g>

    <!-- Card 1.3: Doorstep 14-Digit ABHA Generation Lifecycle -->
    <g transform="translate(25, 680)" filter="url(#shadow)">
      <rect x="0" y="0" width="620" height="440" rx="14" fill="url(#darkCard)" stroke="#F59E0B" stroke-width="2"/>
      <rect x="0" y="0" width="620" height="40" rx="14" fill="#B45309"/>
      <text x="20" y="26" fill="#FFFFFF" font-size="15" font-weight="700">🪪 14-Digit ABHA ID &amp; Digital Health Card Lifecycle</text>
      
      <!-- Step 1 -->
      <rect x="20" y="55" width="580" height="75" rx="8" fill="#1E293B" stroke="#334155"/>
      <text x="35" y="78" fill="#FBBF24" font-size="13" font-weight="700">Step 1: Doorstep Aadhaar Input by ASHA Worker</text>
      <text x="35" y="100" fill="#CBD5E1" font-size="12">ASHA opens [AbhaRegistrationModal] on field tablet $\rightarrow$ enters 12-digit Aadhaar / Mobile</text>
      <text x="35" y="118" fill="#94A3B8" font-size="11">Initiates ABDM M1 National Gateway OTP transaction</text>

      <!-- Step 2 -->
      <rect x="20" y="140" width="580" height="75" rx="8" fill="#1E293B" stroke="#334155"/>
      <text x="35" y="163" fill="#34D399" font-size="13" font-weight="700">Step 2: OTP Verification &amp; 14-Digit ID Generation</text>
      <text x="35" y="185" fill="#CBD5E1" font-size="12">Villager enters OTP received $\rightarrow$ ABDM issues official ID: <tspan fill="#38BDF8" font-weight="700">14-8492-3019-4820</tspan></text>
      <text x="35" y="203" fill="#94A3B8" font-size="11">Profile auto-populated with Name, Age, Gender, and Photo from Aadhaar</text>

      <!-- Step 3 -->
      <rect x="20" y="225" width="580" height="100" rx="8" fill="#064E3B" stroke="#10B981"/>
      <text x="35" y="248" fill="#34D399" font-size="13" font-weight="700">Step 3: Physical &amp; Digital ABHA Card Created with QR</text>
      <text x="35" y="270" fill="#FFFFFF" font-size="12">Card features: 14-Digit ABHA ID • Blood Group • Chronic Diseases • Emergency Contact</text>
      <text x="35" y="292" fill="#A7F3D0" font-size="11">✓ Stored in Patient Vault &amp; synced to ASHA Village Registry</text>
      <text x="35" y="310" fill="#A7F3D0" font-size="11">✓ Printable paper card given to villager with scannable QR</text>

      <!-- Step 4 -->
      <rect x="20" y="335" width="580" height="85" rx="8" fill="#1E293B" stroke="#334155"/>
      <text x="35" y="358" fill="#C084FC" font-size="13" font-weight="700">Step 4: Unified Tracking by ASHA, Doctor &amp; Caregiver</text>
      <text x="35" y="380" fill="#CBD5E1" font-size="12">• ASHA scans QR during village visits $\rightarrow$ loads vitals history instantly</text>
      <text x="35" y="400" fill="#CBD5E1" font-size="12">• Doctor writes digital Rx linked directly to this 14-digit ABHA record</text>
    </g>

    <!-- Card 1.4: Public Emergency Health Card (/emergency-card/:id) -->
    <g transform="translate(25, 1145)" filter="url(#shadow)">
      <rect x="0" y="0" width="620" height="270" rx="14" fill="url(#darkCard)" stroke="#EF4444" stroke-width="2"/>
      <rect x="0" y="0" width="620" height="40" rx="14" fill="#991B1B"/>
      <text x="20" y="26" fill="#FFFFFF" font-size="15" font-weight="700">🚨 Public Emergency Card (/emergency-card/:id) — No Login</text>
      
      <rect x="20" y="55" width="120" height="120" rx="8" fill="#FFFFFF"/>
      <text x="35" y="120" fill="#000000" font-size="14" font-weight="700">[QR CODE]</text>

      <text x="160" y="75" fill="#FFFFFF" font-size="14" font-weight="700">Patient: Ramesh Kumar | ABHA: 14-8492-3019-4820</text>
      <text x="160" y="100" fill="#F87171" font-size="12">⚠️ Critical: Type 2 Diabetes, High BP (145/95)</text>
      <text x="160" y="120" fill="#FCA5A5" font-size="12">🚫 Drug Allergies: Penicillin, Sulfa Drugs</text>
      <text x="160" y="140" fill="#34D399" font-size="12">📞 Emergency Contact: +91 98765 11223 (Son)</text>
      <text x="160" y="160" fill="#38BDF8" font-size="12">🏥 Assigned PHC: Rampur Primary Health Center</text>

      <rect x="20" y="195" width="280" height="45" rx="8" fill="#DC2626"/>
      <text x="60" y="222" fill="#FFFFFF" font-size="14" font-weight="700">📞 Call 108 Ambulance</text>

      <rect x="320" y="195" width="280" height="45" rx="8" fill="#2563EB"/>
      <text x="360" y="222" fill="#FFFFFF" font-size="14" font-weight="700">📍 Share GPS Location</text>
    </g>
  </g>

  <!-- ================= LANE 2: PATIENT EMPOWERMENT & AI (X: 790 - 1750) ================= -->
  <g transform="translate(790, 180)">
    <rect x="0" y="0" width="940" height="1950" rx="20" fill="#0F172A" fill-opacity="0.8" stroke="#10B981" stroke-width="2" stroke-dasharray="8,8"/>
    <rect x="20" y="20" width="900" height="50" rx="10" fill="url(#emeraldGrad)"/>
    <text x="40" y="52" fill="#FFFFFF" font-size="18" font-weight="700">2. PATIENT PORTAL: VOICE AI, PRESCRIPTION OCR &amp; HEALTH VAULT</text>

    <!-- Card 2.1: Patient Dashboard -->
    <g transform="translate(25, 90)" filter="url(#shadow)">
      <rect x="0" y="0" width="890" height="340" rx="14" fill="url(#darkCard)" stroke="#10B981" stroke-width="1.5"/>
      <text x="25" y="35" fill="#34D399" font-size="16" font-weight="700">📱 Patient Dashboard (/app/patient)</text>
      <text x="700" y="35" fill="#FBBF24" font-size="13">नमस्ते Ramesh | Hindi ▼</text>
      <line x1="25" y1="48" x2="865" y2="48" stroke="#334155" stroke-width="1"/>

      <!-- Big Voice Mic Button -->
      <rect x="25" y="65" width="410" height="120" rx="12" fill="#1E293B" stroke="#38BDF8" stroke-width="2"/>
      <circle cx="75" cy="125" r="30" fill="#0284C7"/>
      <text x="63" y="133" fill="#FFFFFF" font-size="22">🎙️</text>
      <text x="120" y="105" fill="#38BDF8" font-size="15" font-weight="700">SwasthyaMitr AI Voice Companion</text>
      <text x="120" y="128" fill="#CBD5E1" font-size="12">Tap to speak symptoms in your village dialect</text>
      <rect x="120" y="142" width="140" height="28" rx="6" fill="#2563EB"/>
      <text x="145" y="160" fill="#FFFFFF" font-size="11" font-weight="600">Speak Now ➔</text>

      <!-- Today's Dosage Schedule -->
      <rect x="455" y="65" width="410" height="120" rx="12" fill="#1E293B" stroke="#334155"/>
      <text x="475" y="90" fill="#FFFFFF" font-size="13" font-weight="700">Today's Dosage Schedule</text>
      <!-- Morning Dose -->
      <rect x="475" y="105" width="185" height="65" rx="8" fill="#064E3B"/>
      <text x="485" y="125" fill="#34D399" font-size="11" font-weight="700">☀️ Morning: Metformin 500mg</text>
      <text x="485" y="145" fill="#A7F3D0" font-size="10">✓ Taken at 8:30 AM (1 Tab)</text>
      <!-- Night Dose -->
      <rect x="670" y="105" width="185" height="65" rx="8" fill="#78350F"/>
      <text x="680" y="125" fill="#FBBF24" font-size="11" font-weight="700">🌙 Night: Amlodipine 5mg</text>
      <text x="680" y="145" fill="#FDE68A" font-size="10">⏳ Due at 9:00 PM (1 Tab)</text>

      <!-- Quick Action Grid -->
      <rect x="25" y="200" width="160" height="50" rx="8" fill="#6D28D9"/>
      <text x="45" y="230" fill="#FFFFFF" font-size="13" font-weight="600">📄 Scan Prescription</text>

      <rect x="195" y="200" width="160" height="50" rx="8" fill="#047857"/>
      <text x="215" y="230" fill="#FFFFFF" font-size="13" font-weight="600">📂 Medical Vault</text>

      <rect x="365" y="200" width="160" height="50" rx="8" fill="#B45309"/>
      <text x="385" y="230" fill="#FFFFFF" font-size="13" font-weight="600">🗺️ Health Map</text>

      <rect x="535" y="200" width="160" height="50" rx="8" fill="#1D4ED8"/>
      <text x="555" y="230" fill="#FFFFFF" font-size="13" font-weight="600">⏰ Reminders</text>

      <rect x="705" y="200" width="160" height="50" rx="8" fill="#991B1B"/>
      <text x="730" y="230" fill="#FFFFFF" font-size="13" font-weight="600">🚨 SOS Emergency</text>

      <text x="25" y="280" fill="#94A3B8" font-size="12">💡 Zero-Literacy Audio Features: Every card has an audio speaker button reading out dosage in Hindi/regional language</text>
      <text x="25" y="305" fill="#34D399" font-size="12">✓ Connected directly to assigned ASHA worker Pushpa Devi (+91 98765 43210)</text>
    </g>

    <!-- Card 2.2: Prescription Upload, OCR & Auto-Reminder Engine -->
    <g transform="translate(25, 455)" filter="url(#shadow)">
      <rect x="0" y="0" width="890" height="420" rx="14" fill="url(#darkCard)" stroke="#8B5CF6" stroke-width="2"/>
      <rect x="0" y="0" width="890" height="40" rx="14" fill="#6D28D9"/>
      <text x="20" y="26" fill="#FFFFFF" font-size="15" font-weight="700">📄 Prescription Upload, Gemini/Groq Vision OCR &amp; Auto-Vault Storage</text>

      <!-- Step 1: Upload Photo -->
      <rect x="25" y="55" width="260" height="150" rx="10" fill="#1E293B" stroke="#475569" stroke-width="1.5"/>
      <text x="45" y="85" fill="#A78BFA" font-size="13" font-weight="700">1. Upload Doctor's Slip</text>
      <text x="45" y="110" fill="#CBD5E1" font-size="11">Take photo with mobile camera</text>
      <text x="45" y="128" fill="#CBD5E1" font-size="11">Supports messy handwriting</text>
      <rect x="45" y="145" width="220" height="35" rx="6" fill="#8B5CF6"/>
      <text x="80" y="167" fill="#FFFFFF" font-size="12" font-weight="600">📷 Snap Prescription</text>

      <!-- Step 2: AI Processing Pipeline -->
      <rect x="300" y="55" width="280" height="150" rx="10" fill="#1E293B" stroke="#F59E0B" stroke-width="1.5"/>
      <text x="315" y="85" fill="#FBBF24" font-size="13" font-weight="700">2. Gemini 1.5 &amp; Groq OCR</text>
      <text x="315" y="110" fill="#34D399" font-size="11">✓ Metformin 500mg — 1 Tab Morning</text>
      <text x="315" y="130" fill="#34D399" font-size="11">✓ Amlodipine 5mg — 1 Tab Night</text>
      <text x="315" y="150" fill="#94A3B8" font-size="11">✓ Paracetamol 650mg — SOS Fever</text>
      <text x="315" y="175" fill="#FDE68A" font-size="11">Confidence: 98.4% Accuracy</text>

      <!-- Step 3: Direct Vault Storage & Auto-Reminder -->
      <rect x="595" y="55" width="270" height="150" rx="10" fill="#064E3B" stroke="#10B981" stroke-width="1.5"/>
      <text x="610" y="85" fill="#34D399" font-size="13" font-weight="700">3. Direct Storage &amp; Alarms</text>
      <text x="610" y="110" fill="#FFFFFF" font-size="11">💾 Auto-saved to Medical Vault</text>
      <text x="610" y="130" fill="#FFFFFF" font-size="11">⏰ Auto-creates Morning/Night alarms</text>
      <text x="610" y="150" fill="#FFFFFF" font-size="11">📲 Sends WhatsApp dosage audio</text>
      <text x="610" y="175" fill="#A7F3D0" font-size="11">✓ No manual typing required</text>

      <!-- Spoken Hindi Translation Box -->
      <rect x="25" y="220" width="840" height="80" rx="10" fill="#1E293B" stroke="#34D399"/>
      <text x="45" y="245" fill="#34D399" font-size="13" font-weight="700">🔊 Spoken Hindi Audio Instruction Generated by AI:</text>
      <text x="45" y="270" fill="#FFFFFF" font-size="12">"Metformin subah naashte ke baad ek goli lein. Amlodipine raat ko sone se pehle lein. Dard hone par hi Paracetamol lein."</text>
      <rect x="700" y="240" width="145" height="35" rx="6" fill="#10B981"/>
      <text x="720" y="262" fill="#FFFFFF" font-size="12" font-weight="600">🔊 Play Audio</text>

      <!-- Action Footer -->
      <rect x="25" y="320" width="410" height="45" rx="8" fill="#10B981"/>
      <text x="130" y="348" fill="#FFFFFF" font-size="14" font-weight="700">✓ Confirm &amp; Activate Reminders</text>
      <rect x="455" y="320" width="410" height="45" rx="8" fill="#2563EB"/>
      <text x="560" y="348" fill="#FFFFFF" font-size="14" font-weight="700">📂 View in ABDM Vault</text>

      <text x="25" y="395" fill="#94A3B8" font-size="11">Pipeline handles zero-literacy: patient snaps photo $\rightarrow$ gets spoken audio instructions $\rightarrow$ receives phone ring alarms</text>
    </g>

    <!-- Card 2.3: Medical Vault & Gyan Kendra (Rural Knowledge Center) -->
    <g transform="translate(25, 895)" filter="url(#shadow)">
      <rect x="0" y="0" width="430" height="480" rx="14" fill="url(#darkCard)" stroke="#059669" stroke-width="1.5"/>
      <text x="20" y="35" fill="#34D399" font-size="15" font-weight="700">📂 Medical Vault (/app/patient/vault)</text>
      <line x1="20" y1="48" x2="410" y2="48" stroke="#334155" stroke-width="1"/>
      <text x="20" y="75" fill="#CBD5E1" font-size="12">ABHA Linked: 14-8492-3019-4820</text>
      
      <!-- Stored Files -->
      <rect x="20" y="95" width="390" height="65" rx="8" fill="#1E293B"/>
      <text x="35" y="120" fill="#FFFFFF" font-size="12" font-weight="600">📄 Dr. Sharma Digital Rx (15 Sept 2026)</text>
      <text x="35" y="140" fill="#94A3B8" font-size="10">Verified Digital Signature • PDF Available</text>

      <rect x="20" y="170" width="390" height="65" rx="8" fill="#1E293B"/>
      <text x="35" y="195" fill="#FFFFFF" font-size="12" font-weight="600">🧪 Fasting Blood Sugar: 110 mg/dL</text>
      <text x="35" y="215" fill="#34D399" font-size="10">Recorded by ASHA Pushpa Devi</text>

      <rect x="20" y="245" width="390" height="65" rx="8" fill="#1E293B"/>
      <text x="35" y="270" fill="#FFFFFF" font-size="12" font-weight="600">📷 Scanned Hospital Discharge Summary</text>
      <text x="35" y="290" fill="#A78BFA" font-size="10">OCR Parsed &amp; Searchable</text>

      <rect x="20" y="330" width="190" height="40" rx="8" fill="#2563EB"/>
      <text x="50" y="355" fill="#FFFFFF" font-size="12" font-weight="600">+ Upload Document</text>
      <rect x="220" y="330" width="190" height="40" rx="8" fill="#10B981"/>
      <text x="250" y="355" fill="#FFFFFF" font-size="12" font-weight="600">🔗 Share with Doctor</text>

      <text x="20" y="405" fill="#94A3B8" font-size="11">• FHIR compliant electronic records</text>
      <text x="20" y="430" fill="#94A3B8" font-size="11">• Offline cache available when visiting remote clinics</text>
    </g>

    <!-- Card 2.4: Gyan Kendra (Health Knowledge Center) -->
    <g transform="translate(485, 895)" filter="url(#shadow)">
      <rect x="0" y="0" width="430" height="480" rx="14" fill="url(#darkCard)" stroke="#F59E0B" stroke-width="1.5"/>
      <text x="20" y="35" fill="#FBBF24" font-size="15" font-weight="700">💡 Gyan Kendra (Rural Health Knowledge)</text>
      <line x1="20" y1="48" x2="410" y2="48" stroke="#334155" stroke-width="1"/>
      <text x="20" y="75" fill="#CBD5E1" font-size="12">Voice-Narrated Education in Village Dialects</text>
      
      <!-- Category 1 -->
      <rect x="20" y="95" width="390" height="75" rx="8" fill="#1E293B"/>
      <text x="35" y="120" fill="#FBBF24" font-size="12" font-weight="700">🤱 Garbhvati Mahila Dekhbhal (Maternal Care)</text>
      <text x="35" y="140" fill="#CBD5E1" font-size="10">Trimester nutrition, danger signs in high BP, iron tablets</text>
      <text x="35" y="158" fill="#34D399" font-size="10">🔊 Listen Audio (Hindi) • 4 Mins</text>

      <!-- Category 2 -->
      <rect x="20" y="180" width="390" height="75" rx="8" fill="#1E293B"/>
      <text x="35" y="205" fill="#38BDF8" font-size="12" font-weight="700">🩺 Madhumeh &amp; Uchh Raktchap (BP &amp; Sugar)</text>
      <text x="35" y="225" fill="#CBD5E1" font-size="10">Daily diet control, salt reduction, timely medicines</text>
      <text x="35" y="243" fill="#34D399" font-size="10">🔊 Listen Audio (Hindi) • 3 Mins</text>

      <!-- Category 3 -->
      <rect x="20" y="265" width="390" height="75" rx="8" fill="#1E293B"/>
      <text x="35" y="290" fill="#A78BFA" font-size="12" font-weight="700">💉 Shishu Tikakaran (Child Immunization)</text>
      <text x="35" y="310" fill="#CBD5E1" font-size="10">Polio, BCG, DPT vaccine schedule &amp; ASHA camp dates</text>
      <text x="35" y="328" fill="#34D399" font-size="10">🔊 Listen Audio (Hindi) • 5 Mins</text>

      <rect x="20" y="355" width="390" height="40" rx="8" fill="#D97706"/>
      <text x="110" y="380" fill="#FFFFFF" font-size="12" font-weight="700">🎙️ Ask AI in Gyan Kendra</text>

      <text x="20" y="425" fill="#94A3B8" font-size="11">• Eliminates rural misinformation and promotes preventative care</text>
    </g>

    <!-- Card 2.5: My Health Map & Generic Store Finder -->
    <g transform="translate(25, 1395)" filter="url(#shadow)">
      <rect x="0" y="0" width="890" height="230" rx="14" fill="url(#darkCard)" stroke="#38BDF8" stroke-width="1.5"/>
      <text x="25" y="35" fill="#38BDF8" font-size="15" font-weight="700">🗺️ My Health Map &amp; Jan Aushadhi Kendra Finder (/app/patient/map)</text>
      <line x1="25" y1="48" x2="865" y2="48" stroke="#334155" stroke-width="1"/>

      <rect x="25" y="65" width="270" height="130" rx="10" fill="#1E293B" stroke="#059669"/>
      <text x="40" y="90" fill="#34D399" font-size="12" font-weight="700">1. Jan Aushadhi Generic Store</text>
      <text x="40" y="112" fill="#CBD5E1" font-size="11">Distance: 0.8 km (Rampur Chowk)</text>
      <text x="40" y="132" fill="#FBBF24" font-size="11">Metformin: ₹12 (90% Cheaper!)</text>
      <rect x="40" y="150" width="240" height="30" rx="6" fill="#059669"/>
      <text x="80" y="170" fill="#FFFFFF" font-size="11" font-weight="600">Get Directions ➔</text>

      <rect x="310" y="65" width="270" height="130" rx="10" fill="#1E293B" stroke="#F59E0B"/>
      <text x="325" y="90" fill="#FBBF24" font-size="12" font-weight="700">2. Primary Health Center (PHC)</text>
      <text x="325" y="112" fill="#CBD5E1" font-size="11">Distance: 2.1 km | Dr. Sharma</text>
      <text x="325" y="132" fill="#CBD5E1" font-size="11">Open: 9:00 AM - 4:00 PM</text>
      <rect x="325" y="150" width="240" height="30" rx="6" fill="#B45309"/>
      <text x="375" y="170" fill="#FFFFFF" font-size="11" font-weight="600">Call PHC Clinic</text>

      <rect x="595" y="65" width="270" height="130" rx="10" fill="#1E293B" stroke="#EF4444"/>
      <text x="610" y="90" fill="#F87171" font-size="12" font-weight="700">3. Community Health Center (CHC)</text>
      <text x="610" y="112" fill="#CBD5E1" font-size="11">Distance: 8.5 km | 24x7 Emergency</text>
      <text x="610" y="132" fill="#CBD5E1" font-size="11">Ambulance Hub &amp; Blood Bank</text>
      <rect x="610" y="150" width="240" height="30" rx="6" fill="#DC2626"/>
      <text x="650" y="170" fill="#FFFFFF" font-size="11" font-weight="600">Emergency Route</text>
    </g>
  </g>

  <!-- ================= LANE 3: ASHA HEALTHCARE WORKER FIELD HUB (X: 1770 - 2730) ================= -->
  <g transform="translate(1770, 180)">
    <rect x="0" y="0" width="940" height="1950" rx="20" fill="#0F172A" fill-opacity="0.8" stroke="#F59E0B" stroke-width="2" stroke-dasharray="8,8"/>
    <rect x="20" y="20" width="900" height="50" rx="10" fill="url(#amberGrad)"/>
    <text x="40" y="52" fill="#FFFFFF" font-size="18" font-weight="700">3. ASHA / HEALTHCARE WORKER FIELD HUB (REGISTRY, VITALS &amp; ROUTE)</text>

    <!-- Card 3.1: ASHA Field Dashboard -->
    <g transform="translate(25, 90)" filter="url(#shadow)">
      <rect x="0" y="0" width="890" height="340" rx="14" fill="url(#darkCard)" stroke="#F59E0B" stroke-width="1.5"/>
      <text x="25" y="35" fill="#FBBF24" font-size="16" font-weight="700">🩺 ASHA Field Dashboard (/app/asha)</text>
      <text x="670" y="35" fill="#34D399" font-size="13">🟢 Offline Cache: 48 Records</text>
      <line x1="25" y1="48" x2="865" y2="48" stroke="#334155" stroke-width="1"/>

      <!-- Metric Badges -->
      <rect x="25" y="65" width="200" height="70" rx="8" fill="#1E3A8A"/>
      <text x="40" y="90" fill="#BFDBFE" font-size="12">Assigned Village</text>
      <text x="40" y="120" fill="#FFFFFF" font-size="18" font-weight="700">Rampur (48 Pts)</text>

      <rect x="245" y="65" width="200" height="70" rx="8" fill="#7F1D1D"/>
      <text x="260" y="90" fill="#FECACA" font-size="12">High-Risk Alerts</text>
      <text x="260" y="120" fill="#FFFFFF" font-size="18" font-weight="700">🔴 3 Critical</text>

      <rect x="465" y="65" width="200" height="70" rx="8" fill="#064E3B"/>
      <text x="480" y="90" fill="#A7F3D0" font-size="12">Visits Scheduled</text>
      <text x="480" y="120" fill="#FFFFFF" font-size="18" font-weight="700">6 Households</text>

      <rect x="685" y="65" width="180" height="70" rx="8" fill="#4C1D95"/>
      <text x="700" y="90" fill="#DDD6FE" font-size="12">Pending Doctor Rx</text>
      <text x="700" y="120" fill="#FFFFFF" font-size="18" font-weight="700">2 Due</text>

      <!-- Fast Action Buttons -->
      <rect x="25" y="150" width="200" height="45" rx="8" fill="#8B5CF6"/>
      <text x="45" y="178" fill="#FFFFFF" font-size="13" font-weight="600">+ Register ABHA ➔</text>

      <rect x="245" y="150" width="200" height="45" rx="8" fill="#059669"/>
      <text x="265" y="178" fill="#FFFFFF" font-size="13" font-weight="600">🗺️ Route Map ➔</text>

      <rect x="465" y="150" width="200" height="45" rx="8" fill="#D97706"/>
      <text x="485" y="178" fill="#FFFFFF" font-size="13" font-weight="600">💓 Record Vitals ➔</text>

      <rect x="685" y="150" width="180" height="45" rx="8" fill="#DC2626"/>
      <text x="700" y="178" fill="#FFFFFF" font-size="13" font-weight="600">🚑 Refer to PHC ➔</text>

      <!-- Scheduled Visits Row -->
      <rect x="25" y="210" width="840" height="85" rx="10" fill="#1E293B" stroke="#334155"/>
      <text x="40" y="235" fill="#38BDF8" font-size="12" font-weight="700">Today's Village Visit List (GPS Optimized Sequence):</text>
      <text x="40" y="258" fill="#FCA5A5" font-size="11">1. Sunita Devi (House #12) — Trimester 3 BP Check ➔ [Check IN ➔]</text>
      <text x="40" y="278" fill="#FDE68A" font-size="11">2. Ramesh Kumar (House #18) — Sugar Test &amp; Rx Delivery ➔ [Pending]</text>

      <text x="25" y="320" fill="#94A3B8" font-size="11">IndexedDB stores all records offline $\rightarrow$ zero data loss in remote zero-network zones</text>
    </g>

    <!-- Card 3.2: Village Registry & Patient Tracking -->
    <g transform="translate(25, 455)" filter="url(#shadow)">
      <rect x="0" y="0" width="890" height="420" rx="14" fill="url(#darkCard)" stroke="#F59E0B" stroke-width="2"/>
      <rect x="0" y="0" width="890" height="40" rx="14" fill="#B45309"/>
      <text x="20" y="26" fill="#FFFFFF" font-size="15" font-weight="700">👥 Village Registry &amp; Patient Household Tracking (/app/asha/patients)</text>

      <!-- Search & Filter -->
      <rect x="25" y="55" width="450" height="40" rx="8" fill="#1E293B" stroke="#475569"/>
      <text x="45" y="80" fill="#9CA3AF" font-size="13">🔍 Search by Name, 14-Digit ABHA ID, House #...</text>
      <rect x="490" y="55" width="120" height="40" rx="8" fill="#7F1D1D"/>
      <text x="505" y="80" fill="#FFFFFF" font-size="12" font-weight="600">🔴 High-Risk (3)</text>
      <rect x="620" y="55" width="120" height="40" rx="8" fill="#064E3B"/>
      <text x="645" y="80" fill="#FFFFFF" font-size="12" font-weight="600">All (48)</text>
      <rect x="750" y="55" width="115" height="40" rx="8" fill="#059669"/>
      <text x="765" y="80" fill="#FFFFFF" font-size="12" font-weight="600">📲 Scan QR</text>

      <!-- Patient 1 -->
      <rect x="25" y="110" width="840" height="75" rx="8" fill="#1E293B" stroke="#EF4444"/>
      <text x="40" y="135" fill="#FFFFFF" font-size="13" font-weight="700">👤 Sunita Devi | Age: 32 | ABHA: 14-8492-3019-4820</text>
      <text x="40" y="155" fill="#F87171" font-size="11">Pregnancy (Trimester 3) • BP: 145/95 🔴 High Risk (Escalated to PHC Doctor)</text>
      <rect x="620" y="125" width="110" height="35" rx="6" fill="#D97706"/>
      <text x="635" y="147" fill="#FFFFFF" font-size="11" font-weight="600">Log Vitals</text>
      <rect x="740" y="125" width="110" height="35" rx="6" fill="#3B82F6"/>
      <text x="755" y="147" fill="#FFFFFF" font-size="11" font-weight="600">Full Details ➔</text>

      <!-- Patient 2 -->
      <rect x="25" y="195" width="840" height="75" rx="8" fill="#1E293B" stroke="#F59E0B"/>
      <text x="40" y="220" fill="#FFFFFF" font-size="13" font-weight="700">👤 Ramesh Kumar | Age: 58 | ABHA: 14-3019-9482-1102</text>
      <text x="40" y="240" fill="#FDE68A" font-size="11">Type 2 Diabetes • Fasting Sugar: 160 mg/dL 🟡 Follow-up Due (Rx Expired)</text>
      <rect x="620" y="210" width="110" height="35" rx="6" fill="#D97706"/>
      <text x="635" y="232" fill="#FFFFFF" font-size="11" font-weight="600">Log Vitals</text>
      <rect x="740" y="210" width="110" height="35" rx="6" fill="#3B82F6"/>
      <text x="755" y="232" fill="#FFFFFF" font-size="11" font-weight="600">Full Details ➔</text>

      <!-- Patient 3 -->
      <rect x="25" y="280" width="840" height="75" rx="8" fill="#1E293B" stroke="#10B981"/>
      <text x="40" y="305" fill="#FFFFFF" font-size="13" font-weight="700">👤 Ananya Sharma | Age: 4 | ABHA: 14-1102-8492-3019</text>
      <text x="40" y="325" fill="#A7F3D0" font-size="11">Child Immunization • Polio Booster &amp; MMR 🟢 Up to Date</text>
      <rect x="620" y="295" width="110" height="35" rx="6" fill="#D97706"/>
      <text x="635" y="317" fill="#FFFFFF" font-size="11" font-weight="600">Log Vitals</text>
      <rect x="740" y="295" width="110" height="35" rx="6" fill="#3B82F6"/>
      <text x="755" y="317" fill="#FFFFFF" font-size="11" font-weight="600">Full Details ➔</text>

      <text x="25" y="390" fill="#94A3B8" font-size="11">Clicking 'Full Details ➔' opens [PatientDetailModal] with longitudinal graphs of BP/Sugar and past doctor prescriptions</text>
    </g>

    <!-- Card 3.3: RecordVitalsModal & VisitRouteMapModal -->
    <g transform="translate(25, 895)" filter="url(#shadow)">
      <rect x="0" y="0" width="430" height="480" rx="14" fill="url(#darkCard)" stroke="#D97706" stroke-width="1.5"/>
      <text x="20" y="35" fill="#FBBF24" font-size="15" font-weight="700">💓 Modal: [RecordVitalsModal]</text>
      <line x1="20" y1="48" x2="410" y2="48" stroke="#334155" stroke-width="1"/>
      <text x="20" y="75" fill="#FFFFFF" font-size="12" font-weight="600">Patient: Sunita Devi (House #12)</text>

      <rect x="20" y="95" width="390" height="45" rx="6" fill="#1E293B"/>
      <text x="35" y="122" fill="#F87171" font-size="12">BP: [ 145 ] / [ 95 ] mmHg ⚠️ High Alert</text>

      <rect x="20" y="150" width="390" height="45" rx="6" fill="#1E293B"/>
      <text x="35" y="177" fill="#CBD5E1" font-size="12">Blood Glucose: [ 110 ] mg/dL | SpO2: [ 98% ]</text>

      <rect x="20" y="205" width="390" height="45" rx="6" fill="#1E293B"/>
      <text x="35" y="232" fill="#CBD5E1" font-size="12">Heart Rate: [ 82 bpm ] | Temp: [ 98.6°F ]</text>

      <rect x="20" y="260" width="390" height="45" rx="6" fill="#334155"/>
      <text x="35" y="287" fill="#38BDF8" font-size="12">🎙️ Voice Memo: "Patient complaining of dizziness"</text>

      <rect x="20" y="320" width="390" height="45" rx="8" fill="#D97706"/>
      <text x="80" y="348" fill="#FFFFFF" font-size="13" font-weight="700">Save Vitals &amp; Auto-Sync ➔</text>

      <text x="20" y="395" fill="#FCA5A5" font-size="11">⚡ Automatically flags patient as 🔴 High Risk</text>
      <text x="20" y="420" fill="#CBD5E1" font-size="11">⚡ Pushes instant alert to Doctor Queue</text>
    </g>

    <!-- Card 3.4: Visit Route Map & Check-In System -->
    <g transform="translate(485, 895)" filter="url(#shadow)">
      <rect x="0" y="0" width="430" height="480" rx="14" fill="url(#darkCard)" stroke="#059669" stroke-width="1.5"/>
      <text x="20" y="35" fill="#34D399" font-size="15" font-weight="700">🗺️ Modal: [VisitRouteMapModal]</text>
      <line x1="20" y1="48" x2="410" y2="48" stroke="#334155" stroke-width="1"/>
      <text x="20" y="75" fill="#CBD5E1" font-size="12">GPS Village Walking Navigation (Sector 4)</text>

      <rect x="20" y="95" width="390" height="150" rx="8" fill="#1E293B" stroke="#334155"/>
      <text x="35" y="120" fill="#38BDF8" font-size="12" font-weight="700">📍 Geo-Optimized Route:</text>
      <text x="35" y="145" fill="#FFFFFF" font-size="11">Pin 1: Sunita Devi (House 12) ➔ 200m</text>
      <text x="35" y="170" fill="#FFFFFF" font-size="11">Pin 2: Ramesh Kumar (House 18) ➔ 450m</text>
      <text x="35" y="195" fill="#FFFFFF" font-size="11">Pin 3: Ananya Sharma (House 24) ➔ 750m</text>
      <text x="35" y="225" fill="#FBBF24" font-size="11">Total: 1.4 km • Est. Time: 45 min</text>

      <rect x="20" y="260" width="190" height="45" rx="8" fill="#10B981"/>
      <text x="50" y="287" fill="#FFFFFF" font-size="13" font-weight="700">Check IN ➔</text>

      <rect x="220" y="260" width="190" height="45" rx="8" fill="#F59E0B"/>
      <text x="250" y="287" fill="#FFFFFF" font-size="13" font-weight="700">Check OUT ➔</text>

      <text x="20" y="335" fill="#34D399" font-size="11">✓ Check IN logs verified GPS timestamp</text>
      <text x="20" y="360" fill="#34D399" font-size="11">✓ Check OUT turns red status dot to green 🟢</text>
      <text x="20" y="385" fill="#94A3B8" font-size="11">✓ Updates ASHA daily attendance register</text>
    </g>

    <!-- Card 3.5: Tasks, Referrals & Doctor Tele-Chat -->
    <g transform="translate(25, 1395)" filter="url(#shadow)">
      <rect x="0" y="0" width="890" height="230" rx="14" fill="url(#darkCard)" stroke="#DC2626" stroke-width="1.5"/>
      <text x="25" y="35" fill="#F87171" font-size="15" font-weight="700">🚑 Doctor Referrals &amp; Tele-Chat Coordination (/app/asha/referrals, /app/asha/coordination)</text>
      <line x1="25" y1="48" x2="865" y2="48" stroke="#334155" stroke-width="1"/>

      <rect x="25" y="65" width="410" height="130" rx="10" fill="#1E293B" stroke="#DC2626"/>
      <text x="40" y="90" fill="#F87171" font-size="13" font-weight="700">🚑 [CreateReferralModal] (Escalate to PHC)</text>
      <text x="40" y="112" fill="#CBD5E1" font-size="11">• Case: Sunita Devi (Pregnancy High BP 145/95)</text>
      <text x="40" y="132" fill="#FCA5A5" font-size="11">• Severity: P1 Critical ➔ Pushes to Doctor Queue</text>
      <rect x="40" y="145" width="380" height="35" rx="6" fill="#DC2626"/>
      <text x="140" y="167" fill="#FFFFFF" font-size="12" font-weight="700">Submit Emergency Referral ➔</text>

      <rect x="455" y="65" width="410" height="130" rx="10" fill="#1E293B" stroke="#8B5CF6"/>
      <text x="470" y="90" fill="#C084FC" font-size="13" font-weight="700">💬 [DoctorTeleChatModal] (Live Advice)</text>
      <text x="470" y="112" fill="#CBD5E1" font-size="11">• Dr. Sharma: "Give Labetalol 100mg &amp; keep resting."</text>
      <text x="470" y="132" fill="#34D399" font-size="11">• ASHA: "Prescription delivered and explained in Hindi."</text>
      <rect x="470" y="145" width="380" height="35" rx="6" fill="#8B5CF6"/>
      <text x="560" y="167" fill="#FFFFFF" font-size="12" font-weight="700">Open Live Tele-Chat</text>
    </g>
  </g>

  <!-- ================= LANE 4: DOCTOR & CAREGIVER PORTALS (X: 2750 - 3700) ================= -->
  <g transform="translate(2750, 180)">
    <rect x="0" y="0" width="940" height="1950" rx="20" fill="#0F172A" fill-opacity="0.8" stroke="#8B5CF6" stroke-width="2" stroke-dasharray="8,8"/>
    <rect x="20" y="20" width="900" height="50" rx="10" fill="url(#purpleGrad)"/>
    <text x="40" y="52" fill="#FFFFFF" font-size="18" font-weight="700">4. DOCTOR TELE-TRIAGE HUB &amp; CAREGIVER ADHERENCE PORTAL</text>

    <!-- Card 4.1: Doctor Dashboard & Tele-Triage Queue -->
    <g transform="translate(25, 90)" filter="url(#shadow)">
      <rect x="0" y="0" width="890" height="420" rx="14" fill="url(#darkCard)" stroke="#8B5CF6" stroke-width="1.5"/>
      <text x="25" y="35" fill="#C084FC" font-size="16" font-weight="700">👨‍⚕️ Doctor Dashboard &amp; Tele-Triage Queue (/app/doctor)</text>
      <text x="650" y="35" fill="#93C5FD" font-size="13">Dr. Sharma (PHC Rampur)</text>
      <line x1="25" y1="48" x2="865" y2="48" stroke="#334155" stroke-width="1"/>
      <text x="25" y="75" fill="#FFFFFF" font-size="13" font-weight="700">Incoming Rural Referrals (Sorted by Clinical Urgency):</text>

      <!-- Queue Item 1: P1 Critical -->
      <rect x="25" y="90" width="840" height="85" rx="8" fill="#450A0A" stroke="#EF4444" stroke-width="1.5"/>
      <text x="40" y="115" fill="#FCA5A5" font-size="13" font-weight="700">🔴 P1 CRITICAL: Sunita Devi (Age: 32) | ABHA: 14-8492-3019-4820</text>
      <text x="40" y="135" fill="#CBD5E1" font-size="11">Referred by ASHA Pushpa • BP: 145/95 • Audio Memo: "Dizziness &amp; Headache in Trimester 3"</text>
      <rect x="680" y="115" width="170" height="35" rx="6" fill="#DC2626"/>
      <text x="705" y="137" fill="#FFFFFF" font-size="12" font-weight="700">Review &amp; Prescribe ➔</text>

      <!-- Queue Item 2: P2 Moderate -->
      <rect x="25" y="185" width="840" height="85" rx="8" fill="#451A03" stroke="#F59E0B" stroke-width="1.5"/>
      <text x="40" y="210" fill="#FDE68A" font-size="13" font-weight="700">🟡 P2 MODERATE: Ramesh Kumar (Age: 58) | ABHA: 14-3019-9482-1102</text>
      <text x="40" y="230" fill="#CBD5E1" font-size="11">Diabetic Refill • Fasting Sugar: 160 mg/dL • Last Rx Expired</text>
      <rect x="680" y="210" width="170" height="35" rx="6" fill="#D97706"/>
      <text x="715" y="232" fill="#FFFFFF" font-size="12" font-weight="700">Approve Refill ➔</text>

      <!-- Queue Item 3: P3 Routine -->
      <rect x="25" y="280" width="840" height="85" rx="8" fill="#022C22" stroke="#10B981" stroke-width="1.5"/>
      <text x="40" y="305" fill="#A7F3D0" font-size="13" font-weight="700">🟢 P3 ROUTINE: Vikas Yadav (Age: 62) | ABHA: 14-9920-1102-4829</text>
      <text x="40" y="325" fill="#CBD5E1" font-size="11">Post-Op Wound Healing Normal • Vitals BP 122/80 Normal</text>
      <rect x="680" y="305" width="170" height="35" rx="6" fill="#059669"/>
      <text x="715" y="327" fill="#FFFFFF" font-size="12" font-weight="700">Sign Off Check ➔</text>

      <text x="25" y="395" fill="#94A3B8" font-size="11">Doctor sees AI-synthesized clinical summary combining raw ASHA vitals, voice memo, and past lab history</text>
    </g>

    <!-- Card 4.2: Doctor Prescription Wizard -->
    <g transform="translate(25, 535)" filter="url(#shadow)">
      <rect x="0" y="0" width="890" height="420" rx="14" fill="url(#darkCard)" stroke="#8B5CF6" stroke-width="2"/>
      <rect x="0" y="0" width="890" height="40" rx="14" fill="#6D28D9"/>
      <text x="20" y="26" fill="#FFFFFF" font-size="15" font-weight="700">💊 Digital Prescription Wizard &amp; Auto-Sync Engine</text>

      <text x="25" y="70" fill="#34D399" font-size="13" font-weight="700">Patient: Sunita Devi | 14-Digit ABHA ID: 14-8492-3019-4820</text>
      
      <!-- Drug Input -->
      <rect x="25" y="90" width="480" height="40" rx="8" fill="#1E293B" stroke="#475569"/>
      <text x="45" y="115" fill="#FFFFFF" font-size="13">💊 Drug: Labetalol 100mg (Antihypertensive)</text>

      <rect x="520" y="90" width="160" height="40" rx="8" fill="#1E293B" stroke="#475569"/>
      <text x="535" y="115" fill="#CBD5E1" font-size="13">Freq: 1-0-1 (BID)</text>

      <rect x="695" y="90" width="170" height="40" rx="8" fill="#1E293B" stroke="#475569"/>
      <text x="715" y="115" fill="#CBD5E1" font-size="13">Duration: 7 Days</text>

      <!-- Drug Safety Check -->
      <rect x="25" y="145" width="840" height="45" rx="8" fill="#064E3B" stroke="#10B981"/>
      <text x="45" y="172" fill="#34D399" font-size="12" font-weight="600">✓ AI Safety Check: Safe for 3rd Trimester Pregnancy • No Allergic Conflicts</text>

      <!-- Instructions in Hindi -->
      <rect x="25" y="200" width="840" height="55" rx="8" fill="#1E293B" stroke="#334155"/>
      <text x="45" y="222" fill="#FBBF24" font-size="12" font-weight="700">Instructions for Patient &amp; ASHA (Voice-Synthesized):</text>
      <text x="45" y="242" fill="#CBD5E1" font-size="11">"Subah shaam khana khane ke baad lein. ASHA didi 2 din baad BP dobara check karengi."</text>

      <!-- One-Click Sync Buttons -->
      <rect x="25" y="275" width="410" height="50" rx="8" fill="#10B981"/>
      <text x="65" y="305" fill="#FFFFFF" font-size="14" font-weight="700">✍️ Sign &amp; Push Digital Rx to Patient Vault ➔</text>

      <rect x="455" y="275" width="410" height="50" rx="8" fill="#2563EB"/>
      <text x="515" y="305" fill="#FFFFFF" font-size="14" font-weight="700">📲 Dispatch Task to ASHA Worker</text>

      <text x="25" y="355" fill="#C084FC" font-size="12" font-weight="700">The Closed-Loop Magic:</text>
      <text x="25" y="375" fill="#CBD5E1" font-size="11">1. Patient phone immediately receives digitized prescription &amp; spoken audio dosage alarms</text>
      <text x="25" y="395" fill="#CBD5E1" font-size="11">2. ASHA tablet receives notification to deliver medicine &amp; re-check BP in 48 hours</text>
    </g>

    <!-- Card 4.3: Caregiver Portal (Family Peace of Mind) -->
    <g transform="translate(25, 980)" filter="url(#shadow)">
      <rect x="0" y="0" width="890" height="420" rx="14" fill="url(#darkCard)" stroke="#EC4899" stroke-width="2"/>
      <rect x="0" y="0" width="890" height="40" rx="14" fill="#BE185D"/>
      <text x="20" y="26" fill="#FFFFFF" font-size="15" font-weight="700">🤝 Caregiver Portal (/app/caregiver) — Remote Family Monitoring</text>

      <text x="25" y="70" fill="#CBD5E1" font-size="13">Monitored Family Members (For migrant children living in cities tracking rural parents):</text>

      <!-- Member 1: Father -->
      <rect x="25" y="90" width="840" height="100" rx="10" fill="#1E293B" stroke="#10B981"/>
      <text x="40" y="118" fill="#FFFFFF" font-size="14" font-weight="700">👤 Father: Ramesh Kumar (Age: 58, Rampur Village)</text>
      <text x="40" y="140" fill="#34D399" font-size="12">Today's Adherence: ☀️ Morning Metformin Taken at 8:30 AM ✓</text>
      <text x="40" y="160" fill="#FBBF24" font-size="12">🌙 Night Amlodipine Due at 9:00 PM | Last ASHA BP: 128/84 Normal</text>
      <rect x="680" y="115" width="170" height="40" rx="8" fill="#059669"/>
      <text x="705" y="140" fill="#FFFFFF" font-size="12" font-weight="700">Adherence: 95%</text>

      <!-- Member 2: Mother -->
      <rect x="25" y="205" width="840" height="100" rx="10" fill="#1E293B" stroke="#EF4444"/>
      <text x="40" y="233" fill="#FFFFFF" font-size="14" font-weight="700">👤 Mother: Geeta Devi (Age: 54, Rampur Village)</text>
      <text x="40" y="255" fill="#F87171" font-size="12">⚠️ Missed Dose Alert: Morning BP medicine was not confirmed by 10:00 AM</text>
      <text x="40" y="275" fill="#FCA5A5" font-size="12">Automated WhatsApp alert sent to mother's phone</text>
      <rect x="680" y="230" width="170" height="40" rx="8" fill="#DC2626"/>
      <text x="700" y="255" fill="#FFFFFF" font-size="12" font-weight="700">Send Buzz Alert</text>

      <!-- Action Buttons -->
      <rect x="25" y="325" width="410" height="45" rx="8" fill="#EC4899"/>
      <text x="110" y="352" fill="#FFFFFF" font-size="13" font-weight="700">📞 Call ASHA Pushpa Devi</text>

      <rect x="455" y="325" width="410" height="45" rx="8" fill="#2563EB"/>
      <text x="540" y="352" fill="#FFFFFF" font-size="13" font-weight="700">📊 View 30-Day Health Trends</text>

      <text x="25" y="395" fill="#FBCFE8" font-size="11">Gives migrant workers complete visibility and peace of mind over elderly parents' medical adherence</text>
    </g>

    <!-- Card 4.4: Profiles & Credentials -->
    <g transform="translate(25, 1425)" filter="url(#shadow)">
      <rect x="0" y="0" width="890" height="200" rx="14" fill="url(#darkCard)" stroke="#475569" stroke-width="1.5"/>
      <text x="25" y="35" fill="#FFFFFF" font-size="15" font-weight="700">⚙️ Doctor &amp; Caregiver Profiles &amp; ABHA Consent Gateway</text>
      <line x1="25" y1="48" x2="865" y2="48" stroke="#334155" stroke-width="1"/>
      <text x="25" y="75" fill="#CBD5E1" font-size="12">• Doctor License: MCI-84920-A (Verified PHC Medical Officer) • Digital Signature Active</text>
      <text x="25" y="100" fill="#CBD5E1" font-size="12">• Caregiver Proxy Consent: ABDM M2 consent artifact active for parents' health records</text>
      <text x="25" y="125" fill="#34D399" font-size="12">✓ 100% compliant with Indian Digital Personal Data Protection (DPDP) Act 2023</text>
      <rect x="25" y="145" width="200" height="38" rx="8" fill="#2563EB"/>
      <text x="60" y="168" fill="#FFFFFF" font-size="12" font-weight="600">Update Credentials</text>
      <rect x="240" y="145" width="160" height="38" rx="8" fill="#DC2626"/>
      <text x="280" y="168" fill="#FFFFFF" font-size="12" font-weight="600">Log Out</text>
    </g>
  </g>

  <!-- ================= MASTER CROSS-FLOW CONNECTING ARROWS ================= -->
  <!-- 1. Auth to ASHA -->
  <path d="M 720 540 L 1770 300" fill="none" stroke="#FBBF24" stroke-width="3" marker-end="url(#arr-amber)" stroke-dasharray="6,6"/>
  <!-- 2. Auth to Patient -->
  <path d="M 720 520 L 790 300" fill="none" stroke="#34D399" stroke-width="3" marker-end="url(#arr-green)"/>
  <!-- 3. Auth to Doctor -->
  <path d="M 720 560 C 1300 200, 2200 100, 2750 300" fill="none" stroke="#C084FC" stroke-width="3" marker-end="url(#arr-purple)" stroke-dasharray="6,6"/>

  <!-- 4. Prescription OCR direct push to Vault & Reminders -->
  <path d="M 1680 700 C 1720 700, 1750 1000, 1220 1000" fill="none" stroke="#8B5CF6" stroke-width="3" marker-end="url(#arr-purple)"/>

  <!-- 5. ASHA Referral to Doctor Queue -->
  <path d="M 2680 1500 C 2720 1500, 2740 350, 2775 350" fill="none" stroke="#EF4444" stroke-width="3.5" marker-end="url(#arr-amber)"/>

  <!-- 6. Doctor Signed Rx push to Patient Vault -->
  <path d="M 2775 830 C 2300 850, 1900 850, 1220 950" fill="none" stroke="#34D399" stroke-width="3.5" marker-end="url(#arr-green)"/>

  <!-- 7. Patient Adherence sync to Caregiver -->
  <path d="M 1680 300 C 2200 150, 2600 950, 2775 1150" fill="none" stroke="#F472B6" stroke-width="3" marker-end="url(#arr-pink)" stroke-dasharray="6,6"/>

</svg>
"""

# Write to project root
with open("Healthcare_Assistant_Figma_Master_Workflow.svg", "w", encoding="utf-8") as f:
    f.write(svg_content)

# Copy to user's Downloads directory
dest = os.path.join(r"C:\Users\kumar\Downloads", "Healthcare_Assistant_Figma_Master_Workflow.svg")
shutil.copy("Healthcare_Assistant_Figma_Master_Workflow.svg", dest)

print("Master Figma SVG Generated Successfully!")
print("Saved to:", "Healthcare_Assistant_Figma_Master_Workflow.svg")
print("Copied to:", dest)
