import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
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
      <Text style={styles.title}>Регистрация</Text>
      <TextInput placeholder="Имя пользователя" value={username} onChangeText={setUsername} style={styles.input} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" autoCapitalize="none" />
      <TextInput placeholder="Пароль" secureTextEntry value={password} onChangeText={setPassword} style={styles.input} />
      <Button title="Зарегистрироваться" onPress={handleRegister} />
      <Button title="Уже есть аккаунт? Войти" onPress={() => router.push('/login')} color="#6B6A66" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#F8F6F2' },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center', fontFamily: 'Georgia' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 16, backgroundColor: '#fff' },
});