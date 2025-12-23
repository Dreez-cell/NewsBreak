export type CategoryType = 'all' | 'local' | 'trending' | 'crime' | 'politics' | 'business' | 'weather' | 'entertainment';

export type MediaType = 'image' | 'video' | 'audio' | 'none';

export interface Article {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  source: string;
  category: CategoryType;
  publishedAt: string;
  distance?: number;
  location: string;
  views: number;
  likes: number;
  comments: number;
  isBreaking?: boolean;
  isSaved?: boolean;
  isLiked?: boolean;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  mediaUrl?: string;
  mediaType: MediaType;
  category: CategoryType;
  location: string;
  createdAt: string;
  likes: number;
  comments: number;
  reposts: number;
  views: number;
  likedBy: string[];
  commentsList: Comment[];
  repostedBy: string[];
}

export interface Comment {
  id: string;
  articleId: string;
  author: string;
  authorId: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
  likes: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar: string;
  bio: string;
  location: string;
  followers: string[];
  following: string[];
  savedArticles: string[];
  followedCategories: CategoryType[];
  notificationsEnabled: boolean;
  createdAt: string;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  albumArt: string;
  duration: number;
  url: string;
  category: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  location: string;
  savedArticles: string[];
  followedCategories: CategoryType[];
  notificationsEnabled: boolean;
}
