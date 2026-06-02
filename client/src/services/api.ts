import axios from 'axios';

// Замените на реальный IP вашего компьютера в локальной сети
export const BASE_URL = 'http://192.168.88.97:8000';
export const API_URL = `${BASE_URL}/api`;

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

export default api;