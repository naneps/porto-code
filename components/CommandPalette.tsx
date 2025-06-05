
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Command } from '../types';
import { ICONS } from '../constants';


interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  commands: Command[];
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, commands }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  
  const SearchIcon = ICONS.search_icon;
  const CloseIcon = ICONS.x_icon;
  const CheckIcon = ICONS.check_icon;

  const [isActuallyOpen, setIsActuallyOpen] = useState(false);
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    if (isOpen) {
      setIsActuallyOpen(true);
      const timer = setTimeout(() => {
        setAnimationClass('modal-open');
        inputRef.current?.focus();
        setSearchTerm(''); 
        setSelectedIndex(0); 
      }, 10); 
      return () => clearTimeout(timer);
    } else {
      setAnimationClass(''); 
      const timer = setTimeout(() => {
        setIsActuallyOpen(false);
      }, 300); // Matches CSS transition duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const filteredCommands = useMemo(() => {
    if (!searchTerm) return commands;
    return commands.filter(command =>
      command.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      command.group?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      command.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [commands, searchTerm]);

  useEffect(() => {
    setSelectedIndex(0); 
  }, [filteredCommands]);
  
  useEffect(() => {
    if (isActuallyOpen && listRef.current && listRef.current.children[selectedIndex]) {
      listRef.current.children[selectedIndex].scrollIntoView({
        behavior: 'smooth', 
        block: 'nearest',
      });
    }
  }, [selectedIndex, isActuallyOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (filteredCommands.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + (filteredCommands.length || 1)) % (filteredCommands.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
      }
    }
  };

  if (!isActuallyOpen) return null;

  return (
    <div className={`modal-backdrop ${animationClass}`} onClick={onClose}>
      <div 
        className={`command-palette-content modal-content-base ${animationClass}`}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center p-3 border-b border-[var(--modal-border)]">
          {SearchIcon && <SearchIcon size={18} className="text-[var(--text-muted)] mr-3" />}
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Type a command or search..."
            className="w-full bg-transparent text-[var(--modal-foreground)] placeholder-[var(--modal-input-placeholder)] focus:outline-none text-sm"
          />
          {CloseIcon && (
            <button onClick={onClose} className="ml-2 text-[var(--text-muted)] hover:text-[var(--modal-foreground)] p-1 rounded hover:bg-[var(--titlebar-button-hover-background)]">
              <CloseIcon size={18} />
            </button>
          )}
        </div>
        <ul ref={listRef} className="max-h-[60vh] overflow-y-auto py-1">
          {filteredCommands.length > 0 ? (
            filteredCommands.map((command, index) => (
              <li key={command.id}>
                <button
                  onClick={() => command.action()}
                  className={`w-full text-left px-3 py-2.5 text-sm flex items-center group transition-colors duration-100 ease-in-out ${
                    index === selectedIndex ? 'bg-[var(--modal-selected-item-background)] text-[var(--modal-selected-item-foreground)]' : 'hover:bg-[var(--sidebar-item-hover-background)]'
                  }`}
                >
                  {command.icon && (
                    <command.icon size={16} className={`mr-3 flex-shrink-0 ${
                      index === selectedIndex ? 'text-[var(--modal-selected-item-foreground)]' : 'text-[var(--text-muted)] group-hover:text-[var(--modal-foreground)]'
                    }`} />
                  )}
                  <div className="flex-grow overflow-hidden">
                    <span className="truncate">{command.label}</span>
                    {command.description && (
                      <span className={`block text-xs truncate ${
                        index === selectedIndex ? 'text-[var(--modal-selected-item-foreground)] opacity-75' : 'text-[var(--text-muted)] group-hover:opacity-90'
                      }`}>
                        {command.description}
                      </span>
                    )}
                  </div>
                  {command.isSelected && CheckIcon && (
                    <CheckIcon size={16} className={`ml-auto flex-shrink-0 ${
                      index === selectedIndex ? 'text-[var(--modal-selected-item-foreground)]' : 'text-[var(--text-accent)]'
                    }`} />
                  )}
                </button>
              </li>
            ))
          ) : (
            <li className="px-3 py-4 text-center text-[var(--text-muted)] text-sm">
              No commands found.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default CommandPalette;