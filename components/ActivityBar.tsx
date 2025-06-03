
import React from 'react';
import { ICONS } from '../constants';
import { ActivityBarSelection } from '../types'; // Import ActivityBarSelection type

interface ActivityBarProps {
  onSelectExplorerView: () => void;
  onOpenAIChat: () => void;
  onToggleSearchPanel: () => void; 
  onToggleArticlesPanel: () => void; // New prop for articles panel
  activeViewId?: ActivityBarSelection; 
}

const ActivityBar: React.FC<ActivityBarProps> = ({ 
  onSelectExplorerView, 
  onOpenAIChat, 
  onToggleSearchPanel, 
  onToggleArticlesPanel, // Destructure new prop
  activeViewId 
}) => {
  const FilesIcon = ICONS.files_icon;
  const SettingsIcon = ICONS.settings_icon;
  const AIChatIcon = ICONS.ai_chat_icon;
  const SearchIcon = ICONS.search_icon; 
  const ArticlesIcon = ICONS.articles_icon; // Get Articles icon

  const getItemClasses = (viewId: ActivityBarSelection | string) => { 
    const isActive = activeViewId === viewId;
    return `p-2.5 rounded text-[var(--activitybar-inactive-foreground)] focus:outline-none transition-colors duration-150 ease-in-out relative ${
      isActive
        ? 'text-[var(--activitybar-foreground)] bg-[var(--activitybar-active-background)]'
        : 'hover:text-[var(--activitybar-foreground)] hover:bg-[var(--activitybar-hover-background)] focus:bg-[var(--activitybar-hover-background)]'
    }`;
  };

  return (
    <div className="w-12 bg-[var(--activitybar-background)] h-full flex flex-col justify-between items-center py-3 shadow-md flex-shrink-0">
      <div className="flex flex-col space-y-1">
        {FilesIcon && (
          <button
            onClick={onSelectExplorerView}
            className={getItemClasses('explorer')}
            title="Explorer"
            aria-label="Explorer - Show files and folders"
            aria-pressed={activeViewId === 'explorer'}
            aria-current={activeViewId === 'explorer' ? "page" : undefined}
          >
            {activeViewId === 'explorer' && (
              <span 
                className="absolute left-0 top-1/2 transform -translate-y-1/2 w-0.5 h-6 bg-[var(--activitybar-active-border)] rounded-r-sm"
                aria-hidden="true"
              ></span>
            )}
            <FilesIcon size={22} />
          </button>
        )}
        {SearchIcon && ( 
          <button
            onClick={onToggleSearchPanel}
            className={getItemClasses('search')}
            title="Search"
            aria-label="Search - Open global search panel"
            aria-pressed={activeViewId === 'search'}
            aria-current={activeViewId === 'search' ? "page" : undefined}
          >
            {activeViewId === 'search' && (
              <span 
                className="absolute left-0 top-1/2 transform -translate-y-1/2 w-0.5 h-6 bg-[var(--activitybar-active-border)] rounded-r-sm"
                aria-hidden="true"
              ></span>
            )}
            <SearchIcon size={22} />
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
         {ArticlesIcon && ( // Add Articles Icon Button
          <button
            onClick={onToggleArticlesPanel}
            className={getItemClasses('articles')}
            title="Articles"
            aria-label="Articles - Show articles and posts"
            aria-pressed={activeViewId === 'articles'}
            aria-current={activeViewId === 'articles' ? "page" : undefined}
          >
            {activeViewId === 'articles' && (
              <span 
                className="absolute left-0 top-1/2 transform -translate-y-1/2 w-0.5 h-6 bg-[var(--activitybar-active-border)] rounded-r-sm"
                aria-hidden="true"
              ></span>
            )}
            <ArticlesIcon size={22} />
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