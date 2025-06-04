
import { useState, useCallback } from 'react';
import { NotificationItem, NotificationType, NotificationAction } from '../types';
import { LucideIcon } from 'lucide-react';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const addNotification = useCallback(
    (
      message: string,
      type: NotificationType,
      duration: number = 5000, // Default duration 5 seconds
      actions?: NotificationAction[],
      icon?: LucideIcon
    ) => {
      // Check if an identical notification (same message and type) already exists
      const isDuplicate = notifications.some(
        n => n.message === message && n.type === type
      );

      if (isDuplicate) {
        // Do not add the notification if an identical one is already visible
        // This prevents stacking, as seen in the user's screenshot.
        return;
      }

      const id = crypto.randomUUID();
      const newNotification: NotificationItem = { id, message, type, duration, actions, icon };
      setNotifications(prev => [newNotification, ...prev]); // Add to the top

      if (duration > 0) {
        setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== id));
        }, duration);
      }
    },
    [notifications] // Added notifications to the dependency array for the duplicate check
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return { notifications, addNotification, removeNotification };
};
