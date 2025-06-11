
import React, { useCallback, useEffect, useState } from 'react';
import { ICONS } from '../../App/constants';
import { FeatureId, FeatureStatus, FeatureStatusAdminPanelProps, FeaturesStatusState } from '../../App/types';

const FeatureStatusAdminPanel: React.FC<FeatureStatusAdminPanelProps> = ({
  isOpen,
  onClose,
  currentStatuses,
  onSaveChangesToFirebase,
  allFeatureIds,
}) => {
  const [localStatuses, setLocalStatuses] = useState<FeaturesStatusState>(currentStatuses);
  const [isSaving, setIsSaving] = useState(false);

  const CloseIcon = ICONS.x_icon;
  const PanelIcon = ICONS.feature_status_admin_icon || ICONS.settings_icon;
  const SaveIcon = ICONS.check_icon; // Or specific Save icon

  // Sync local state when currentStatuses prop changes (e.g., after Firebase update)
  useEffect(() => {
    setLocalStatuses(currentStatuses);
  }, [currentStatuses]);

  const handleStatusChange = useCallback((featureId: FeatureId, newStatus: FeatureStatus) => {
    setLocalStatuses(prev => ({
      ...prev,
      [featureId]: newStatus,
    }));
  }, []);

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      await onSaveChangesToFirebase(localStatuses);
      // onClose will likely be called by the parent on successful save via notification
    } catch (error) {
      // Error notification should be handled by the parent
      console.error("Error saving feature statuses:", error);
    } finally {
      setIsSaving(false);
    }
  };
  
  const [isActuallyOpen, setIsActuallyOpen] = useState(false);
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    if (isOpen) {
      setIsActuallyOpen(true);
      // Refresh localStatuses from currentStatuses when opening, in case they drifted
      setLocalStatuses(currentStatuses); 
      const timer = setTimeout(() => {
        setAnimationClass('modal-open');
      }, 10);
      return () => clearTimeout(timer);
    } else {
      setAnimationClass('');
      const timer = setTimeout(() => {
        setIsActuallyOpen(false);
      }, 300); // Match CSS transition duration
      return () => clearTimeout(timer);
    }
  }, [isOpen, currentStatuses]);

  if (!isActuallyOpen) return null;


  const featureStatusOptions: { value: FeatureStatus; label: string }[] = [
    { value: 'active', label: 'Active' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'disabled', label: 'Disabled' },
  ];

  return (
    <div className={`modal-backdrop ${animationClass}`} onClick={onClose}>
      <div
        className={`about-modal-content modal-content-base ${animationClass} !w-[700px] !max-w-[95%] !mt-[5vh]`} // Wider modal
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="feature-status-admin-title"
      >
        <div className="flex items-center justify-between p-3 border-b border-[var(--modal-border)]">
          <div className="flex items-center">
            {PanelIcon && <PanelIcon size={18} className="text-[var(--text-accent)] mr-2" />}
            <h2 id="feature-status-admin-title" className="text-md font-semibold text-[var(--modal-foreground)]">
              Feature Status Management
            </h2>
          </div>
          {CloseIcon && (
            <button
              onClick={onClose}
              className="text-[var(--text-muted)] hover:text-[var(--modal-foreground)] p-1 rounded hover:bg-[var(--titlebar-button-hover-background)]"
              aria-label="Close feature status panel"
            >
              <CloseIcon size={18} />
            </button>
          )}
        </div>

        <div className="p-4 space-y-3 flex-grow overflow-y-auto max-h-[75vh]">
          <p className="text-xs text-[var(--text-muted)] mb-3">
            Modify the status of application features. Changes will be saved to Firebase and reflected globally.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
            {(Object.keys(allFeatureIds) as FeatureId[]).sort().map((featureId) => (
              <div key={featureId} className="flex items-center justify-between py-2 border-b border-[var(--border-color)] border-opacity-50 last:border-b-0 md:last:border-b-0">
                <span className="text-xs text-[var(--editor-foreground)] mr-2 truncate" title={allFeatureIds[featureId]}>
                  {allFeatureIds[featureId]}
                </span>
                <select
                  value={localStatuses[featureId] || 'disabled'}
                  onChange={(e) => handleStatusChange(featureId, e.target.value as FeatureStatus)}
                  className="px-2 py-1 text-xs bg-[var(--sidebar-background)] text-[var(--editor-foreground)] border border-[var(--border-color)] rounded-md focus:outline-none focus:border-[var(--focus-border)] focus:ring-1 focus:ring-[var(--focus-border)] appearance-none min-w-[120px]"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23${ICONS.chevron_down_icon ? 'currentColor' : '6B7280'}' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.3rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1em 1em',
                    paddingRight: '1.8rem',
                  }}
                  disabled={isSaving}
                >
                  {featureStatusOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>

        <div className="p-3 border-t border-[var(--modal-border)] bg-[var(--sidebar-background)] flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs bg-[var(--sidebar-item-hover-background)] hover:bg-[var(--activitybar-hover-background)] text-[var(--modal-foreground)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--focus-border)] transition-colors"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            onClick={handleSaveChanges}
            className="px-3 py-1.5 text-xs bg-[var(--modal-button-background)] hover:bg-[var(--modal-button-hover-background)] text-[var(--modal-button-foreground)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--focus-border)] transition-colors flex items-center"
            disabled={isSaving || JSON.stringify(localStatuses) === JSON.stringify(currentStatuses)}
          >
            {isSaving ? (
              <ICONS.SpinnerIcon size={14} className="animate-spin mr-1.5" />
            ) : (
              SaveIcon && <SaveIcon size={14} className="mr-1.5" />
            )}
            {isSaving ? 'Saving...' : 'Save to Firebase'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeatureStatusAdminPanel;
