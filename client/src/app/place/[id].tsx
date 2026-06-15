import { useLocalSearchParams, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, Linking, TouchableOpacity, TextInput, Alert, Button } from 'react-native';
import api from '../../services/api';
import { BASE_URL } from '../../services/api';
import { StyleSheet } from 'react-native';
import FavoriteButton from '../../components/FavoriteButton';
import { useFavorites } from '../../context/FavoritesContext';

interface PlaceDetail {
  id: number;
  name: string;
  description: string;
  address?: {
    address_line: string;
    city: string;
    latitude: number;
    longitude: number;
  };
  contact?: {
    phone: string;
    website: string;
  };
  accessibility?: {
    has_wheelchair_access: boolean;
    has_parking: boolean;
  };
  opening_hours_summary?: string;
  average_rating?: number;
  ratings_count?: number;
  photos?: { image_url: string; is_main: boolean }[];
}

export default function PlaceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [place, setPlace] = useState<PlaceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<any[]>([]);
  const [newRating, setNewRating] = useState('');
  const [newComment, setNewComment] = useState('');
  const { isAuthenticated } = useFavorites();

  useEffect(() => {
    if (id) {
      fetchPlaceDetail();
    }
  }, [id]);

  const fetchPlaceDetail = async () => {
    try {
      const response = await api.get(`/religious-places/${id}/`);
      setPlace(response.data);
      // загружаем отзывы
      const numericId = Number(id);
      const reviewsRes = await api.get(`/reviews/?religious_place=${numericId}`);
      setReviews(reviewsRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async () => {
    if (!newRating || !newComment) {
      Alert.alert('Ошибка', 'Заполните оценку и комментарий');
      return;
    }
    try {
      await api.post('/reviews/', {
        religious_place: place?.id,
        rating: parseInt(newRating),
        comment: newComment,
      });
      // обновляем отзывы
      const reviewsRes = await api.get(`/reviews/?religious_place=${id}`);
      setReviews(reviewsRes.data);
      setNewRating('');
      setNewComment('');
      Alert.alert('Успех', 'Отзыв добавлен');
    } catch (err: any) {
      Alert.alert('Ошибка', err.response?.data?.detail || 'Не удалось добавить отзыв');
    }
  };

  const openPhone = () => {
    if (place?.contact?.phone) {
      Linking.openURL(`tel:${place.contact.phone}`);
    }
  };

  const openWebsite = () => {
    if (place?.contact?.website) {
      Linking.openURL(place.contact.website);
    }
  };

  const openMaps = () => {
    if (place?.address) {
      const url = `https://yandex.ru/maps/?pt=${place.address.longitude},${place.address.latitude}&z=18`;
      Linking.openURL(url);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#C17B5E" />
      </View>
    );
  }

  if (!place) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Храм не найден</Text>
      </View>
    );
  }

  const mainPhoto = place.photos?.find(p => p.is_main) || place.photos?.[0];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F8F6F2' }}>
      <Stack.Screen options={{ title: place.name }} />

      {/* Фото */}
      {mainPhoto && (
        <Image
          source={{ uri: `${BASE_URL}${mainPhoto.image_url}` }}
          style={{ width: '100%', height: 240 }}
          resizeMode="cover"
        />
      )}

      <View style={{ padding: 20 }}>
        {/* Название и кнопка избранного */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <Text style={{ fontSize: 28, fontFamily: 'Georgia', color: '#3A2C1F', flex: 1 }}>
            {place.name}
          </Text>
          <FavoriteButton placeId={place.id} size={28} />
        </View>
        
        {/* Рейтинг */}
        {place.average_rating ? (
          <Text style={{ fontSize: 16, color: '#C7A86B', marginBottom: 16 }}>
            ⭐ {place.average_rating.toFixed(1)} ({place.ratings_count} оценок)
          </Text>
        ) : null}

        {/* Адрес */}
        {place.address && (
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontWeight: '600', marginBottom: 4 }}>📍 Адрес</Text>
            <Text style={{ color: '#6B6A66' }}>{place.address.address_line}, {place.address.city}</Text>
          </View>
        )}

        {/* Контакты */}
        {(place.contact?.phone || place.contact?.website) && (
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontWeight: '600', marginBottom: 4 }}>📞 Контакты</Text>
            {place.contact?.phone && (
              <TouchableOpacity onPress={openPhone}>
                <Text style={{ color: '#C17B5E', marginBottom: 4 }}>{place.contact.phone}</Text>
              </TouchableOpacity>
            )}
            {place.contact?.website && (
              <TouchableOpacity onPress={openWebsite}>
                <Text style={{ color: '#C17B5E' }}>{place.contact.website}</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Доступность */}
        {(place.accessibility?.has_wheelchair_access || place.accessibility?.has_parking) && (
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontWeight: '600', marginBottom: 4 }}>♿ Доступность</Text>
            <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
              {place.accessibility?.has_wheelchair_access && (
                <Text style={styles.badge}>Пандус</Text>
              )}
              {place.accessibility?.has_parking && (
                <Text style={styles.badge}>Парковка</Text>
              )}
            </View>
          </View>
        )}

        {/* Часы работы */}
        {place.opening_hours_summary && (
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontWeight: '600', marginBottom: 4 }}>🕒 Часы работы</Text>
            <Text style={{ color: '#6B6A66' }}>{place.opening_hours_summary}</Text>
          </View>
        )}

        {/* ========== ОТЗЫВЫ ========== */}
        <Text style={styles.sectionTitle}>Отзывы</Text>
        {reviews.length === 0 ? (
          <Text style={{ color: '#6B6A66', marginBottom: 16 }}>Пока нет отзывов. Будьте первым!</Text>
        ) : (
          reviews.map(review => (
            <View key={review.id} style={styles.reviewItem}>
              <Text style={styles.reviewAuthor}>{review.user}</Text>
              <Text style={{ marginVertical: 4 }}>⭐ {review.rating}</Text>
              <Text style={{ color: '#4B4A47' }}>{review.comment}</Text>
            </View>
          ))
        )}

        {isAuthenticated ? (
          <View style={styles.reviewForm}>
            <Text style={styles.sectionTitle}>Оставить отзыв</Text>
            <TextInput
              placeholder="Оценка (1-5)"
              keyboardType="numeric"
              value={newRating}
              onChangeText={setNewRating}
              style={styles.input}
            />
            <TextInput
              placeholder="Комментарий"
              value={newComment}
              onChangeText={setNewComment}
              style={[styles.input, { height: 80 }]}
              multiline
            />
            <Button title="Отправить отзыв" onPress={submitReview} />
          </View>
        ) : (
          <TouchableOpacity onPress={() => Alert.alert('Вход', 'Чтобы оставить отзыв, войдите в аккаунт')}>
            <Text style={{ color: '#C17B5E', textAlign: 'center', marginTop: 16 }}>Войдите, чтобы оставить отзыв</Text>
          </TouchableOpacity>
        )}

        {/* Кнопка маршрута */}
        <TouchableOpacity
          onPress={openMaps}
          style={{
            backgroundColor: '#C17B5E',
            padding: 14,
            borderRadius: 40,
            alignItems: 'center',
            marginTop: 16,
          }}
        >
          <Text style={{ color: 'white', fontWeight: '600' }}>Проложить маршрут</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: '#EFEBE4',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 30,
    fontSize: 11,
    color: '#C17B5E',
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 12,
    color: '#3A2C1F',
  },
  reviewItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E0D8',
    paddingVertical: 12,
    marginBottom: 8,
  },
  reviewAuthor: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#3A2C1F',
  },
  reviewForm: {
    marginTop: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E0D8',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
});