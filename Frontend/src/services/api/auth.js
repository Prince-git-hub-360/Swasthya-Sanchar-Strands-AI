import { request } from './client';

export const authApi = {
  async login(username, password) {
    return request('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  async register(userData) {
    return request('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  async getProfile() {
    return request('/auth/profile/', {
      method: 'GET',
    });
  },

  async updateProfile(profileData) {
    return request('/auth/profile/', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  async refreshToken(refreshToken) {
    return request('/auth/token/refresh/', {
      method: 'POST',
      body: JSON.stringify({ refresh: refreshToken }),
    });
  },

  async logout() {
    return request('/auth/logout/', {
      method: 'POST',
    }).catch(() => ({}));
  },

  async sendOtp(phoneOrEmail) {
    const isEmail = String(phoneOrEmail).includes('@');
    return request('/auth/otp/send/', {
      method: 'POST',
      body: JSON.stringify(isEmail ? { email: phoneOrEmail } : { phone: phoneOrEmail }),
    });
  },

  async verifyOtp(otp, expectedOtp) {
    return request('/auth/otp/verify/', {
      method: 'POST',
      body: JSON.stringify({ otp, expected_otp: expectedOtp }),
    });
  },

  async checkUsername(username) {
    return request(`/auth/check-username/?username=${encodeURIComponent(username)}`, {
      method: 'GET',
    });
  },

  async googleAuth(credential, role = 'patient', language = 'en') {
    return request('/auth/google/', {
      method: 'POST',
      body: JSON.stringify({ credential, role, language }),
    });
  },
};
