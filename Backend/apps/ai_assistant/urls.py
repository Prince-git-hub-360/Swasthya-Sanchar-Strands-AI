from django.urls import path
from .views import MedicineAssistantView, AgenticAssistantView, StrandsSwarmAssistantView

urlpatterns = [
    path('medicine/', MedicineAssistantView.as_view(), name='ai-medicine-assistant'),
    path('medicine', MedicineAssistantView.as_view(), name='ai-medicine-assistant-no-slash'),
    path('agent/', AgenticAssistantView.as_view(), name='ai-agentic-assistant'),
    path('agent', AgenticAssistantView.as_view(), name='ai-agentic-assistant-no-slash'),
    path('swarm/', StrandsSwarmAssistantView.as_view(), name='ai-strands-swarm'),
    path('swarm', StrandsSwarmAssistantView.as_view(), name='ai-strands-swarm-no-slash'),
]
