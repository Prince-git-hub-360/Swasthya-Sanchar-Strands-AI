"""
medical.gemini_ocr_service

Gemini Multimodal Vision API Service for Handwritten Doctor Prescription OCR.
Transcribes handwritten prescription text, extracts structured medications (strength, dosage frequency, meal instructions),
and produces clear, step-by-step simplified guidance in the patient's chosen regional language.
"""
import os
import json
import base64
import requests
from pathlib import Path
from typing import Dict, Any, List


class GeminiVisionOCRService:
    """Multimodal Vision OCR Service utilizing Google Gemini Vision Models."""

    ACTIVE_MODELS = [
        "gemini-2.0-flash",
        "gemini-1.5-flash",
        "gemini-2.5-flash",
        "gemini-1.5-pro",
    ]

    LANG_NAMES = {
        'hi': 'Hindi (हिंदी)',
        'kn': 'Kannada (ಕನ್ನಡ)',
        'te': 'Telugu (తెలుగు)',
        'ta': 'Tamil (தமிழ்)',
        'mr': 'Marathi (मराठी)',
        'bn': 'Bengali (বাংলা)',
        'gu': 'Gujarati (ગુજરાતી)',
        'ml': 'Malayalam (മലയാളം)',
        'pa': 'Punjabi (ਪੰਜਾਬੀ)',
        'or': 'Odia (ଓଡ଼ିଆ)',
        'ur': 'Urdu (اردو)',
        'as': 'Assamese (অসমীয়া)',
        'mai': 'Maithili (मैथिली)',
        'sat': 'Santali (ᱥᱟᱱᱛᱟᱲᱤ)',
        'ks': 'Kashmiri (کٲشُر)',
        'ne': 'Nepali (नेपाली)',
        'sd': 'Sindhi (سنڌي)',
        'kok': 'Konkani (कोंकणी)',
        'doi': 'Dogri (डोगरी)',
        'mni': 'Manipuri (মৈতৈলোন্)',
        'brx': 'Bodo (बड़ो)',
        'sa': 'Sanskrit (संस्कृतम्)',
        'en': 'English',
    }

    @classmethod
    def get_api_key(cls) -> str:
        return os.getenv('GEMINI_API_KEY', '').strip()

    @classmethod
    def extract_prescription_data(cls, image_path: str, target_language: str = 'hi') -> Dict[str, Any]:
        """Extracts medical text, structured medication list, and native simplified guidance from a prescription image file."""
        api_key = cls.get_api_key()
        if not api_key:
            return {
                'status': 'error',
                'error': 'GEMINI_API_KEY not configured in environment',
                'extracted_text': '',
                'simplified_text': '',
                'medications': [],
                'confidence': 0.0,
            }

        if not os.path.exists(image_path):
            return {
                'status': 'error',
                'error': f'Image file not found at path: {image_path}',
                'extracted_text': '',
                'simplified_text': '',
                'medications': [],
                'confidence': 0.0,
            }

        try:
            with open(image_path, 'rb') as img_f:
                img_bytes = img_f.read()
                mime_type = 'image/jpeg'
                ext = Path(image_path).suffix.lower()
                if ext == '.png':
                    mime_type = 'image/png'
                elif ext == '.webp':
                    mime_type = 'image/webp'
                elif ext == '.pdf':
                    mime_type = 'application/pdf'
                base64_img = base64.b64encode(img_bytes).decode('utf-8')

            lang_label = cls.LANG_NAMES.get(target_language, f"{target_language} language")

            prompt_text = (
                f"You are an expert AI clinical pharmacist and specialist in reading Indian handwritten doctor prescriptions.\n"
                f"Analyze this doctor prescription image carefully (including cursive handwriting, abbreviations, clinic header, symptoms, Rx medicines, dosages, and rest/course duration).\n\n"
                f"CRITICAL EXTRACTION RULES:\n"
                f"1. CLINICAL DATA EXTRACTION:\n"
                f"   - Clinic Name, Doctor Name, Patient Age/Name, and Chief Complaints (e.g. 'Loose motion', 'vomiting', 'stomach pain', 'fever', 'headache', 'anxiety').\n"
                f"   - Read all prescribed medicines accurately (e.g. Flagyl 400, Oflox OZ, Drotin M, Pan 40, Electral, Sertraline 50mg, Clonazepam 0.5mg, etc.). NEVER return 'Unknown' if decipherable from clinical context.\n"
                f"   - Note exact frequency (1-0-1 = twice daily Morning & Night, 1-0-0 = Morning, 0-0-1 = Night, SOS = as needed) and meal rules (Before/After food).\n"
                f"   - Note exact course duration written on the slip (e.g. 'Rest for 3 days' -> duration_days: 3, 'for 5 days' -> 5, 'for 14 days' -> 14). Do NOT default to 30 days if a short course is written.\n\n"
                f"2. PATIENT TRANSLATION GUIDANCE ({lang_label}):\n"
                f"   - The 'simplified_summary' field MUST be 100% focused on patient medicine intake rules.\n"
                f"   - Format clearly in {lang_label} with numbered medicine points:\n"
                f"     1. 🌅 [Morning / Afternoon / Night Timing] ([Before / After food]):\n"
                f"        💊 [Medicine Name + Strength] — [Dose] ([Frequency]) • [Duration in Days]\n"
                f"        👉 [Purpose in simple vernacular words]\n"
                f"   - End with 2 short general precautions (take with water, complete the full course).\n"
                f"   - STRICT PROHIBITION: DO NOT include clinic address, hospital telephone/fax numbers, consultation timings, or legal hospital codes in the simplified_summary. Keep those only in clinic_name and raw_text.\n\n"
                f"Return strictly valid JSON with format:\n"
                f"{{\n"
                f'  "clinic_name": "Clinic or Hospital Name",\n'
                f'  "doctor_name": "Doctor Name",\n'
                f'  "diagnosis": "Diagnosed condition / chief complaints",\n'
                f'  "raw_text": "Complete transcribed prescription text with all lines",\n'
                f'  "simplified_summary": "Clean, structured, patient-friendly medicine guidance in {lang_label}",\n'
                f'  "medications": [\n'
                f'    {{\n'
                f'      "medicine_name": "Medicine Name with strength",\n'
                f'      "strength": "Strength (e.g. 400mg, 500mg, 40mg)",\n'
                f'      "frequency": "1-0-1 (Twice daily)",\n'
                f'      "meal_rule": "After Food",\n'
                f'      "duration_days": 3,\n'
                f'      "purpose": "Simple 1-line reason for taking this medicine"\n'
                f'    }}\n'
                f'  ],\n'
                f'  "confidence_score": 0.96\n'
                f"}}\n"
            )

            request_body = {
                "contents": [{
                    "parts": [
                        {"text": prompt_text},
                        {
                            "inline_data": {
                                "mime_type": mime_type,
                                "data": base64_img
                            }
                        }
                    ]
                }],
                "generationConfig": {
                    "temperature": 0.1,
                    "response_mime_type": "application/json"
                }
            }

            res_data = None
            used_model = None

            for model_name in cls.ACTIVE_MODELS:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
                try:
                    resp = requests.post(url, json=request_body, timeout=45)
                    if resp.status_code == 200:
                        res_data = resp.json()
                        used_model = model_name
                        break
                except Exception:
                    continue

            if not res_data:
                raise ValueError('Gemini Vision API endpoints could not be reached or timed out.')

            candidates = res_data.get('candidates', [])
            if not candidates:
                raise ValueError('No response candidates returned by Gemini Vision.')

            part_text = candidates[0].get('content', {}).get('parts', [{}])[0].get('text', '').strip()

            if part_text.startswith("```"):
                lines = part_text.splitlines()
                if lines[0].startswith("```"):
                    lines = lines[1:]
                if lines and lines[-1].startswith("```"):
                    lines = lines[:-1]
                part_text = "\n".join(lines).strip()

            parsed_json = json.loads(part_text)
            if isinstance(parsed_json, list) and len(parsed_json) > 0:
                if isinstance(parsed_json[0], dict) and 'medicine_name' in parsed_json[0]:
                    parsed_json = {'medications': parsed_json, 'raw_text': part_text, 'simplified_summary': ''}
                elif isinstance(parsed_json[0], dict):
                    parsed_json = parsed_json[0]

            raw_text = parsed_json.get('raw_text', '') or part_text
            simplified = parsed_json.get('simplified_summary', '')
            meds = parsed_json.get('medications', [])
            conf = float(parsed_json.get('confidence_score', 0.95))

            return {
                'status': 'success',
                'extracted_text': raw_text,
                'simplified_text': simplified,
                'translated_text': simplified,
                'medications': meds,
                'confidence': conf,
                'ocr_engine': f'gemini-{used_model}',
            }

        except Exception as exc:
            # Fallback directly to Groq Vision / LLM Engine
            try:
                from .groq_ocr_service import GroqVisionOCRService
                groq_res = GroqVisionOCRService.extract_prescription_data(image_path, target_language=target_language)
                if groq_res.get('status') == 'success' and (groq_res.get('extracted_text') or groq_res.get('medications')):
                    return groq_res
            except Exception:
                pass

            return {
                'status': 'error',
                'error': str(exc),
                'extracted_text': '',
                'simplified_text': '',
                'medications': [],
                'confidence': 0.0,
                'ocr_engine': 'gemini_failed',
            }
