import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { useContent } from '../../hooks/useContent';
import { useAuth } from '../../hooks/useAuth';
import { PostCard } from '../../components/ui/PostCard';
import { TrendingSection } from '../../components/ui/TrendingSection';
import { CategoryFilter, NewsCategory } from '../../components/ui/CategoryFilter';
import { BreakingNewsBanner } from '../../components/ui/BreakingNewsBanner';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { posts, loading, refreshPosts } = useContent();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory>('all');

  // Filter posts by category
  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'all') {
      return posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    if (selectedCategory === 'breaking') {
      // Show most recent posts with high engagement
      return posts
        .filter(p => {
          const hoursSincePost = (Date.now() - new Date(p.createdAt).getTime()) / (1000 * 60 * 60);
          return hoursSincePost < 6 && (p.likes + p.comments + p.reposts) > 5;
        })
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    if (selectedCategory === 'trending') {
      // Sort by engagement
      return posts
        .sort((a, b) => {
          const engagementA = a.likes + a.comments * 2 + a.reposts * 1.5;
          const engagementB = b.likes + b.comments * 2 + b.reposts * 1.5;
          return engagementB - engagementA;
        });
    }
    return posts.filter(p => p.category === selectedCategory)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [posts, selectedCategory]);

  // Check if there are breaking news
  const breakingNews = posts.filter(p => {
    const hoursSincePost = (Date.now() - new Date(p.createdAt).getTime()) / (1000 * 60 * 60);
    return hoursSincePost < 2 && (p.likes + p.comments + p.reposts) > 10;
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshPosts();
    setRefreshing(false);
  };

  const handlePostPress = (postId: string) => {
    router.push(`/article/${postId}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.logoContainer}>
          <Ionicons name="newspaper" size={28} color={theme.colors.primary} />
          <Text style={styles.logo}>NewsBreak</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => router.push('/(tabs)/explore')}
          >
            <Ionicons name="search" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => router.push('/(tabs)/profile')}
          >
            <Ionicons name="person-circle-outline" size={26} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Category Filter */}
      <CategoryFilter 
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Breaking News Banner */}
      {breakingNews.length > 0 && selectedCategory === 'all' && (
        <BreakingNewsBanner news={breakingNews[0]} />
      )}

      {/* Feed */}
      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            currentUserId={user?.id || ''}
            onPress={() => handlePostPress(item.id)}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={selectedCategory === 'all' ? <TrendingSection /> : null}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="newspaper-outline" size={64} color={theme.colors.textTertiary} />
              <Text style={styles.emptyText}>No posts yet</Text>
              <Text style={styles.emptySubtext}>Be the first to share something!</Text>
              <TouchableOpacity 
                style={styles.createButton}
                onPress={() => router.push('/post/create')}
              >
                <Text style={styles.createButtonText}>Create Post</Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    fontSize: 24,
    fontWeight: theme.fonts.weights.heavy,
    color: theme.colors.text,
    letterSpacing: -0.5,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    padding: 4,
  },
  list: {
    paddingVertical: 8,
  },
  emptyContainer: {
    paddingVertical: 80,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: theme.fonts.sizes.xl,
    fontWeight: theme.fonts.weights.semibold,
    color: theme.colors.textSecondary,
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.textTertiary,
    marginTop: 8,
  },
  createButton: {
    marginTop: 24,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.md,
  },
  createButtonText: {
    color: theme.colors.background,
    fontSize: theme.fonts.sizes.base,
    fontWeight: theme.fonts.weights.bold,
  },
});
