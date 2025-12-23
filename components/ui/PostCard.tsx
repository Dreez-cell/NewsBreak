import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable, Share, Platform, Alert } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { theme } from '../../constants/theme';
import { Post } from '../../types';
import { useContent } from '../../hooks/useContent';
import { RichText } from './RichText';
import * as Clipboard from 'expo-clipboard';

interface PostCardProps {
  post: Post;
  currentUserId: string;
  onPress?: () => void;
}

export function PostCard({ post, currentUserId, onPress }: PostCardProps) {
  const router = useRouter();
  const { toggleLike, repost } = useContent();
  const [imageAspectRatio, setImageAspectRatio] = useState(16 / 9);
  const [reposting, setReposting] = useState(false);

  const handleLike = async () => {
    await toggleLike(post.id, currentUserId);
  };

  const handleRepost = async () => {
    setReposting(true);
    await repost(post.id, currentUserId);
    setTimeout(() => setReposting(false), 300);
  };

  const handleShare = async () => {
    const shareUrl = `newsbreak://post/${post.id}`;
    const message = `${post.content.substring(0, 100)}${post.content.length > 100 ? '...' : ''}\n\nShared from NewsBreak`;

    try {
      if (Platform.OS === 'web') {
        await Clipboard.setStringAsync(shareUrl);
        Alert.alert('Link Copied', 'Post link copied to clipboard');
      } else {
        await Share.share({
          message,
          url: shareUrl,
        });
      }
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  const handleReply = () => {
    router.push(`/article/${post.id}`);
  };

  const handleUserPress = () => {
    if (post.authorId === currentUserId) {
      router.push('/(tabs)/profile');
    } else {
      router.push(`/user/${post.authorId}`);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const isLiked = post.likedBy.includes(currentUserId);
  const isReposted = post.repostedBy.includes(currentUserId);

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <TouchableOpacity style={styles.header} onPress={handleUserPress}>
        <Image
          source={{ uri: post.authorAvatar }}
          style={styles.avatar}
          contentFit="cover"
        />
        <View style={styles.headerInfo}>
          <Text style={styles.authorName}>{post.authorName}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.time}>{formatTime(post.createdAt)}</Text>
            <View style={styles.dot} />
            <View style={styles.locationRow}>
              <Ionicons name="location" size={12} color={theme.colors.local} />
              <Text style={styles.location}>{post.location}</Text>
            </View>
          </View>
        </View>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>
            {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
          </Text>
        </View>
      </TouchableOpacity>

      <RichText content={post.content} style={styles.content} />

      {post.mediaUrl && post.mediaType === 'image' && (
        <Image
          source={{ uri: post.mediaUrl }}
          style={[styles.media, { aspectRatio: imageAspectRatio }]}
          contentFit="cover"
          onLoad={(e) => {
            const { width, height } = e.source;
            if (width && height) {
              const ratio = width / height;
              // Constrain aspect ratio between 0.75 (portrait) and 2 (wide)
              const constrainedRatio = Math.max(0.75, Math.min(2, ratio));
              setImageAspectRatio(constrainedRatio);
            }
          }}
        />
      )}
      {post.mediaUrl && post.mediaType === 'video' && (
        <View style={styles.videoContainer}>
          <Ionicons name="play-circle" size={64} color={theme.colors.primary} />
        </View>
      )}

      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.actionButton, isLiked && styles.actionButtonActive]}
          onPress={handleLike}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isLiked ? 'heart' : 'heart-outline'}
            size={22}
            color={isLiked ? theme.colors.error : theme.colors.textSecondary}
          />
          <Text style={[styles.actionText, isLiked && { color: theme.colors.error }]}>
            {formatNumber(post.likes)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleReply}
          activeOpacity={0.7}
        >
          <Ionicons name="chatbubble-outline" size={20} color={theme.colors.textSecondary} />
          <Text style={styles.actionText}>{formatNumber(post.comments)}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, isReposted && styles.actionButtonActive, reposting && styles.actionButtonAnimating]}
          onPress={handleRepost}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isReposted ? 'repeat' : 'repeat-outline'}
            size={22}
            color={isReposted ? theme.colors.success : theme.colors.textSecondary}
          />
          <Text style={[styles.actionText, isReposted && { color: theme.colors.success }]}>
            {formatNumber(post.reposts)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleShare}
          activeOpacity={0.7}
        >
          <Ionicons name="share-outline" size={20} color={theme.colors.textSecondary} />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    marginBottom: 8,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.surfaceElevated,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  authorName: {
    fontSize: theme.fonts.sizes.base,
    fontWeight: theme.fonts.weights.semibold,
    color: theme.colors.text,
    marginBottom: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  time: {
    fontSize: theme.fonts.sizes.xs,
    color: theme.colors.textTertiary,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: theme.colors.textTertiary,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  location: {
    fontSize: theme.fonts.sizes.xs,
    color: theme.colors.local,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.surfaceElevated,
  },
  categoryText: {
    fontSize: theme.fonts.sizes.xs,
    fontWeight: theme.fonts.weights.semibold,
    color: theme.colors.primary,
  },
  content: {
    fontSize: theme.fonts.sizes.base,
    color: theme.colors.text,
    lineHeight: 22,
    marginBottom: 12,
  },
  media: {
    width: '100%',
    minHeight: 180,
    maxHeight: 400,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surfaceElevated,
    marginBottom: 12,
  },
  videoContainer: {
    width: '100%',
    height: 200,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.sm,
  },
  actionButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  actionButtonAnimating: {
    transform: [{ scale: 1.1 }],
  },
  actionText: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.textSecondary,
    fontWeight: theme.fonts.weights.medium,
  },
});
