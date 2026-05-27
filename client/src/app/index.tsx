// app/index.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import api from '../services/api';
import PlacesList from '../components/PlacesList';

export default function Index() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    try {
      const response = await api.get('/religious-places/');
      setPlaces(response.data);
    } catch (err) {
      setError((err as any).message || 'Произошла неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator size="large" />;
  if (error) return <Text>Ошибка: {error}</Text>;

  return <PlacesList places={places} />;
}