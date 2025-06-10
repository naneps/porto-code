
import React, { useState } from 'react';
import { ICONS } from '../../App/constants';
import { ActivityBarSelection, ActivityBarItemConfig } from '../../App/types'; 
import { playSound } from '../../Utils/audioUtils';

interface ActivityBarProps {
  items: ActivityBarItemConfig[];
  onReorder: (draggedItemId: string, targetItemId: string) => void;
  activeViewId?: ActivityBarSelection;
  onOpenSettingsEditor: () => void; 
  className?: string; 
}

const ActivityBar: React.FC<ActivityBarProps> = ({ 
  items,
  onReorder,
  activeViewId,
  onOpenSettingsEditor, 
  className
}) => {
  const SettingsIcon = ICONS.settings_icon;
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [dragOverItemId, setDragOverItemId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLButtonElement>, itemId: string) => {
    setDraggedItemId(itemId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', itemId);
  };

  const handleDragOver = (e: React.DragEvent<HTMLButtonElement>, targetItemId: string) => {
    e.preventDefault();
    if (draggedItemId && targetItemId !== draggedItemId) {
      setDragOverItemId(targetItemId);
    }
  };
  
  const handleDragEnter = (e: React.DragEvent<HTMLButtonElement>, targetItemId: string) => {
    e.preventDefault();
    if (draggedItemId && targetItemId !== draggedItemId) {
      setDragOverItemId(targetItemId);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverItemId(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLButtonElement>, targetItemId: string) => {
    e.preventDefault();
    if (draggedItemId && targetItemId !== draggedItemId) {
      onReorder(draggedItemId, targetItemId);
    }
    setDraggedItemId(null);
    setDragOverItemId(null);
  };

  const handleDragEnd = () => {
    setDraggedItemId(null);
    setDragOverItemId(null);
  };
  
  const handleActionClick = (action: () => void) => {
    playSound('ui-click');
    action();
  };

  const handleSettingsIconClick = () => {
    playSound('ui-click');
    onOpenSettingsEditor(); 
  };

  return (
    <div className={`w-12 bg-[var(--activitybar-background)] h-full flex flex-col justify-between items-center py-3 shadow-md flex-shrink-0 ${className || ''}`}>
      <div className="flex flex-col space-y-1 w-full items-center">
        {items.map((item) => {
          const isActive = activeViewId === item.viewId;
          const isBeingDragged = draggedItemId === item.id;
          const isDragOverTarget = dragOverItemId === item.id && !isBeingDragged;

          let buttonClasses = `p-2.5 rounded text-[var(--activitybar-inactive-foreground)] focus:outline-none transition-colors duration-150 ease-in-out relative w-10 h-10 flex items-center justify-center ${
            isActive
              ? 'text-[var(--activitybar-foreground)] bg-[var(--activitybar-active-background)]'
              : 'hover:text-[var(--activitybar-foreground)] hover:bg-[var(--activitybar-hover-background)] focus:bg-[var(--activitybar-hover-background)]'
          }`;
          if (isBeingDragged) buttonClasses += ' opacity-50 border-2 border-dashed border-[var(--focus-border)]';
          if (isDragOverTarget) buttonClasses += ' border-t-2 border-[var(--focus-border)]';


          return (
            <button
              key={item.id}
              draggable="true"
              onDragStart={(e) => handleDragStart(e, item.id)}
              onDragOver={(e) => handleDragOver(e, item.id)}
              onDragEnter={(e) => handleDragEnter(e, item.id)}
              onDragLeave={(e) => handleDragLeave(e)}
              onDrop={(e) => handleDrop(e, item.id)}
              onDragEnd={handleDragEnd}
              onClick={() => handleActionClick(item.action)}
              className={buttonClasses}
              title={item.label}
              aria-label={item.label}
              aria-pressed={isActive}
              aria-current={isActive ? "page" : undefined}
            >
              {isActive && !isDragOverTarget && ( 
                <span 
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 w-0.5 h-6 bg-[var(--activitybar-active-border)] rounded-r-sm"
                  aria-hidden="true"
                ></span>
              )}
              <item.icon size={22} />
            </button>
          );
        })}
      </div>
      
      <div className="flex flex-col space-y-1">
        {SettingsIcon && (
          <button
            onClick={handleSettingsIconClick} 
            className="p-2.5 rounded text-[var(--activitybar-inactive-foreground)] hover:text-[var(--activitybar-foreground)] hover:bg-[var(--activitybar-hover-background)] focus:bg-[var(--activitybar-hover-background)] focus:outline-none transition-colors duration-150 ease-in-out w-10 h-10 flex items-center justify-center"
            title="Manage Settings" 
            aria-label="Manage settings"
          >
            <SettingsIcon size={22} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ActivityBar;