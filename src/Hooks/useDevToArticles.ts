import { useState, useCallback } from 'react';
import { ArticleItem, LogLevel } from '../App/types';
import crawledArticles from '../Assets/articles.json';

export const useDevToArticles = (
  username: string, 
  addAppLogHook?: (level: LogLevel, message: string, source?: string, details?: Record<string, any>) => void
) => {
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const log = addAppLogHook || console.log;

  const fetchArticles = useCallback(async (isRetry: boolean = false): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    if (typeof log === 'function') {
      log('info', `Local crawled articles fetch started. Retry: ${isRetry}`, 'CrawledArticlesHook');
    }

    try {
      // Simulate network request to keep the slick loading UX animation
      await new Promise((resolve) => setTimeout(resolve, 500));

      const sortedData = (crawledArticles as ArticleItem[]).sort((a, b) => 
        new Date(b.published_timestamp).getTime() - new Date(a.published_timestamp).getTime()
      );

      setArticles(sortedData);
      if (typeof log === 'function') {
        log('info', `Successfully loaded ${sortedData.length} crawled articles statically.`, 'CrawledArticlesHook');
      }
      setIsLoading(false);
      return true;
    } catch (e: any) {
      const errorMessage = e.message || "An unknown error occurred while loading articles.";
      console.error("Error loading articles:", e);
      setError(errorMessage);
      setArticles([]); 
      if (typeof log === 'function') {
        log('error', `Failed to load articles: ${errorMessage}`, 'CrawledArticlesHook', { error: e });
      }
      setIsLoading(false);
      return false;
    }
  }, [log]);

  return { articles, isLoading, error, fetchArticles };
};