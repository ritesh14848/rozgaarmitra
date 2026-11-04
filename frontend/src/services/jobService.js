import api from './api';

export const jobService = {
  async getJobs(params = {}) {
    const res = await api.get('/jobs', { params });
    return res.data;
  },

  async getJobById(id) {
    const res = await api.get(`/jobs/${id}`);
    return res.data;
  },

  async createJob(jobData) {
    const res = await api.post('/jobs', jobData);
    return res.data;
  },

  async updateJob(id, jobData) {
    const res = await api.put(`/jobs/${id}`, jobData);
    return res.data;
  },

  async updateJobStatus(id, status) {
    const res = await api.patch(`/jobs/${id}/status`, { status });
    return res.data;
  },

  async applyForJob(jobId) {
    const res = await api.post('/applications', { jobId });
    return res.data;
  },

  async getMyApplications() {
    const res = await api.get('/applications/my');
    return res.data;
  },
};
