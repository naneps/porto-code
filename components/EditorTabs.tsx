
import React from 'react';
import { Tab } from '../types';
import { ICONS } from '../constants';


interface EditorTabsProps {
  tabs: Tab[];
  activeTabId: string | null;
  onSelectTab: (tabId: string) => void;
  onCloseTab: (tabId: string) => void;
  onContextMenuRequest: (x: number, y: number, tabId: string) => void; 
  isPreviewTabLoading?: boolean; // New prop for linear progress bar
}

const EditorTabs: React.FC<EditorTabsProps> = ({ 
  tabs, 
  activeTabId, 
  onSelectTab, 
  onCloseTab, 
  onContextMenuRequest,
  isPreviewTabLoading 
}) => {
  if (tabs.length === 0 && !isPreviewTabLoading) {
    return <div className="h-[42px] bg-[var(--editor-tab-background)] border-b border-[var(--editor-tab-border)] relative"></div>; 
  }
  const CloseIcon = ICONS.x_icon;

  return (
    <div 
      className="relative flex bg-[var(--editor-tab-background)] border-b border-[var(--editor-tab-border)] overflow-x-auto"
      role="tablist"
      aria-label="Editor open files"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        let iconKey = tab.id; 
        if (tab.type === 'project_detail') {
            iconKey = 'project_detail';
        } else if (tab.type === 'ai_chat') {
            iconKey = 'ai_chat_icon'; 
        } else if (tab.type === 'article_detail') {
            iconKey = 'article_detail';
        } else if (tab.type === 'json_preview' && tab.fileName) {
            iconKey = ICONS[tab.fileName] ? tab.fileName : 'default'; 
        }
        const IconComponent = ICONS[iconKey] || ICONS.default;
        
        const iconColorClass = isActive 
          ? 'text-[var(--editor-tab-icon-active-foreground)]'
          : 'text-[var(--editor-tab-icon-foreground)] group-hover:text-[var(--editor-tab-active-foreground)]';

        const textColorClass = isActive 
          ? 'text-[var(--editor-tab-active-foreground)]'
          : 'text-[var(--editor-tab-inactive-foreground)] group-hover:text-[var(--editor-tab-active-foreground)]';
        
        const tabBackgroundClass = isActive
          ? 'bg-[var(--editor-tab-active-background)]'
          : 'bg-[var(--editor-tab-inactive-background)] hover:bg-[var(--editor-tab-hover-background)]';
        
        const activeBorderClass = isActive ? 'border-t-2 border-[var(--editor-tab-active-border-top)]' : 'border-t-2 border-transparent';


        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelectTab(tab.id)}
            onContextMenu={(e) => { 
              e.preventDefault();
              onContextMenuRequest(e.pageX, e.pageY, tab.id);
            }}
            className={`flex items-center py-2 px-3 md:px-4 cursor-pointer border-r border-[var(--editor-tab-border)] whitespace-nowrap group transition-colors duration-150 ease-in-out relative focus:outline-none focus:ring-1 focus:ring-inset focus:ring-[var(--focus-border)]
              ${tabBackgroundClass} ${activeBorderClass}`}
            style={{paddingTop: isActive ? 'calc(0.5rem - 2px)' : '0.5rem'}} 
            title={tab.title} // Changed from tab.id to tab.title
          >
            <IconComponent size={16} className={`mr-2 flex-shrink-0 ${iconColorClass} pointer-events-none`} />
            <span className={`text-sm truncate max-w-[100px] md:max-w-[150px] ${textColorClass} pointer-events-none`}>{tab.title}</span>
            {CloseIcon && (
              <button
                onClick={(e) => {
                  e.stopPropagation(); 
                  onCloseTab(tab.id);
                }}
                className={`ml-2 p-0.5 rounded hover:bg-[var(--titlebar-button-hover-background)] focus:outline-none transition-colors duration-150 ease-in-out ${isActive ? 'text-[var(--editor-tab-active-foreground)] hover:opacity-80' : 'text-[var(--editor-tab-inactive-foreground)] group-hover:text-[var(--editor-tab-active-foreground)]'}`}
                title={`Close ${tab.title}`}
                aria-label={`Close ${tab.title} tab`}
              >
                <CloseIcon size={14} />
              </button>
            )}
          </button>
        );
      })}
      <div className="flex-grow bg-[var(--editor-tab-background)] h-full border-t-2 border-transparent min-h-[38px]"></div>
      
      {isPreviewTabLoading && (
        <div className="linear-progress-bar" aria-label="Loading preview content">
          <div className="linear-progress-bar-indicator"></div>
        </div>
      )}
    </div>
  );
};

export default EditorTabs;
