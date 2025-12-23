import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { theme } from '../../constants/theme';

export function LoadingArticleCard() {
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 1500 }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(shimmer.value, [0, 0.5, 1], [0.3, 0.6, 0.3]);
    return { opacity };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.image, animatedStyle]} />
      <View style={styles.content}>
        <Animated.View style={[styles.source, animatedStyle]} />
        <Animated.View style={[styles.title, animatedStyle]} />
        <Animated.View style={[styles.titleShort, animatedStyle]} />
        <Animated.View style={[styles.summary, animatedStyle]} />
        <Animated.View style={[styles.summaryShort, animatedStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    marginBottom: 12,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: theme.colors.surfaceElevated,
  },
  content: {
    padding: 16,
  },
  source: {
    width: 120,
    height: 12,
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: 6,
    marginBottom: 12,
  },
  title: {
    width: '100%',
    height: 20,
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: 4,
    marginBottom: 8,
  },
  titleShort: {
    width: '70%',
    height: 20,
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: 4,
    marginBottom: 12,
  },
  summary: {
    width: '100%',
    height: 16,
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: 4,
    marginBottom: 6,
  },
  summaryShort: {
    width: '50%',
    height: 16,
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: 4,
  },
});
