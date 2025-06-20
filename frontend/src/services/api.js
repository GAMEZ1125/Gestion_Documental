// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://gamez-solutions.ddns.net:4005/api', // Asegúrate de que coincida con tu backend
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
