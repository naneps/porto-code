
import React, { useEffect, useRef, useState } from 'react';
import { PortfolioData } from '../types';
import { ICONS } from '../constants';

interface ProfilePopupProps {
  isOpen: boolean;
  onClose: () => void;
  anchorEl: HTMLElement | null;
  portfolioData: PortfolioData;
}

const ProfilePopup: React.FC<ProfilePopupProps> = ({ isOpen, onClose, anchorEl, portfolioData }) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const [popupStyle, setPopupStyle] = useState<React.CSSProperties>({
    opacity: 0,
    transform: 'scale(0.95)',
    transition: 'opacity 0.1s ease-out, transform 0.1s ease-out',
    position: 'fixed', // Default to fixed position
  });
  const CloseIcon = ICONS.x_icon;

  useEffect(() => {
    if (isOpen && anchorEl) {
      const rect = anchorEl.getBoundingClientRect();
      const popupWidth = 280; // Must match CSS width
      const popupHeightEstimate = 150; // Estimate, adjust if needed

      let top = rect.bottom + 8;
      let left = rect.right - popupWidth; // Align right edge of popup with right edge of anchor

      // Adjust if it goes off-screen
      if (left < 8) {
        left = 8; // Prevent going off left edge
      }
      if (left + popupWidth > window.innerWidth - 8) {
        left = window.innerWidth - popupWidth - 8; // Prevent going off right edge
      }
      if (top + popupHeightEstimate > window.innerHeight - 8) {
        top = rect.top - popupHeightEstimate - 8; // Position above if not enough space below
      }

      setPopupStyle({
        position: 'fixed',
        top: `${top}px`,
        left: `${left}px`,
        opacity: 1,
        transform: 'scale(1)',
        transition: 'opacity 0.1s ease-out, transform 0.1s ease-out',
      });
    } else {
      // When closing or if anchorEl is missing, transition out
      setPopupStyle(prev => ({
        ...prev, // Keep existing position properties (like top, left, position:'fixed')
        opacity: 0,
        transform: 'scale(0.95)',
        transition: 'opacity 0.1s ease-out, transform 0.1s ease-out', // Ensure transition is set for closing
      }));
    }
  }, [isOpen, anchorEl]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        anchorEl &&
        !anchorEl.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, anchorEl]);

  // Render if isOpen is true (even if opacity is 0 for transition-in)
  // or if it's closing (isOpen false but opacity not yet 0 for transition-out)
  if (!isOpen && popupStyle.opacity === 0) {
    return null;
  }

  return (
    <div
      ref={popupRef}
      style={popupStyle} // Apply the full style object including transitions and positioning
      className="profile-popup-content flex flex-col items-center text-center"
      onClick={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      aria-label="User Profile"
    >
      <button
        onClick={onClose}
        className="absolute top-1 right-1 p-1 text-[var(--text-muted)] hover:text-[var(--modal-foreground)] rounded-full hover:bg-[var(--titlebar-button-hover-background)]"
        aria-label="Close profile popup"
      >
        {CloseIcon && <CloseIcon size={16} />}
      </button>
      {portfolioData.avatarUrl && (
        <img
          src={portfolioData.avatarUrl}
          alt={`${portfolioData.name}'s avatar`}
          className="w-20 h-20 mb-3 mt-2 object-cover" // mt-2 to give space for close button
        />
      )}
      <h3 className="text-lg font-semibold text-[var(--menu-item-selected-foreground)] mb-1">
        {portfolioData.name}
      </h3>
      <p className="text-sm text-[var(--text-muted)] mb-2">
        {portfolioData.role || 'Portfolio Owner'}
      </p>
    </div>
  );
};

export default ProfilePopup;