import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Message, Conversation } from '../types';

interface MessagingContextType {
  conversations: Conversation[];
  messages: Message[];
  loading: boolean;
  sendMessage: (senderId: string, receiverId: string, content: string) => Promise<void>;
  getConversation: (userId1: string, userId2: string) => Conversation | undefined;
  getConversationMessages: (conversationId: string) => Message[];
  markConversationAsRead: (conversationId: string, userId: string) => Promise<void>;
  getUnreadCount: (userId: string) => number;
}

export const MessagingContext = createContext<MessagingContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CONVERSATIONS: '@newsbreak_conversations',
  MESSAGES: '@newsbreak_messages',
};

export function MessagingProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [conversationsData, messagesData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.CONVERSATIONS),
        AsyncStorage.getItem(STORAGE_KEYS.MESSAGES),
      ]);

      if (conversationsData) setConversations(JSON.parse(conversationsData));
      if (messagesData) setMessages(JSON.parse(messagesData));
    } catch (error) {
      console.error('Failed to load messaging data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveData = async (updatedConversations: Conversation[], updatedMessages: Message[]) => {
    try {
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(updatedConversations)),
        AsyncStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(updatedMessages)),
      ]);
      setConversations(updatedConversations);
      setMessages(updatedMessages);
    } catch (error) {
      console.error('Failed to save messaging data:', error);
    }
  };

  const getOrCreateConversation = (userId1: string, userId2: string): Conversation => {
    const existing = conversations.find(conv =>
      conv.participants.includes(userId1) && conv.participants.includes(userId2)
    );

    if (existing) return existing;

    const newConversation: Conversation = {
      id: `conv_${Date.now()}`,
      participants: [userId1, userId2],
      updatedAt: new Date().toISOString(),
    };

    return newConversation;
  };

  const sendMessage = async (senderId: string, receiverId: string, content: string) => {
    const conversation = getOrCreateConversation(senderId, receiverId);
    
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      conversationId: conversation.id,
      senderId,
      receiverId,
      content,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    const updatedMessages = [newMessage, ...messages];
    
    const conversationExists = conversations.find(c => c.id === conversation.id);
    const updatedConversation: Conversation = {
      ...conversation,
      lastMessage: newMessage,
      updatedAt: new Date().toISOString(),
    };

    const updatedConversations = conversationExists
      ? conversations.map(c => c.id === conversation.id ? updatedConversation : c)
      : [updatedConversation, ...conversations];

    await saveData(updatedConversations, updatedMessages);
  };

  const getConversation = (userId1: string, userId2: string) => {
    return conversations.find(conv =>
      conv.participants.includes(userId1) && conv.participants.includes(userId2)
    );
  };

  const getConversationMessages = (conversationId: string) => {
    return messages
      .filter(msg => msg.conversationId === conversationId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  };

  const markConversationAsRead = async (conversationId: string, userId: string) => {
    const updatedMessages = messages.map(msg =>
      msg.conversationId === conversationId && msg.receiverId === userId
        ? { ...msg, isRead: true }
        : msg
    );
    await saveData(conversations, updatedMessages);
  };

  const getUnreadCount = (userId: string) => {
    return messages.filter(msg => msg.receiverId === userId && !msg.isRead).length;
  };

  return (
    <MessagingContext.Provider value={{
      conversations,
      messages,
      loading,
      sendMessage,
      getConversation,
      getConversationMessages,
      markConversationAsRead,
      getUnreadCount,
    }}>
      {children}
    </MessagingContext.Provider>
  );
}
