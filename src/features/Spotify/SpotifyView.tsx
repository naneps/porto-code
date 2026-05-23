import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  clearSpotifyTokens,
  formatDuration,
  getRecentlyPlayed,
  getTopArtists,
  getTopTracks,
  getNowPlaying,
  initiateSpotifyLogin,
  isSpotifyAuthenticated,
  SpotifyArtist,
  SpotifyNowPlaying,
  SpotifyRecentlyPlayedItem,
  SpotifyTrack,
} from '../../Utils/spotifyUtils';
import { ExternalLink, Music, Headphones, TrendingUp, Clock, LogIn, LogOut, RefreshCw, Play, ChevronRight } from 'lucide-react';

// ── Music bars animation ──────────────────────────────────────────────────────
const MusicBars: React.FC<{ playing: boolean; size?: 'sm' | 'md' }> = ({ playing, size = 'md' }) => {
  const h = size === 'sm' ? 'h-3' : 'h-4';
  const w = size === 'sm' ? 'w-0.5' : 'w-0.5';
  return (
    <div className={`flex items-end gap-px ${size === 'sm' ? 'h-3' : 'h-4'}`}>
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={`${w} bg-[var(--text-accent)] rounded-full ${playing ? 'music-bar-animate' : 'opacity-40'}`}
          style={{
            height: playing ? undefined : '30%',
            animationDelay: playing ? `${(i - 1) * 0.15}s` : undefined,
          }}
        />
      ))}
    </div>
  );
};

