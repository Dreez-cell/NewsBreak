import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { Article } from '../../types';

interface BreakingNewsBannerProps {
  articles: Article[];
  onPress: (article: Article) => void;
}

export function BreakingNewsBanner({ articles, onPress }: BreakingNewsBannerProps) {
  if (articles.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="flash" size={16} color={theme.colors.background} />
        <Text style={styles.headerText}>BREAKING NEWS</Text>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {articles.map((article) => (
          <TouchableOpacity
            key={article.id}
            onPress={() => onPress(article)}
            style={styles.newsItem}
            activeOpacity={0.8}
          >
            <Text style={styles.newsText} numberOfLines={2}>
              {article.title}
            </Text>
            <Ionicons name="chevron-forward" size={16} color={theme.colors.background} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.primary,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerText: {
    fontSize: theme.fonts.sizes.xs,
    fontWeight: theme.fonts.weights.heavy,
    color: theme.colors.background,
    letterSpacing: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  newsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: theme.borderRadius.md,
    marginRight: 8,
    maxWidth: 280,
  },
  newsText: {
    flex: 1,
    fontSize: theme.fonts.sizes.sm,
    fontWeight: theme.fonts.weights.semibold,
    color: theme.colors.background,
    marginRight: 8,
    lineHeight: 18,
  },
});
