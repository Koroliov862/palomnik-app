import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from '../context/FavoritesContext';
import api from '../services/api';
import PlacesList from '../components/PlacesList';

export default function FavoritesScreen() {
  const { favorites, loading: favLoading } = useFavorites();
  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (favLoading) return;
    const fetchFavorites = async () => {
      setLoading(true);
      try {
        if (favorites.length === 0) {
          setPlaces([]);
          return;
        }
        const response = await api.get('/religious-places/');
        const allPlaces = response.data;
        const favPlaces = allPlaces.filter((place: any) => favorites.includes(place.id));
        setPlaces(favPlaces);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [favorites, favLoading]);

  if (favLoading || loading) return <ActivityIndicator size="large" />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.greeting}>
          <Text style={styles.greetingTitle}>Избранное</Text>
          <Text style={styles.greetingSubtitle}>Сохранённые места</Text>
        </View>
        <View style={styles.profileIcon}>
          <Ionicons name="person-outline" size={24} color="white" />
        </View>
      </View>
      {places.length === 0 ? (
        <View style={styles.empty}>
          <Text>Нет избранных храмов</Text>
        </View>
      ) : (
        <PlacesList places={places} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F6F2' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 24,
    backgroundColor: '#E8DCCC',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  greeting: { flex: 1 },
  greetingTitle: { fontSize: 22, fontWeight: '600', fontFamily: 'Georgia', color: '#3A2C1F' },
  greetingSubtitle: { fontSize: 13, color: '#6B6A66', marginTop: 4 },
  profileIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#DCAF96', alignItems: 'center', justifyContent: 'center' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});