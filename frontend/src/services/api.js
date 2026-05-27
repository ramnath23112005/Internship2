import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const campaignAPI = {
  getAll: (params) => api.get('/campaigns', { params }),
  getOne: (id) => api.get(`/campaigns/${id}`),
  create: (data) => api.post('/campaigns', data),
  update: (id, data) => api.put(`/campaigns/${id}`, data),
  delete: (id) => api.delete(`/campaigns/${id}`),
  join: (id) => api.post(`/campaigns/${id}/join`),
  getAITips: (id) => api.get(`/campaigns/${id}/ai-tips`),
};

export const donationAPI = {
  create: (data) => api.post('/donations', data),
  getAll: (params) => api.get('/donations', { params }),
  getStats: () => api.get('/donations/stats'),
};

export const notificationAPI = {
  getAll: (params) => api.get('/notifications', { params }),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
};

export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getVolunteer: () => api.get('/analytics/volunteer'),
};

export const certificateAPI = {
  generate: (data) => api.post('/certificates', data),
  getAll: () => api.get('/certificates'),
  verify: (id) => api.get(`/certificates/verify/${id}`),
};

export const userAPI = {
  getAll: (params) => api.get('/users', { params }),
  updateRole: (id, role) => api.put(`/users/${id}/role`, { role }),
  toggleStatus: (id) => api.put(`/users/${id}/status`),
};

export const aiAPI = {
  getTips: (campaignId) => api.get(`/ai/tips/${campaignId}`),
  generateDescription: (data) => api.post('/ai/generate-description', data),
};

export default api;
