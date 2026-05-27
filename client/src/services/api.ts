import axios from 'axios';

// Замените на реальный IP вашего компьютера в локальной сети
const BASE_URL = 'http://192.168.100.16/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export default api;