// utils/audioUtils.ts

// MASTER CONTROL FOR SOUNDS
const SOUNDS_ENABLED = true; // Set to true if you have sound files in /public/sounds/

let isMuted = false;
// Cache Audio objects to avoid re-creating them every time and to allow quick replay.
const audioCache: { [key: string]: HTMLAudioElement } = {};

// Define sound file paths. These point to actual .wav or .mp3 files
// expected to be in a /public/sounds directory.
const SOUND_FILES: { [key: string]: string } = {
  'tab-open': '/sounds/ui_tab_open.wav',
  'tab-close': '/sounds/ui_tab_close.wav',
  'tab-select': '/sounds/ui_tab_select.wav',
  'ui-click': '/sounds/ui_generic_click.wav',
  'panel-toggle': '/sounds/ui_panel_toggle.wav',
  'modal-toggle': '/sounds/ui_modal_toggle.wav',
  'chat-receive': '/sounds/chat_message_receive.wav',
  'terminal-run': '/sounds/terminal_command_run.wav',
  'terminal-complete': '/sounds/terminal_command_complete.wav',
  'setting-change': '/sounds/ui_setting_change.wav',
  'command-execute': '/sounds/ui_command_execute.wav',
  'error': '/sounds/ui_error.wav',
  'notification': '/sounds/ui_notification.wav', // General notification/alert
};

/**
 * Plays a sound effect by its logical name.
 * @param soundName The logical name of the sound to play.
 */
export function playSound(soundName: string): void {
  if (!SOUNDS_ENABLED) {
    // console.log(`Sounds disabled. Would play: ${soundName}`);
    return;
  }
  if (isMuted) {
    // console.log(`Sound muted. Would play: ${soundName}`);
    return;
  }

  const soundFile = SOUND_FILES[soundName];
  if (!soundFile) {
    console.warn(`Sound effect not found: ${soundName}`);
    return;
  }

  // console.log(`%cAttempting to play sound: ${soundName} (from ${soundFile})`, 'color: #22aadd;');

  try {
    let audio = audioCache[soundName];
    if (audio) {
      audio.currentTime = 0; // Rewind to start if playing again
    } else {
      // Assumes files are in public/sounds. The leading '/' makes it relative to the domain root.
      audio = new Audio(soundFile);
      audioCache[soundName] = audio;
    }
    // Play returns a Promise which can be used to catch errors if playback fails.
    audio.play().catch(e => {
        // Autoplay restrictions might prevent sound from playing without user interaction.
        // Or the file might not be found (404).
        console.error(`Error playing sound ${soundName} from ${soundFile}:`, e);
        // Attempt to inform the user if it's an autoplay issue or file not found.
        if (e.name === 'NotAllowedError') {
            console.warn("Audio playback was prevented. This might be due to browser autoplay restrictions. User interaction might be required to enable sound.");
        } else if (e.name === 'AbortError' && audio.error?.code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED) {
             console.error(`Audio file not found or format not supported for ${soundFile}. Ensure the file exists at the correct path and is a supported format.`);
        }
    });
  } catch (error) {
    console.error(`Error initializing or playing sound ${soundName}:`, error);
  }
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
    // Play a sound when unmuting, but not when muting to avoid sound when user wants silence.
    if (SOUNDS_ENABLED) playSound('ui-click'); 
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
if (SOUNDS_ENABLED && isMuted) { // Only log if sounds are enabled but muted
    console.log("Sound effects are currently MUTED (loaded from previous session).");
} else if (!SOUNDS_ENABLED) {
    console.log("Sound effects are globally DISABLED via SOUNDS_ENABLED flag.");
}
