import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Platform, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import api from '../services/api';

interface Place {
  id: number;
  name: string;
  address?: { latitude: number; longitude: number };
}

export default function MapScreen() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    try {
      const response = await api.get('/religious-places/');
      setPlaces(response.data);
    } catch (error) {
      console.error('Ошибка загрузки храмов для карты', error);
    } finally {
      setLoading(false);
    }
  };

  // Для веба – заглушка (без импорта react-native-maps)
  if (Platform.OS === 'web') {
    return (
      <View style={styles.webPlaceholder}>
        <Ionicons name="map-outline" size={48} color="#C17B5E" />
        <Text style={styles.webText}>Карта доступна только в мобильном приложении</Text>
      </View>
    );
  }

  // Динамический импорт для нативных платформ
  const MapView = require('react-native-maps').default;
  const Marker = require('react-native-maps').Marker;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#C17B5E" />
      </View>
    );
  }

  const validPlaces = places.filter(p => p.address?.latitude && p.address?.longitude);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 51.759,
          longitude: 55.090,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        }}
      >
        {validPlaces.map(place => (
          <Marker
            key={place.id}
            coordinate={{
              latitude: place.address!.latitude,
              longitude: place.address!.longitude,
            }}
            title={place.name}
            onPress={() => router.push(`/place/${place.id}`)}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  webPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F6F2',
    padding: 20,
  },
  webText: {
    fontSize: 18,
    color: '#6B6A66',
    marginTop: 16,
    textAlign: 'center',
    fontFamily: 'Georgia',
  },
});