import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { theme } from '../../constants/theme';
import { useAuth } from '../../hooks/useAuth';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [location, setLocation] = useState(user?.location || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [saving, setSaving] = useState(false);

  const showAlert = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}\n\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const handlePickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        showAlert('Permission Required', 'Please allow access to your photo library to change your profile picture.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setAvatar(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      showAlert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      showAlert('Error', 'Name cannot be empty');
      return;
    }

    setSaving(true);
    try {
      await updateProfile({
        name: name.trim(),
        bio: bio.trim(),
        location: location.trim(),
        avatar,
      });
      showAlert('Success', 'Profile updated successfully');
      router.back();
    } catch (error) {
      showAlert('Error', 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Avatar */}
          <View style={styles.avatarSection}>
            <TouchableOpacity onPress={handlePickImage} activeOpacity={0.8}>
              <Image
                source={{ uri: avatar }}
                style={styles.avatar}
                contentFit="cover"
              />
              <View style={styles.changeAvatarButton}>
                <Ionicons name="camera" size={20} color={theme.colors.background} />
              </View>
            </TouchableOpacity>
            <Text style={styles.avatarHint}>Tap photo to change picture</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Your name"
                placeholderTextColor={theme.colors.textTertiary}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Bio</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={bio}
                onChangeText={setBio}
                placeholder="Tell us about yourself"
                placeholderTextColor={theme.colors.textTertiary}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Location</Text>
              <View style={styles.inputWithIcon}>
                <Ionicons name="location" size={20} color={theme.colors.local} />
                <TextInput
                  style={styles.inputFlex}
                  value={location}
                  onChangeText={setLocation}
                  placeholder="City, State"
                  placeholderTextColor={theme.colors.textTertiary}
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, styles.inputDisabled]}
                value={user?.email}
                editable={false}
              />
              <Text style={styles.hint}>Email cannot be changed</Text>
            </View>
          </View>
        </ScrollView>

        {/* Save Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            disabled={saving}
          >
            <Text style={styles.saveButtonText}>
              {saving ? 'Saving...' : 'Save Changes'}
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
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 32,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.surfaceElevated,
  },
  changeAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: theme.colors.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  avatarHint: {
    marginTop: 12,
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.textTertiary,
  },
  form: {
    padding: 16,
    gap: 24,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: theme.fonts.sizes.sm,
    fontWeight: theme.fonts.weights.semibold,
    color: theme.colors.text,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: 16,
    fontSize: theme.fonts.sizes.base,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  inputFlex: {
    flex: 1,
    fontSize: theme.fonts.sizes.base,
    color: theme.colors.text,
    paddingVertical: 16,
  },
  inputDisabled: {
    opacity: 0.5,
  },
  hint: {
    fontSize: theme.fonts.sizes.xs,
    color: theme.colors.textTertiary,
    marginTop: -4,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: theme.fonts.sizes.lg,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.background,
  },
});
