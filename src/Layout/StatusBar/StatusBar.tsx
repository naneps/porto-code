
import React from 'react';
import { ICONS } from '../../App/constants';
import { playSound } from '../../Utils/audioUtils';

interface StatusBarProps {
  version: string;
  currentThemeName: string;
  isSoundMuted: boolean;
  onToggleSoundMute: () => void;
  notificationsCount: number;
  onOpenCommandPalette: () => void;
  onOpenAboutModal: () => void;
  isBottomPanelVisible: boolean; // New prop
  onToggleBottomPanel: () => void; // New prop
}

const StatusBar: React.FC<StatusBarProps> = ({
  version,
  currentThemeName,
  isSoundMuted,
  onToggleSoundMute,
  notificationsCount,
  onOpenCommandPalette,
  onOpenAboutModal,
  isBottomPanelVisible, // Destructure new prop
  onToggleBottomPanel,  // Destructure new prop
}) => {
  const SoundIcon = isSoundMuted ? (ICONS.VolumeXIcon || ICONS.default) : (ICONS.Volume2Icon || ICONS.default) ;
  const ThemeIcon = ICONS.Palette || ICONS.theme_command || ICONS.default;
  const BellIcon = ICONS.Bell || ICONS.bell_icon || ICONS.default;
  const BottomPanelToggleIcon = ICONS.layout_panel_bottom || ICONS.default;

  const handleVersionClick = () => {
    playSound('ui-click');
    onOpenAboutModal();
  };

  const handleThemeClick = () => {
    playSound('ui-click');
    onOpenCommandPalette(); // User can then type 'theme'
  };

  const handleSoundIconClick = () => {
    onToggleSoundMute();
  };

  const handleBellClick = () => {
    playSound('ui-click');
    onOpenCommandPalette(); 
  };

  const handleBottomPanelToggleClick = () => {
    onToggleBottomPanel(); // Sound is handled by the passed-in function
  };

  return (
    <footer 
        className="bg-[var(--statusbar-background)] text-[var(--statusbar-foreground)] border-t border-[var(--statusbar-border)] h-6 flex items-center px-3 text-xs justify-between flex-shrink-0 select-none"
        role="status"
        aria-label="Status Bar"
    >
      {/* Left Section */}
      <div className="flex items-center space-x-3">
        <button
          onClick={handleVersionClick}
          className="hover:bg-[var(--statusbar-item-hover-background)] px-1.5 py-0.5 rounded transition-colors"
          title={`Version ${version}. Click for details.`}
          aria-label={`Application version ${version}, click for about information`}
        >
          v{version}
        </button>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-3">
        <button
          onClick={handleThemeClick}
          className="flex items-center hover:bg-[var(--statusbar-item-hover-background)] px-1.5 py-0.5 rounded transition-colors"
          title={`Current theme: ${currentThemeName}. Click to change.`}
          aria-label={`Current theme: ${currentThemeName}, click to open command palette for theme selection`}
        >
          {ThemeIcon && <ThemeIcon size={14} className="mr-1" />}
          {currentThemeName}
        </button>
        <button
          onClick={handleSoundIconClick}
          className="flex items-center hover:bg-[var(--statusbar-item-hover-background)] px-1 py-0.5 rounded transition-colors"
          title={isSoundMuted ? "Sound is Muted. Click to unmute." : "Sound is On. Click to mute."}
          aria-label={isSoundMuted ? "Unmute sound effects" : "Mute sound effects"}
          aria-pressed={!isSoundMuted}
        >
          {SoundIcon && <SoundIcon size={14} />}
        </button>
        <button
          onClick={handleBottomPanelToggleClick}
          className={`flex items-center hover:bg-[var(--statusbar-item-hover-background)] px-1 py-0.5 rounded transition-colors ${isBottomPanelVisible ? 'bg-[var(--statusbar-item-hover-background)]' : ''}`}
          title="Toggle Bottom Panel (Ctrl+` or Cmd+`)"
          aria-label="Toggle bottom panel visibility"
          aria-pressed={isBottomPanelVisible}
        >
          {BottomPanelToggleIcon && <BottomPanelToggleIcon size={14} />}
        </button>
        <button
          onClick={handleBellClick}
          className="flex items-center hover:bg-[var(--statusbar-item-hover-background)] px-1 py-0.5 rounded transition-colors"
          title={`${notificationsCount} notifications. Click to view (opens Command Palette).`}
          aria-label={`${notificationsCount} notifications. Click to manage.`}
        >
          {BellIcon && <BellIcon size={14} />}
          {notificationsCount > 0 && (
            <span className="ml-0.5 text-[0.65rem] bg-[var(--text-accent)] text-[var(--text-inverse)] px-1 rounded-full" aria-hidden="true">
              {notificationsCount}
            </span>
          )}
        </button>
      </div>
    </footer>
  );
};

export default StatusBar;
