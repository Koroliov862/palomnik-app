import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';
import PlacesList from '../components/PlacesList';
import FilterModal from '../components/FilterModal';

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

  // Загрузка храмов с применёнными фильтрами
  const fetchPlaces = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
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

  useEffect(() => {
    fetchPlaces();
  }, [filters]);

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
        <View style={styles.profileIcon}>
          <Ionicons name="person-outline" size={24} color="white" />
        </View>
      </View>

      {/* Строка фильтров (как в образце) */}
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
    paddingTop: 8,
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
    fontFamily: 'Georgia', // можно заменить на 'PlayfairDisplay-Regular'
    color: '#3A2C1F',
  },
  greetingSubtitle: {
    fontSize: 13,
    color: '#6B6A66',
    marginTop: 4,
  },
  profileIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#DCAF96',
    alignItems: 'center',
    justifyContent: 'center',
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