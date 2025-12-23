import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { theme } from '../../constants/theme';
import { CategoryType } from '../../types';

interface CategoryChipProps {
  label: string;
  category: CategoryType;
  isSelected: boolean;
  onPress: () => void;
}

export function CategoryChip({ label, category, isSelected, onPress }: CategoryChipProps) {
  const getCategoryColor = (cat: CategoryType) => {
    const colors: Record<CategoryType, string> = {
      all: theme.colors.text,
      local: theme.colors.local,
      trending: theme.colors.trending,
      crime: theme.colors.crime,
      politics: theme.colors.politics,
      business: theme.colors.business,
      weather: theme.colors.weather,
      entertainment: theme.colors.entertainment,
    };
    return colors[cat] || theme.colors.text;
  };

  const color = getCategoryColor(category);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.chip,
        isSelected && { backgroundColor: color },
        !isSelected && { 
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.colors.borderLight,
        },
      ]}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.label,
          { color: isSelected ? theme.colors.background : theme.colors.textSecondary },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.round,
    marginRight: 8,
    height: 36,
    justifyContent: 'center',
  },
  label: {
    fontSize: theme.fonts.sizes.sm,
    fontWeight: theme.fonts.weights.semibold,
  },
});
