import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { AppState } from 'react-native';
import { supabase } from '../lib/supabase';
import { User } from '../types';
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

function generateUsername(name: string): string {
  const cleaned = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  const random = Math.floor(Math.random() * 1000);
  return `${cleaned}${random}`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        loadUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        loadUserProfile(session.user.id);
      } else {
        setUser(null);
      }
    });

    // Handle app state changes
    const appStateListener = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        supabase.auth.startAutoRefresh();
      } else {
        supabase.auth.stopAutoRefresh();
      }
    });

    return () => {
      subscription.unsubscribe();
      appStateListener.remove();
    };
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (data) {
        // Get follower/following counts
        const [{ count: followersCount }, { count: followingCount }] = await Promise.all([
          supabase.from('follows').select('*', { count: 'exact', head: true }).eq('following_id', userId),
          supabase.from('follows').select('*', { count: 'exact', head: true }).eq('follower_id', userId),
        ]);

        const userProfile: User = {
          id: data.id,
          name: data.name,
          username: data.username,
          email: data.email,
          bio: data.bio || '',
          location: data.location || '',
          avatar: data.avatar,
          followers: [], // Will be populated by UsersContext
          following: [], // Will be populated by UsersContext
          savedArticles: [],
          followedCategories: ['all'],
          notificationsEnabled: true,
          createdAt: data.created_at,
          password: '', // Not stored in client
        };

        setUser(userProfile);
      }
    } catch (error) {
      console.error('Failed to load user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        await loadUserProfile(data.user.id);
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Login failed. Please try again.' };
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const username = generateUsername(name);
      const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            username,
            avatar,
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Profile is automatically created by trigger
        await loadUserProfile(data.user.id);
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Signup failed. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;

    try {
      let avatarUrl = updates.avatar;

      // Upload avatar if it is a local file URI
      if (avatarUrl && avatarUrl.startsWith('file://')) {
        const timestamp = Date.now();
        const fileName = `${user.id}/${timestamp}_avatar.jpg`;

        const response = await fetch(avatarUrl);
        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, arrayBuffer, {
            contentType: 'image/jpeg',
            upsert: true,
          });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);

        avatarUrl = publicUrlData.publicUrl;
      }

      const { error } = await supabase
        .from('user_profiles')
        .update({
          name: updates.name,
          bio: updates.bio,
          location: updates.location,
          avatar: avatarUrl,
        })
        .eq('id', user.id);

      if (error) throw error;

      const updatedUser = { ...user, ...updates, avatar: avatarUrl || user.avatar };
      setUser(updatedUser);
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
