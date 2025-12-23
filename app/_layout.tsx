import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { theme } from '../constants/theme';
import { AuthProvider } from '../contexts/AuthContext';
import { ContentProvider } from '../contexts/ContentContext';
import { UsersProvider } from '../contexts/UsersContext';
import { NotificationsProvider } from '../contexts/NotificationsContext';
import { MessagingProvider } from '../contexts/MessagingContext';
import { AuthGuard } from '../components/AuthGuard';

export default function RootLayout() {
  return (
    <AuthProvider>
      <UsersProvider>
        <NotificationsProvider>
          <MessagingProvider>
            <ContentProvider>
              <StatusBar style="light" />
              <AuthGuard>
                <Stack
                  screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: theme.colors.background },
                    animation: 'fade',
                  }}
                >
                  <Stack.Screen name="login" options={{ headerShown: false }} />
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                  <Stack.Screen 
                    name="article/[id]" 
                    options={{ 
                      headerShown: true,
                      headerStyle: { backgroundColor: theme.colors.surface },
                      headerTintColor: theme.colors.text,
                      headerTitle: '',
                      headerShadowVisible: false,
                    }} 
                  />
                  <Stack.Screen 
                    name="post/create" 
                    options={{ 
                      headerShown: true,
                      headerStyle: { backgroundColor: theme.colors.surface },
                      headerTintColor: theme.colors.text,
                      headerTitle: 'Create Post',
                      headerShadowVisible: false,
                    }} 
                  />
                  <Stack.Screen 
                    name="profile/edit" 
                    options={{ 
                      headerShown: true,
                      headerStyle: { backgroundColor: theme.colors.surface },
                      headerTintColor: theme.colors.text,
                      headerTitle: 'Edit Profile',
                      headerShadowVisible: false,
                    }} 
                  />
                  <Stack.Screen 
                    name="user/[id]" 
                    options={{ 
                      headerShown: true,
                      headerStyle: { backgroundColor: theme.colors.surface },
                      headerTintColor: theme.colors.text,
                      headerTitle: '',
                      headerShadowVisible: false,
                    }} 
                  />
                  <Stack.Screen 
                    name="chat/[id]" 
                    options={{ 
                      headerShown: true,
                      headerStyle: { backgroundColor: theme.colors.surface },
                      headerTintColor: theme.colors.text,
                      headerTitle: 'Chat',
                      headerShadowVisible: false,
                    }} 
                  />
                  <Stack.Screen 
                    name="hashtag/[tag]" 
                    options={{ 
                      headerShown: true,
                      headerStyle: { backgroundColor: theme.colors.surface },
                      headerTintColor: theme.colors.text,
                      headerTitle: '',
                      headerShadowVisible: false,
                    }} 
                  />
                </Stack>
              </AuthGuard>
            </ContentProvider>
          </MessagingProvider>
        </NotificationsProvider>
      </UsersProvider>
    </AuthProvider>
  );
}
