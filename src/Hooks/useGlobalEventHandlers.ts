import { useEffect } from 'react';

interface UseGlobalEventHandlersProps {
  toggleSidebarVisibility: () => void;
  openCommandPalette: () => void;
  isCommandPaletteOpen: boolean;
  closeCommandPalette: () => void;
  isAboutModalOpen: boolean;
  closeAboutModal: () => void;
  contextMenuVisible: boolean;
  setContextMenuVisible: (visible: boolean) => void;
  toggleTerminalVisibility: () => void; // Now toggles Terminal tab in bottom panel
  togglePetsPanelVisibility: () => void; // Now toggles Pets tab in bottom panel
  isDevModeEnabled?: boolean; 
}

export const useGlobalEventHandlers = ({
  toggleSidebarVisibility,
  openCommandPalette,
  isCommandPaletteOpen,
  closeCommandPalette,
  isAboutModalOpen,
  closeAboutModal,
  contextMenuVisible,
  setContextMenuVisible,
  toggleTerminalVisibility,
  togglePetsPanelVisibility,
  isDevModeEnabled,
}: UseGlobalEventHandlersProps) => {
  useEffect(() => {
    const handleGlobalClick = (event: MouseEvent) => {
        if (contextMenuVisible) {
            const customContextMenuSelectors = '.fixed.bg-\\[var\\(--menu-dropdown-background\\)\\]';
            const isClickInsideCustomMenu = (event.target as HTMLElement).closest(customContextMenuSelectors);

            if (!isClickInsideCustomMenu) {
                 setContextMenuVisible(false);
            }
        }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      // Toggle Sidebar
      if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
        event.preventDefault();
        toggleSidebarVisibility();
      }
      // Open Command Palette
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && (event.key === 'P' || event.key === 'p')) {
        event.preventDefault();
        openCommandPalette();
      }
      // Toggle Terminal Tab in Bottom Panel
      if ((event.ctrlKey || event.metaKey) && event.key === '`') {
        event.preventDefault();
        toggleTerminalVisibility(); // This now handles terminal tab logic
      }
      // Toggle Pets Panel Tab in Bottom Panel (Example shortcut, can be adjusted)
      if ((event.ctrlKey || event.metaKey) && event.altKey && event.shiftKey && (event.key === 'P' || event.key === 'p')) {
        event.preventDefault();
        togglePetsPanelVisibility(); // This now handles pets tab logic
      }

      // Escape key
      if (event.key === 'Escape') {
        if (isCommandPaletteOpen) closeCommandPalette();
        if (isAboutModalOpen) closeAboutModal();
        if (contextMenuVisible) setContextMenuVisible(false);
        if (document.fullscreenElement) document.exitFullscreen().catch(err => console.error("Error exiting fullscreen:", err));
      }

      // Prevent default browser developer tools only if Dev Mode is NOT enabled
      if (!isDevModeEnabled) {
        if (event.key === 'F12') {
          event.preventDefault();
        }
        if ((event.ctrlKey || event.metaKey) && event.shiftKey) {
          if (event.key === 'I' || event.key === 'i' ||
              event.key === 'J' || event.key === 'j' ||
              event.key === 'C' || event.key === 'c') {
            event.preventDefault();
          }
        }
        if ((event.ctrlKey || event.metaKey) && (event.key === 'U' || event.key === 'u')) {
          event.preventDefault();
        }
      }
    };

    const handleContextMenu = (event: MouseEvent) => {
      // Prevent default context menu only if Dev Mode is NOT enabled
      if (!isDevModeEnabled) {
        event.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleGlobalClick);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('click', handleGlobalClick);
        document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [
    toggleSidebarVisibility,
    openCommandPalette,
    isCommandPaletteOpen,
    closeCommandPalette,
    isAboutModalOpen,
    closeAboutModal,
    contextMenuVisible,
    setContextMenuVisible,
    toggleTerminalVisibility,
    togglePetsPanelVisibility,
    isDevModeEnabled, // Added isDevModeEnabled to dependency array
  ]);
};