
import React, { useState, useEffect, useRef } from 'react';
import { ICONS, PET_DEFINITIONS, PET_THOUGHTS, ALL_FEATURE_IDS } from '../../App/constants';
import type { PetType, PetDefinition } from '../../App/constants';
import { playSound } from '../../Utils/audioUtils';
import { FeatureStatus } from '../../App/types'; // Added FeatureStatus
import MaintenanceView from '../../UI/MaintenanceView'; // Added MaintenanceView

interface PetsPanelProps {
  onClose: () => void; 
  featureStatus: FeatureStatus; // Added featureStatus
}

const PetsPanel: React.FC<PetsPanelProps> = ({ onClose, featureStatus }) => {
  const CloseIcon = ICONS.x_icon;
  const PawPrintIcon = ICONS.PawPrintIcon || ICONS.default; 
  const panelRef = useRef<HTMLDivElement>(null);

  const [currentPetType, setCurrentPetType] = useState<PetType>(() => {
    return (localStorage.getItem('portfolio-selectedPet') as PetType) || PET_DEFINITIONS[0].type;
  });
  const [currentPet, setCurrentPet] = useState<PetDefinition>(
    PET_DEFINITIONS.find(p => p.type === currentPetType) || PET_DEFINITIONS[0]
  );

  const [petPosition, setPetPosition] = useState({ x: 50, y: 0 }); // y for duck bobbing
  const [petDirection, setPetDirection] = useState<'left' | 'right'>('right');
  const [bobDirection, setBobDirection] = useState<'up' | 'down'>('up');
  const [slitherPhase, setSlitherPhase] = useState(0);

  const [currentThought, setCurrentThought] = useState<string | null>(null);
  const thoughtTimeoutRef = useRef<number | null>(null);
  const newThoughtIntervalRef = useRef<number | null>(null);
  
  const animationIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (featureStatus !== 'active') return;
    localStorage.setItem('portfolio-selectedPet', currentPetType);
    setCurrentPet(PET_DEFINITIONS.find(p => p.type === currentPetType) || PET_DEFINITIONS[0]);
    setPetPosition({ x: 50, y: 0 });
    setPetDirection('right');
    setBobDirection('up');
    setSlitherPhase(0);
  }, [currentPetType, featureStatus]);

  useEffect(() => {
    if (featureStatus !== 'active') {
      if (animationIntervalRef.current) clearInterval(animationIntervalRef.current);
      return;
    }
    if (animationIntervalRef.current) clearInterval(animationIntervalRef.current);

    animationIntervalRef.current = window.setInterval(() => {
      const panelWidth = panelRef.current?.clientWidth || 300;
      const petIconWidthApprox = 28; 
      const petWidthPercent = (petIconWidthApprox / panelWidth) * 100;

      if (currentPet.type === 'cat') {
        setPetPosition(prevPos => {
          let newX = prevPos.x;
          const step = 0.5;
          if (petDirection === 'right') {
            newX += step;
            if (newX >= 100 - petWidthPercent) { newX = 100 - petWidthPercent; setPetDirection('left'); }
          } else {
            newX -= step;
            if (newX <= 0) { newX = 0; setPetDirection('right'); }
          }
          return { ...prevPos, x: newX };
        });
      } else if (currentPet.type === 'duck') {
        setPetPosition(prevPos => {
          let newY = prevPos.y;
          const bobStep = 0.5; 
          const maxBob = 3; 
          if (bobDirection === 'up') {
            newY -= bobStep;
            if (newY <= -maxBob) { newY = -maxBob; setBobDirection('down'); }
          } else {
            newY += bobStep;
            if (newY >= 0) { newY = 0; setBobDirection('up'); }
          }
          return { ...prevPos, y: newY };
        });
      } else if (currentPet.type === 'serpent') {
         setPetPosition(prevPos => {
          let newX = prevPos.x;
          const step = 0.4;
          if (petDirection === 'right') {
            newX += step;
            if (newX >= 100 - petWidthPercent) { newX = 100 - petWidthPercent; setPetDirection('left'); }
          } else {
            newX -= step;
            if (newX <= 0) { newX = 0; setPetDirection('right'); }
          }
          setSlitherPhase(prevPhase => prevPhase + 0.1);
          const newY = Math.sin(slitherPhase) * 2; 
          return { x: newX, y: newY };
        });
      }
    }, 70);

    return () => { 
      if (animationIntervalRef.current) clearInterval(animationIntervalRef.current);
    };
  }, [currentPet.type, petDirection, bobDirection, slitherPhase, featureStatus]);


  useEffect(() => {
    if (featureStatus !== 'active') {
      if (thoughtTimeoutRef.current) clearTimeout(thoughtTimeoutRef.current);
      if (newThoughtIntervalRef.current) clearInterval(newThoughtIntervalRef.current);
      setCurrentThought(null);
      return;
    }
    const showNewThought = () => {
      if (thoughtTimeoutRef.current) clearTimeout(thoughtTimeoutRef.current);
      const randomThought = PET_THOUGHTS[Math.floor(Math.random() * PET_THOUGHTS.length)];
      setCurrentThought(randomThought);
      playSound('chat-receive'); 

      thoughtTimeoutRef.current = window.setTimeout(() => {
        setCurrentThought(null);
      }, 6000); 
    };

    if (newThoughtIntervalRef.current) clearInterval(newThoughtIntervalRef.current);
    
    showNewThought(); 
    newThoughtIntervalRef.current = window.setInterval(showNewThought, 20000 + Math.random() * 10000); 

    return () => {
      if (thoughtTimeoutRef.current) clearTimeout(thoughtTimeoutRef.current);
      if (newThoughtIntervalRef.current) clearInterval(newThoughtIntervalRef.current);
    };
  }, [currentPet.type, featureStatus]); 

  const handleChangePet = () => {
    playSound('ui-click');
    const currentIndex = PET_DEFINITIONS.findIndex(p => p.type === currentPetType);
    const nextIndex = (currentIndex + 1) % PET_DEFINITIONS.length;
    setCurrentPetType(PET_DEFINITIONS[nextIndex].type);
  };

  if (featureStatus !== 'active') {
    return <MaintenanceView featureName={ALL_FEATURE_IDS.petsPanel} featureIcon={ICONS.CatIcon} />;
  }

  const PetIconComponent = currentPet.icon;

  return (
    <div
      ref={panelRef}
      className="h-full flex flex-col bg-[var(--terminal-background)] text-[var(--terminal-foreground)] border-t border-[var(--terminal-border)] shadow-md relative overflow-hidden"
      role="complementary"
      aria-label="Pets Panel"
    >
      <div className="flex items-center justify-between px-2 py-1 bg-[var(--terminal-toolbar-background)] border-b border-[var(--terminal-border)] text-xs flex-shrink-0">
        <div className="flex items-center">
          {PetIconComponent && <PetIconComponent size={14} className="mr-1.5 text-[var(--text-accent)]" />}
          <span>{currentPet.name.toUpperCase()}</span>
        </div>
        <div className="flex items-center space-x-1">
            {PawPrintIcon && (
                 <button
                    onClick={handleChangePet}
                    className="p-1 rounded hover:bg-[var(--terminal-close-button-hover-background)] focus:outline-none"
                    title="Change Pet"
                    aria-label="Change Pet"
                >
                    <PawPrintIcon size={16} />
                </button>
            )}
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
      </div>
      <div className="flex-1 p-1 relative"> 
        {currentThought && (
          <div 
            className="pet-speech-bubble"
            style={{
              left: `${petPosition.x}%`,
              bottom: '40px', 
              transform: `translateX(-${petPosition.x < 50 ? 0 : (petPosition.x > 80 ? 100 : 50)}%)`, 
            }}
          >
            {currentThought}
          </div>
        )}

        <div
          style={{
            position: 'absolute',
            left: `${petPosition.x}%`,
            bottom: '5px', 
            transform: `translateY(${petPosition.y}px) ${currentPet.type === 'cat' && petDirection === 'left' ? 'scaleX(-1)' : ''}`, 
            transition: 'left 0.07s linear, transform 0.07s linear', 
          }}
          title={currentPet.defaultMessage}
        >
          <PetIconComponent size={28} className="text-[var(--text-accent)]" />
        </div>
      </div>
    </div>
  );
};

export default PetsPanel;
