// src/services/authService.js
import api from './api';

export async function login(email, password) {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
}

export async function register(email, password, name) {
  const response = await api.post('/auth/register', { email, password, name });
  return response.data;
}

export async function getCurrentUser() {
  const response = await api.get('/auth/me');
  return response.data;
}