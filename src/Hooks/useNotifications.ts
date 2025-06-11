
import { useState, useCallback } from 'react';
import { NotificationItem, NotificationType, NotificationAction } from '../App/types';
import { LucideIcon } from 'lucide-react';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const addNotification = useCallback(
    (
      message: string,
      type: NotificationType,
      duration: number = 5000, // Default duration 5 seconds
      actions?: NotificationAction[],
      icon?: LucideIcon,
      isLoadingProgressBar?: boolean, // New parameter
      progressId?: string // New parameter for identifying progress notifications
    ) => {
      const id = progressId || crypto.randomUUID(); // Use progressId if provided
      const newNotification: NotificationItem = { 
        id, 
        message, 
        type, 
        duration, 
        actions, 
        icon,
        isLoadingProgressBar, // Store this
        progressId // Store this
      };

      setNotifications(prevNotifications => {
        // Check for duplicates using prevNotifications
        const isPotentiallyDuplicate = prevNotifications.some(
          n => n.message === message && n.type === type && n.progressId === progressId
        );

        if (isPotentiallyDuplicate && !progressId) { // Only prevent non-progress duplicates strictly
          return prevNotifications; // Do not add if it's a non-progress duplicate
        }

        // If it's an update to an existing progress notification, replace it
        if (progressId && prevNotifications.some(n => n.id === progressId)) {
          return prevNotifications.map(n => n.id === progressId ? newNotification : n);
        }
        // Add new notification to the top, ensuring no actual duplicates by ID (for safety, though UUIDs should be unique)
        return [newNotification, ...prevNotifications.filter(n => n.id !== id)];
      });


      if (duration > 0 && !isLoadingProgressBar) { // Auto-dismiss only if not a progress bar or duration is set
        setTimeout(() => {
          // Use functional update for removing notification to ensure it works with the latest state
          setNotifications(prev => prev.filter(n => n.id !== id));
        }, duration);
      }
    },
    [] // Empty dependency array makes addNotification stable
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return { notifications, addNotification, removeNotification };
};
