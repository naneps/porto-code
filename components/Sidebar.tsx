
import React, { useState } from 'react';
import { SidebarItemConfig } from '../types';
import { ICONS } from '../constants';


interface SidebarProps {
  items: SidebarItemConfig[]; // Renamed from orderedItems to items for clarity inside component
  onOpenTab: (item: SidebarItemConfig) => void;
  isVisible: boolean;
  activeTabId: string | null;
  onReorderItems: (draggedItemId: string, targetItemId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ items, onOpenTab, isVisible, activeTabId, onReorderItems }) => {
  const [isExplorerSectionOpen, setIsExplorerSectionOpen] = React.useState(true);
  const ChevronIcon = isExplorerSectionOpen ? ICONS.chevron_down_icon : ICONS.chevron_right_icon;

  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [dragOverItemId, setDragOverItemId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLLIElement>, itemId: string) => {
    setDraggedItemId(itemId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', itemId); // Necessary for Firefox
     // Optional: add a class to the dragged item for visual feedback
    e.currentTarget.classList.add('opacity-50', 'border-dashed', 'border-[var(--focus-border)]');
  };

  const handleDragOver = (e: React.DragEvent<HTMLLIElement>, targetItemId: string) => {
    e.preventDefault(); // Allow drop
    if (draggedItemId && targetItemId !== draggedItemId) {
        setDragOverItemId(targetItemId);
    }
  };
  
  const handleDragEnter = (e: React.DragEvent<HTMLLIElement>, targetItemId: string) => {
    e.preventDefault();
    if (draggedItemId && targetItemId !== draggedItemId) {
      setDragOverItemId(targetItemId);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault();
    // Check if the mouse is leaving the actual list item and not just moving over its children
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
        setDragOverItemId(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLLIElement>, targetItemId: string) => {
    e.preventDefault();
    if (draggedItemId && targetItemId !== draggedItemId) {
      onReorderItems(draggedItemId, targetItemId);
    }
    setDraggedItemId(null);
    setDragOverItemId(null);
    e.currentTarget.classList.remove('opacity-50', 'border-dashed', 'border-[var(--focus-border)]');
    // Remove class from all potential items (might be better to target the original dragged item if stored)
    document.querySelectorAll('.sidebar-drag-item').forEach(el => el.classList.remove('opacity-50', 'border-dashed', 'border-[var(--focus-border)]'));

  };

  const handleDragEnd = (e: React.DragEvent<HTMLLIElement>) => {
    e.currentTarget.classList.remove('opacity-50', 'border-dashed', 'border-[var(--focus-border)]');
    setDraggedItemId(null);
    setDragOverItemId(null);
  };

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
                const isDragOverTarget = dragOverItemId === item.id && draggedItemId !== item.id;
                return (
                  <li 
                    key={item.id}
                    draggable="true"
                    onDragStart={(e) => handleDragStart(e, item.id)}
                    onDragOver={(e) => handleDragOver(e, item.id)}
                    onDragEnter={(e) => handleDragEnter(e, item.id)}
                    onDragLeave={(e) => handleDragLeave(e)}
                    onDrop={(e) => handleDrop(e, item.id)}
                    onDragEnd={handleDragEnd}
                    className={`
                      sidebar-drag-item cursor-grab rounded
                      ${isDragOverTarget ? 'border-t-2 border-[var(--focus-border)]' : 'border-t-2 border-transparent'}
                    `}
                  >
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
                        className={`mr-2 flex-shrink-0 pointer-events-none 
                          ${isActive ? 'text-[var(--sidebar-item-focus-foreground)]' : 'text-[var(--sidebar-foreground)]'}`
                        } 
                      />
                      <span className="truncate pointer-events-none">{item.fileName}</span>
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