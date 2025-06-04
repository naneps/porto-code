
import React, { useEffect, useState } from 'react';
import { NotificationItem } from '../../types';
import { ICONS } from '../../constants';
import { CheckCircle2, XCircle, Info, AlertTriangle, LucideIcon } from 'lucide-react';

interface NotificationItemProps {
  notification: NotificationItem;
  onDismiss: (id: string) => void;
}

const typeIcons: Record<NotificationItem['type'], LucideIcon> = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

// Updated "soft dark" colors. Using Tailwind's darker shades.
// Ensure these var() fallbacks match the theme.ts general colors if needed.
const typeColors: Record<NotificationItem['type'], { bg: string; text: string; border: string, icon: string }> = {
  success: { 
    bg: 'bg-[var(--notification-success-background,rgb(21,54,36))]', // Darker green, e.g., green-800/90 or custom
    text: 'text-[var(--notification-success-foreground,rgb(134,239,172))]', // Lighter green text, e.g., green-300
    border: 'border-[var(--notification-success-border,rgb(34,90,56))]', // Slightly lighter border, e.g., green-700
    icon: 'text-[var(--notification-success-icon,rgb(74,222,128))]' // e.g., green-400
  },
  error: { 
    bg: 'bg-[var(--notification-error-background,rgb(70,26,29))]', // Darker red
    text: 'text-[var(--notification-error-foreground,rgb(252,165,165))]', // Lighter red text
    border: 'border-[var(--notification-error-border,rgb(120,36,42))]', // Slightly lighter border
    icon: 'text-[var(--notification-error-icon,rgb(248,113,113))]' 
  },
  info: { 
    bg: 'bg-[var(--notification-info-background,rgb(29,54,82))]', // Darker blue
    text: 'text-[var(--notification-info-foreground,rgb(147,197,253))]', // Lighter blue text
    border: 'border-[var(--notification-info-border,rgb(39,74,122))]', // Slightly lighter border
    icon: 'text-[var(--notification-info-icon,rgb(96,165,250))]' 
  },
  warning: { 
    bg: 'bg-[var(--notification-warning-background,rgb(70,51,20))]', // Darker yellow/orange
    text: 'text-[var(--notification-warning-foreground,rgb(252,211,77))]', // Lighter yellow text
    border: 'border-[var(--notification-warning-border,rgb(110,71,30))]', // Slightly lighter border
    icon: 'text-[var(--notification-warning-icon,rgb(251,191,36))]' 
  },
};


const NotificationItemComponent: React.FC<NotificationItemProps> = ({ notification, onDismiss }) => {
  const { id, message, type, actions, icon: customIcon } = notification;
  const IconComponent = customIcon || typeIcons[type];
  const colors = typeColors[type];
  const CloseIcon = ICONS.x_icon;

  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setIsVisible(true); 
  }, []);

  const handleDismiss = () => {
    setIsVisible(false); 
    setTimeout(() => onDismiss(id), 300); 
  };

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`
        w-full max-w-sm rounded-md shadow-lg p-3 mb-3
        border ${colors.border} ${colors.bg}
        flex items-start space-x-3
        transition-all duration-300 ease-out
        ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}
      `}
    >
      {IconComponent && <IconComponent size={20} className={`${colors.icon} flex-shrink-0 mt-0.5`} />}
      <div className="flex-grow">
        <p className={`text-sm font-medium ${colors.text}`}>{message}</p>
        {actions && actions.length > 0 && (
          <div className="mt-2 flex space-x-2">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={() => {
                  action.onClick();
                  handleDismiss(); 
                }}
                className={`px-2 py-1 text-xs rounded-md focus:outline-none
                            bg-[var(--modal-button-background)] text-[var(--modal-button-foreground)]
                            hover:bg-[var(--modal-button-hover-background)]
                            focus:ring-2 focus:ring-[var(--focus-border)]`}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
      {CloseIcon && (
        <button
          onClick={handleDismiss}
          className={`p-0.5 rounded-full hover:bg-black/20 ${colors.text} flex-shrink-0`}
          aria-label="Dismiss notification"
        >
          <CloseIcon size={16} />
        </button>
      )}
    </div>
  );
};

export default NotificationItemComponent;