export type CategoryType = 'all' | 'local' | 'trending' | 'crime' | 'politics' | 'business' | 'weather' | 'entertainment';

export interface Article {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  source: string;
  category: CategoryType;
  publishedAt: string;
  distance?: number; // in miles
  location: string;
  views: number;
  likes: number;
  comments: number;
  isBreaking?: boolean;
  isSaved?: boolean;
  isLiked?: boolean;
}

export interface Comment {
  id: string;
  articleId: string;
  author: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
  likes: number;
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
