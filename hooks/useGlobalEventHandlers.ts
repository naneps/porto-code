
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
}: UseGlobalEventHandlersProps) => {
  useEffect(() => {
    const handleGlobalClick = (event: MouseEvent) => {
        if (contextMenuVisible) {
            // Check if the click is outside any custom context menu.
            // This logic assumes custom context menus have a specific class or structure.
            // For simplicity, we'll rely on the context menu component itself to handle its closure
            // or for the Escape key to close it. This global click primarily handles
            // clicks that are NOT on a custom context menu, ensuring it closes.
            const customContextMenuSelectors = '.fixed.bg-\\[var\\(--menu-dropdown-background\\)\\]'; // Selector for our ContextMenu
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
      // Escape key
      if (event.key === 'Escape') {
        if (isCommandPaletteOpen) closeCommandPalette();
        if (isAboutModalOpen) closeAboutModal();
        if (contextMenuVisible) setContextMenuVisible(false);
        if (document.fullscreenElement) document.exitFullscreen().catch(err => console.error("Error exiting fullscreen:", err));
      }

      // Attempt to disable inspect element shortcuts
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
      // Attempt to disable view source (Ctrl+U / Cmd+U)
      if ((event.ctrlKey || event.metaKey) && (event.key === 'U' || event.key === 'u')) {
        event.preventDefault();
      }
    };

    const handleContextMenu = (event: MouseEvent) => {
      // Prevent the default browser context menu everywhere.
      // Specific components can still open custom context menus.
      event.preventDefault();
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
    setContextMenuVisible
  ]);
};
