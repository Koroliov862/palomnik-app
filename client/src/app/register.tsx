import React, { useState } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import api from '../services/api';

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    console.log('Кнопка нажата, username:', username, 'email:', email);
    try {
      console.log('Отправка запроса на /auth/users/');
      const response = await api.post('/auth/users/', { username, email, password });
      console.log('Ответ сервера:', response.data);
      Alert.alert('Успех', 'Регистрация прошла. Теперь войдите.');
      router.replace('/login');
    } catch (err: any) {
      console.error('Ошибка регистрации:', err.response?.data || err.message);
      Alert.alert('Ошибка', err.response?.data?.detail || 'Не удалось зарегистрироваться');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Регистрация</Text>
        <TextInput
          style={styles.input}
          placeholder="Имя пользователя"
          value={username}
          onChangeText={setUsername}
          placeholderTextColor="#A89F94"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#A89F94"
        />
        <TextInput
          style={styles.input}
          placeholder="Пароль"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#A89F94"
        />
        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>Зарегистрироваться</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginLink} onPress={() => router.push('/login')}>
          <Text style={styles.loginLinkText}>Уже есть аккаунт? Войти</Text>
        </TouchableOpacity>
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
  registerButton: {
    backgroundColor: '#C17B5E',
    borderRadius: 40,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  loginLink: {
    marginTop: 16,
    alignItems: 'center',
  },
  loginLinkText: {
    color: '#C17B5E',
    fontSize: 14,
    textDecorationLine: 'underline',
    fontFamily: 'Georgia',
  },
});