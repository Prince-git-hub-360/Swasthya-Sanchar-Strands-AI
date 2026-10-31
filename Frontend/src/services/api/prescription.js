import { request } from './client';

export const prescriptionApi = {
  async parsePrescriptionText(raw_text, target_language = 'hi') {
    return request('/medical-documents/parse-text/', {
      method: 'POST',
      body: JSON.stringify({ raw_text, target_language }),
    });
  },

  async translateText(text, target_language = 'hi') {
    return request('/translate/', {
      method: 'POST',
      body: JSON.stringify({ text, target_language }),
    });
  },

  async textToSpeech(text, target_language = 'hi') {
    return request('/voice/text-to-speech/', {
      method: 'POST',
      body: JSON.stringify({ text, target_language }),
    });
  },
};
