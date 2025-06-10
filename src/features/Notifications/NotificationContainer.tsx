
import React from 'react';
import { NotificationItem } from '../../App/types';
import NotificationItemComponent from './NotificationItem';

interface NotificationContainerProps {
  notifications: NotificationItem[];
  onDismissNotification: (id: string) => void;
}

const NotificationContainer: React.FC<NotificationContainerProps> = ({ notifications, onDismissNotification }) => {
  if (notifications.length === 0) {
    return null;
  }

  return (
    <div
      className="fixed bottom-4 right-4 z-[200] w-full max-w-sm space-y-0" // space-y-0 because item has mb
      aria-live="polite"
      aria-atomic="true"
    >
      {notifications.map(notification => (
        <NotificationItemComponent
          key={notification.id}
          notification={notification}
          onDismiss={onDismissNotification}
        />
      ))}
    </div>
  );
};

export default NotificationContainer;
