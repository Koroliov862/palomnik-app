import React, { useState } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity, StyleSheet } from 'react-native';
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
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Вход</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          placeholderTextColor="#A89F94"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#A89F94"
        />
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Войти</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Отмена</Text>
        </TouchableOpacity>
        <View style={styles.registerContainer}>
          <TouchableOpacity onPress={() => router.push('/register')}>
            <Text style={styles.registerText}>Нет аккаунта? Зарегистрироваться</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F6F2',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Georgia',
    color: '#3A2C1F',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#F8F6F2',
    borderWidth: 1,
    borderColor: '#E5E0D8',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
    color: '#3A2C1F',
  },
  loginButton: {
    backgroundColor: '#C17B5E',
    borderRadius: 40,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#EFEBE4',
    borderRadius: 40,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  cancelButtonText: {
    color: '#6B6A66',
    fontSize: 16,
    fontWeight: '500',
  },
  registerContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  registerText: {
    color: '#C17B5E',
    fontSize: 14,
    textDecorationLine: 'underline',
    fontFamily: 'Georgia',
  },
});