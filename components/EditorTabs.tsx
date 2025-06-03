
import React from 'react';
import { Tab } from '../types';
import { ICONS } from '../constants';


interface EditorTabsProps {
  tabs: Tab[];
  activeTabId: string | null;
  onSelectTab: (tabId: string) => void;
  onCloseTab: (tabId: string) => void;
  onContextMenuRequest: (x: number, y: number, tabId: string) => void; // Added prop
}

const EditorTabs: React.FC<EditorTabsProps> = ({ tabs, activeTabId, onSelectTab, onCloseTab, onContextMenuRequest }) => {
  if (tabs.length === 0) {
    return <div className="h-[42px] bg-[var(--editor-tab-background)] border-b border-[var(--editor-tab-border)]"></div>; 
  }
  const CloseIcon = ICONS.x_icon;

  return (
    <div className="flex bg-[var(--editor-tab-background)] border-b border-[var(--editor-tab-border)] overflow-x-auto">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        let iconKey = tab.id; 
        if (tab.type === 'project_detail') {
            iconKey = 'project_detail';
        } else if (tab.type === 'ai_chat') {
            iconKey = 'ai_chat_icon'; // Use specific icon for AI chat tab
        } else if (tab.type === 'json_preview' && tab.fileName) {
            iconKey = ICONS[tab.fileName] ? tab.fileName : 'default'; // Icon for preview based on original file
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
        
        const activeBorderClass = isActive ? 'border-b-2 border-[var(--editor-tab-active-border-bottom)]' : '';


        return (
          <div
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            onContextMenu={(e) => { // Added onContextMenu handler
              e.preventDefault();
              onContextMenuRequest(e.pageX, e.pageY, tab.id);
            }}
            className={`flex items-center py-2 px-3 md:px-4 cursor-pointer border-r border-[var(--editor-tab-border)] whitespace-nowrap group transition-colors duration-150 ease-in-out 
              ${tabBackgroundClass} ${activeBorderClass}`}
            title={tab.id} 
          >
            <IconComponent size={16} className={`mr-2 flex-shrink-0 ${iconColorClass}`} />
            <span className={`text-sm truncate max-w-[100px] md:max-w-[150px] ${textColorClass}`}>{tab.title}</span>
            {CloseIcon && (
              <button
                onClick={(e) => {
                  e.stopPropagation(); 
                  onCloseTab(tab.id);
                }}
                className={`ml-2 p-0.5 rounded hover:bg-[var(--titlebar-button-hover-background)] focus:outline-none transition-colors duration-150 ease-in-out ${isActive ? 'text-[var(--editor-tab-active-foreground)] hover:opacity-80' : 'text-[var(--editor-tab-inactive-foreground)] group-hover:text-[var(--editor-tab-active-foreground)]'}`}
                title={`Close ${tab.title}`}
              >
                <CloseIcon size={14} />
              </button>
            )}
          </div>
        );
      })}
      <div className="flex-grow bg-[var(--editor-tab-background)] h-full"></div>
    </div>
  );
};

export default EditorTabs;
