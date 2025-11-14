import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

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
  signup: (userData) => api.post('/auth/signup', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
};

export const habitAPI = {
  addHabit: (habitData) => api.post('/habits', habitData),
  getHabits: () => api.get('/habits'),
  updateHabit: (id, habitData) => api.put(`/habits/${id}`, habitData),
  deleteHabit: (id) => api.delete(`/habits/${id}`),
  getHabitAnalytics: (id) => api.get(`/habits/${id}/analytics`),
  toggleHabitCompletion: (id) => api.put(`/habits/${id}/toggle`),
  getUserXpHistory: () => api.get('/habits/xp-history'),
};

export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (userData) => api.put('/user/profile', userData),
  getXP: () => api.get('/user/xp'),
};

export const leaderboardAPI = {
  getLeaderboard: () => api.get('/leaderboard'),
  getGroups: () => api.get('/leaderboard/groups'),
  getUserRank: () => api.get('/leaderboard/rank'),
};

export default api;