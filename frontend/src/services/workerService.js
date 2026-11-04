import api from './api';

export const workerService = {
  async getProfile() {
    const res = await api.get('/worker/profile');
    return res.data;
  },

  async updateProfile(profileData) {
    const res = await api.put('/worker/profile', profileData);
    return res.data;
  },
};
