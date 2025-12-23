import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { MusicTrack } from '../../types';
import { MusicPlayer } from '../../components/ui/MusicPlayer';

const SAMPLE_TRACKS: MusicTrack[] = [
  {
    id: '1',
    title: 'Breaking News Theme',
    artist: 'NewsBreak Radio',
    albumArt: 'https://picsum.photos/seed/music1/400/400',
    duration: 180,
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    category: 'News',
  },
  {
    id: '2',
    title: 'Morning Briefing',
    artist: 'Daily Updates',
    albumArt: 'https://picsum.photos/seed/music2/400/400',
    duration: 240,
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    category: 'Podcast',
  },
  {
    id: '3',
    title: 'Local Stories',
    artist: 'Community Radio',
    albumArt: 'https://picsum.photos/seed/music3/400/400',
    duration: 210,
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    category: 'Local',
  },
  {
    id: '4',
    title: 'World News Roundup',
    artist: 'Global Network',
    albumArt: 'https://picsum.photos/seed/music4/400/400',
    duration: 300,
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    category: 'International',
  },
  {
    id: '5',
    title: 'Tech Talk',
    artist: 'Innovation Hub',
    albumArt: 'https://picsum.photos/seed/music5/400/400',
    duration: 270,
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    category: 'Technology',
  },
];

export default function MusicScreen() {
  const insets = useSafeAreaInsets();
  const [selectedTrack, setSelectedTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleTrackPress = (track: MusicTrack) => {
    if (selectedTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setSelectedTrack(track);
      setIsPlaying(true);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Text style={styles.title}>Music & Podcasts</Text>
        <Text style={styles.subtitle}>Listen to news and stories</Text>
      </View>

      {/* Tracks List */}
      <FlatList
        data={SAMPLE_TRACKS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isSelected = selectedTrack?.id === item.id;
          return (
            <TouchableOpacity
              style={[styles.trackCard, isSelected && styles.trackCardActive]}
              onPress={() => handleTrackPress(item)}
            >
              <Image
                source={{ uri: item.albumArt }}
                style={styles.albumArt}
                contentFit="cover"
              />
              <View style={styles.trackInfo}>
                <Text style={styles.trackTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.trackArtist} numberOfLines={1}>
                  {item.artist}
                </Text>
                <View style={styles.trackMeta}>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{item.category}</Text>
                  </View>
                  <Text style={styles.duration}>{formatDuration(item.duration)}</Text>
                </View>
              </View>
              <View style={styles.playButton}>
                <Ionicons
                  name={isSelected && isPlaying ? 'pause' : 'play'}
                  size={28}
                  color={isSelected ? theme.colors.primary : theme.colors.textSecondary}
                />
              </View>
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      {/* Music Player */}
      {selectedTrack && (
        <MusicPlayer
          track={selectedTrack}
          isPlaying={isPlaying}
          onPlayPause={() => setIsPlaying(!isPlaying)}
          onClose={() => {
            setSelectedTrack(null);
            setIsPlaying(false);
          }}
        />
      )}
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
  title: {
    fontSize: 28,
    fontWeight: theme.fonts.weights.heavy,
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  list: {
    padding: 16,
    paddingBottom: 120,
  },
  trackCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: 12,
    marginBottom: 12,
  },
  trackCardActive: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  albumArt: {
    width: 64,
    height: 64,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surfaceElevated,
  },
  trackInfo: {
    flex: 1,
    marginLeft: 12,
  },
  trackTitle: {
    fontSize: theme.fonts.sizes.base,
    fontWeight: theme.fonts.weights.semibold,
    color: theme.colors.text,
    marginBottom: 4,
  },
  trackArtist: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.textSecondary,
    marginBottom: 6,
  },
  trackMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryBadge: {
    backgroundColor: theme.colors.surfaceElevated,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  categoryText: {
    fontSize: theme.fonts.sizes.xs,
    color: theme.colors.primary,
    fontWeight: theme.fonts.weights.semibold,
  },
  duration: {
    fontSize: theme.fonts.sizes.xs,
    color: theme.colors.textTertiary,
  },
  playButton: {
    padding: 8,
  },
});
