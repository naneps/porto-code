

import React, { useState, useCallback } from 'react';
import { SidebarItemConfig } from '../../App/types';
import { ICONS } from '../../App/constants';
import { playSound } from '../../Utils/audioUtils';


interface SidebarProps {
  items: SidebarItemConfig[];
  onOpenTab: (item: SidebarItemConfig) => void;
  onRunAction: (actionType: SidebarItemConfig['actionType'], item: SidebarItemConfig) => void;
  isVisible: boolean;
  activeTabId: string | null;
  onReorderItems: (draggedItemId: string, targetItemId: string, parentId?: string) => void; 
  onContextMenuRequest: (event: React.MouseEvent, item: SidebarItemConfig) => void; 
}

export const Sidebar: React.FC<SidebarProps> = ({ items, onOpenTab, onRunAction, isVisible, activeTabId, onReorderItems, onContextMenuRequest }) => {
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>(() => {
    const initialOpenState: Record<string, boolean> = {};
    const setInitialOpen = (currentItems: SidebarItemConfig[], parentId?: string) => {
      currentItems.forEach(item => {
        if (item.isFolder) {
          initialOpenState[item.id] = !!item.defaultOpen;
          if (item.children) {
            setInitialOpen(item.children, item.id);
          }
        }
      });
    };
    setInitialOpen(items);
    return initialOpenState;
  });

  const [draggedItemInfo, setDraggedItemInfo] = useState<{ id: string; parentId?: string } | null>(null);
  const [dragOverItemInfo, setDragOverItemInfo] = useState<{ id: string; parentId?: string } | null>(null);


  const toggleFolder = useCallback((folderId: string) => {
    playSound('ui-click');
    setOpenFolders(prev => ({ ...prev, [folderId]: !prev[folderId] }));
  }, []);

  const handleItemClick = (item: SidebarItemConfig) => {
    if (item.isFolder) {
      toggleFolder(item.id);
    } else if (item.actionType === 'run_cv_generator') { 
      onRunAction(item.actionType, item);
    } else if (item.actionType === 'open_tab' || !item.actionType) { 
      onOpenTab(item);
    }
  };

  const handleItemContextMenu = (event: React.MouseEvent, item: SidebarItemConfig) => {
    if (!item.isFolder) { 
      event.preventDefault();
      onContextMenuRequest(event, item);
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLLIElement>, item: SidebarItemConfig, parentId?: string) => {
    setDraggedItemInfo({ id: item.id, parentId });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', item.id);
    e.currentTarget.classList.add('opacity-50');
  };

  const handleDragOver = (e: React.DragEvent<HTMLLIElement>, item: SidebarItemConfig, parentId?: string) => {
    e.preventDefault();
    if (draggedItemInfo && item.id !== draggedItemInfo.id) {
      setDragOverItemInfo({ id: item.id, parentId });
    }
  };
  
  const handleDragEnter = (e: React.DragEvent<HTMLLIElement>, item: SidebarItemConfig, parentId?: string) => {
    e.preventDefault();
    if (draggedItemInfo && item.id !== draggedItemInfo.id) {
      setDragOverItemInfo({ id: item.id, parentId });
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverItemInfo(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLLIElement>, targetItem: SidebarItemConfig, parentId?: string) => {
    e.preventDefault();
    if (draggedItemInfo && targetItem.id !== draggedItemInfo.id) {
      if (draggedItemInfo.parentId === parentId) { 
        onReorderItems(draggedItemInfo.id, targetItem.id, parentId);
      } else if (!targetItem.isFolder && !draggedItemInfo.parentId && !parentId){ 
         onReorderItems(draggedItemInfo.id, targetItem.id, undefined);
      }
    }
    setDraggedItemInfo(null);
    setDragOverItemInfo(null);
    e.currentTarget.classList.remove('opacity-50');
    document.querySelectorAll('.sidebar-drag-item').forEach(el => el.classList.remove('opacity-50'));
  };

  const handleDragEnd = (e: React.DragEvent<HTMLLIElement>) => {
    e.currentTarget.classList.remove('opacity-50');
    setDraggedItemInfo(null);
    setDragOverItemInfo(null);
  };

  const renderItems = (currentItems: SidebarItemConfig[], level: number = 0, parentId?: string): JSX.Element[] => {
    return currentItems.map((item) => {
      const isOpen = item.isFolder ? openFolders[item.id] : false;
      const IconComponent = item.isFolder 
        ? (isOpen ? ICONS.folder_open_icon : ICONS.folder_closed_icon) 
        : item.icon;
      const ChevronIcon = item.isFolder 
        ? (isOpen ? ICONS.chevron_down_icon : ICONS.chevron_right_icon) 
        : null;
      
      const isActive = !item.isFolder && item.id === activeTabId;
      const isDragOverTarget = dragOverItemInfo?.id === item.id && draggedItemInfo?.id !== item.id;

      // For top-level folders, make the clickable area larger and include the label styling
      const isTopLevelFolder = item.isFolder && level === 0;

      return (
        <React.Fragment key={item.id}>
          <li
            draggable={!item.isFolder} 
            onDragStart={!item.isFolder ? (e) => handleDragStart(e, item, parentId) : undefined}
            onDragOver={!item.isFolder ? (e) => handleDragOver(e, item, parentId) : undefined}
            onDragEnter={!item.isFolder ? (e) => handleDragEnter(e, item, parentId) : undefined}
            onDragLeave={!item.isFolder ? (e) => handleDragLeave(e) : undefined}
            onDrop={!item.isFolder ? (e) => handleDrop(e, item, parentId) : undefined}
            onDragEnd={!item.isFolder ? handleDragEnd : undefined}
            onContextMenu={ (e) => handleItemContextMenu(e, item)}
            className={`
              ${!item.isFolder ? 'sidebar-drag-item cursor-grab' : ''}
              rounded
              ${isDragOverTarget ? 'border-t-2 border-[var(--focus-border)]' : 'border-t-2 border-transparent'}
              ${isTopLevelFolder ? 'mb-1' : ''} 
            `}
            style={{ marginLeft: isTopLevelFolder ? `0` : `${level * 1}rem` }}
          >
            <button
              onClick={() => handleItemClick(item)}
              className={`flex items-center w-full text-left py-1 px-2 rounded text-sm focus:outline-none transition-colors duration-150 ease-in-out
                ${isActive
                  ? 'bg-[var(--sidebar-item-focus-background)] text-[var(--sidebar-item-focus-foreground)]'
                  : `text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-item-hover-background)] focus:bg-[var(--sidebar-item-focus-background)] focus:text-[var(--sidebar-item-focus-foreground)] ${isTopLevelFolder ? 'font-semibold' : ''}`
                }
              `}
              title={item.title || item.label}
              aria-expanded={item.isFolder ? isOpen : undefined}
              aria-current={isActive ? 'page' : undefined}
            >
              {ChevronIcon && <ChevronIcon size={16} className="mr-1 flex-shrink-0" />}
              {IconComponent && <IconComponent size={16} className={`${ChevronIcon ? '' : (isTopLevelFolder && item.isFolder ? '' : 'ml-[16px]')} mr-2 flex-shrink-0`} />} 
              <span className={`truncate ${isTopLevelFolder ? 'max-w-full' : 'max-w-[100px] sm:max-w-[120px] lg:max-w-[150px]'}`}>{item.label}</span>
            </button>
          </li>
          {item.isFolder && isOpen && item.children && (
            <li>
              <ul className="mt-0.5"> 
                {renderItems(item.children, level + 1, item.id)}
              </ul>
            </li>
          )}
        </React.Fragment>
      );
    });
  };

  return (
    <aside
      className={`
        bg-[var(--sidebar-background)] 
        text-[var(--sidebar-foreground)]
        w-full h-full flex-shrink-0 overflow-hidden min-w-0
      `}
      style={{ padding: isVisible ? '0.25rem 0.5rem' : '0' }}
      aria-hidden={!isVisible}
    >
      <div
        className={`
          w-full h-full transition-opacity duration-200 ease-in-out overflow-y-auto
          ${isVisible ? 'opacity-100 delay-100' : 'opacity-0 delay-0'}
        `}
      >
        <div className="text-xs text-[var(--sidebar-section-header-foreground)] uppercase tracking-wider mb-2 px-2 py-1 whitespace-nowrap">Explorer</div>
        
        <ul className="mt-0.5">
          {renderItems(items, 0)}
        </ul>
      </div>
    </aside>
  );
};
