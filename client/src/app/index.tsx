import React, { useEffect, useState } from 'react';
import { Text, ActivityIndicator, Platform } from 'react-native';
import api from '../services/api';
import PlacesList from '../components/PlacesList';
import * as Location from 'expo-location';

// Определяем тип для координат
interface Coords {
  latitude: number;
  longitude: number;
}

export default function Index() {
  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<Coords | null>(null);

  // Запрос геолокации (только для нативных платформ)
  useEffect(() => {
    if (Platform.OS === 'web') {
      // Для веба используем фиксированные координаты (например, центр Москвы)
      setLocation({ latitude: 55.7512, longitude: 37.6184 });
      setLoading(false);
      return;
    }

    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Нет разрешения на определение местоположения');
          setLoading(false);
          return;
        }
        let loc = await Location.getCurrentPositionAsync({});
        setLocation(loc.coords);
      } catch (err) {
        setError('Ошибка получения геолокации');
        setLoading(false);
      }
    })();
  }, []);

  // Загрузка списка храмов с учётом координат
  const fetchPlaces = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (location) {
        params.lat = location.latitude;
        params.lon = location.longitude;
      }
      const response = await api.get('/religious-places/', { params });
      setPlaces(response.data);
    } catch (err: any) {
      setError(err.message || 'Произошла неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, [location]);

  if (loading) return <ActivityIndicator size="large" />;
  if (error) return <Text>Ошибка: {error}</Text>;

  return <PlacesList places={places} />;
}