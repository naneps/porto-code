import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { SpotifyPlaybackControls as Controls } from '../../Utils/spotifyUtils';

interface SpotifyPlaybackControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrevious: () => void;
  volume?: number;
  onVolumeChange?: (volume: number) => void;
  disabled?: boolean;
}

const SpotifyPlaybackControls: React.FC<SpotifyPlaybackControlsProps> = ({
  isPlaying,
  onTogglePlay,
  onNext,
  onPrevious,
  volume = 0.8,
  onVolumeChange,
  disabled = false,
}) => {
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    if (onVolumeChange) {
      onVolumeChange(newVolume);
    }
    Controls.setVolume(newVolume);
  };

  return (
    <div className="flex items-center gap-4 p-3 rounded-xl bg-[var(--editor-tab-inactive-background)] border border-[var(--border-color)]">
      {/* Main Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={onPrevious}
          disabled={disabled}
          className="p-2 rounded-full hover:bg-[var(--sidebar-item-hover-background)] disabled:opacity-50 transition-colors"
          title="Previous"
        >
          <SkipBack size={18} />
        </button>

        <button
          onClick={onTogglePlay}
          disabled={disabled}
          className="p-3 rounded-full bg-[var(--text-accent)] text-[var(--text-inverse)] hover:bg-[var(--focus-border)] disabled:opacity-50 transition-all active:scale-95"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>

        <button
          onClick={onNext}
          disabled={disabled}
          className="p-2 rounded-full hover:bg-[var(--sidebar-item-hover-background)] disabled:opacity-50 transition-colors"
          title="Next"
        >
          <SkipForward size={18} />
        </button>
      </div>

      {/* Volume Control */}
      {onVolumeChange && (
        <div className="flex items-center gap-2 flex-1 max-w-[120px]">
          <Volume2 size={16} className="text-[var(--text-muted)]" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            disabled={disabled}
            className="w-full accent-[var(--text-accent)]"
          />
        </div>
      )}

      <div className="text-[10px] text-[var(--text-muted)] ml-auto hidden sm:block">
        Web Player
      </div>
    </div>
  );
};

export default SpotifyPlaybackControls;