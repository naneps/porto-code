import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getNowPlaying, isSpotifyAuthenticated, SpotifyNowPlaying } from '../../Utils/spotifyUtils';
import { Music } from 'lucide-react';

interface NowPlayingWidgetProps {
  onClick?: () => void;
}

const NowPlayingWidget: React.FC<NowPlayingWidgetProps> = ({ onClick }) => {
  const [nowPlaying, setNowPlaying] = useState<SpotifyNowPlaying | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const fetchNowPlaying = useCallback(async () => {
    if (!isSpotifyAuthenticated()) {
      return;
    }
    const data = await getNowPlaying();
    if (data?.item) {
      setNowPlaying(data);
    }
  }, []);

  useEffect(() => {
    fetchNowPlaying();
    intervalRef.current = setInterval(fetchNowPlaying, 30_000);
    return () => clearInterval(intervalRef.current);
  }, [fetchNowPlaying]);

  if (!nowPlaying?.item) {
    return (
      <button
        onClick={onClick}
        className="flex items-center gap-1.5 hover:bg-[var(--statusbar-item-hover-background)] px-1.5 py-0.5 rounded transition-colors group"
        title="Open Spotify integration"
        aria-label="Open Spotify integration"
      >
        <Music size={10} className="opacity-60 text-[hsl(141_72%_55%)]" />
        <span className="text-[10px] text-[var(--statusbar-foreground)] opacity-80 group-hover:opacity-100">Spotify</span>
      </button>
    );
  }

  const track = nowPlaying.item;
  const name = track.name;
  const artist = track.artists[0]?.name ?? '';
  const label = `${name} — ${artist}`;

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 max-w-[200px] hover:bg-[var(--statusbar-item-hover-background)] px-1.5 py-0.5 rounded transition-colors group"
      title={`Now Playing: ${label} — Click to open Spotify view`}
      aria-label={`Now Playing: ${label}`}
    >
      {/* Animated bars */}
      <div className="flex items-end gap-px h-3 flex-shrink-0">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-0.5 bg-[hsl(141_72%_55%)] rounded-full ${nowPlaying.is_playing ? 'music-bar-animate' : ''}`}
            style={{
              height: nowPlaying.is_playing ? undefined : '40%',
              opacity: nowPlaying.is_playing ? 1 : 0.5,
              animationDelay: nowPlaying.is_playing ? `${i * 0.15}s` : undefined,
            }}
          />
        ))}
      </div>
      <span
        className="text-[10px] truncate leading-none"
        style={{ color: 'hsl(141 72% 65%)' }}
      >
        {label}
      </span>
      <Music size={10} className="flex-shrink-0 opacity-50" style={{ color: 'hsl(141 72% 55%)' }} />
    </button>
  );
};

export default NowPlayingWidget;
