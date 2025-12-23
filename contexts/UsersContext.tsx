import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';

interface UsersContextType {
  users: User[];
  loading: boolean;
  getUserById: (userId: string) => User | undefined;
  followUser: (currentUserId: string, targetUserId: string) => Promise<void>;
  unfollowUser: (currentUserId: string, targetUserId: string) => Promise<void>;
  refreshUsers: () => Promise<void>;
}

export const UsersContext = createContext<UsersContextType | undefined>(undefined);

const STORAGE_KEY = '@newsbreak_users_db';

export function UsersProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        setUsers(JSON.parse(data));
      }
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveUsers = async (updatedUsers: User[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Failed to save users:', error);
    }
  };

  const getUserById = (userId: string) => {
    return users.find(u => u.id === userId);
  };

  const followUser = async (currentUserId: string, targetUserId: string) => {
    const updatedUsers = users.map(user => {
      if (user.id === currentUserId) {
        return {
          ...user,
          following: [...user.following, targetUserId],
        };
      }
      if (user.id === targetUserId) {
        return {
          ...user,
          followers: [...user.followers, currentUserId],
        };
      }
      return user;
    });
    await saveUsers(updatedUsers);
  };

  const unfollowUser = async (currentUserId: string, targetUserId: string) => {
    const updatedUsers = users.map(user => {
      if (user.id === currentUserId) {
        return {
          ...user,
          following: user.following.filter(id => id !== targetUserId),
        };
      }
      if (user.id === targetUserId) {
        return {
          ...user,
          followers: user.followers.filter(id => id !== currentUserId),
        };
      }
      return user;
    });
    await saveUsers(updatedUsers);
  };

  const refreshUsers = async () => {
    await loadUsers();
  };

  return (
    <UsersContext.Provider value={{
      users,
      loading,
      getUserById,
      followUser,
      unfollowUser,
      refreshUsers,
    }}>
      {children}
    </UsersContext.Provider>
  );
}
