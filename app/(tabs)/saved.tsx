import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Share } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { Article } from '../../types';
import { newsService } from '../../services/newsService';
import { ArticleCard } from '../../components/ui/ArticleCard';

export default function SavedScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [savedArticles, setSavedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedArticles();
  }, []);

  const loadSavedArticles = async () => {
    try {
      setLoading(true);
      const profile = await newsService.getUserProfile();
      const allArticles = await newsService.getArticles();
      const saved = allArticles.filter(article => 
        profile.savedArticles.includes(article.id)
      ).map(article => ({ ...article, isSaved: true }));
      setSavedArticles(saved);
    } catch (error) {
      console.error('Failed to load saved articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleArticlePress = (articleId: string) => {
    router.push(`/article/${articleId}`);
  };

  const handleUnsave = async (articleId: string) => {
    await newsService.toggleSaveArticle(articleId);
    setSavedArticles(prev => prev.filter(article => article.id !== articleId));
  };

  const handleLike = async (articleId: string) => {
    await newsService.toggleLikeArticle(articleId);
    setSavedArticles(prev => prev.map(article => {
      if (article.id === articleId) {
        const isLiked = !article.isLiked;
        return {
          ...article,
          isLiked,
          likes: article.likes + (isLiked ? 1 : -1),
        };
      }
      return article;
    }));
  };

  const handleShare = async (title: string) => {
    try {
      await Share.share({
        message: `Check out this saved article: ${title}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.titleRow}>
          <Ionicons name="bookmark" size={28} color={theme.colors.warning} />
          <Text style={styles.title}>Saved Articles</Text>
        </View>
        <Text style={styles.subtitle}>
          {savedArticles.length} {savedArticles.length === 1 ? 'article' : 'articles'} saved
        </Text>
      </View>

      {/* Saved Articles */}
      <FlatList
        data={savedArticles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ArticleCard
            article={item}
            onPress={() => handleArticlePress(item.id)}
            onLike={() => handleLike(item.id)}
            onSave={() => handleUnsave(item.id)}
            onShare={() => handleShare(item.title)}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="bookmark-outline" size={64} color={theme.colors.textTertiary} />
              <Text style={styles.emptyText}>No saved articles yet</Text>
              <Text style={styles.emptySubtext}>
                Tap the bookmark icon on articles to save them for later
              </Text>
            </View>
          ) : null
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
    paddingVertical: 100,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: theme.fonts.sizes.xl,
    fontWeight: theme.fonts.weights.semibold,
    color: theme.colors.textSecondary,
    marginTop: 20,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.textTertiary,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
});
