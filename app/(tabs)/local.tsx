import React from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, Share } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { useNews } from '../../hooks/useNews';
import { ArticleCard } from '../../components/ui/ArticleCard';
import { LoadingArticleCard } from '../../components/ui/LoadingArticleCard';

export default function LocalScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { articles, loading, refreshing, refresh, toggleSave, toggleLike } = useNews('local');

  const handleArticlePress = (articleId: string) => {
    router.push(`/article/${articleId}`);
  };

  const handleShare = async (title: string) => {
    try {
      await Share.share({
        message: `Check out this local news: ${title}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const localArticles = articles
    .filter(article => article.distance !== undefined && article.distance < 10)
    .sort((a, b) => (a.distance || 0) - (b.distance || 0));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.titleRow}>
          <Ionicons name="location" size={28} color={theme.colors.local} />
          <Text style={styles.title}>Local News</Text>
        </View>
        <Text style={styles.subtitle}>Stories within 10 miles of you</Text>
      </View>

      {/* News Feed */}
      <FlatList
        data={localArticles}
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
        ListEmptyComponent={
          loading ? (
            <View>
              <LoadingArticleCard />
              <LoadingArticleCard />
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="location-outline" size={48} color={theme.colors.textTertiary} />
              <Text style={styles.emptyText}>No local news found</Text>
              <Text style={styles.emptySubtext}>Check back later for updates</Text>
            </View>
          )
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor={theme.colors.local}
            colors={[theme.colors.local]}
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
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: theme.fonts.weights.heavy,
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.textSecondary,
    marginLeft: 36,
  },
  list: {
    padding: 16,
  },
  emptyContainer: {
    paddingVertical: 80,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: theme.fonts.sizes.lg,
    fontWeight: theme.fonts.weights.semibold,
    color: theme.colors.textSecondary,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.textTertiary,
    marginTop: 4,
  },
});
