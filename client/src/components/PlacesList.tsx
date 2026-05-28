import React from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import api from '../services/api';

interface ReligiousPlace {
  id: number;
  name: string;
  distance?: number;
  average_rating?: number;
  photos?: { image_url: string }[];   // добавляем поле photos
}

interface PlacesListProps {
  places: ReligiousPlace[];
}

const PlacesList: React.FC<PlacesListProps> = ({ places }) => {
  const renderItem = ({ item }: { item: ReligiousPlace }) => {
    // Безопасно получаем URL первого фото (если есть)
    const photoUrl = item.photos?.[0]?.image_url;
    const imageSource = photoUrl
      ? { uri: `${api.defaults.baseURL}${photoUrl}` }
      : { uri: 'https://placehold.co/80x80' }; // заглушка

    return (
      <View style={styles.card}>
        <Image source={imageSource} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.distance}>
            {item.distance ? `${item.distance.toFixed(1)} км` : '—'}
          </Text>
          {item.average_rating ? (
            <Text style={styles.rating}>⭐ {item.average_rating.toFixed(1)}</Text>
          ) : null}
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={places}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: { padding: 16 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  image: { width: 80, height: 80, borderRadius: 16, marginRight: 12, backgroundColor: '#EFEBE4' },
  info: { flex: 1, justifyContent: 'center' },
  name: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  distance: { fontSize: 13, color: '#6B6A66', marginBottom: 4 },
  rating: { fontSize: 13, color: '#C7A86B' },
});

export default PlacesList;