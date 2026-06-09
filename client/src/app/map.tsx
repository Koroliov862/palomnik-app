import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function MapScreen() {
  return (
    <View style={styles.container}>
      {/* Кастомный заголовок */}
      <View style={styles.header}>
        <View style={styles.greeting}>
          <Text style={styles.greetingTitle}>Карта</Text>
          <Text style={styles.greetingSubtitle}>Храмы на карте</Text>
        </View>
        <View style={styles.profileIcon}>
          <Ionicons name="person-outline" size={24} color="white" />
        </View>
      </View>
      {/* Просто текст вместо карты */}
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>Карты здесь нет</Text>
      </View>
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
    fontFamily: 'Georgia',
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
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 18,
    color: '#6B6A66',
  },
});