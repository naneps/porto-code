import React from 'react';
import { ICONS } from '../../App/constants';
import { BottomPanelTabId, FeaturesStatusState, FeatureId } from '../../App/types'; 

interface BottomPanelTabConfig {
  id: BottomPanelTabId;
  title: string;
  icon: React.ElementType;
  featureId?: FeatureId; // Added to link tab to a feature
}

interface BottomPanelTabsProps {
  tabs: BottomPanelTabConfig[];
  activeTabId: BottomPanelTabId;
  onSelectTab: (tabId: BottomPanelTabId) => void;
  featuresStatus: FeaturesStatusState; // Added featuresStatus
}

const BottomPanelTabs: React.FC<BottomPanelTabsProps> = ({ tabs, activeTabId, onSelectTab, featuresStatus }) => {
  if (!tabs || tabs.length === 0) {
    return <div className="h-[38px] bg-[var(--bottom-panel-tab-background)] border-t border-[var(--bottom-panel-tab-border)]"></div>;
  }

  return (
    <div className="flex bg-[var(--bottom-panel-tab-background)] border-t border-[var(--bottom-panel-tab-border)] overflow-x-auto flex-shrink-0">
      {tabs.map((tab) => {
        const featureIsActive = tab.featureId ? featuresStatus[tab.featureId] === 'active' : true;
        const isActive = tab.id === activeTabId && featureIsActive;
        const IconComponent = tab.icon || ICONS.default;
        
        let iconColorClass = isActive 
          ? 'text-[var(--bottom-panel-tab-icon-active-foreground)]'
          : 'text-[var(--bottom-panel-tab-icon-foreground)] group-hover/tab:text-[var(--bottom-panel-tab-active-foreground)]';

        let textColorClass = isActive 
          ? 'text-[var(--bottom-panel-tab-active-foreground)]'
          : 'text-[var(--bottom-panel-tab-inactive-foreground)] group-hover/tab:text-[var(--bottom-panel-tab-active-foreground)]';
        
        let tabBackgroundClass = isActive
          ? 'bg-[var(--bottom-panel-tab-active-background)]'
          : 'bg-[var(--bottom-panel-tab-inactive-background)] hover:bg-[var(--bottom-panel-tab-hover-background)]';
        
        let activeBorderClass = isActive ? 'border-b-2 border-[var(--bottom-panel-tab-active-border-bottom)]' : 'border-b-2 border-transparent';
        let cursorClass = 'cursor-pointer';

        if (!featureIsActive) {
          iconColorClass = 'text-[var(--text-muted)] opacity-60';
          textColorClass = 'text-[var(--text-muted)] opacity-60';
          tabBackgroundClass = 'bg-[var(--bottom-panel-tab-inactive-background)] opacity-60';
          activeBorderClass = 'border-b-2 border-transparent';
          cursorClass = 'cursor-not-allowed';
        }

        return (
          <button
            key={tab.id}
            onClick={() => featureIsActive && onSelectTab(tab.id)}
            disabled={!featureIsActive}
            className={`flex items-center py-2 px-3 md:px-4 border-r border-[var(--bottom-panel-tab-border)] whitespace-nowrap group transition-colors duration-150 ease-in-out relative
              ${tabBackgroundClass} ${activeBorderClass} ${cursorClass}`}
            style={{paddingBottom: isActive ? 'calc(0.5rem - 2px)' : '0.5rem'}} 
            title={featureIsActive ? tab.title : `${tab.title} (Under Maintenance)`}
            role="tab"
            aria-selected={isActive}
            aria-disabled={!featureIsActive}
          >
            <IconComponent size={14} className={`mr-2 flex-shrink-0 ${iconColorClass}`} />
            <span className={`text-xs uppercase tracking-wider ${textColorClass}`}>{tab.title}</span>
            {!featureIsActive && ICONS.HardHatIcon && (
                <ICONS.HardHatIcon size={10} className="ml-1.5 text-[var(--text-muted)] opacity-80" />
            )}
          </button>
        );
      })}
      <div className="flex-grow bg-[var(--bottom-panel-tab-background)] border-b-2 border-transparent min-h-[34px]"></div>
    </div>
  );
};

export default BottomPanelTabs;
