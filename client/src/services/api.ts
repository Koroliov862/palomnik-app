import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Замените на реальный IP вашего компьютера в локальной сети
export const BASE_URL = 'http://159.194.237.50';
export const API_URL = `${BASE_URL}/api`;

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

// Добавляем перехватчик для токена
api.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export default api;