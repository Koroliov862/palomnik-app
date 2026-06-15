import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FavoritesProvider } from '../context/FavoritesContext';

export default function Layout() {
  return (
    <FavoritesProvider>
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Список',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Ionicons name="list" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Карта',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Ionicons name="map" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Избранное',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Ionicons name="star-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen name="login" options={{ title: 'Вход', href: null }} />
      <Tabs.Screen name="place/[id]" options={{ href: null }} />
      <Tabs.Screen name="register" options={{ href: null}} />
    </Tabs>
    </FavoritesProvider>
  );
}