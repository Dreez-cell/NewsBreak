import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { User } from '../../types';
import { useUsers } from '../../hooks/useUsers';
import { useAuth } from '../../hooks/useAuth';
import { useContent } from '../../hooks/useContent';
import { PostCard } from '../../components/ui/PostCard';

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getUserById, followUser, unfollowUser, users } = useUsers();
  const { user: currentUser } = useAuth();
  const { posts } = useContent();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    loadUser();
  }, [id, users]);

  const loadUser = () => {
    const user = getUserById(id);
    if (user) {
      setProfileUser(user);
      setIsFollowing(currentUser?.following.includes(id) || false);
    }
  };

  const handleFollow = async () => {
    if (!currentUser || !profileUser) return;

    if (isFollowing) {
      await unfollowUser(currentUser.id, profileUser.id);
    } else {
      await followUser(currentUser.id, profileUser.id);
    }
    setIsFollowing(!isFollowing);
  };

  if (!profileUser) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>User not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const userPosts = posts.filter(p => p.authorId === profileUser.id);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.header}>
          <Image
            source={{ uri: profileUser.avatar }}
            style={styles.avatar}
            contentFit="cover"
          />
          <Text style={styles.name}>{profileUser.name}</Text>
          {profileUser.bio && <Text style={styles.bio}>{profileUser.bio}</Text>}
          
          <View style={styles.locationRow}>
            <Ionicons name="location" size={16} color={theme.colors.local} />
            <Text style={styles.location}>{profileUser.location}</Text>
          </View>

          {/* Stats */}
          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{userPosts.length}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{profileUser.followers.length}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{profileUser.following.length}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>

          {/* Follow Button */}
          <TouchableOpacity
            style={[styles.followButton, isFollowing && styles.followingButton]}
            onPress={handleFollow}
          >
            <Ionicons
              name={isFollowing ? 'checkmark' : 'person-add'}
              size={20}
              color={isFollowing ? theme.colors.text : theme.colors.background}
            />
            <Text style={[styles.followButtonText, isFollowing && styles.followingButtonText]}>
              {isFollowing ? 'Following' : 'Follow'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Posts */}
        <View style={styles.postsSection}>
          <Text style={styles.sectionTitle}>Posts</Text>
          {userPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUserId={currentUser?.id || ''}
            />
          ))}
          {userPosts.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="document-text-outline" size={48} color={theme.colors.textTertiary} />
              <Text style={styles.emptyText}>No posts yet</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: theme.fonts.sizes.base,
    color: theme.colors.textSecondary,
  },
  header: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.surfaceElevated,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.text,
    marginBottom: 8,
  },
  bio: {
    fontSize: theme.fonts.sizes.base,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
    paddingHorizontal: 32,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 20,
  },
  location: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.local,
    fontWeight: theme.fonts.weights.medium,
  },
  stats: {
    flexDirection: 'row',
    gap: 32,
    marginBottom: 20,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.text,
  },
  statLabel: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  followButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 32,
    paddingVertical: 12,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
  },
  followingButton: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  followButtonText: {
    fontSize: theme.fonts.sizes.base,
    fontWeight: theme.fonts.weights.semibold,
    color: theme.colors.background,
  },
  followingButtonText: {
    color: theme.colors.text,
  },
  postsSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: theme.fonts.sizes.lg,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.text,
    padding: 16,
  },
  emptyState: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: theme.fonts.sizes.base,
    color: theme.colors.textTertiary,
    marginTop: 12,
  },
});
