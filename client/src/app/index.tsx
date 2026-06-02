import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
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
    <View style={{ flex: 1 }}>
      <View style={{ padding: 16, flexDirection: 'row', justifyContent: 'flex-start' }}>
        <TouchableOpacity onPress={() => setFilterVisible(true)} style={{ backgroundColor: '#C17B5E', padding: 8, borderRadius: 30 }}>
          <Ionicons name="options-outline" size={24} color="white" />
        </TouchableOpacity>
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