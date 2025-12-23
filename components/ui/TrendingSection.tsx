import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { theme } from '../../constants/theme';
import { useContent } from '../../hooks/useContent';
import { useUsers } from '../../hooks/useUsers';
import { useAuth } from '../../hooks/useAuth';

export function TrendingSection() {
  const router = useRouter();
  const { getTrendingHashtags } = useContent();
  const { users, followUser } = useUsers();
  const { user } = useAuth();

  const trendingHashtags = getTrendingHashtags().slice(0, 5);
  
  // Get suggested users to follow (users with most followers, excluding current user)
  const suggestedUsers = users
    .filter(u => u.id !== user?.id && !user?.following.includes(u.id))
    .sort((a, b) => b.followers.length - a.followers.length)
    .slice(0, 3);

  return (
    <View style={styles.container}>
      {/* Trending Hashtags */}
      {trendingHashtags.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="flame" size={20} color={theme.colors.trending} />
            <Text style={styles.sectionTitle}>Trending Now</Text>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hashtagScroll}
          >
            {trendingHashtags.map((item) => (
              <TouchableOpacity
                key={item.tag}
                style={styles.trendingCard}
                onPress={() => router.push(`/hashtag/${item.tag}`)}
              >
                <View style={styles.trendingIcon}>
                  <Ionicons name="trending-up" size={18} color={theme.colors.trending} />
                </View>
                <Text style={styles.trendingTag}>#{item.tag}</Text>
                <Text style={styles.trendingCount}>{item.count} posts</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Suggested Users */}
      {suggestedUsers.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="people" size={20} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>Who to Follow</Text>
          </View>
          <View style={styles.usersContainer}>
            {suggestedUsers.map((suggestedUser) => (
              <TouchableOpacity
                key={suggestedUser.id}
                style={styles.userCard}
                onPress={() => router.push(`/user/${suggestedUser.id}`)}
              >
                <Image
                  source={{ uri: suggestedUser.avatar }}
                  style={styles.userAvatar}
                  contentFit="cover"
                />
                <View style={styles.userInfo}>
                  <Text style={styles.userName} numberOfLines={1}>
                    {suggestedUser.name}
                  </Text>
                  <Text style={styles.userLocation} numberOfLines={1}>
                    <Ionicons name="location" size={12} color={theme.colors.local} />
                    {' '}{suggestedUser.location}
                  </Text>
                  <Text style={styles.userStats}>
                    {suggestedUser.followers.length} followers
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.followButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    if (user) {
                      followUser(user.id, suggestedUser.id);
                    }
                  }}
                >
                  <Ionicons name="person-add" size={16} color={theme.colors.background} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  section: {
    backgroundColor: theme.colors.surface,
    marginBottom: 8,
    paddingVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: theme.fonts.sizes.lg,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.text,
  },
  hashtagScroll: {
    paddingHorizontal: 16,
    gap: 12,
  },
  trendingCard: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    padding: 16,
    minWidth: 140,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  trendingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  trendingTag: {
    fontSize: theme.fonts.sizes.base,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.text,
    marginBottom: 4,
  },
  trendingCount: {
    fontSize: theme.fonts.sizes.xs,
    color: theme.colors.textTertiary,
  },
  usersContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.surfaceElevated,
  },
  userInfo: {
    flex: 1,
    gap: 2,
  },
  userName: {
    fontSize: theme.fonts.sizes.base,
    fontWeight: theme.fonts.weights.semibold,
    color: theme.colors.text,
  },
  userLocation: {
    fontSize: theme.fonts.sizes.xs,
    color: theme.colors.local,
  },
  userStats: {
    fontSize: theme.fonts.sizes.xs,
    color: theme.colors.textTertiary,
  },
  followButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
