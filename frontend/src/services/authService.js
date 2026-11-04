import api from './api';

export const authService = {
  async registerWorker(data) {
    const res = await api.post('/auth/register/worker', data);
    return res.data;
  },

  async registerEmployer(data) {
    const res = await api.post('/auth/register/employer', data);
    return res.data;
  },

  async login(credentials) {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },

  async getCurrentUser() {
    const res = await api.get('/auth/me');
    return res.data;
  },

  logout() {
    localStorage.removeItem('rozgaar_token');
    localStorage.removeItem('rozgaar_user');
  },

  getStoredToken() {
    return localStorage.getItem('rozgaar_token');
  },

  getStoredUser() {
    const user = localStorage.getItem('rozgaar_user');
    return user ? JSON.parse(user) : null;
  },

  setAuthData(authResponse) {
    localStorage.setItem('rozgaar_token', authResponse.token);
    const user = {
      userId: authResponse.userId,
      name: authResponse.name,
      email: authResponse.email,
      role: authResponse.role,
      profileId: authResponse.profileId,
    };
    localStorage.setItem('rozgaar_user', JSON.stringify(user));
    return user;
  },
};
