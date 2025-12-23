import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { Article, Comment } from '../../types';
import { newsService } from '../../services/newsService';

export default function ArticleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticle();
    loadComments();
  }, [id]);

  const loadArticle = async () => {
    try {
      setLoading(true);
      const data = await newsService.getArticleById(id);
      setArticle(data);
    } catch (error) {
      console.error('Failed to load article:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      const data = await newsService.getComments(id);
      setComments(data);
    } catch (error) {
      console.error('Failed to load comments:', error);
    }
  };

  const handleLike = async () => {
    if (!article) return;
    const isLiked = await newsService.toggleLikeArticle(article.id);
    setArticle({
      ...article,
      isLiked,
      likes: article.likes + (isLiked ? 1 : -1),
    });
  };

  const handleSave = async () => {
    if (!article) return;
    const isSaved = await newsService.toggleSaveArticle(article.id);
    setArticle({
      ...article,
      isSaved,
    });
  };

  const handleShare = async () => {
    if (!article) return;
    try {
      await Share.share({
        message: `${article.title}\n\n${article.summary}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  if (loading || !article) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading article...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Image */}
      <Image
        source={{ uri: article.imageUrl }}
        style={styles.heroImage}
        contentFit="cover"
      />

      {/* Content */}
      <View style={styles.content}>
        {/* Category Badge */}
        {article.isBreaking && (
          <View style={styles.breakingBadge}>
            <Ionicons name="flash" size={14} color={theme.colors.background} />
            <Text style={styles.breakingText}>BREAKING NEWS</Text>
          </View>
        )}

        {/* Title */}
        <Text style={styles.title}>{article.title}</Text>

        {/* Meta Info */}
        <View style={styles.metaRow}>
          <Text style={styles.source}>{article.source}</Text>
          <View style={styles.dot} />
          <Text style={styles.time}>{formatTime(article.publishedAt)}</Text>
        </View>

        {article.distance !== undefined && (
          <View style={styles.locationRow}>
            <Ionicons name="location" size={16} color={theme.colors.local} />
            <Text style={styles.location}>{article.location} · {article.distance} miles away</Text>
          </View>
        )}

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Ionicons name="eye-outline" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.statText}>{formatNumber(article.views)} views</Text>
          </View>
          <View style={styles.stat}>
            <Ionicons name="heart-outline" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.statText}>{formatNumber(article.likes)} likes</Text>
          </View>
          <View style={styles.stat}>
            <Ionicons name="chatbubble-outline" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.statText}>{formatNumber(article.comments)} comments</Text>
          </View>
        </View>

        {/* Summary */}
        <Text style={styles.summary}>{article.summary}</Text>

        {/* Full Article (Mock) */}
        <Text style={styles.body}>
          This is a comprehensive article about the story. In a production environment, this would contain the full article content fetched from your backend or RSS feed.
          {'\n\n'}
          The article would include detailed information, quotes from sources, background context, and analysis relevant to the headline and summary.
          {'\n\n'}
          Additional paragraphs would provide readers with complete coverage of the event, including multiple perspectives and expert opinions.
        </Text>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity onPress={handleLike} style={styles.actionButton}>
            <Ionicons 
              name={article.isLiked ? 'heart' : 'heart-outline'} 
              size={24} 
              color={article.isLiked ? theme.colors.primary : theme.colors.textSecondary} 
            />
            <Text style={[styles.actionText, article.isLiked && { color: theme.colors.primary }]}>
              Like
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSave} style={styles.actionButton}>
            <Ionicons 
              name={article.isSaved ? 'bookmark' : 'bookmark-outline'} 
              size={24} 
              color={article.isSaved ? theme.colors.warning : theme.colors.textSecondary} 
            />
            <Text style={[styles.actionText, article.isSaved && { color: theme.colors.warning }]}>
              Save
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
            <Ionicons name="share-outline" size={24} color={theme.colors.textSecondary} />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View>

        {/* Comments Section */}
        <View style={styles.commentsSection}>
          <Text style={styles.commentsTitle}>
            Comments ({comments.length})
          </Text>

          {comments.map((comment) => (
            <View key={comment.id} style={styles.commentCard}>
              <Image
                source={{ uri: comment.authorAvatar }}
                style={styles.commentAvatar}
                contentFit="cover"
              />
              <View style={styles.commentContent}>
                <View style={styles.commentHeader}>
                  <Text style={styles.commentAuthor}>{comment.author}</Text>
                  <Text style={styles.commentTime}>
                    {formatTime(comment.createdAt)}
                  </Text>
                </View>
                <Text style={styles.commentText}>{comment.content}</Text>
                <View style={styles.commentActions}>
                  <TouchableOpacity style={styles.commentAction}>
                    <Ionicons name="heart-outline" size={14} color={theme.colors.textTertiary} />
                    <Text style={styles.commentActionText}>{comment.likes}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.commentAction}>
                    <Text style={styles.commentActionText}>Reply</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}

          {comments.length === 0 && (
            <Text style={styles.noComments}>
              No comments yet. Be the first to comment!
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
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
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    fontSize: theme.fonts.sizes.base,
    color: theme.colors.textSecondary,
  },
  heroImage: {
    width: '100%',
    height: 280,
    backgroundColor: theme.colors.surfaceElevated,
  },
  content: {
    padding: 16,
  },
  breakingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.sm,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  breakingText: {
    color: theme.colors.background,
    fontSize: 11,
    fontWeight: theme.fonts.weights.bold,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 26,
    fontWeight: theme.fonts.weights.heavy,
    color: theme.colors.text,
    lineHeight: 34,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  source: {
    fontSize: theme.fonts.sizes.sm,
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
    marginHorizontal: 8,
  },
  time: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.textTertiary,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 16,
  },
  location: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.local,
    fontWeight: theme.fonts.weights.medium,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.textSecondary,
  },
  summary: {
    fontSize: theme.fonts.sizes.lg,
    fontWeight: theme.fonts.weights.medium,
    color: theme.colors.text,
    lineHeight: 26,
    marginBottom: 20,
  },
  body: {
    fontSize: theme.fonts.sizes.base,
    color: theme.colors.textSecondary,
    lineHeight: 24,
    marginBottom: 24,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 24,
  },
  actionButton: {
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
  },
  actionText: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.textSecondary,
    fontWeight: theme.fonts.weights.medium,
  },
  commentsSection: {
    marginTop: 8,
  },
  commentsTitle: {
    fontSize: theme.fonts.sizes.lg,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.text,
    marginBottom: 16,
  },
  commentCard: {
    flexDirection: 'row',
    marginBottom: 16,
    padding: 12,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.surfaceElevated,
  },
  commentContent: {
    flex: 1,
    marginLeft: 12,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  commentAuthor: {
    fontSize: theme.fonts.sizes.sm,
    fontWeight: theme.fonts.weights.semibold,
    color: theme.colors.text,
  },
  commentTime: {
    fontSize: theme.fonts.sizes.xs,
    color: theme.colors.textTertiary,
  },
  commentText: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  commentActions: {
    flexDirection: 'row',
    gap: 16,
  },
  commentAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  commentActionText: {
    fontSize: theme.fonts.sizes.xs,
    color: theme.colors.textTertiary,
    fontWeight: theme.fonts.weights.medium,
  },
  noComments: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.textTertiary,
    textAlign: 'center',
    paddingVertical: 32,
  },
});
