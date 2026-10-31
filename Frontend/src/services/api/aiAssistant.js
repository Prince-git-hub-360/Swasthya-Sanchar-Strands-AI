import { request } from './client';

export const aiAssistantApi = {
  /**
   * Query the Swasthya Mitr AI Medicine Assistant backend (Google Gemini proxy).
   * @param {Object} payload - { question, medicine, language, conversation_history }
   */
  async queryMedicineAssistant(payload) {
    return request('/ai-assistant/medicine/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Query the Autonomous Swasthya Agentic Companion (Meta Llama ReAct loop with tool calling).
   * @param {Object} payload - { message, language, is_proactive, patient_id, context }
   */
  async queryAgenticAssistant(payload) {
    return request('/ai-assistant/agent/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Execute the AWS Strands Agents SDK 4-Agent Collaborative Swarm:
   * (RxVisionAgent -> RxPharmacologyAgent -> RxSafetySentinel -> RxVernacularCommunicator).
   * Persists medicines, 5-day pillbox reminders, and SOS escalations.
   * @param {Object} payload - { prescription_text, language, acute_symptoms, patient_id, save_to_db }
   */
  async queryStrandsSwarm(payload) {
    return request('/ai-assistant/swarm/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
