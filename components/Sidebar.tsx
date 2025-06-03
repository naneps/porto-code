
import React from 'react';
import { SidebarItemConfig } from '../types';
import { ICONS } from '../constants';


interface SidebarProps {
  items: SidebarItemConfig[];
  onOpenTab: (item: SidebarItemConfig) => void;
  isVisible: boolean;
  activeTabId: string | null; // To know which item is currently active
}

const Sidebar: React.FC<SidebarProps> = ({ items, onOpenTab, isVisible, activeTabId }) => {
  const [isExplorerSectionOpen, setIsExplorerSectionOpen] = React.useState(true);
  const ChevronIcon = isExplorerSectionOpen ? ICONS.chevron_down_icon : ICONS.chevron_right_icon;

  return (
    <aside
      className={`
        ${isVisible ? 'w-48 md:w-64 p-1 md:p-2' : 'w-0 p-0'}
        bg-[var(--sidebar-background)] border-r border-[var(--sidebar-border)]
        text-[var(--sidebar-foreground)]
        flex-shrink-0 h-full overflow-hidden
        transition-all duration-300 ease-in-out
      `}
      aria-hidden={!isVisible}
    >
      <div
        className={`
          w-full h-full transition-opacity duration-200 ease-in-out 
          ${isVisible ? 'opacity-100 delay-150' : 'opacity-0 delay-0'}
        `}
      >
        <div className="text-xs text-[var(--sidebar-section-header-foreground)] uppercase tracking-wider mb-2 px-2 py-1 whitespace-nowrap">Explorer</div>
        
        <div className="mb-2">
          <button 
            onClick={() => setIsExplorerSectionOpen(!isExplorerSectionOpen)}
            className="flex items-center w-full text-left text-sm font-semibold text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-item-hover-background)] px-2 py-1 rounded transition-colors duration-150 ease-in-out"
            aria-expanded={isExplorerSectionOpen}
          >
            {ChevronIcon && <ChevronIcon size={16} className="mr-1 flex-shrink-0" />}
            <span className="whitespace-nowrap">PORTFOLIO</span>
          </button>
          {isExplorerSectionOpen && (
            <ul className="mt-1 ml-2">
              {items.map((item) => {
                const isActive = item.id === activeTabId;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => onOpenTab(item)}
                      className={`flex items-center w-full text-left py-1 px-2 rounded text-sm focus:outline-none transition-colors duration-150 ease-in-out
                        ${isActive
                          ? 'bg-[var(--sidebar-item-focus-background)] text-[var(--sidebar-item-focus-foreground)]'
                          : 'text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-item-hover-background)] focus:bg-[var(--sidebar-item-focus-background)] focus:text-[var(--sidebar-item-focus-foreground)]'
                        }
                      `}
                      title={`Open ${item.fileName}`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <item.icon 
                        size={16} 
                        className={`mr-2 flex-shrink-0 
                          ${isActive ? 'text-[var(--sidebar-item-focus-foreground)]' : 'text-[var(--sidebar-foreground)]'}`
                        } 
                      />
                      <span className="truncate">{item.fileName}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
