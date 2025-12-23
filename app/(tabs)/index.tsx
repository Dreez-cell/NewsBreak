import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView, RefreshControl, Share } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { theme } from '../../constants/theme';
import { CategoryType } from '../../types';
import { useNews } from '../../hooks/useNews';
import { useBreakingNews } from '../../hooks/useBreakingNews';
import { ArticleCard } from '../../components/ui/ArticleCard';
import { CategoryChip } from '../../components/ui/CategoryChip';
import { BreakingNewsBanner } from '../../components/ui/BreakingNewsBanner';
import { LoadingArticleCard } from '../../components/ui/LoadingArticleCard';

const categories: { label: string; value: CategoryType }[] = [
  { label: 'All', value: 'all' },
  { label: 'Local', value: 'local' },
  { label: 'Trending', value: 'trending' },
  { label: 'Crime', value: 'crime' },
  { label: 'Politics', value: 'politics' },
  { label: 'Business', value: 'business' },
  { label: 'Weather', value: 'weather' },
  { label: 'Entertainment', value: 'entertainment' },
];

export default function FeedScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const { articles, loading, refreshing, refresh, toggleSave, toggleLike } = useNews(selectedCategory);
  const { breakingNews } = useBreakingNews();

  const handleArticlePress = (articleId: string) => {
    router.push(`/article/${articleId}`);
  };

  const handleShare = async (title: string) => {
    try {
      await Share.share({
        message: `Check out this news: ${title}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Text style={styles.logo}>NewsBreak</Text>
        <Text style={styles.location}>Los Angeles, CA</Text>
      </View>

      {/* Category Filter */}
      <View style={styles.categoryContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {categories.map((cat) => (
            <CategoryChip
              key={cat.value}
              label={cat.label}
              category={cat.value}
              isSelected={selectedCategory === cat.value}
              onPress={() => setSelectedCategory(cat.value)}
            />
          ))}
        </ScrollView>
      </View>

      {/* News Feed */}
      <FlatList
        data={articles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ArticleCard
            article={item}
            onPress={() => handleArticlePress(item.id)}
            onLike={() => toggleLike(item.id)}
            onSave={() => toggleSave(item.id)}
            onShare={() => handleShare(item.title)}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          breakingNews.length > 0 ? (
            <BreakingNewsBanner
              articles={breakingNews}
              onPress={(article) => handleArticlePress(article.id)}
            />
          ) : null
        }
        ListEmptyComponent={
          loading ? (
            <View>
              <LoadingArticleCard />
              <LoadingArticleCard />
              <LoadingArticleCard />
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No articles found</Text>
            </View>
          )
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: theme.colors.background,
  },
  logo: {
    fontSize: 28,
    fontWeight: theme.fonts.weights.heavy,
    color: theme.colors.primary,
    letterSpacing: -0.5,
  },
  location: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  categoryContainer: {
    backgroundColor: theme.colors.background,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  categoryScroll: {
    paddingHorizontal: 16,
  },
  list: {
    padding: 16,
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: theme.fonts.sizes.base,
    color: theme.colors.textSecondary,
  },
});
