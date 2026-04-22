import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
          refresh: refreshToken,
        });
        
        localStorage.setItem('access_token', response.data.access);
        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/register/', userData),
  login: (credentials) => api.post('/login/', credentials),
  getProfile: () => api.get('/me/'),
  updateProfile: (data) => api.put('/me/', data),
};

// Rooms API
export const roomsAPI = {
  getAll: () => api.get('/rooms/'),
  getAvailable: (params) => api.get('/rooms/available/', { params }),
  getById: (id) => api.get(`/rooms/${id}/`),
  create: (data) => api.post('/rooms/', data),
  update: (id, data) => api.put(`/rooms/${id}/`, data),
  delete: (id) => api.delete(`/rooms/${id}/`),
};

// Reservations API
export const reservationsAPI = {
  getAll: () => api.get('/reservations/'),
  getMyReservations: () => api.get('/my-reservations/'),
  create: (data) => api.post('/reservations/', data),
  getById: (id) => api.get(`/reservations/${id}/`),
  update: (id, data) => api.put(`/reservations/${id}/`, data),
  cancel: (id) => api.post(`/reservations/${id}/cancel/`),
};

export default api;