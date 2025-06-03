
import React from 'react';
import { ICONS } from '../constants';
import { BottomPanelTabId } from '../App'; // Assuming BottomPanelTabId is exported from App.tsx

interface BottomPanelTabConfig {
  id: BottomPanelTabId;
  title: string;
  icon: React.ElementType;
}

interface BottomPanelTabsProps {
  tabs: BottomPanelTabConfig[];
  activeTabId: BottomPanelTabId;
  onSelectTab: (tabId: BottomPanelTabId) => void;
}

const BottomPanelTabs: React.FC<BottomPanelTabsProps> = ({ tabs, activeTabId, onSelectTab }) => {
  if (!tabs || tabs.length === 0) {
    return <div className="h-[38px] bg-[var(--bottom-panel-tab-background)] border-t border-[var(--bottom-panel-tab-border)]"></div>;
  }

  return (
    <div className="flex bg-[var(--bottom-panel-tab-background)] border-t border-[var(--bottom-panel-tab-border)] overflow-x-auto flex-shrink-0">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        const IconComponent = tab.icon || ICONS.default;
        
        const iconColorClass = isActive 
          ? 'text-[var(--bottom-panel-tab-icon-active-foreground)]'
          : 'text-[var(--bottom-panel-tab-icon-foreground)] group-hover:text-[var(--bottom-panel-tab-active-foreground)]';

        const textColorClass = isActive 
          ? 'text-[var(--bottom-panel-tab-active-foreground)]'
          : 'text-[var(--bottom-panel-tab-inactive-foreground)] group-hover:text-[var(--bottom-panel-tab-active-foreground)]';
        
        const tabBackgroundClass = isActive
          ? 'bg-[var(--bottom-panel-tab-active-background)]'
          : 'bg-[var(--bottom-panel-tab-inactive-background)] hover:bg-[var(--bottom-panel-tab-hover-background)]';
        
        // VSCode typically uses a top border for bottom panel tabs, or a border that makes it look like it's "on top"
        const activeBorderClass = isActive ? 'border-b-2 border-[var(--bottom-panel-tab-active-border-bottom)]' : 'border-b-2 border-transparent';

        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`flex items-center py-2 px-3 md:px-4 cursor-pointer border-r border-[var(--bottom-panel-tab-border)] whitespace-nowrap group transition-colors duration-150 ease-in-out relative
              ${tabBackgroundClass} ${activeBorderClass}`}
            style={{paddingBottom: isActive ? 'calc(0.5rem - 2px)' : '0.5rem'}} 
            title={tab.title}
            role="tab"
            aria-selected={isActive}
          >
            <IconComponent size={14} className={`mr-2 flex-shrink-0 ${iconColorClass}`} />
            <span className={`text-xs uppercase tracking-wider ${textColorClass}`}>{tab.title}</span>
            {/* No close button for panel tabs like Terminal/Pets by default */}
          </button>
        );
      })}
      {/* Flex grow to push tabs to the left and fill space like VSCode editor tabs */}
      <div className="flex-grow bg-[var(--bottom-panel-tab-background)] border-b-2 border-transparent min-h-[34px]"></div>
    </div>
  );
};

export default BottomPanelTabs;
