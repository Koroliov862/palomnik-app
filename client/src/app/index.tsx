import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import api from '../services/api';
import PlacesList from '../components/PlacesList';
import FilterModal from '../components/FilterModal';
import { useRouter } from 'expo-router';
import { useFavorites } from '../context/FavoritesContext';

// Тип для фильтров
interface Filters {
  denominationIds: number[];
  hasWheelchair: boolean;
  hasParking: boolean;
  isOpen247: boolean;
}

export default function Index() {
  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    denominationIds: [],
    hasWheelchair: false,
    hasParking: false,
    isOpen247: false,
  });
  const [denominations, setDenominations] = useState<any[]>([]);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const { isAuthenticated, username, logout } = useFavorites();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  // Запрос геолокации
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocationError('Нет разрешения на геолокацию');
          return;
        }
        const loc = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
      } catch (err) {
        setLocationError('Ошибка получения геолокации');
      }
    })();
  }, []);

  // Загрузка конфессий
  useEffect(() => {
    const fetchDenominations = async () => {
      try {
        const response = await api.get('/denominations/');
        setDenominations(response.data);
      } catch (err) {
        console.error('Ошибка загрузки конфессий', err);
      }
    };
    fetchDenominations();
  }, []);

  // Загрузка храмов с применёнными фильтрами и координатами
  const fetchPlaces = async (lat?: number, lon?: number) => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (lat && lon) {
        params.lat = String(lat);
        params.lon = String(lon);
      }
      if (filters.denominationIds.length) {
        params.denomination = filters.denominationIds.join(',');
      }
      if (filters.hasWheelchair) params.wheelchair = 'true';
      if (filters.hasParking) params.parking = 'true';
      if (filters.isOpen247) params.open_247 = 'true';
      const response = await api.get('/religious-places/', { params });
      setPlaces(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  // Загрузка при изменении фильтров или получении координат
  useEffect(() => {
    if (location) {
      fetchPlaces(location.latitude, location.longitude);
    } else if (locationError) {
      // Если геолокация недоступна – загружаем без координат
      fetchPlaces();
    }
  }, [filters, location]);

  const applyFilters = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  if (loading) return <ActivityIndicator size="large" />;
  if (error) return <Text>Ошибка: {error}</Text>;

  return (
    <View style={styles.container}>
      {/* Заголовочная панель */}
      <View style={styles.header}>
        <View style={styles.greeting}>
          <Text style={styles.greetingTitle}>Паломник</Text>
          <Text style={styles.greetingSubtitle}>Религиозные сооружения рядом</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
          {isAuthenticated ? (
            <>
              <Text style={{ color: '#3A2C1F', fontSize: 14 }}>{username}</Text>
              <TouchableOpacity onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={24} color="white" />
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Ionicons name="person-outline" size={24} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Строка фильтров */}
      <View style={styles.filterRow}>
        <TouchableOpacity onPress={() => setFilterVisible(true)} style={styles.filterChip}>
          <Ionicons name="options-outline" size={16} color="#C17B5E" />
          <Text style={styles.filterChipText}>Фильтры</Text>
        </TouchableOpacity>
        <View style={styles.filterChip}>
          <Text style={styles.filterChipText}>По расстоянию</Text>
        </View>
        <View style={styles.filterChip}>
          <Text style={styles.filterChipText}>По рейтингу</Text>
        </View>
      </View>

      <PlacesList places={places} />
      <FilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={applyFilters}
        denominations={denominations}
        initialFilters={filters}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F6F2',
  },
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
  greeting: {
    flex: 1,
  },
  greetingTitle: {
    fontSize: 22,
    fontWeight: '600',
    fontFamily: 'Georgia',
    color: '#3A2C1F',
  },
  greetingSubtitle: {
    fontSize: 13,
    color: '#6B6A66',
    marginTop: 4,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  filterChip: {
    backgroundColor: '#EFEBE4',
    borderRadius: 30,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  filterChipText: {
    fontSize: 12,
    color: '#C17B5E',
  },
});