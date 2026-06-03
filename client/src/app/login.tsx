import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useFavorites } from '../context/FavoritesContext';
import api from '../services/api';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useFavorites();
  const router = useRouter();

  const handleLogin = async () => {
    console.log('Отправка запроса с:', { username, password });
    try {
      const response = await api.post('/auth/token/login/', { username, password });
      console.log('Полный ответ:', response);
      const token = response.data.auth_token;
      if (token) {
        await login(token, username);
        Alert.alert('Успех', 'Вход выполнен');
        router.replace('/');
      } else {
        Alert.alert('Ошибка', 'Токен не получен');
      }
    } catch (error: any) {
      console.error('Ошибка:', error);
      if (error.response) {
        console.log('Статус:', error.response.status);
        console.log('Данные:', error.response.data);
        Alert.alert('Ошибка', `Статус ${error.response.status}: ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        Alert.alert('Ошибка', 'Сервер не отвечает');
      } else {
        Alert.alert('Ошибка', error.message);
      }
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Логин</Text>
      <TextInput placeholder="Username" value={username} onChangeText={setUsername} />
      <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <Button title="Войти" onPress={handleLogin} />
    </View>
  );
}