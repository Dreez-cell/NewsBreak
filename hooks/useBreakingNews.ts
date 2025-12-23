import { useState, useEffect } from 'react';
import { Article } from '../types';
import { newsService } from '../services/newsService';

export function useBreakingNews() {
  const [breakingNews, setBreakingNews] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBreakingNews();
  }, []);

  const loadBreakingNews = async () => {
    try {
      setLoading(true);
      const data = await newsService.getBreakingNews();
      setBreakingNews(data);
    } catch (err) {
      console.error('Failed to load breaking news:', err);
    } finally {
      setLoading(false);
    }
  };

  return { breakingNews, loading };
}
