import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { Post } from '../../types';

interface BreakingNewsBannerProps {
  news: Post;
}

export function BreakingNewsBanner({ news }: BreakingNewsBannerProps) {
  const router = useRouter();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, []);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push(`/article/${news.id}`)}
      activeOpacity={0.9}
    >
      <View style={styles.content}>
        <Animated.View style={[styles.badge, { transform: [{ scale: pulseAnim }] }]}>
          <Ionicons name="flash" size={16} color="#fff" />
          <Text style={styles.badgeText}>BREAKING</Text>
        </Animated.View>
        <Text style={styles.title} numberOfLines={2}>
          {news.content}
        </Text>
        <Ionicons name="chevron-forward" size={20} color={theme.colors.background} />
      </View>
      <View style={styles.timeContainer}>
        <Ionicons name="time-outline" size={12} color="rgba(255, 255, 255, 0.8)" />
        <Text style={styles.timeText}>Just now</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.error,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.round,
  },
  badgeText: {
    fontSize: theme.fonts.sizes.xs,
    fontWeight: theme.fonts.weights.heavy,
    color: '#fff',
    letterSpacing: 1,
  },
  title: {
    flex: 1,
    fontSize: theme.fonts.sizes.base,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.background,
    lineHeight: 20,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  timeText: {
    fontSize: theme.fonts.sizes.xs,
    color: 'rgba(255, 255, 255, 0.8)',
  },
});
