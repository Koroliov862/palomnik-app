import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from '../context/FavoritesContext';

interface Props {
  placeId: number;
  size?: number;
  color?: string;
}

const FavoriteButton: React.FC<Props> = ({ placeId, size = 24, color = '#C17B5E' }) => {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const favorite = isFavorite(placeId);

  const toggle = async () => {
    if (favorite) {
      await removeFavorite(placeId);
    } else {
      await addFavorite(placeId);
    }
  };

  return (
    <TouchableOpacity onPress={toggle} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
      <Ionicons name={favorite ? 'heart' : 'heart-outline'} size={size} color={color} />
    </TouchableOpacity>
  );
};

export default FavoriteButton;