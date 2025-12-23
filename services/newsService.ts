import { Article, CategoryType, Comment, UserProfile } from '../types';

// Mock data - will be replaced with real Supabase integration
const mockArticles: Article[] = [
  {
    id: '1',
    title: 'Breaking: Major Traffic Incident on I-405 Causes Hour-Long Delays',
    summary: 'A multi-vehicle collision has shut down three lanes of I-405 northbound near Sunset Boulevard, causing significant delays during evening rush hour.',
    imageUrl: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800',
    source: 'Local Traffic News',
    category: 'local',
    publishedAt: new Date(Date.now() - 15 * 60000).toISOString(),
    distance: 2.3,
    location: 'Los Angeles, CA',
    views: 12543,
    likes: 234,
    comments: 67,
    isBreaking: true,
  },
  {
    id: '2',
    title: 'City Council Approves $50M Budget for New Community Park',
    summary: 'After months of debate, the city council has unanimously approved funding for a 25-acre community park featuring sports facilities and green spaces.',
    imageUrl: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=800',
    source: 'City Hall Report',
    category: 'politics',
    publishedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    distance: 5.1,
    location: 'Los Angeles, CA',
    views: 8932,
    likes: 456,
    comments: 123,
  },
  {
    id: '3',
    title: 'Local Startup Raises $10M Series A to Revolutionize Food Delivery',
    summary: 'TechCrunch reports that a locally-based food delivery startup has secured significant funding from venture capital firms.',
    imageUrl: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=800',
    source: 'Business Wire',
    category: 'business',
    publishedAt: new Date(Date.now() - 4 * 3600000).toISOString(),
    distance: 8.7,
    location: 'San Francisco, CA',
    views: 15234,
    likes: 892,
    comments: 234,
  },
  {
    id: '4',
    title: 'Police Arrest Suspect in String of Downtown Burglaries',
    summary: 'Local police department announces the arrest of a suspect connected to multiple commercial burglaries that occurred over the past two weeks.',
    imageUrl: 'https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=800',
    source: 'Crime Watch Daily',
    category: 'crime',
    publishedAt: new Date(Date.now() - 6 * 3600000).toISOString(),
    distance: 1.5,
    location: 'Los Angeles, CA',
    views: 23456,
    likes: 567,
    comments: 345,
    isBreaking: true,
  },
  {
    id: '5',
    title: 'Heat Wave Alert: Temperatures Expected to Reach 105°F This Weekend',
    summary: 'National Weather Service issues excessive heat warning for the greater metropolitan area, urging residents to stay hydrated and avoid outdoor activities.',
    imageUrl: 'https://images.unsplash.com/photo-1601134467661-3d775b999c8b?w=800',
    source: 'Weather Channel',
    category: 'weather',
    publishedAt: new Date(Date.now() - 8 * 3600000).toISOString(),
    distance: 0,
    location: 'Your Area',
    views: 45678,
    likes: 1234,
    comments: 456,
  },
  {
    id: '6',
    title: 'Hollywood Producer Announces New Film Studio Opening in Downtown',
    summary: 'A renowned Hollywood producer plans to open a state-of-the-art production facility, bringing hundreds of jobs to the local economy.',
    imageUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800',
    source: 'Entertainment Today',
    category: 'entertainment',
    publishedAt: new Date(Date.now() - 12 * 3600000).toISOString(),
    distance: 12.4,
    location: 'Hollywood, CA',
    views: 34567,
    likes: 2345,
    comments: 678,
  },
  {
    id: '7',
    title: 'New Restaurant Opens on Main Street Serving Farm-to-Table Cuisine',
    summary: 'A family-owned restaurant celebrating local ingredients and sustainable farming practices opens its doors to the community.',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    source: 'Local Eats',
    category: 'local',
    publishedAt: new Date(Date.now() - 18 * 3600000).toISOString(),
    distance: 3.2,
    location: 'Los Angeles, CA',
    views: 6789,
    likes: 345,
    comments: 89,
  },
  {
    id: '8',
    title: 'Tech Giant Announces Plans for Regional Headquarters',
    summary: 'A major technology company reveals plans to establish a 500,000 square foot campus, creating over 2,000 high-paying jobs.',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
    source: 'Tech Business Journal',
    category: 'business',
    publishedAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    distance: 15.6,
    location: 'Silicon Valley, CA',
    views: 56789,
    likes: 3456,
    comments: 890,
  },
];

const mockComments: Comment[] = [
  {
    id: '1',
    articleId: '1',
    author: 'Sarah Johnson',
    authorAvatar: 'https://i.pravatar.cc/150?img=1',
    content: 'Just drove through there, it is really bad. Take alternate routes!',
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
    likes: 23,
  },
  {
    id: '2',
    articleId: '1',
    author: 'Mike Chen',
    authorAvatar: 'https://i.pravatar.cc/150?img=2',
    content: 'Thanks for the heads up. Does anyone know if the 101 is clear?',
    createdAt: new Date(Date.now() - 3 * 60000).toISOString(),
    likes: 12,
  },
];

const mockUser: UserProfile = {
  id: 'user1',
  name: 'Alex Thompson',
  email: 'alex.thompson@example.com',
  avatar: 'https://i.pravatar.cc/150?img=5',
  location: 'Los Angeles, CA',
  savedArticles: [],
  followedCategories: ['local', 'business'],
  notificationsEnabled: true,
};

// Service functions
export const newsService = {
  getArticles: async (category: CategoryType = 'all'): Promise<Article[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (category === 'all') {
      return mockArticles;
    }
    
    return mockArticles.filter(article => article.category === category);
  },
  
  getArticleById: async (id: string): Promise<Article | null> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockArticles.find(article => article.id === id) || null;
  },
  
  getBreakingNews: async (): Promise<Article[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockArticles.filter(article => article.isBreaking);
  },
  
  getLocalNews: async (): Promise<Article[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockArticles
      .filter(article => article.distance !== undefined && article.distance < 10)
      .sort((a, b) => (a.distance || 0) - (b.distance || 0));
  },
  
  getComments: async (articleId: string): Promise<Comment[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockComments.filter(comment => comment.articleId === articleId);
  },
  
  getUserProfile: async (): Promise<UserProfile> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockUser;
  },
  
  toggleSaveArticle: async (articleId: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockUser.savedArticles.indexOf(articleId);
    if (index > -1) {
      mockUser.savedArticles.splice(index, 1);
      return false;
    } else {
      mockUser.savedArticles.push(articleId);
      return true;
    }
  },
  
  toggleLikeArticle: async (articleId: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const article = mockArticles.find(a => a.id === articleId);
    if (article) {
      article.isLiked = !article.isLiked;
      article.likes += article.isLiked ? 1 : -1;
      return article.isLiked;
    }
    return false;
  },
};
