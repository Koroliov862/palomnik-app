import axios from 'axios';

// Замените на реальный IP вашего компьютера в локальной сети
export const BASE_URL = 'http://localhost:8000';
export const API_URL = `${BASE_URL}/api`;

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

export default api;