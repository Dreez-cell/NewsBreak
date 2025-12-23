import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { theme } from '../../constants/theme';
import { CategoryType, MediaType } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { useContent } from '../../hooks/useContent';

const categories: { label: string; value: CategoryType }[] = [
  { label: 'Local', value: 'local' },
  { label: 'Trending', value: 'trending' },
  { label: 'Crime', value: 'crime' },
  { label: 'Politics', value: 'politics' },
  { label: 'Business', value: 'business' },
  { label: 'Weather', value: 'weather' },
  { label: 'Entertainment', value: 'entertainment' },
];

export default function CreatePostScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { createPost } = useContent();
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState<MediaType>('none');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('local');
  const [posting, setPosting] = useState(false);

  const showAlert = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}\n\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const handlePickMedia = async (type: 'image' | 'video') => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: type === 'image' ? ImagePicker.MediaTypeOptions.Images : ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setMediaUrl(result.assets[0].uri);
      setMediaType(type);
    }
  };

  const handleRemoveMedia = () => {
    setMediaUrl('');
    setMediaType('none');
  };

  const handlePost = async () => {
    if (!content.trim()) {
      showAlert('Error', 'Post content cannot be empty');
      return;
    }

    if (!user) return;

    setPosting(true);
    try {
      await createPost({
        authorId: user.id,
        authorName: user.name,
        authorAvatar: user.avatar,
        content: content.trim(),
        mediaUrl: mediaUrl || undefined,
        mediaType,
        category: selectedCategory,
        location: user.location,
      });
      showAlert('Success', 'Post created successfully');
      router.back();
    } catch (error) {
      showAlert('Error', 'Failed to create post');
    } finally {
      setPosting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* User Info */}
          <View style={styles.userInfo}>
            <Image
              source={{ uri: user?.avatar }}
              style={styles.avatar}
              contentFit="cover"
            />
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{user?.name}</Text>
              <View style={styles.locationRow}>
                <Ionicons name="location" size={14} color={theme.colors.local} />
                <Text style={styles.location}>{user?.location}</Text>
              </View>
            </View>
          </View>

          {/* Content Input */}
          <TextInput
            style={styles.contentInput}
            value={content}
            onChangeText={setContent}
            placeholder="What is happening in your area?"
            placeholderTextColor={theme.colors.textTertiary}
            multiline
            autoFocus
          />

          {/* Media Preview */}
          {mediaUrl && (
            <View style={styles.mediaPreview}>
              {mediaType === 'image' && (
                <Image
                  source={{ uri: mediaUrl }}
                  style={styles.mediaImage}
                  contentFit="cover"
                />
              )}
              {mediaType === 'video' && (
                <View style={styles.videoPlaceholder}>
                  <Ionicons name="videocam" size={48} color={theme.colors.primary} />
                  <Text style={styles.videoText}>Video selected</Text>
                </View>
              )}
              <TouchableOpacity style={styles.removeMedia} onPress={handleRemoveMedia}>
                <Ionicons name="close-circle" size={32} color={theme.colors.error} />
              </TouchableOpacity>
            </View>
          )}

          {/* Category Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Category</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryScroll}
            >
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.value}
                  style={[
                    styles.categoryChip,
                    selectedCategory === cat.value && styles.categoryChipActive,
                  ]}
                  onPress={() => setSelectedCategory(cat.value)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      selectedCategory === cat.value && styles.categoryTextActive,
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Media Options */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Add Media</Text>
            <View style={styles.mediaOptions}>
              <TouchableOpacity
                style={styles.mediaOption}
                onPress={() => handlePickMedia('image')}
              >
                <Ionicons name="image" size={24} color={theme.colors.primary} />
                <Text style={styles.mediaOptionText}>Image</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.mediaOption}
                onPress={() => handlePickMedia('video')}
              >
                <Ionicons name="videocam" size={24} color={theme.colors.primary} />
                <Text style={styles.mediaOptionText}>Video</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Post Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.postButton, (!content.trim() || posting) && styles.postButtonDisabled]}
            onPress={handlePost}
            disabled={!content.trim() || posting}
          >
            <Text style={styles.postButtonText}>
              {posting ? 'Posting...' : 'Post'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.surfaceElevated,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: theme.fonts.sizes.base,
    fontWeight: theme.fonts.weights.semibold,
    color: theme.colors.text,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    fontSize: theme.fonts.sizes.xs,
    color: theme.colors.local,
  },
  contentInput: {
    padding: 16,
    fontSize: theme.fonts.sizes.lg,
    color: theme.colors.text,
    minHeight: 150,
    textAlignVertical: 'top',
  },
  mediaPreview: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  mediaImage: {
    width: '100%',
    height: 200,
    backgroundColor: theme.colors.surfaceElevated,
  },
  videoPlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoText: {
    marginTop: 8,
    fontSize: theme.fonts.sizes.base,
    color: theme.colors.text,
  },
  removeMedia: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  section: {
    padding: 16,
    gap: 12,
  },
  sectionTitle: {
    fontSize: theme.fonts.sizes.sm,
    fontWeight: theme.fonts.weights.semibold,
    color: theme.colors.text,
  },
  categoryScroll: {
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  categoryChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  categoryText: {
    fontSize: theme.fonts.sizes.sm,
    fontWeight: theme.fonts.weights.medium,
    color: theme.colors.text,
  },
  categoryTextActive: {
    color: theme.colors.background,
  },
  mediaOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  mediaOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  mediaOptionText: {
    fontSize: theme.fonts.sizes.sm,
    fontWeight: theme.fonts.weights.medium,
    color: theme.colors.text,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  postButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postButtonDisabled: {
    opacity: 0.5,
  },
  postButtonText: {
    fontSize: theme.fonts.sizes.lg,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.background,
  },
});
