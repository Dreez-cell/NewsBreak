import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';

export type NewsCategory = 'all' | 'breaking' | 'local' | 'trending' | 'national' | 'crime' | 'politics' | 'business' | 'entertainment';

interface CategoryFilterProps {
  selectedCategory: NewsCategory;
  onSelectCategory: (category: NewsCategory) => void;
}

const categories: { id: NewsCategory; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'all', label: 'For You', icon: 'star' },
  { id: 'breaking', label: 'Breaking', icon: 'flash' },
  { id: 'local', label: 'Local', icon: 'location' },
  { id: 'trending', label: 'Trending', icon: 'trending-up' },
  { id: 'national', label: 'National', icon: 'flag' },
  { id: 'crime', label: 'Crime', icon: 'warning' },
  { id: 'politics', label: 'Politics', icon: 'people' },
  { id: 'business', label: 'Business', icon: 'briefcase' },
  { id: 'entertainment', label: 'Entertainment', icon: 'film' },
];

export function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {categories.map((category) => {
          const isSelected = selectedCategory === category.id;
          return (
            <TouchableOpacity
              key={category.id}
              style={[styles.categoryChip, isSelected && styles.categoryChipActive]}
              onPress={() => onSelectCategory(category.id)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={category.icon}
                size={16}
                color={isSelected ? theme.colors.background : theme.colors.textSecondary}
              />
              <Text style={[styles.categoryText, isSelected && styles.categoryTextActive]}>
                {category.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  scroll: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  categoryChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  categoryText: {
    fontSize: theme.fonts.sizes.sm,
    fontWeight: theme.fonts.weights.medium,
    color: theme.colors.textSecondary,
  },
  categoryTextActive: {
    color: theme.colors.background,
    fontWeight: theme.fonts.weights.bold,
  },
});
