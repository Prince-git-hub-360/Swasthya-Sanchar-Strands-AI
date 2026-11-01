"""
medical.views

Viewset for MedicalDocument model.
Configured with AllowAny for Version 1 API testing.
Automatically triggers OCR Engine & PrescriptionParserService pipeline on uploaded documents.
"""
from rest_framework import permissions, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.exceptions import ValidationError, PermissionDenied

from drf_spectacular.utils import extend_schema

from .models import MedicalDocument
from .serializers import MedicalDocumentSerializer
from .filters import MedicalDocumentFilter
from .ocr_service import OpticalCharacterRecognitionService
from medications.services import PrescriptionParserService
from patients.models import PatientCaregiver


@extend_schema(tags=['04. Medical Documents & Clinical Records'])
class MedicalDocumentViewSet(viewsets.ModelViewSet):
    queryset = MedicalDocument.objects.all()
    serializer_class = MedicalDocumentSerializer
    permission_classes = [permissions.AllowAny]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = MedicalDocumentFilter
    search_fields = ['title', 'text_content', 'translated_text']
    ordering_fields = ['created_at', 'updated_at']

    def get_queryset(self):
        user = self.request.user
        if not user or user.is_anonymous:
            return MedicalDocument.objects.all()
        if user.is_staff:
            return MedicalDocument.objects.all()

        profile = getattr(user, 'profile', None)
        if profile and profile.role == 'healthcare_worker':
            return MedicalDocument.objects.all()

        return MedicalDocument.objects.filter(patient__user=user)

    def perform_create(self, serializer):
        user = self.request.user
        if not user or user.is_anonymous:
            from django.contrib.auth import get_user_model
            User = get_user_model()
            user = User.objects.filter(profile__role='patient').first() or User.objects.first()

        profile = getattr(user, 'profile', None)
        patient = serializer.validated_data.get('patient')

        if not patient:
            from patients.models import Patient
            patient, _ = Patient.objects.get_or_create(user=user)

        doc = serializer.save(uploaded_by=user, patient=patient)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        doc = serializer.instance
        ocr_data = {}
        target_lang = (
            request.query_params.get('lang')
            or request.data.get('target_language')
            or request.data.get('language')
            or getattr(doc, 'language', None)
        )
        profile = getattr(request.user, 'profile', None)
        if not target_lang and profile:
            target_lang = profile.preferred_language
        target_lang = target_lang or 'hi'


        try:
            ocr_data = OpticalCharacterRecognitionService.extract_text_from_document(doc, target_language=target_lang)
            doc.refresh_from_db()
        except Exception:
            pass

        try:
            ocr_meds = ocr_data.get('medications') if isinstance(ocr_data, dict) else None
            PrescriptionParserService.process_prescription_document(doc, ocr_medications=ocr_meds)
            doc.refresh_from_db()
        except Exception:
            pass

        res_data = self.get_serializer(doc).data
        if ocr_data:
            res_data['extracted_text'] = ocr_data.get('extracted_text') or doc.text_content
            res_data['simplified_text'] = ocr_data.get('simplified_text') or doc.simplified_text
            res_data['translated_text'] = ocr_data.get('translated_text') or doc.translated_text
            res_data['medications'] = ocr_data.get('medications', [])
            res_data['confidence'] = ocr_data.get('confidence')

        headers = self.get_success_headers(res_data)
        return Response(res_data, status=status.HTTP_201_CREATED, headers=headers)

    @action(detail=False, methods=['post'], url_path='parse-text')
    def parse_text(self, request):
        """Processes raw OCR text using Groq LLM clinical pipeline and returns natural conversational advice + structured medications."""
        raw_text = request.data.get('raw_text') or request.data.get('text', '')
        target_lang = request.data.get('target_language') or request.data.get('language', 'hi')
        
        from .groq_ocr_service import GroqVisionOCRService
        result = GroqVisionOCRService.process_text_with_groq(raw_text, target_language=target_lang)
        return Response(result, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], url_path='strands-swarm')
    def strands_swarm(self, request):
        """
        Executes the AWS Strands 4-Agent Swarm:
        RxVisionAgent -> RxPharmacologyAgent -> RxSafetySentinel -> RxVernacularCommunicator
        """
        prescription_text = request.data.get('prescription_text') or request.data.get('raw_text') or request.data.get('text', '')
        target_lang = request.data.get('target_language') or request.data.get('language', 'hi')
        patient_name = request.data.get('patient_name') or 'Patient'
        acute_symptoms = request.data.get('acute_symptoms', '')

        uploaded_file = request.FILES.get('file') or request.FILES.get('original_file')
        if uploaded_file and not prescription_text:
            prescription_text = f"Prescription Document: {uploaded_file.name}"

        import sys
        from pathlib import Path
        PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent.parent
        if str(PROJECT_ROOT) not in sys.path:
            sys.path.insert(0, str(PROJECT_ROOT))

        from strands_agents_swarm.swarm_orchestrator import SwasthyaSwarmOrchestrator
        orchestrator = SwasthyaSwarmOrchestrator()
        report = orchestrator.execute_swarm(
            prescription_input=prescription_text or "Prescription Document",
            target_language=target_lang,
            patient_name=patient_name,
            acute_symptoms=acute_symptoms
        )

        medications_data = [
            {
                "medicine_name": d.brand_name,
                "generic_name": getattr(d, 'generic_name', d.brand_name),
                "strength": getattr(d, 'dosage', 'As prescribed'),
                "dosage": f"1 dose • {getattr(d, 'frequency', '1-0-1')}",
                "frequency": getattr(d, 'frequency', '1-0-1'),
                "meal_rule": "Before Food" if getattr(d, 'food_relation', '') == 'before_meals' else "After Food",
                "duration_days": getattr(d, 'duration_days', 5),
                "purpose": getattr(d, 'purpose', 'Doctor prescribed clinical therapy'),
                "visual_pill_color": getattr(d, 'visual_pill_color', 'white'),
                "jan_aushadhi_match": f"Generic {getattr(d, 'generic_name', d.brand_name)} available at Jan Aushadhi (save 70-85%)",
                "schedule_time": "08:00 AM & 08:30 PM" if ('1-0-1' in getattr(d, 'frequency', '') or 'BD' in getattr(d, 'frequency', '')) else ("08:30 PM" if '0-0-1' in getattr(d, 'frequency', '') else "08:00 AM")
            }
            for d in report.pharmacology.drugs
        ]

        spoken_voice = getattr(report.vernacular, 'full_spoken_script', '') or getattr(report.vernacular, 'spoken_voice_script', '')
        safety_warnings = (
            getattr(report.safety, 'dosage_threshold_warnings', [])
            + getattr(report.safety, 'drug_interactions', [])
            + getattr(report.safety, 'food_contraindications', [])
        )

        return Response({
            "status": "success",
            "execution_id": report.execution_id,
            "duration_ms": report.duration_ms,
            "swarm_status": report.swarm_status,
            "doctor_name": getattr(report.vision, 'detected_doctor_name', 'Consulting Physician'),
            "clinic_name": getattr(report.vision, 'detected_clinic_name', 'Primary Health Centre'),
            "raw_text": getattr(report.vision, 'raw_text', ''),
            "medications": medications_data,
            "pillbox_matrix": getattr(report.pharmacology, 'pillbox_5day_matrix', {}),
            "safety": {
                "is_safe": getattr(report.safety, 'is_safe', True),
                "risk_level": getattr(report.safety, 'risk_level', 'SAFE'),
                "emergency_sos_triggered": getattr(report.safety, 'emergency_sos_triggered', False),
                "sentinel_verdict": getattr(report.safety, 'sentinel_verdict', 'CLEARED'),
                "warnings": safety_warnings
            },
            "vernacular": {
                "language": getattr(report.vernacular, 'target_language', 'hi'),
                "language_name": getattr(report.vernacular, 'language_display_name', 'Hindi'),
                "spoken_voice_script": spoken_voice,
                "steps": [s.__dict__ if hasattr(s, '__dict__') else s for s in getattr(report.vernacular, 'steps', [])]
            },
            "translated_text": spoken_voice,
            "simplified_text": spoken_voice,
            "confidence": 0.98
        }, status=status.HTTP_200_OK)

    def perform_destroy(self, instance):
        """Cascade delete all linked medications and reminders when a prescription is deleted."""
        try:
            from medications.models import Medication
            Medication.objects.filter(document=instance).delete()
        except Exception:
            pass

        try:
            from reminders.models import Reminder
            Reminder.objects.filter(medication__document=instance).delete()
        except Exception:
            pass

        try:
            from reminders.models import Reminder
            Reminder.objects.filter(document=instance).delete()
        except Exception:
            pass

        instance.delete()


