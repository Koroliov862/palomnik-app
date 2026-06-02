import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

interface FavoritesContextType {
  favorites: number[];
  loading: boolean;
  addFavorite: (placeId: number) => Promise<void>;
  removeFavorite: (placeId: number) => Promise<void>;
  isFavorite: (placeId: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        setFavorites([]);
        setLoading(false);
        return;
      }
      const response = await api.get('/favorites/', {
        headers: { Authorization: `Token ${token}` }
      });
      const ids = response.data.map((item: any) => item.religious_place);
      setFavorites(ids);
    } catch (error) {
      console.error('Ошибка загрузки избранного', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const addFavorite = async (placeId: number) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('Не авторизован');
      await api.post('/favorites/', { religious_place: placeId }, {
        headers: { Authorization: `Token ${token}` }
      });
      setFavorites(prev => [...prev, placeId]);
    } catch (error) {
      console.error('Ошибка добавления в избранное', error);
    }
  };

  const removeFavorite = async (placeId: number) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('Не авторизован');
      // Получим список избранного, чтобы найти id записи
      const response = await api.get('/favorites/', {
        headers: { Authorization: `Token ${token}` }
      });
      const favItem = response.data.find((item: any) => item.religious_place === placeId);
      if (favItem) {
        await api.delete(`/favorites/${favItem.id}/`, {
          headers: { Authorization: `Token ${token}` }
        });
        setFavorites(prev => prev.filter(id => id !== placeId));
      }
    } catch (error) {
      console.error('Ошибка удаления из избранного', error);
    }
  };

  const isFavorite = (placeId: number) => favorites.includes(placeId);

  return (
    <FavoritesContext.Provider value={{ favorites, loading, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites must be used within FavoritesProvider');
  return context;
};