
import React, { useState, useEffect, useRef } from 'react';
import { ICONS } from '../../App/constants';

interface PetsPanelProps {
  onClose: () => void; 
}

const PetsPanel: React.FC<PetsPanelProps> = ({ onClose }) => {
  const CloseIcon = ICONS.x_icon;
  const PetIcon = ICONS.CatIcon || ICONS.default; 
  const panelRef = useRef<HTMLDivElement>(null);

  const [petPosition, setPetPosition] = useState(50); 
  const [petDirection, setPetDirection] = useState<'left' | 'right'>('right');
  const animationIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    animationIntervalRef.current = window.setInterval(() => {
      setPetPosition(prevPosition => {
        let newPosition = prevPosition;
        const step = 0.5; 
        const petWidthPercent = 5;

        if (petDirection === 'right') {
          newPosition += step;
          if (newPosition >= 100 - petWidthPercent) {
            newPosition = 100 - petWidthPercent;
            setPetDirection('left');
          }
        } else { 
          newPosition -= step;
          if (newPosition <= 0) {
            newPosition = 0;
            setPetDirection('right');
          }
        }
        return newPosition;
      });
    }, 70);

    return () => { 
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
      }
    };
  }, [petDirection]); 


  return (
    <div
      ref={panelRef}
      className="h-full flex flex-col bg-[var(--terminal-background)] text-[var(--terminal-foreground)] border-t border-[var(--terminal-border)] shadow-md relative overflow-hidden"
      role="complementary"
      aria-label="Pets Panel"
    >
      <div className="flex items-center justify-between px-2 py-1 bg-[var(--terminal-toolbar-background)] border-b border-[var(--terminal-border)] text-xs flex-shrink-0">
        <div className="flex items-center">
          {PetIcon && <PetIcon size={14} className="mr-2 text-[var(--text-accent)]" />}
          <span>PETS</span>
        </div>
        {CloseIcon && (
          <button
            onClick={onClose} 
            className="p-1 rounded hover:bg-[var(--terminal-close-button-hover-background)] focus:outline-none"
            title="Close Panel"
            aria-label="Close Panel"
          >
            <CloseIcon size={16} />
          </button>
        )}
      </div>
      <div className="flex-1 p-1 relative">
        <div
          style={{
            position: 'absolute',
            left: `${petPosition}%`,
            bottom: '5px', 
            transition: 'left 0.07s linear', 
          }}
          title="Meow!"
        >
          {PetIcon && <PetIcon size={28} className="text-[var(--text-accent)]" />}
        </div>
      </div>
    </div>
  );
};

export default PetsPanel;
