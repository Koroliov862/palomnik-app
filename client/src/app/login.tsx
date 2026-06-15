import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, TouchableOpacity, StyleSheet } from 'react-native';
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

  const handleCancel = () => {
    router.replace('/'); // перенаправление на главный экран без авторизации
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Вход</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <View style={styles.buttonRow}>
        <View style={styles.button}>
          <Button title="Войти" onPress={handleLogin} />
        </View>
        <View style={styles.button}>
          <Button title="Отмена" onPress={handleCancel} color="#6B6A66" />
        </View>
      </View>
      {/* Ссылка на регистрацию */}
      <View style={styles.registerContainer}>
        <TouchableOpacity onPress={() => router.push('/register')}>
          <Text style={styles.registerText}>Нет аккаунта? Зарегистрироваться</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  button: { flex: 1 },
  registerContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  registerText: {
    color: '#C17B5E',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});