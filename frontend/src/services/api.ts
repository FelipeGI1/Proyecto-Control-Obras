import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000', // La URL de tu Backend (NestJS)
});

// Interceptor para enviar el Token automáticamente en cada petición
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});