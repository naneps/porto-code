
import { useState, useEffect, useCallback } from 'react';
import { ArticleItem, LogLevel } from '../App/types'; // Ensure this path is correct
// Removed import of addAppLog from '../App/App' as it's passed as a prop (addAppLogHook)

export const useDevToArticles = (
  username: string, 
  addAppLogHook?: (level: LogLevel, message: string, source?: string, details?: Record<string, any>) => void
) => {
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const log = addAppLogHook || console.log; // Fallback if addAppLogHook is not provided

  const fetchArticles = useCallback(async (isRetry: boolean = false): Promise<boolean> => {
    if (!username) {
      setError("Dev.to username not provided.");
      setArticles([]);
      if (typeof log === 'function') {
        log('warning', "Dev.to username not provided, cannot fetch articles.", 'DevToArticlesHook');
      }
      return false;
    }
    setIsLoading(true);
    setError(null); // Clear previous error on new fetch attempt
    if (typeof log === 'function') {
      log('info', `Dev.to articles fetch started for ${username}. Retry: ${isRetry}`, 'DevToArticlesHook');
    }

    try {
      const response = await fetch(`https://dev.to/api/articles?username=${username}&per_page=100`);

      if (!response.ok) {
        let errorMessage = `Failed to fetch articles: ${response.statusText} (Status: ${response.status})`;
        if (response.status === 404) {
          errorMessage = `User "${username}" not found on dev.to or no articles published.`;
        } else if (response.status === 401 || response.status === 403) {
          errorMessage = `Unauthorized or Forbidden. Check API access or permissions for dev.to user ${username}.`;
        }
        throw new Error(errorMessage);
      }
      const data: ArticleItem[] = await response.json();
      
      const sortedData = data.sort((a, b) => 
        new Date(b.published_timestamp).getTime() - new Date(a.published_timestamp).getTime()
      );

      setArticles(sortedData);
      if (typeof log === 'function') {
        log('info', `Successfully fetched ${sortedData.length} articles for ${username}.`, 'DevToArticlesHook');
      }
      setIsLoading(false);
      return true;
    } catch (e: any) {
      const errorMessage = e.message || "An unknown error occurred while fetching articles.";
      console.error("Error fetching dev.to articles:", e);
      setError(errorMessage);
      setArticles([]); 
      if (typeof log === 'function') {
        log('error', `Failed to fetch articles for ${username}: ${errorMessage}`, 'DevToArticlesHook', { error: e });
      }
      setIsLoading(false);
      return false;
    }
  }, [username, log]);

  // No useEffect here to auto-fetch.

  return { articles, isLoading, error, fetchArticles };
};