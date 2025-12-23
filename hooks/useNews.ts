import { useState, useEffect, useCallback } from 'react';
import { Article, CategoryType } from '../types';
import { newsService } from '../services/newsService';

export function useNews(category: CategoryType = 'all') {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadArticles = useCallback(async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      const data = await newsService.getArticles(category);
      setArticles(data);
    } catch (err) {
      setError('Failed to load news');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [category]);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  const refresh = useCallback(() => {
    loadArticles(true);
  }, [loadArticles]);

  const toggleSave = useCallback(async (articleId: string) => {
    const isSaved = await newsService.toggleSaveArticle(articleId);
    setArticles(prev => prev.map(article => 
      article.id === articleId ? { ...article, isSaved } : article
    ));
    return isSaved;
  }, []);

  const toggleLike = useCallback(async (articleId: string) => {
    const isLiked = await newsService.toggleLikeArticle(articleId);
    setArticles(prev => prev.map(article => 
      article.id === articleId 
        ? { ...article, isLiked, likes: article.likes + (isLiked ? 1 : -1) } 
        : article
    ));
    return isLiked;
  }, []);

  return {
    articles,
    loading,
    refreshing,
    error,
    refresh,
    toggleSave,
    toggleLike,
  };
}
