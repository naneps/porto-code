
import React from 'react';
import { ContextMenuProps, ContextMenuItem } from '../types'; // Use updated types

const ContextMenuComponent: React.FC<ContextMenuProps> = ({ x, y, items, visible, onClose }) => {
  if (!visible) return null;

  return (
    <div
      style={{ top: y, left: x }}
      className="fixed bg-[var(--menu-dropdown-background)] border border-[var(--menu-dropdown-border)] 
                 rounded-md shadow-lg py-1 z-[100] min-w-[180px] text-[var(--menu-item-foreground)]"
      onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing it via App's global handler
    >
      {items.map((item, index) => (
        <button
          key={index}
          onClick={() => {
            item.action();
            onClose(); // Close menu after action
          }}
          disabled={item.disabled}
          className={`w-full text-left px-3 py-1.5 text-xs flex items-center transition-colors
                      hover:bg-[var(--menu-item-hover-background)] hover:text-[var(--menu-item-hover-foreground)]
                      disabled:opacity-50 disabled:cursor-not-allowed
                      focus:outline-none focus:bg-[var(--menu-item-hover-background)] focus:text-[var(--menu-item-hover-foreground)]`}
        >
          {item.icon && <item.icon size={14} className="mr-2 text-[var(--menu-item-icon-foreground)]" />}
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default ContextMenuComponent;