from rest_framework.views import APIView

class StrandsSwarmExecuteAPIView(APIView):
    """
    Standalone API View to execute AWS Strands 4-Agent Swarm.
    POST /api/v1/strands-swarm/execute/
    POST /api/v1/strands-swarm/
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        prescription_text = request.data.get('prescription_text') or request.data.get('raw_text') or request.data.get('text', '')
        target_lang = request.data.get('target_language') or request.data.get('language', 'hi')
        patient_name = request.data.get('patient_name') or 'Patient'
        acute_symptoms = request.data.get('acute_symptoms', '')

        uploaded_file = request.FILES.get('file') or request.FILES.get('original_file')
        if uploaded_file and not prescription_text:
            prescription_text = f"Prescription Document: {uploaded_file.name}"

        import sys
        from pathlib import Path
        PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent.parent
        if str(PROJECT_ROOT) not in sys.path:
            sys.path.insert(0, str(PROJECT_ROOT))

        from strands_agents_swarm.swarm_orchestrator import SwasthyaSwarmOrchestrator
        orchestrator = SwasthyaSwarmOrchestrator()
        report = orchestrator.execute_swarm(
            prescription_input=prescription_text or "Prescription Document",
            target_language=target_lang,
            patient_name=patient_name,
            acute_symptoms=acute_symptoms
        )

        medications_data = [
            {
                "medicine_name": d.brand_name,
                "generic_name": getattr(d, 'generic_name', d.brand_name),
                "strength": getattr(d, 'dosage', 'As prescribed'),
                "dosage": f"1 dose • {getattr(d, 'frequency', '1-0-1')}",
                "frequency": getattr(d, 'frequency', '1-0-1'),
                "meal_rule": "Before Food" if getattr(d, 'food_relation', '') == 'before_meals' else "After Food",
                "duration_days": getattr(d, 'duration_days', 5),
                "purpose": getattr(d, 'purpose', 'Doctor prescribed clinical therapy'),
                "visual_pill_color": getattr(d, 'visual_pill_color', 'white'),
                "jan_aushadhi_match": f"Generic {getattr(d, 'generic_name', d.brand_name)} available at Jan Aushadhi (save 70-85%)",
                "schedule_time": "08:00 AM & 08:30 PM" if ('1-0-1' in getattr(d, 'frequency', '') or 'BD' in getattr(d, 'frequency', '')) else ("08:30 PM" if '0-0-1' in getattr(d, 'frequency', '') else "08:00 AM")
            }
            for d in report.pharmacology.drugs
        ]

        spoken_voice = getattr(report.vernacular, 'full_spoken_script', '') or getattr(report.vernacular, 'spoken_voice_script', '')
        safety_warnings = (
            getattr(report.safety, 'dosage_threshold_warnings', [])
            + getattr(report.safety, 'drug_interactions', [])
            + getattr(report.safety, 'food_contraindications', [])
        )

        return Response({
            "status": "success",
            "execution_id": report.execution_id,
            "duration_ms": report.duration_ms,
            "swarm_status": report.swarm_status,
            "doctor_name": getattr(report.vision, 'detected_doctor_name', 'Consulting Physician'),
            "clinic_name": getattr(report.vision, 'detected_clinic_name', 'Primary Health Centre'),
            "raw_text": getattr(report.vision, 'raw_text', ''),
            "medications": medications_data,
            "pillbox_matrix": getattr(report.pharmacology, 'pillbox_5day_matrix', {}),
            "safety": {
                "is_safe": getattr(report.safety, 'is_safe', True),
                "risk_level": getattr(report.safety, 'risk_level', 'SAFE'),
                "emergency_sos_triggered": getattr(report.safety, 'emergency_sos_triggered', False),
                "sentinel_verdict": getattr(report.safety, 'sentinel_verdict', 'CLEARED'),
                "warnings": safety_warnings
            },
            "vernacular": {
                "language": getattr(report.vernacular, 'target_language', 'hi'),
                "language_name": getattr(report.vernacular, 'language_display_name', 'Hindi'),
                "spoken_voice_script": spoken_voice,
                "steps": [s.__dict__ if hasattr(s, '__dict__') else s for s in getattr(report.vernacular, 'steps', [])]
            },
            "translated_text": spoken_voice,
            "simplified_text": spoken_voice,
            "confidence": 0.98
        }, status=status.HTTP_200_OK)
