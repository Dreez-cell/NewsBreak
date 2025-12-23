import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { useContent } from '../../hooks/useContent';
import { useAuth } from '../../hooks/useAuth';
import { PostCard } from '../../components/ui/PostCard';

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { posts, getTrendingHashtags } = useContent();
  const { user } = useAuth();
  const [selectedHashtag, setSelectedHashtag] = useState<string | null>(null);

  const trendingHashtags = getTrendingHashtags();
  const displayedPosts = selectedHashtag
    ? posts.filter(p => p.hashtags.includes(selectedHashtag.toLowerCase()))
    : posts.sort((a, b) => b.likes + b.comments + b.reposts - (a.likes + a.comments + a.reposts));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Text style={styles.title}>Explore</Text>
        <TouchableOpacity>
          <Ionicons name="search" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      {/* Trending Hashtags */}
      {trendingHashtags.length > 0 && (
        <View style={styles.hashtagSection}>
          <Text style={styles.sectionTitle}>Trending Hashtags</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hashtagScroll}
          >
            <TouchableOpacity
              style={[styles.hashtagChip, !selectedHashtag && styles.hashtagChipActive]}
              onPress={() => setSelectedHashtag(null)}
            >
              <Text style={[styles.hashtagText, !selectedHashtag && styles.hashtagTextActive]}>
                All
              </Text>
            </TouchableOpacity>
            {trendingHashtags.map((item) => (
              <TouchableOpacity
                key={item.tag}
                style={[
                  styles.hashtagChip,
                  selectedHashtag === item.tag && styles.hashtagChipActive,
                ]}
                onPress={() => setSelectedHashtag(item.tag)}
              >
                <Text
                  style={[
                    styles.hashtagText,
                    selectedHashtag === item.tag && styles.hashtagTextActive,
                  ]}
                >
                  #{item.tag}
                </Text>
                <Text style={styles.hashtagCount}>{item.count}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Posts */}
      <FlatList
        data={displayedPosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            currentUserId={user?.id || ''}
            onPress={() => router.push(`/article/${item.id}`)}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="compass-outline" size={64} color={theme.colors.textTertiary} />
            <Text style={styles.emptyText}>No posts found</Text>
          </View>
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
  title: {
    fontSize: 24,
    fontWeight: theme.fonts.weights.heavy,
    color: theme.colors.text,
  },
  hashtagSection: {
    paddingVertical: 12,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  sectionTitle: {
    fontSize: theme.fonts.sizes.sm,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.text,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  hashtagScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  hashtagChip: {
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
  hashtagChipActive: {
    backgroundColor: theme.colors.trending,
    borderColor: theme.colors.trending,
  },
  hashtagText: {
    fontSize: theme.fonts.sizes.sm,
    fontWeight: theme.fonts.weights.medium,
    color: theme.colors.text,
  },
  hashtagTextActive: {
    color: theme.colors.background,
  },
  hashtagCount: {
    fontSize: theme.fonts.sizes.xs,
    color: theme.colors.textTertiary,
  },
  list: {
    paddingVertical: 8,
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: theme.fonts.sizes.base,
    color: theme.colors.textSecondary,
    marginTop: 16,
  },
});
