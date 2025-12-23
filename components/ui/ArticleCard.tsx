import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { Article } from '../../types';

interface ArticleCardProps {
  article: Article;
  onPress: () => void;
  onLike?: () => void;
  onSave?: () => void;
  onShare?: () => void;
}

export function ArticleCard({ article, onPress, onLike, onSave, onShare }: ArticleCardProps) {
  const formatTime = (dateString: string) => {
    const now = new Date();
    const published = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - published.getTime()) / 60000);

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <Pressable 
      onPress={onPress} 
      style={({ pressed }) => [
        styles.container,
        pressed && { opacity: 0.9 }
      ]}
    >
      {article.isBreaking && (
        <View style={styles.breakingBadge}>
          <Ionicons name="flash" size={12} color={theme.colors.background} />
          <Text style={styles.breakingText}>BREAKING</Text>
        </View>
      )}

      <Image
        source={{ uri: article.imageUrl }}
        style={styles.image}
        contentFit="cover"
        transition={200}
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.source}>{article.source}</Text>
          {article.distance !== undefined && (
            <>
              <View style={styles.dot} />
              <Ionicons name="location" size={12} color={theme.colors.local} />
              <Text style={styles.distance}>{article.distance} mi</Text>
            </>
          )}
        </View>

        <Text style={styles.title} numberOfLines={3}>
          {article.title}
        </Text>

        <Text style={styles.summary} numberOfLines={2}>
          {article.summary}
        </Text>

        <View style={styles.footer}>
          <View style={styles.stats}>
            <Ionicons name="eye-outline" size={14} color={theme.colors.textTertiary} />
            <Text style={styles.statText}>{formatNumber(article.views)}</Text>
            
            <View style={styles.statDivider} />
            
            <Text style={styles.timeText}>{formatTime(article.publishedAt)}</Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity onPress={onLike} style={styles.actionButton} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons 
                name={article.isLiked ? 'heart' : 'heart-outline'} 
                size={20} 
                color={article.isLiked ? theme.colors.primary : theme.colors.textSecondary} 
              />
              <Text style={styles.actionText}>{formatNumber(article.likes)}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onPress} style={styles.actionButton} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="chatbubble-outline" size={18} color={theme.colors.textSecondary} />
              <Text style={styles.actionText}>{formatNumber(article.comments)}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onSave} style={styles.actionButton} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons 
                name={article.isSaved ? 'bookmark' : 'bookmark-outline'} 
                size={20} 
                color={article.isSaved ? theme.colors.warning : theme.colors.textSecondary} 
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={onShare} style={styles.actionButton} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="share-outline" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    marginBottom: 12,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  breakingBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    zIndex: 10,
    ...theme.shadows.md,
  },
  breakingText: {
    color: theme.colors.background,
    fontSize: 10,
    fontWeight: theme.fonts.weights.bold,
    letterSpacing: 0.5,
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: theme.colors.surfaceElevated,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  source: {
    fontSize: theme.fonts.sizes.xs,
    fontWeight: theme.fonts.weights.semibold,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: theme.colors.textTertiary,
    marginHorizontal: 6,
  },
  distance: {
    fontSize: theme.fonts.sizes.xs,
    color: theme.colors.local,
    fontWeight: theme.fonts.weights.semibold,
    marginLeft: 2,
  },
  title: {
    fontSize: theme.fonts.sizes.lg,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.text,
    lineHeight: 24,
    marginBottom: 8,
  },
  summary: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: theme.fonts.sizes.xs,
    color: theme.colors.textTertiary,
    fontWeight: theme.fonts.weights.medium,
  },
  statDivider: {
    width: 1,
    height: 12,
    backgroundColor: theme.colors.borderLight,
    marginHorizontal: 4,
  },
  timeText: {
    fontSize: theme.fonts.sizes.xs,
    color: theme.colors.textTertiary,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: theme.fonts.sizes.xs,
    color: theme.colors.textSecondary,
    fontWeight: theme.fonts.weights.medium,
  },
});
