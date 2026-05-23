// ─── Spotify PKCE OAuth + API Utilities ───────────────────────────────────────
// Uses Authorization Code with PKCE — no client secret exposed in browser.
// User authorizes once; tokens are persisted in localStorage.

export const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID || '90102add9d3f44748b5f6dc3a2e62ecd';
const SPOTIFY_SCOPES = [
  'user-read-currently-playing',
  'user-read-recently-played',
  'user-top-read',
  'user-read-playback-state',
].join(' ');

const LS_ACCESS_TOKEN  = 'spotify_access_token';
const LS_REFRESH_TOKEN = 'spotify_refresh_token';
const LS_EXPIRES_AT    = 'spotify_expires_at';
const LS_CODE_VERIFIER = 'spotify_code_verifier';

// ── PKCE helpers ──────────────────────────────────────────────────────────────
function generateRandomString(len: number) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const arr = new Uint8Array(len);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => chars[b % chars.length]).join('');
}

async function sha256(plain: string) {
  const enc = new TextEncoder().encode(plain);
  return crypto.subtle.digest('SHA-256', enc);
}

function base64urlEncode(buf: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

// ── Auth flow ─────────────────────────────────────────────────────────────────
export function getSpotifyRedirectUri() {
  return window.location.origin + window.location.pathname;
}

export async function initiateSpotifyLogin() {
  const verifier  = generateRandomString(64);
  const challenge = base64urlEncode(await sha256(verifier));

  localStorage.setItem(LS_CODE_VERIFIER, verifier);

  const params = new URLSearchParams({
    response_type: 'code',
    client_id:     SPOTIFY_CLIENT_ID,
    scope:         SPOTIFY_SCOPES,
    redirect_uri:  getSpotifyRedirectUri(),
    code_challenge_method: 'S256',
    code_challenge:        challenge,
  });

  window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

export async function handleSpotifyCallback(code: string): Promise<boolean> {
  const verifier = localStorage.getItem(LS_CODE_VERIFIER);
  if (!verifier) return false;

  const body = new URLSearchParams({
    grant_type:    'authorization_code',
    code,
    redirect_uri:  getSpotifyRedirectUri(),
    client_id:     SPOTIFY_CLIENT_ID,
    code_verifier: verifier,
  });

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!res.ok) return false;
  const data = await res.json();
  storeTokens(data);
  localStorage.removeItem(LS_CODE_VERIFIER);
  // Clean the ?code= from URL without triggering a reload
  window.history.replaceState({}, document.title, window.location.pathname);
  return true;
}

function storeTokens(data: { access_token: string; refresh_token?: string; expires_in: number }) {
  localStorage.setItem(LS_ACCESS_TOKEN,  data.access_token);
  if (data.refresh_token) localStorage.setItem(LS_REFRESH_TOKEN, data.refresh_token);
  localStorage.setItem(LS_EXPIRES_AT, String(Date.now() + data.expires_in * 1000));
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem(LS_REFRESH_TOKEN);
  if (!refreshToken) return null;

  const body = new URLSearchParams({
    grant_type:    'refresh_token',
    refresh_token: refreshToken,
    client_id:     SPOTIFY_CLIENT_ID,
  });

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!res.ok) {
    // Refresh token expired — clear everything
    clearSpotifyTokens();
    return null;
  }

  const data = await res.json();
  storeTokens(data);
  return data.access_token;
}

export function clearSpotifyTokens() {
  [LS_ACCESS_TOKEN, LS_REFRESH_TOKEN, LS_EXPIRES_AT, LS_CODE_VERIFIER].forEach(k =>
    localStorage.removeItem(k)
  );
}

export function isSpotifyAuthenticated(): boolean {
  return !!localStorage.getItem(LS_ACCESS_TOKEN);
}

async function getValidAccessToken(): Promise<string | null> {
  const token     = localStorage.getItem(LS_ACCESS_TOKEN);
  const expiresAt = Number(localStorage.getItem(LS_EXPIRES_AT) || 0);

  if (!token) return null;

  // Refresh if < 60 seconds left
  if (Date.now() > expiresAt - 60_000) {
    return refreshAccessToken();
  }

  return token;
}

// ── API helpers ───────────────────────────────────────────────────────────────
async function spotifyFetch<T>(endpoint: string): Promise<T | null> {
  const token = await getValidAccessToken();
  if (!token) return null;

  const res = await fetch(`https://api.spotify.com/v1${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 401) {
    // Try once more with refreshed token
    const newToken = await refreshAccessToken();
    if (!newToken) return null;
    const retry = await fetch(`https://api.spotify.com/v1${endpoint}`, {
      headers: { Authorization: `Bearer ${newToken}` },
    });
    if (!retry.ok) return null;
    if (retry.status === 204) return null;
    return retry.json();
  }

  if (!res.ok) return null;
  if (res.status === 204) return null; // No content (nothing playing)
  return res.json();
}

// ── Spotify Data Types ────────────────────────────────────────────────────────
export interface SpotifyImage { url: string; width: number; height: number; }
export interface SpotifyArtist { id: string; name: string; images?: SpotifyImage[]; external_urls: { spotify: string }; genres?: string[]; }
export interface SpotifyTrack {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  album: { name: string; images: SpotifyImage[]; };
  external_urls: { spotify: string };
  duration_ms: number;
  preview_url: string | null;
}
export interface SpotifyNowPlaying {
  is_playing: boolean;
  progress_ms: number;
  item: SpotifyTrack | null;
}
export interface SpotifyRecentlyPlayedItem {
  track: SpotifyTrack;
  played_at: string;
}

// ── Public API functions ──────────────────────────────────────────────────────
export async function getNowPlaying(): Promise<SpotifyNowPlaying | null> {
  return spotifyFetch<SpotifyNowPlaying>('/me/player/currently-playing');
}

export async function getTopTracks(timeRange: 'short_term' | 'medium_term' | 'long_term' = 'short_term', limit = 10): Promise<SpotifyTrack[]> {
  const data = await spotifyFetch<{ items: SpotifyTrack[] }>(`/me/top/tracks?time_range=${timeRange}&limit=${limit}`);
  return data?.items ?? [];
}

export async function getTopArtists(timeRange: 'short_term' | 'medium_term' | 'long_term' = 'short_term', limit = 6): Promise<SpotifyArtist[]> {
  const data = await spotifyFetch<{ items: SpotifyArtist[] }>(`/me/top/artists?time_range=${timeRange}&limit=${limit}`);
  return data?.items ?? [];
}

export async function getRecentlyPlayed(limit = 10): Promise<SpotifyRecentlyPlayedItem[]> {
  const data = await spotifyFetch<{ items: SpotifyRecentlyPlayedItem[] }>(`/me/player/recently-played?limit=${limit}`);
  return data?.items ?? [];
}

export function formatDuration(ms: number): string {
  const mins = Math.floor(ms / 60000);
  const secs = Math.floor((ms % 60000) / 1000);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
