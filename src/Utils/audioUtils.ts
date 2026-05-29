// utils/audioUtils.ts

// MASTER CONTROL FOR SOUNDS
const SOUNDS_ENABLED = true;

let isMuted = false;

// Web Audio API context (created lazily on first user interaction)
let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (!audioContext) {
    try {
      // @ts-ignore - for older browsers
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioContext = new AudioContextClass();
      }
    } catch (e) {
      console.warn('Web Audio API not supported in this browser.');
      return null;
    }
  }
  return audioContext;
}

// Synthetic sound definitions for all sound names used across the app.
// These use simple oscillators for reliable, lightweight UI feedback without external files.
interface SoundPreset {
  type: OscillatorType;
  frequency: number;
  duration: number;
  volume?: number;
  frequencyEnd?: number; // For frequency sweep effects
  delay?: number;
}

const SYNTHETIC_SOUNDS: { [key: string]: SoundPreset | SoundPreset[] } = {
  // Most common UI interactions
  'ui-click': { type: 'square', frequency: 820, duration: 35, volume: 0.12 },
  
  // Tab operations (slightly different flavors)
  'tab-open': { type: 'sine', frequency: 680, duration: 55, volume: 0.15 },
  'tab-close': { type: 'sine', frequency: 520, duration: 60, volume: 0.13 },
  'tab-select': { type: 'square', frequency: 880, duration: 28, volume: 0.1 },
  
  // Panel / sidebar toggles
  'panel-toggle': { type: 'sine', frequency: 610, duration: 70, volume: 0.14 },
  
  // Modals and command palette
  'modal-toggle': { type: 'sine', frequency: 750, duration: 80, volume: 0.16 },
  
  // Terminal actions
  'terminal-run': { type: 'sawtooth', frequency: 420, duration: 90, volume: 0.11 },
  'terminal-complete': [
    { type: 'sine', frequency: 680, duration: 60, volume: 0.13 },
    { type: 'sine', frequency: 920, duration: 70, volume: 0.11, delay: 55 }
  ],
  
  // Settings / theme changes (positive confirmation feel)
  'setting-change': { type: 'sine', frequency: 780, duration: 65, volume: 0.14 },
  
  // Command / run actions
  'command-execute': { type: 'square', frequency: 640, duration: 48, volume: 0.12 },
  
  // Error / warning feedback (lower, harsher)
  'error': { type: 'sawtooth', frequency: 180, duration: 120, volume: 0.18 },
  
  // Chat / notification sounds (gentle)
  'chat-receive': { type: 'sine', frequency: 880, duration: 90, volume: 0.15 },
  'notification': { type: 'sine', frequency: 920, duration: 75, volume: 0.16 },
};

/**
 * Plays a short synthetic tone using Web Audio API.
 * Falls back silently if AudioContext is unavailable.
 */
function playSyntheticSound(preset: SoundPreset | SoundPreset[]): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  // Resume context if it was suspended (required by autoplay policy)
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }

  const playOne = (p: SoundPreset, startTimeOffset = 0) => {
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = p.type;
      osc.frequency.value = p.frequency;

      // Light low-pass filter for softer UI sounds
      filter.type = 'lowpass';
      filter.frequency.value = 2200;

      // Volume envelope
      const volume = p.volume ?? 0.12;
      gain.gain.value = volume;

      // Simple attack/decay envelope
      const now = ctx.currentTime + startTimeOffset / 1000;
      gain.gain.setValueAtTime(volume, now);
      gain.gain.linearRampToValueAtTime(0.0001, now + p.duration / 1000 + 0.03);

      // Optional frequency sweep (nice for some sounds)
      if (p.frequencyEnd) {
        osc.frequency.setValueAtTime(p.frequency, now);
        osc.frequency.linearRampToValueAtTime(p.frequencyEnd, now + p.duration / 1000);
      }

      // Connect graph
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + p.duration / 1000 + 0.06);
    } catch (e) {
      // Fail silently — sound is non-critical
    }
  };

  if (Array.isArray(preset)) {
    preset.forEach(p => playOne(p, p.delay ?? 0));
  } else {
    playOne(preset);
  }
}

/**
 * Plays a sound effect by its logical name.
 * Uses synthetic Web Audio tones for reliable feedback without external assets.
 */
export function playSound(soundName: string): void {
  if (!SOUNDS_ENABLED) return;
  if (isMuted) return;

  const preset = SYNTHETIC_SOUNDS[soundName];
  if (!preset) {
    // Unknown sound name — do nothing (keeps behavior consistent with before)
    return;
  }

  playSyntheticSound(preset);
}

/**
 * Toggles the global mute state for sound effects.
 * @returns The new mute state (true if muted, false if unmuted).
 */
export function toggleMute(): boolean {
  isMuted = !isMuted;
  if (isMuted) {
    console.log("Sound effects MUTED.");
  } else {
    console.log("Sound effects UNMUTED.");
    // Play a soft confirmation when unmuting (user just clicked something, so gesture exists)
    if (SOUNDS_ENABLED) {
      // Use a very short safe sound
      setTimeout(() => playSound('ui-click'), 10);
    }
  }
  try {
    localStorage.setItem('portfolio-soundMuted', JSON.stringify(isMuted));
  } catch (e) {
    console.warn("Could not save mute status to localStorage", e);
  }
  return isMuted;
}

/**
 * Gets the current mute status.
 * Initializes mute status from localStorage if available.
 * @returns True if sounds are muted, false otherwise.
 */
export function getMuteStatus(): boolean {
  try {
    const storedMute = localStorage.getItem('portfolio-soundMuted');
    if (storedMute !== null) {
      isMuted = JSON.parse(storedMute);
    }
  } catch (e) {
    console.warn("Could not retrieve mute status from localStorage", e);
    // isMuted remains its default (false) or last set value.
  }
  return isMuted;
}

// Initialize mute status on load
isMuted = getMuteStatus();
if (SOUNDS_ENABLED && isMuted) {
    console.log("Sound effects are currently MUTED (loaded from previous session).");
} else if (!SOUNDS_ENABLED) {
    console.log("Sound effects are globally DISABLED via SOUNDS_ENABLED flag.");
}

// Warm up AudioContext on first user interaction (helps bypass autoplay policies)
if (SOUNDS_ENABLED) {
  const warmUp = () => {
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    // Remove listeners after first interaction
    document.removeEventListener('click', warmUp);
    document.removeEventListener('keydown', warmUp);
    document.removeEventListener('touchstart', warmUp);
  };
  document.addEventListener('click', warmUp, { once: true, passive: true });
  document.addEventListener('keydown', warmUp, { once: true, passive: true });
  document.addEventListener('touchstart', warmUp, { once: true, passive: true });
}