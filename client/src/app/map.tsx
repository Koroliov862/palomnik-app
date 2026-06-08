import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';
import { useRouter } from 'expo-router';

interface Place {
  id: number;
  name: string;
  address?: {
    latitude: number;
    longitude: number;
  };
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#C17B5E" />
      </View>
    );
  }

  // Фильтруем места, у которых есть координаты
  const validPlaces = places.filter(place => place.address?.latitude && place.address?.longitude);

  // Начальная область карты – центр Оренбурга (можно заменить на ваш город)
  const initialRegion = {
    latitude: 51.759,   // широта Оренбурга
    longitude: 55.090,  // долгота Оренбурга
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.greeting}>
          <Text style={styles.greetingTitle}>Карта</Text>
          <Text style={styles.greetingSubtitle}>Храмы на карте</Text>
        </View>
        <View style={styles.profileIcon}>
          <Ionicons name="person-outline" size={24} color="white" />
        </View>
      </View>
      <MapView style={styles.map} initialRegion={initialRegion}>
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
  container: { flex: 1, backgroundColor: '#F8F6F2' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
    backgroundColor: '#E8DCCC',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  greeting: { flex: 1 },
  greetingTitle: { fontSize: 22, fontWeight: '600', fontFamily: 'Georgia', color: '#3A2C1F' },
  greetingSubtitle: { fontSize: 13, color: '#6B6A66', marginTop: 4 },
  profileIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#DCAF96', alignItems: 'center', justifyContent: 'center' },
  map: { flex: 1, margin: 16, borderRadius: 20 },
});