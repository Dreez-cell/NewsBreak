import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';

export default function CreateTabScreen() {
  const router = useRouter();

  React.useEffect(() => {
    router.push('/post/create');
  }, []);

  return (
    <View style={styles.container}>
      <Ionicons name="add-circle" size={64} color={theme.colors.primary} />
      <Text style={styles.text}>Redirecting to create post...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  text: {
    marginTop: 16,
    fontSize: theme.fonts.sizes.base,
    color: theme.colors.textSecondary,
  },
});