// ── Track Row ─────────────────────────────────────────────────────────────────
const TrackRow: React.FC<{
  track: SpotifyTrack;
  index?: number;
  isPlaying?: boolean;
  playedAt?: string;
}> = ({ track, index, isPlaying, playedAt }) => {
  const img = track.album.images?.[2] || track.album.images?.[0];
  return (
    <a
      href={track.external_urls.spotify}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--sidebar-item-hover-background)] transition-all group"
    >
      <div className="flex-shrink-0 w-8 text-center">
        {isPlaying ? (
          <MusicBars playing size="sm" />
        ) : index !== undefined ? (
          <span className="text-xs text-[var(--text-muted)] group-hover:hidden block">{index + 1}</span>
        ) : null}
        <Play size={12} className="text-[var(--text-accent)] hidden group-hover:block mx-auto" />
      </div>
      {img && (
        <img src={img.url} alt={track.album.name} className="w-8 h-8 rounded flex-shrink-0 object-cover shadow" />
      )}
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-medium truncate ${isPlaying ? 'text-[var(--text-accent)]' : 'text-[var(--editor-foreground)]'}`}>
          {track.name}
        </p>
        <p className="text-[10px] text-[var(--text-muted)] truncate">
          {track.artists.map(a => a.name).join(', ')}
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {playedAt && (
          <span className="text-[10px] text-[var(--text-muted)] hidden group-hover:block">
            {new Date(playedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
        <span className="text-[10px] text-[var(--text-muted)]">{formatDuration(track.duration_ms)}</span>
        <ExternalLink size={10} className="text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </a>
  );
};

// ── Artist Chip ───────────────────────────────────────────────────────────────
const ArtistChip: React.FC<{ artist: SpotifyArtist; rank: number }> = ({ artist, rank }) => {
  const img = artist.images?.[1] || artist.images?.[0];
  return (
    <a
      href={artist.external_urls.spotify}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-[var(--sidebar-item-hover-background)] transition-all text-center group w-[70px]"
    >
      <div className="relative">
        {img ? (
          <img src={img.url} alt={artist.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-[var(--border-color)] group-hover:ring-[var(--text-accent)] transition-all" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-[var(--sidebar-background)] flex items-center justify-center">
            <Music size={20} className="text-[var(--text-muted)]" />
          </div>
        )}
        <span className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-[var(--text-accent)] text-[var(--text-inverse)] text-[9px] flex items-center justify-center font-bold">
          {rank}
        </span>
      </div>
      <span className="text-[10px] text-[var(--editor-foreground)] leading-tight truncate w-full">{artist.name}</span>
    </a>
  );
};

// ── Now Playing Card ──────────────────────────────────────────────────────────
const NowPlayingCard: React.FC<{ nowPlaying: SpotifyNowPlaying | null; loading: boolean }> = ({ nowPlaying, loading }) => {
  const track = nowPlaying?.item;

  if (loading) {
    return (
      <div className="spotify-shimmer rounded-xl p-4 mb-4 h-24" />
    );
  }

  if (!track) {
    return (
      <div className="rounded-xl border border-[var(--border-color)] p-4 mb-4 flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg bg-[var(--sidebar-background)] flex items-center justify-center flex-shrink-0">
          <Music size={20} className="text-[var(--text-muted)]" />
        </div>
        <div>
          <p className="text-xs text-[var(--text-muted)]">Not playing right now</p>
          <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Spotify is paused or offline</p>
        </div>
      </div>
    );
  }

  const img = track.album.images?.[0];
  const progress = nowPlaying ? (nowPlaying.progress_ms / track.duration_ms) * 100 : 0;

  return (
    <a
      href={track.external_urls.spotify}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-xl p-3 mb-4 relative overflow-hidden group transition-transform hover:scale-[1.01]"
      style={{
        background: 'linear-gradient(135deg, hsl(141 70% 13%) 0%, hsl(141 60% 8%) 100%)',
        border: '1px solid hsl(141 60% 20%)',
      }}
    >
      {/* Background blur art */}
      {img && (
        <div className="absolute inset-0 opacity-10 blur-xl scale-150" style={{ backgroundImage: `url(${img.url})`, backgroundSize: 'cover' }} />
      )}
      <div className="relative flex items-center gap-3">
        <div className="relative flex-shrink-0">
          {img ? (
            <img src={img.url} alt={track.album.name} className="w-14 h-14 rounded-lg shadow-lg object-cover" />
          ) : (
            <div className="w-14 h-14 rounded-lg bg-[hsl(141_70%_15%)] flex items-center justify-center">
              <Music size={24} className="text-[hsl(141_80%_60%)]" />
            </div>
          )}
          {nowPlaying?.is_playing && (
            <div className="absolute bottom-0.5 right-0.5 bg-[hsl(141_70%_13%)] rounded-sm p-0.5">
              <MusicBars playing size="sm" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[9px] font-semibold uppercase tracking-widest text-[hsl(141_80%_60%)]">
              {nowPlaying?.is_playing ? '● Now Playing' : '⏸ Paused'}
            </span>
          </div>
          <p className="text-sm font-semibold text-white truncate">{track.name}</p>
          <p className="text-xs text-[hsl(141_50%_70%)] truncate">{track.artists.map(a => a.name).join(', ')}</p>
          <p className="text-[10px] text-[hsl(141_40%_55%)] truncate mt-0.5">{track.album.name}</p>
          {/* Progress bar */}
          <div className="mt-2 h-0.5 rounded-full bg-[hsl(141_50%_20%)]">
            <div
              className="h-full rounded-full bg-[hsl(141_80%_60%)] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-0.5">
            <span className="text-[9px] text-[hsl(141_40%_55%)]">{formatDuration(nowPlaying?.progress_ms ?? 0)}</span>
            <span className="text-[9px] text-[hsl(141_40%_55%)]">{formatDuration(track.duration_ms)}</span>
          </div>
        </div>
        <ExternalLink size={12} className="text-[hsl(141_60%_50%)] flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </a>
  );
};

// ── Time Range Picker ─────────────────────────────────────────────────────────
type TimeRange = 'short_term' | 'medium_term' | 'long_term';
const TIME_RANGE_LABELS: Record<TimeRange, string> = {
  short_term:  '4 Weeks',
  medium_term: '6 Months',
  long_term:   'All Time',
};

// ── Main SpotifyView Component ────────────────────────────────────────────────
interface SpotifyViewProps {
  onAuth?: () => void;
}

const SpotifyView: React.FC<SpotifyViewProps> = () => {
  const [authenticated, setAuthenticated] = useState(isSpotifyAuthenticated());
  const [activeTab, setActiveTab] = useState<'tracks' | 'artists' | 'recent'>('tracks');
  const [timeRange, setTimeRange] = useState<TimeRange>('short_term');

  const [nowPlaying, setNowPlaying] = useState<SpotifyNowPlaying | null>(null);
  const [topTracks, setTopTracks] = useState<SpotifyTrack[]>([]);
  const [topArtists, setTopArtists] = useState<SpotifyArtist[]>([]);
  const [recentTracks, setRecentTracks] = useState<SpotifyRecentlyPlayedItem[]>([]);

  const [loadingNowPlaying, setLoadingNowPlaying] = useState(false);
  const [loadingContent, setLoadingContent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nowPlayingInterval = useRef<ReturnType<typeof setInterval>>();

  const fetchNowPlaying = useCallback(async () => {
    if (!isSpotifyAuthenticated()) return;
    const data = await getNowPlaying();
    setNowPlaying(data);
  }, []);

  const fetchContent = useCallback(async (tr: TimeRange, tab: string) => {
    if (!isSpotifyAuthenticated()) return;
    setLoadingContent(true);
    setError(null);
    try {
      if (tab === 'tracks') {
        const tracks = await getTopTracks(tr, 20);
        setTopTracks(tracks);
      } else if (tab === 'artists') {
        const artists = await getTopArtists(tr, 12);
        setTopArtists(artists);
      } else {
        const recent = await getRecentlyPlayed(20);
        setRecentTracks(recent);
      }
    } catch {
      setError('Failed to load data from Spotify.');
    } finally {
      setLoadingContent(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    if (!authenticated) return;

    setLoadingNowPlaying(true);
    fetchNowPlaying().finally(() => setLoadingNowPlaying(false));
    fetchContent(timeRange, activeTab);

    // Poll now playing every 30s
    nowPlayingInterval.current = setInterval(fetchNowPlaying, 30_000);
    return () => clearInterval(nowPlayingInterval.current);
  }, [authenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (authenticated) fetchContent(timeRange, activeTab);
  }, [timeRange, activeTab, fetchContent, authenticated]);

  const handleLogin = () => initiateSpotifyLogin();

  const handleLogout = () => {
    clearSpotifyTokens();
    setAuthenticated(false);
    setNowPlaying(null);
    setTopTracks([]);
    setTopArtists([]);
    setRecentTracks([]);
    clearInterval(nowPlayingInterval.current);
  };

  const handleRefresh = () => {
    fetchNowPlaying();
    fetchContent(timeRange, activeTab);
  };

  // ── Not authenticated ──────────────────────────────────────────────────────
  if (!authenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-xl"
          style={{ background: 'linear-gradient(135deg, hsl(141 70% 25%), hsl(141 80% 15%))' }}
        >
          <Music size={28} className="text-white" />
        </div>
        <h3 className="text-sm font-semibold text-[var(--editor-foreground)] mb-1">Connect Spotify</h3>
        <p className="text-xs text-[var(--text-muted)] mb-6 max-w-[200px]">
          See what Nandang is listening to right now, his top tracks, artists, and more.
        </p>
        <button
          onClick={handleLogin}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:scale-105 active:scale-95 shadow-lg"
          style={{ background: 'hsl(141 72% 42%)' }}
          aria-label="Connect to Spotify"
        >
          <LogIn size={16} />
          Connect with Spotify
        </button>
        <p className="text-[10px] text-[var(--text-muted)] mt-3 max-w-[220px]">
          You'll be redirected to Spotify to authorize. No passwords are stored.
        </p>
      </div>
    );
  }

  // ── Authenticated ──────────────────────────────────────────────────────────
  const tabItems: { id: typeof activeTab; label: string; icon: React.ElementType }[] = [
    { id: 'tracks',  label: 'Top Tracks',  icon: TrendingUp },
    { id: 'artists', label: 'Top Artists', icon: Headphones },
    { id: 'recent',  label: 'Recent',      icon: Clock },
  ];

  return (
    <div className="flex flex-col h-full bg-[var(--editor-background)] text-[var(--editor-foreground)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center"
            style={{ background: 'hsl(141 72% 42%)' }}
          >
            <Music size={13} className="text-white" />
          </div>
          <span className="text-sm font-semibold" style={{ color: 'hsl(141 72% 55%)' }}>Spotify</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleRefresh}
            className="p-1 rounded hover:bg-[var(--sidebar-item-hover-background)] transition-colors"
            title="Refresh"
            aria-label="Refresh Spotify data"
          >
            <RefreshCw size={13} className="text-[var(--text-muted)]" />
          </button>
          <button
            onClick={handleLogout}
            className="p-1 rounded hover:bg-[var(--sidebar-item-hover-background)] transition-colors"
            title="Disconnect Spotify"
            aria-label="Disconnect Spotify"
          >
            <LogOut size={13} className="text-[var(--text-muted)]" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-4">
        {/* Now Playing */}
        <NowPlayingCard nowPlaying={nowPlaying} loading={loadingNowPlaying} />

        {/* Tab bar */}
        <div className="flex gap-1 mb-3 bg-[var(--sidebar-background)] rounded-lg p-1">
          {tabItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex items-center justify-center gap-1 py-1 rounded-md text-[10px] font-medium transition-all ${
                activeTab === id
                  ? 'bg-[var(--editor-background)] text-[var(--text-accent)] shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--editor-foreground)]'
              }`}
              aria-pressed={activeTab === id}
            >
              <Icon size={11} />
              {label}
            </button>
          ))}
        </div>

        {/* Time range (not for recent) */}
        {activeTab !== 'recent' && (
          <div className="flex gap-1 mb-3">
            {(Object.entries(TIME_RANGE_LABELS) as [TimeRange, string][]).map(([range, label]) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-2 py-0.5 rounded text-[10px] transition-all ${
                  timeRange === range
                    ? 'text-[var(--text-accent)] font-semibold'
                    : 'text-[var(--text-muted)] hover:text-[var(--editor-foreground)]'
                }`}
                aria-pressed={timeRange === range}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-xs text-red-400 text-center py-4">{error}</div>
        )}

        {/* Loading shimmer */}
        {loadingContent && !error && (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="spotify-shimmer h-12 rounded-lg" />
            ))}
          </div>
        )}

        {/* Top Tracks */}
        {!loadingContent && activeTab === 'tracks' && (
          <div className="space-y-0.5">
            {topTracks.length === 0 ? (
              <p className="text-xs text-[var(--text-muted)] text-center py-6">No tracks found</p>
            ) : (
              topTracks.map((track, i) => (
                <TrackRow
                  key={track.id}
                  track={track}
                  index={i}
                  isPlaying={nowPlaying?.item?.id === track.id && nowPlaying.is_playing}
                />
              ))
            )}
          </div>
        )}

        {/* Top Artists */}
        {!loadingContent && activeTab === 'artists' && (
          <div className="flex flex-wrap gap-1 justify-center">
            {topArtists.length === 0 ? (
              <p className="text-xs text-[var(--text-muted)] text-center w-full py-6">No artists found</p>
            ) : (
              topArtists.map((artist, i) => (
                <ArtistChip key={artist.id} artist={artist} rank={i + 1} />
              ))
            )}
          </div>
        )}

        {/* Recently Played */}
        {!loadingContent && activeTab === 'recent' && (
          <div className="space-y-0.5">
            {recentTracks.length === 0 ? (
              <p className="text-xs text-[var(--text-muted)] text-center py-6">No recent tracks</p>
            ) : (
              recentTracks.map((item) => (
                <TrackRow
                  key={`${item.track.id}-${item.played_at}`}
                  track={item.track}
                  isPlaying={nowPlaying?.item?.id === item.track.id && nowPlaying.is_playing}
                  playedAt={item.played_at}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SpotifyView;
