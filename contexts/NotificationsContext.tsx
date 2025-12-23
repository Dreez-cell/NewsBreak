import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Notification, NotificationType } from '../types';

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  createNotification: (
    type: NotificationType,
    userId: string,
    fromUserId: string,
    fromUserName: string,
    fromUserAvatar: string,
    content: string,
    relatedId?: string
  ) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: (userId: string) => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  getUserNotifications: (userId: string) => Notification[];
}

export const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

const STORAGE_KEY = '@newsbreak_notifications';

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        setNotifications(JSON.parse(data));
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveNotifications = async (updatedNotifications: Notification[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotifications));
      setNotifications(updatedNotifications);
    } catch (error) {
      console.error('Failed to save notifications:', error);
    }
  };

  const createNotification = async (
    type: NotificationType,
    userId: string,
    fromUserId: string,
    fromUserName: string,
    fromUserAvatar: string,
    content: string,
    relatedId?: string
  ) => {
    // Do not create notification if user is notifying themselves
    if (userId === fromUserId) return;

    const newNotification: Notification = {
      id: `notif_${Date.now()}`,
      type,
      userId,
      fromUserId,
      fromUserName,
      fromUserAvatar,
      content,
      relatedId,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    const updatedNotifications = [newNotification, ...notifications];
    await saveNotifications(updatedNotifications);
  };

  const markAsRead = async (notificationId: string) => {
    const updatedNotifications = notifications.map(notif =>
      notif.id === notificationId ? { ...notif, isRead: true } : notif
    );
    await saveNotifications(updatedNotifications);
  };

  const markAllAsRead = async (userId: string) => {
    const updatedNotifications = notifications.map(notif =>
      notif.userId === userId ? { ...notif, isRead: true } : notif
    );
    await saveNotifications(updatedNotifications);
  };

  const deleteNotification = async (notificationId: string) => {
    const updatedNotifications = notifications.filter(notif => notif.id !== notificationId);
    await saveNotifications(updatedNotifications);
  };

  const getUserNotifications = (userId: string) => {
    return notifications.filter(notif => notif.userId === userId);
  };

  const unreadCount = notifications.filter(notif => !notif.isRead).length;

  return (
    <NotificationsContext.Provider value={{
      notifications,
      unreadCount,
      loading,
      createNotification,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      getUserNotifications,
    }}>
      {children}
    </NotificationsContext.Provider>
  );
}
