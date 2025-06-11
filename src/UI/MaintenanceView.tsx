import React from 'react';
import { ICONS } from '../App/constants';
import { LucideIcon } from 'lucide-react';

interface MaintenanceViewProps {
  featureName: string;
  featureIcon?: LucideIcon; // Optional icon for the feature itself
  className?: string;
}

const MaintenanceView: React.FC<MaintenanceViewProps> = ({ featureName, featureIcon: FeatureSpecificIcon, className }) => {
  const MaintenanceIcon = ICONS.HardHatIcon || ICONS.settings_icon; // Fallback to settings icon

  return (
    <div 
      className={`maintenance-view-container flex flex-col items-center justify-center h-full p-4 sm:p-6 md:p-8 text-center bg-[var(--editor-background)] text-[var(--editor-foreground)] ${className || ''}`}
      role="alert"
      aria-live="polite"
    >
      <MaintenanceIcon size={48} className="text-[var(--text-accent)] mb-4 animate-pulse" />
      <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-[var(--editor-tab-active-foreground)]">
        Feature Under Maintenance
      </h2>
      {FeatureSpecificIcon && (
         <div className="flex items-center text-sm text-[var(--text-muted)] mb-3">
            <FeatureSpecificIcon size={16} className="mr-1.5" /> 
            <span>{featureName}</span>
         </div>
      )}
       {!FeatureSpecificIcon && (
         <p className="text-sm text-[var(--text-muted)] mb-3">
            The <strong className="text-[var(--editor-foreground)]">{featureName}</strong> is currently unavailable.
         </p>
      )}
      <p className="text-sm text-[var(--text-muted)] max-w-md">
        We're working on making it even better and will have it back up and running shortly. Thank you for your patience!
      </p>
    </div>
  );
};

export default MaintenanceView;
