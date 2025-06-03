
import React from 'react';
import { ICONS } from '../constants';


interface ActivityBarProps {
  onSelectExplorerView: () => void; // Renamed from onToggleSidebar
  onOpenAIChat: () => void; 
  activeViewId?: string | null; 
}

const ActivityBar: React.FC<ActivityBarProps> = ({ onSelectExplorerView, onOpenAIChat, activeViewId }) => {
  const FilesIcon = ICONS.files_icon;
  const SettingsIcon = ICONS.settings_icon;
  const AIChatIcon = ICONS.ai_chat_icon;

  const getItemClasses = (viewId: string) => {
    const isActive = activeViewId === viewId;
    return `p-2.5 rounded text-[var(--activitybar-inactive-foreground)] focus:outline-none transition-colors duration-150 ease-in-out relative ${
      isActive
        ? 'text-[var(--activitybar-foreground)] bg-[var(--activitybar-active-background)]'
        : 'hover:text-[var(--activitybar-foreground)] hover:bg-[var(--activitybar-hover-background)] focus:bg-[var(--activitybar-hover-background)]'
    }`;
  };

  const isExplorerActive = activeViewId === 'explorer';

  return (
    <div className="w-12 bg-[var(--activitybar-background)] h-full flex flex-col justify-between items-center py-3 shadow-md flex-shrink-0">
      <div className="flex flex-col space-y-1">
        {FilesIcon && (
          <button
            onClick={onSelectExplorerView} // Use the new prop
            className={getItemClasses('explorer')}
            title="Explorer"
            aria-label="Explorer - Show files and folders"
            aria-pressed={isExplorerActive} // aria-pressed is true if explorer view is active
            aria-current={isExplorerActive ? "page" : undefined}
          >
            {isExplorerActive && (
              <span 
                className="absolute left-0 top-1/2 transform -translate-y-1/2 w-0.5 h-6 bg-[var(--activitybar-active-border)] rounded-r-sm"
                aria-hidden="true"
              ></span>
            )}
            <FilesIcon size={22} />
          </button>
        )}
        {AIChatIcon && (
          <button
            onClick={onOpenAIChat}
            className={getItemClasses('ai_chat_tab')}
            title="AI Assistant"
            aria-label="Open AI Assistant Chat"
            aria-current={activeViewId === 'ai_chat_tab' ? "page" : undefined}
          >
            {activeViewId === 'ai_chat_tab' && (
              <span
                className="absolute left-0 top-1/2 transform -translate-y-1/2 w-0.5 h-6 bg-[var(--activitybar-active-border)] rounded-r-sm"
                aria-hidden="true"
              ></span>
            )}
            <AIChatIcon size={22} />
          </button>
        )}
      </div>
      
      <div className="flex flex-col space-y-1">
        {SettingsIcon && (
          <button
            className="p-2.5 rounded text-[var(--activitybar-inactive-foreground)] hover:text-[var(--activitybar-foreground)] hover:bg-[var(--activitybar-hover-background)] focus:bg-[var(--activitybar-hover-background)] focus:outline-none transition-colors duration-150 ease-in-out"
            title="Manage (Settings - Not Implemented)"
            aria-label="Manage settings (feature not implemented)"
          >
            <SettingsIcon size={22} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ActivityBar;
