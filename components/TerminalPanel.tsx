
import React, { useEffect, useRef } from 'react';
import { ICONS } from '../constants';

interface TerminalPanelProps {
  // isVisible prop is removed, App.tsx controls rendering
  output: string[];
  isRunning: boolean; 
  onClose: () => void; // This will now hide the entire bottom panel area
}

const TerminalPanel: React.FC<TerminalPanelProps> = ({ output, isRunning, onClose }) => {
  const outputEndRef = useRef<HTMLDivElement>(null);
  const CloseIcon = ICONS.x_icon;
  const TerminalIcon = ICONS.TerminalIcon;

  useEffect(() => {
    outputEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [output]);

  // The component is only rendered when its tab is active and bottom panel is visible
  return (
    <div 
      className="h-full flex flex-col bg-[var(--terminal-background)] text-[var(--terminal-foreground)] border-t border-[var(--terminal-border)] shadow-md"
      role="log"
      aria-live="polite"
    >
      <div className="flex items-center justify-between px-2 py-1 bg-[var(--terminal-toolbar-background)] border-b border-[var(--terminal-border)] text-xs flex-shrink-0">
        <div className="flex items-center">
          {TerminalIcon && <TerminalIcon size={14} className="mr-2 text-[var(--text-accent)]" />}
          <span>TERMINAL</span>
        </div>
        {CloseIcon && (
          <button 
            onClick={onClose} // This now triggers hiding the whole bottom panel via App.tsx
            className="p-1 rounded hover:bg-[var(--terminal-close-button-hover-background)] focus:outline-none"
            title="Close Panel"
            aria-label="Close Panel"
          >
            <CloseIcon size={16} />
          </button>
        )}
      </div>
      <div className="flex-1 p-2 overflow-y-auto font-mono text-xs leading-normal">
        {output.map((line, index) => (
          <div key={index} className="whitespace-pre-wrap break-all">
            {line}
            {index === output.length - 1 && isRunning && (
              <span className="inline-block w-2 h-3 bg-[var(--terminal-cursor-color)] animate-pulse ml-1"></span>
            )}
          </div>
        ))}
        <div ref={outputEndRef} />
      </div>
    </div>
  );
};

export default TerminalPanel;
