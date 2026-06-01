import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { BASE_URL } from '../services/api';

interface ReligiousPlace {
  id: number;
  name: string;
  distance?: number;
  average_rating?: number;
  is_open_247?: boolean;
  accessibility?: {
    has_wheelchair_access: boolean;
    has_parking: boolean;
  };
  photos?: { image_url: string }[];
}

interface PlacesListProps {
  places: ReligiousPlace[];
}

const PlacesList: React.FC<PlacesListProps> = ({ places }) => {
  const router = useRouter();

  const onCardPress = (id: number) => {
    router.push(`/place/${id}` as any); // если TypeScript ругается, используйте as any или путь с параметрами
  };

  const renderItem = ({ item }: { item: ReligiousPlace }) => {
    const photoUrl = item.photos?.[0]?.image_url;
    const imageSource = photoUrl
      ? { uri: `${BASE_URL}${photoUrl}` }
      : { uri: 'https://placehold.co/80x80?text=Фото' };

    const hasWheelchair = item.accessibility?.has_wheelchair_access || false;
    const hasParking = item.accessibility?.has_parking || false;
    const isOpen247 = item.is_open_247 || false;

    return (
      <TouchableOpacity onPress={() => onCardPress(item.id)} activeOpacity={0.7}>
        <View style={styles.card}>
          <Image source={imageSource} style={styles.image} />
          <View style={styles.info}>
            <Text style={styles.name}>{item.name}</Text>
            <View style={styles.metaRow}>
              <Text style={styles.distance}>
                📍 {item.distance ? `${item.distance.toFixed(1)} км` : '—'}
              </Text>
              {item.average_rating ? (
                <Text style={styles.rating}>⭐ {item.average_rating.toFixed(1)}</Text>
              ) : null}
            </View>
            <View style={styles.badges}>
              {hasWheelchair && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>♿ Пандус</Text>
                </View>
              )}
              {hasParking && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>🅿️ Парковка</Text>
                </View>
              )}
              {isOpen247 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>🕒 Круглосуточно</Text>
                </View>
              )}
            </View>
          </View>
          <TouchableOpacity style={styles.favoriteBtn}>
            <Text style={styles.favoriteIcon}>🤍</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
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
  list: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#F8F6F2',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 16,
    marginRight: 12,
    backgroundColor: '#EFEBE4',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Georgia',
    marginBottom: 4,
    color: '#3A2C1F',
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 6,
  },
  distance: {
    fontSize: 13,
    color: '#6B6A66',
  },
  rating: {
    fontSize: 13,
    color: '#C7A86B',
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    backgroundColor: '#EFEBE4',
    borderRadius: 30,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 11,
    color: '#C17B5E',
  },
  favoriteBtn: {
    alignSelf: 'flex-start',
    padding: 8,
  },
  favoriteIcon: {
    fontSize: 22,
    color: '#C17B5E',
  },
});

export default PlacesList;