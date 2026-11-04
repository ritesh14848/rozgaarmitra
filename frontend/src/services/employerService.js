import api from './api';

export const employerService = {
  async getProfile() {
    const res = await api.get('/employer/profile');
    return res.data;
  },

  async updateProfile(profileData) {
    const res = await api.put('/employer/profile', profileData);
    return res.data;
  },

  async getMyJobs() {
    const res = await api.get('/employer/jobs');
    return res.data;
  },

  async getAllApplications() {
    const res = await api.get('/employer/applications');
    return res.data;
  },

  async getJobApplications(jobId) {
    const res = await api.get(`/employer/jobs/${jobId}/applications`);
    return res.data;
  },

  async updateApplicationStatus(applicationId, status) {
    const res = await api.patch(`/employer/applications/${applicationId}/status`, { status });
    return res.data;
  },
};
