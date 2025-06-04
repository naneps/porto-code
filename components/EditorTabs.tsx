
import React, { useState } from 'react';
import { Tab } from '../types';
import { ICONS } from '../constants';
import { playSound } from '../utils/audioUtils';


interface EditorTabsProps {
  tabs: Tab[];
  activeTabId: string | null;
  onSelectTab: (tabId: string) => void;
  onCloseTab: (tabId: string) => void;
  onContextMenuRequest: (x: number, y: number, tabId: string, isCVContext?: boolean) => void; 
  isLoading?: boolean; // Combined loading state for preview or CV generation
  onReorderTabs: (draggedTabId: string, targetTabId: string | null) => void; 
  onRunCVGeneratorFromTab?: () => void; // Optional handler for CV run icon
  className?: string; 
}

const EditorTabs: React.FC<EditorTabsProps> = ({ 
  tabs, 
  activeTabId, 
  onSelectTab, 
  onCloseTab, 
  onContextMenuRequest,
  isLoading,
  onReorderTabs,
  onRunCVGeneratorFromTab,
  className
}) => {
  const [draggedTabId, setDraggedTabId] = useState<string | null>(null);
  const [dragOverTabId, setDragOverTabId] = useState<string | null>(null); 
  const [isDragOverEndZone, setIsDragOverEndZone] = useState<boolean>(false);

  if (tabs.length === 0 && !isLoading) {
    return <div className={`h-[42px] bg-[var(--editor-tab-background)] border-b border-[var(--editor-tab-border)] relative ${className || ''}`}></div>; 
  }
  const CloseIcon = ICONS.x_icon;
  const PlayIcon = ICONS.PlayIcon;


  const handleDragStart = (e: React.DragEvent<HTMLButtonElement>, tabId: string) => {
    setDraggedTabId(tabId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', tabId);
    playSound('ui-click'); 
  };

  const handleDragOver = (e: React.DragEvent<HTMLElement>, targetTabId: string | null) => {
    e.preventDefault();
    if (draggedTabId) {
      if (targetTabId && targetTabId !== draggedTabId) {
        setDragOverTabId(targetTabId);
        setIsDragOverEndZone(false);
      } else if (targetTabId === null) { 
        setDragOverTabId(null);
        setIsDragOverEndZone(true);
      }
    }
  };
  
  const handleDragEnter = (e: React.DragEvent<HTMLElement>, targetTabId: string | null) => {
    e.preventDefault();
    if (draggedTabId) {
      if (targetTabId && targetTabId !== draggedTabId) {
        setDragOverTabId(targetTabId);
        setIsDragOverEndZone(false);
      } else if (targetTabId === null) {
        setDragOverTabId(null);
        setIsDragOverEndZone(true);
      }
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget as Node) && !e.currentTarget.parentElement?.contains(e.relatedTarget as Node)) {
        setDragOverTabId(null);
        setIsDragOverEndZone(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLElement>, targetTabId: string | null) => {
    e.preventDefault();
    if (draggedTabId) {
      if (targetTabId === null) { 
        onReorderTabs(draggedTabId, null);
      } else if (targetTabId !== draggedTabId) {
        onReorderTabs(draggedTabId, targetTabId);
      }
    }
    resetDragState();
  };

  const handleDragEnd = () => {
    resetDragState();
  };

  const resetDragState = () => {
    setDraggedTabId(null);
    setDragOverTabId(null);
    setIsDragOverEndZone(false);
  };


  return (
    <div 
      className={`relative flex bg-[var(--editor-tab-background)] border-b border-[var(--editor-tab-border)] overflow-x-auto ${className || ''}`}
      role="tablist"
      aria-label="Editor open files"
      onDragLeave={handleDragLeave} 
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        const isBeingDragged = tab.id === draggedTabId;
        const isDropTarget = tab.id === dragOverTabId;

        let iconKey = tab.id; 
        if (tab.type === 'project_detail') iconKey = 'project_detail';
        else if (tab.type === 'ai_chat') iconKey = 'ai_chat_icon'; 
        else if (tab.type === 'article_detail') iconKey = 'article_detail';
        else if (tab.type === 'cv_preview') iconKey = 'cv_preview_icon'; 
        else if (tab.fileName === 'generate_cv.ts') iconKey = 'generate_cv_icon';
        else if (tab.type === 'json_preview' && tab.fileName) iconKey = ICONS[tab.fileName] ? tab.fileName : 'default'; 
        
        const IconComponent = ICONS[iconKey] || ICONS.default;
        
        const iconColorClass = isActive ? 'text-[var(--editor-tab-icon-active-foreground)]' : 'text-[var(--editor-tab-icon-foreground)] group-hover:text-[var(--editor-tab-active-foreground)]';
        const textColorClass = isActive ? 'text-[var(--editor-tab-active-foreground)]' : 'text-[var(--editor-tab-inactive-foreground)] group-hover:text-[var(--editor-tab-active-foreground)]';
        const tabBackgroundClass = isActive ? 'bg-[var(--editor-tab-active-background)]' : 'bg-[var(--editor-tab-inactive-background)] hover:bg-[var(--editor-tab-hover-background)]';
        const activeBorderClass = isActive ? 'border-t-2 border-[var(--editor-tab-active-border-top)]' : 'border-t-2 border-transparent';
        
        let dynamicClasses = `${tabBackgroundClass} ${activeBorderClass}`;
        if (isBeingDragged) dynamicClasses += ' opacity-50 ring-2 ring-[var(--focus-border)] ring-inset';
        if (isDropTarget) dynamicClasses += ' border-l-2 border-[var(--focus-border)]';


        return (
          <button
            key={tab.id}
            draggable="true"
            onDragStart={(e) => handleDragStart(e, tab.id)}
            onDragOver={(e) => handleDragOver(e, tab.id)}
            onDragEnter={(e) => handleDragEnter(e, tab.id)}
            onDrop={(e) => handleDrop(e, tab.id)}
            onDragEnd={handleDragEnd}
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelectTab(tab.id)}
            onContextMenu={(e) => { 
              e.preventDefault();
              onContextMenuRequest(e.pageX, e.pageY, tab.id, tab.fileName === 'generate_cv.ts');
            }}
            className={`flex items-center py-2 px-3 md:px-4 cursor-pointer border-r border-[var(--editor-tab-border)] whitespace-nowrap group transition-all duration-150 ease-in-out relative focus:outline-none focus:ring-1 focus:ring-inset focus:ring-[var(--focus-border)]
              ${dynamicClasses}`}
            style={{paddingTop: isActive ? 'calc(0.5rem - 2px)' : '0.5rem'}} 
            title={tab.title}
          >
            <IconComponent size={16} className={`mr-2 flex-shrink-0 ${iconColorClass} pointer-events-none`} />
            <span className={`text-sm truncate max-w-[80px] md:max-w-[120px] ${textColorClass} pointer-events-none`}>{tab.title}</span>
            
            {tab.fileName === 'generate_cv.ts' && PlayIcon && onRunCVGeneratorFromTab && (
              <button
                onClick={(e) => { e.stopPropagation(); onRunCVGeneratorFromTab(); }}
                className={`ml-1 p-0.5 rounded hover:bg-[var(--titlebar-button-hover-background)] focus:outline-none transition-colors duration-150 ease-in-out ${isActive ? 'text-[var(--editor-tab-active-foreground)] hover:opacity-80' : 'text-[var(--editor-tab-inactive-foreground)] group-hover:text-[var(--editor-tab-active-foreground)]'}`}
                title="Run CV Generator Script"
                aria-label="Run CV Generator Script"
              >
                <PlayIcon size={14} />
              </button>
            )}

            {CloseIcon && (
              <button
                onClick={(e) => { e.stopPropagation(); onCloseTab(tab.id); }}
                className={`ml-1 p-0.5 rounded hover:bg-[var(--titlebar-button-hover-background)] focus:outline-none transition-colors duration-150 ease-in-out ${isActive ? 'text-[var(--editor-tab-active-foreground)] hover:opacity-80' : 'text-[var(--editor-tab-inactive-foreground)] group-hover:text-[var(--editor-tab-active-foreground)]'}`}
                title={`Close ${tab.title}`}
                aria-label={`Close ${tab.title} tab`}
              >
                <CloseIcon size={14} />
              </button>
            )}
          </button>
        );
      })}
      <div 
        className={`flex-grow bg-[var(--editor-tab-background)] h-full border-t-2 min-h-[38px] 
                    ${isDragOverEndZone ? 'bg-[var(--editor-tab-hover-background)] border-[var(--focus-border)] border-dashed' : 'border-transparent'}`}
        onDragOver={(e) => handleDragOver(e, null)}
        onDragEnter={(e) => handleDragEnter(e, null)}
        onDrop={(e) => handleDrop(e, null)}
      ></div>
      
      {isLoading && ( // Use combined isLoading prop
        <div className="linear-progress-bar" aria-label="Loading content">
          <div className="linear-progress-bar-indicator"></div>
        </div>
      )}
    </div>
  );
};

export default EditorTabs;