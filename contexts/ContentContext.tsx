import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Post, Comment } from '../types';

interface ContentContextType {
  posts: Post[];
  loading: boolean;
  createPost: (post: Omit<Post, 'id' | 'createdAt' | 'likes' | 'comments' | 'reposts' | 'views'>) => Promise<void>;
  toggleLike: (postId: string, userId: string) => Promise<void>;
  addComment: (postId: string, comment: Omit<Comment, 'id' | 'createdAt' | 'likes'>) => Promise<void>;
  repost: (postId: string, userId: string) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  refreshPosts: () => Promise<void>;
}

export const ContentContext = createContext<ContentContextType | undefined>(undefined);

const STORAGE_KEY = '@newsbreak_posts';

export function ContentProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        setPosts(JSON.parse(data));
      }
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const savePosts = async (updatedPosts: Post[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPosts));
      setPosts(updatedPosts);
    } catch (error) {
      console.error('Failed to save posts:', error);
    }
  };

  const createPost = async (postData: Omit<Post, 'id' | 'createdAt' | 'likes' | 'comments' | 'reposts' | 'views'>) => {
    const newPost: Post = {
      ...postData,
      id: `post_${Date.now()}`,
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: 0,
      reposts: 0,
      views: 0,
      likedBy: [],
      commentsList: [],
      repostedBy: [],
    };

    const updatedPosts = [newPost, ...posts];
    await savePosts(updatedPosts);
  };

  const toggleLike = async (postId: string, userId: string) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const isLiked = post.likedBy.includes(userId);
        return {
          ...post,
          likes: post.likes + (isLiked ? -1 : 1),
          likedBy: isLiked 
            ? post.likedBy.filter(id => id !== userId)
            : [...post.likedBy, userId],
        };
      }
      return post;
    });
    await savePosts(updatedPosts);
  };

  const addComment = async (postId: string, commentData: Omit<Comment, 'id' | 'createdAt' | 'likes'>) => {
    const newComment: Comment = {
      ...commentData,
      id: `comment_${Date.now()}`,
      createdAt: new Date().toISOString(),
      likes: 0,
    };

    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments + 1,
          commentsList: [...(post.commentsList || []), newComment],
        };
      }
      return post;
    });
    await savePosts(updatedPosts);
  };

  const repost = async (postId: string, userId: string) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const isReposted = post.repostedBy.includes(userId);
        return {
          ...post,
          reposts: post.reposts + (isReposted ? -1 : 1),
          repostedBy: isReposted
            ? post.repostedBy.filter(id => id !== userId)
            : [...post.repostedBy, userId],
        };
      }
      return post;
    });
    await savePosts(updatedPosts);
  };

  const deletePost = async (postId: string) => {
    const updatedPosts = posts.filter(post => post.id !== postId);
    await savePosts(updatedPosts);
  };

  const refreshPosts = async () => {
    await loadPosts();
  };

  return (
    <ContentContext.Provider value={{
      posts,
      loading,
      createPost,
      toggleLike,
      addComment,
      repost,
      deletePost,
      refreshPosts,
    }}>
      {children}
    </ContentContext.Provider>
  );
}
