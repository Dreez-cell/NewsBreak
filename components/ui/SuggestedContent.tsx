import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';

const SUGGESTED = [
  {
    id: '1',
    type: 'trending',
    title: 'Local Elections 2025',
    subtitle: '12K people talking',
    image: 'https://picsum.photos/seed/trend1/300/200',
  },
  {
    id: '2',
    type: 'weather',
    title: 'Storm Warning',
    subtitle: 'Next 24 hours',
    image: 'https://picsum.photos/seed/trend2/300/200',
  },
  {
    id: '3',
    type: 'local',
    title: 'New Park Opening',
    subtitle: 'Downtown area',
    image: 'https://picsum.photos/seed/trend3/300/200',
  },
];

export function SuggestedContent() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="star" size={20} color={theme.colors.warning} />
        <Text style={styles.title}>Suggested for You</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {SUGGESTED.map((item) => (
          <TouchableOpacity key={item.id} style={styles.card}>
            <Image
              source={{ uri: item.image }}
              style={styles.image}
              contentFit="cover"
            />
            <View style={styles.overlay}>
              <Text style={styles.cardTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: theme.fonts.sizes.lg,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.text,
  },
  scroll: {
    paddingHorizontal: 16,
    gap: 12,
  },
  card: {
    width: 200,
    height: 120,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 12,
    justifyContent: 'flex-end',
  },
  cardTitle: {
    fontSize: theme.fonts.sizes.base,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.text,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: theme.fonts.sizes.xs,
    color: theme.colors.text,
    opacity: 0.9,
  },
});
