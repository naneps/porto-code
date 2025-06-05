
import React from 'react';
import { ICONS } from '../constants';
import { playSound } from '../utils/audioUtils';

interface StatusBarProps {
  version: string;
  currentThemeName: string;
  isSoundMuted: boolean;
  onToggleSoundMute: () => void;
  notificationsCount: number;
  onOpenCommandPalette: () => void;
  onOpenAboutModal: () => void;
}

const StatusBar: React.FC<StatusBarProps> = ({
  version,
  currentThemeName,
  isSoundMuted,
  onToggleSoundMute,
  notificationsCount,
  onOpenCommandPalette,
  onOpenAboutModal,
}) => {
  const SoundIcon = isSoundMuted ? (ICONS.VolumeXIcon || ICONS.default) : (ICONS.Volume2Icon || ICONS.default) ;
  const ThemeIcon = ICONS.Palette || ICONS.theme_command || ICONS.default;
  const BellIcon = ICONS.Bell || ICONS.bell_icon || ICONS.default;

  const handleVersionClick = () => {
    playSound('ui-click');
    onOpenAboutModal();
  };

  const handleThemeClick = () => {
    playSound('ui-click');
    onOpenCommandPalette(); // User can then type 'theme'
  };

  const handleSoundIconClick = () => {
    // playSound is handled by onToggleSoundMute callback itself in App.tsx
    onToggleSoundMute();
  };

  const handleBellClick = () => {
    playSound('ui-click');
    onOpenCommandPalette(); // User can then type 'notifications' or view a future panel
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
        {/* Placeholder for future items like source control, errors/warnings */}
        {/* 
        <button className="flex items-center hover:bg-[var(--statusbar-item-hover-background)] px-1.5 py-0.5 rounded transition-colors" title="Source Control (Not Implemented)">
          <ICONS.GitFork size={14} className="mr-1" /> main
        </button> 
        */}
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-3">
        {/* Placeholders for future items like Line/Col, Spaces, Encoding */}
        {/* 
        <span className="hover:bg-[var(--statusbar-item-hover-background)] px-1.5 py-0.5 rounded transition-colors cursor-default">Ln 1, Col 1</span>
        <span className="hover:bg-[var(--statusbar-item-hover-background)] px-1.5 py-0.5 rounded transition-colors cursor-default">Spaces: 2</span>
        <span className="hover:bg-[var(--statusbar-item-hover-background)] px-1.5 py-0.5 rounded transition-colors cursor-default">UTF-8</span>
        */}
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
