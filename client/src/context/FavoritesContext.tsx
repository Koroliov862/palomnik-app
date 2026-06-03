// context/FavoritesContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

interface FavoritesContextType {
  favorites: number[];
  loading: boolean;
  addFavorite: (placeId: number) => Promise<void>;
  removeFavorite: (placeId: number) => Promise<void>;
  isFavorite: (placeId: number) => boolean;
  isAuthenticated: boolean;
  username: string | null;
  login: (token: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

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

  // Загрузка состояния авторизации при старте
  useEffect(() => {
    const loadAuth = async () => {
      const token = await AsyncStorage.getItem('authToken');
      const storedUsername = await AsyncStorage.getItem('username');
      if (token && storedUsername) {
        setIsAuthenticated(true);
        setUsername(storedUsername);
      }
    };
    loadAuth().then(() => loadFavorites());
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

  const login = async (token: string, username: string) => {
    await AsyncStorage.setItem('authToken', token);
    await AsyncStorage.setItem('username', username);
    setIsAuthenticated(true);
    setUsername(username);
    // После логина загружаем избранное
    await loadFavorites();
  };

  const logout = async () => {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('username');
    setIsAuthenticated(false);
    setUsername(null);
    setFavorites([]);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        loading,
        addFavorite,
        removeFavorite,
        isFavorite,
        isAuthenticated,
        username,
        login,
        logout,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites must be used within FavoritesProvider');
  return context;
};