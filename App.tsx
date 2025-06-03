
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Tab, PortfolioData, SidebarItemConfig, Command, Theme, FontFamilyOption, FontSizeOption, ContextMenuItem } from './types';
import { PORTFOLIO_DATA, SIDEBAR_ITEMS, generateFileContent, generateProjectDetailContent, ICONS, REPO_URL } from './constants';
import { generateCSSVariables, PREDEFINED_THEMES, FONT_FAMILY_OPTIONS, FONT_SIZE_OPTIONS, DEFAULT_THEME_NAME, DEFAULT_FONT_FAMILY_ID, DEFAULT_FONT_SIZE_ID } from './themes';
import Sidebar from './components/Sidebar';
import EditorTabs from './components/EditorTabs';
import TabContent from './components/TabContent';
import ActivityBar from './components/ActivityBar';
import TitleBar from './components/TitleBar';
import Breadcrumbs from './components/Breadcrumbs'; 
import CommandPalette from './components/CommandPalette';
import AboutModal from './components/AboutModal';
import ContextMenu from './components/ContextMenu'; // Import ContextMenu
import { EyeOff, Command as CommandIcon, Eye, Check, Bot as BotIcon, FileText, Files } from 'lucide-react';

const App: React.FC = () => {
  const [openTabs, setOpenTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [portfolioData] = useState<PortfolioData>(PORTFOLIO_DATA);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  const [tabHistory, setTabHistory] = useState<string[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState<number>(-1);

  // Theme state
  const [currentThemeName, setCurrentThemeName] = useState<string>(() => localStorage.getItem('portfolio-theme') || DEFAULT_THEME_NAME);
  const [currentFontFamilyId, setCurrentFontFamilyId] = useState<string>(() => localStorage.getItem('portfolio-font-family') || DEFAULT_FONT_FAMILY_ID);
  const [currentFontSizeId, setCurrentFontSizeId] = useState<string>(() => localStorage.getItem('portfolio-font-size') || DEFAULT_FONT_SIZE_ID);
  
  // Context Menu State
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [contextMenuItems, setContextMenuItems] = useState<ContextMenuItem[]>([]);

  useEffect(() => {
    const selectedTheme = PREDEFINED_THEMES.find(theme => theme.name === currentThemeName) || PREDEFINED_THEMES[0];
    const selectedFontFamily = FONT_FAMILY_OPTIONS.find(font => font.id === currentFontFamilyId) || FONT_FAMILY_OPTIONS[0];
    const selectedFontSize = FONT_SIZE_OPTIONS.find(size => size.id === currentFontSizeId) || FONT_SIZE_OPTIONS[1];

    let cssVars = generateCSSVariables(selectedTheme.properties);
    cssVars += `\n--editor-font-family: ${selectedFontFamily.value};`;
    cssVars += `\n--editor-font-size: ${selectedFontSize.value};`;
    cssVars += `\n--editor-line-height: ${selectedFontSize.lineHeight || '1.5'};`;
    
    const styleElement = document.getElementById('dynamic-theme-styles');
    if (styleElement) {
        styleElement.innerHTML = `:root {\n${cssVars}\n}`;
    } else {
        const newStyleElement = document.createElement('style');
        newStyleElement.id = 'dynamic-theme-styles';
        newStyleElement.innerHTML = `:root {\n${cssVars}\n}`;
        document.head.appendChild(newStyleElement);
    }

    localStorage.setItem('portfolio-theme', currentThemeName);
    localStorage.setItem('portfolio-font-family', currentFontFamilyId);
    localStorage.setItem('portfolio-font-size', currentFontSizeId);

  }, [currentThemeName, currentFontFamilyId, currentFontSizeId]);


  const handleThemeChange = useCallback((themeName: string) => setCurrentThemeName(themeName), []);
  const handleFontFamilyChange = useCallback((fontId: string) => setCurrentFontFamilyId(fontId), []);
  const handleFontSizeChange = useCallback((sizeId: string) => setCurrentFontSizeId(sizeId), []);

  const toggleSidebarVisibility = useCallback(() => setIsSidebarVisible(prev => !prev), []);
  
  const openCommandPalette = useCallback(() => setIsCommandPaletteOpen(true), []);
  const closeCommandPalette = useCallback(() => setIsCommandPaletteOpen(false), []);
  const openAboutModal = useCallback(() => setIsAboutModalOpen(true), []);
  const closeAboutModal = useCallback(() => setIsAboutModalOpen(false), []);

  const handleOpenTab = useCallback((item: SidebarItemConfig | { id?: string, fileName: string, type?: Tab['type'], title?: string, originalFileIdForPreview?: string } ) => {
    const tabId = ('id' in item && typeof item.id === 'string') ? item.id : item.fileName; 
    const existingTab = openTabs.find(tab => tab.id === tabId);
    
    if (existingTab) {
      setActiveTabId(existingTab.id);
    } else {
      let newTabDisplayTitle: string = ('title' in item && typeof item.title === 'string') ? item.title : item.fileName;
      const newTab: Tab = { 
        id: tabId, 
        title: newTabDisplayTitle, 
        type: item.type || 'file',
        fileName: item.fileName // Store original fileName, useful for previews
      };
      setOpenTabs(prevTabs => [...prevTabs, newTab]);
      setActiveTabId(newTab.id);
    }
  }, [openTabs, setActiveTabId, setOpenTabs]);
  
  const handleOpenPreviewTab = useCallback((originalFileId: string) => {
    const originalFileItem = SIDEBAR_ITEMS.find(item => item.fileName === originalFileId);
    if (!originalFileItem) return;

    const previewTabId = `${originalFileId}_preview`;
    const previewTabTitle = `Preview: ${originalFileItem.fileName}`;
    
    // Check if preview tab already open
    const existingPreviewTab = openTabs.find(tab => tab.id === previewTabId);
    if (existingPreviewTab) {
        setActiveTabId(existingPreviewTab.id);
    } else {
        const newPreviewTab: Tab = {
            id: previewTabId,
            title: previewTabTitle,
            type: 'json_preview',
            fileName: originalFileId // Store original filename
        };
        setOpenTabs(prevTabs => [...prevTabs, newPreviewTab]);
        setActiveTabId(newPreviewTab.id);
    }
  }, [openTabs, setActiveTabId, setOpenTabs]);


  const handleCloseTab = useCallback((tabIdToClose: string) => {
    setOpenTabs(prevTabs => {
        const tabIndexToClose = prevTabs.findIndex(tab => tab.id === tabIdToClose);
        const newTabs = prevTabs.filter(tab => tab.id !== tabIdToClose);

        let newActiveId: string | null = null;
        if (activeTabId === tabIdToClose) {
            if (newTabs.length > 0) {
                if (tabIndexToClose < newTabs.length) {
                    newActiveId = newTabs[tabIndexToClose].id;
                } else if (tabIndexToClose - 1 >= 0 && tabIndexToClose - 1 < newTabs.length) {
                    newActiveId = newTabs[tabIndexToClose - 1].id;
                } else {
                    newActiveId = newTabs[newTabs.length - 1].id;
                }
            }
        } else {
            newActiveId = activeTabId;
        }
        setActiveTabId(newActiveId); // This will trigger history useEffect
        
        // History needs to be cleaned of the closed tab
        setTabHistory(prevHistory => {
            const filteredHistory = prevHistory.filter(id => id !== tabIdToClose);
            // If the newActiveId was part of the history, currentHistoryIndex should point to it
            // Otherwise, if newActiveId is null (no tabs left), index should be -1
            // Or if newActiveId is not in filteredHistory (should not happen if logic is correct), adjust.
            if (newActiveId) {
                const newIdx = filteredHistory.indexOf(newActiveId);
                setCurrentHistoryIndex(newIdx !== -1 ? newIdx : filteredHistory.length - 1);
            } else {
                setCurrentHistoryIndex(filteredHistory.length > 0 ? filteredHistory.length - 1 : -1);
            }
            return filteredHistory;
        });
        return newTabs;
    });
  }, [activeTabId, setActiveTabId, setOpenTabs, setTabHistory, setCurrentHistoryIndex]);

  const handleOpenAIChatTab = useCallback(() => {
    handleOpenTab({
      id: 'ai_chat_tab', 
      fileName: 'ai_chat_tab', // Not a real file, but helps identify
      title: 'AI Assistant',
      type: 'ai_chat',
    });
  }, [handleOpenTab]);

  const handleSelectExplorerView = useCallback(() => {
    if (activeTabId === 'ai_chat_tab') {
        setIsSidebarVisible(true);
        // Closing AI tab might activate another tab, let handleCloseTab manage history.
        const aiTab = openTabs.find(t => t.id === 'ai_chat_tab');
        if (aiTab) handleCloseTab('ai_chat_tab'); 
    } else {
        setIsSidebarVisible(prev => !prev);
    }
  }, [activeTabId, handleCloseTab, openTabs]);

  const handleContextMenuRequest = useCallback((x: number, y: number, tabIdForContext: string) => {
    const targetTab = openTabs.find(t => t.id === tabIdForContext);
    if (!targetTab) {
        setContextMenuVisible(false);
        return;
    }

    const menuItems: ContextMenuItem[] = [];
    const eligibleForPreview = ['about.json', 'experience.json', 'skills.json', 'contact.json'].includes(targetTab.id);

    if (targetTab.type === 'file' && eligibleForPreview) {
        menuItems.push({
            label: 'Show Preview in New Tab',
            action: () => {
                handleOpenPreviewTab(targetTab.id); 
                setContextMenuVisible(false);
            },
            icon: FileText, 
        });
    }
    
    // Common context menu item for all tabs
     menuItems.push({ 
        label: `Close ${targetTab.title}`, 
        action: () => { handleCloseTab(targetTab.id); setContextMenuVisible(false); }, 
        icon: ICONS.x_icon 
    });


    if (menuItems.length > 0) {
        setContextMenuItems(menuItems);
        setContextMenuPosition({ x, y });
        setContextMenuVisible(true);
    } else {
        setContextMenuVisible(false);
    }
  }, [openTabs, handleOpenPreviewTab, handleCloseTab]);

  // Tab history management
  useEffect(() => {
    if (activeTabId) {
        // This effect runs when activeTabId changes.
        // It ensures the tabHistory is updated correctly for new navigations.
        setTabHistory(prevHistory => {
            const newHistoryBase = prevHistory.slice(0, currentHistoryIndex + 1);
            if (newHistoryBase[newHistoryBase.length - 1] !== activeTabId) {
                newHistoryBase.push(activeTabId);
            }
            return newHistoryBase;
        });
        setCurrentHistoryIndex(prevIndex => {
            // This uses tabHistory from the App scope (which might be from the previous render cycle if setTabHistory hasn't flushed)
            // and prevIndex (which is currentHistoryIndex from the App scope).
            // The goal is to set currentHistoryIndex to the index of activeTabId in the *newly updated* tabHistory.
            const historySliceForIndex = tabHistory.slice(0, prevIndex + 1);
            if (historySliceForIndex[historySliceForIndex.length - 1] !== activeTabId) {
                // activeTabId was (or will be) pushed to historySliceForIndex
                return historySliceForIndex.length; 
            }
            // activeTabId is already in historySliceForIndex (or is the head)
            const foundIndex = historySliceForIndex.indexOf(activeTabId);
            return foundIndex !== -1 ? foundIndex : (prevIndex === -1 && activeTabId ? 0 : prevIndex) ;
        });
    }
  }, [activeTabId, tabHistory]); // Dependencies from original code. currentHistoryIndex is implicitly part of this via closures.


  const navigateTabHistoryBack = useCallback(() => {
    if (currentHistoryIndex > 0) {
      const newIndex = currentHistoryIndex - 1;
      // Set activeTabId first, then currentHistoryIndex.
      // The useEffect for history will see the new activeTabId and the old currentHistoryIndex.
      // It should correctly identify this as a navigation within existing history.
      setActiveTabId(tabHistory[newIndex]); 
      setCurrentHistoryIndex(newIndex);
    }
  }, [currentHistoryIndex, tabHistory, setActiveTabId, setCurrentHistoryIndex]);

  const navigateTabHistoryForward = useCallback(() => {
    if (currentHistoryIndex < tabHistory.length - 1) {
      const newIndex = currentHistoryIndex + 1;
      setActiveTabId(tabHistory[newIndex]);
      setCurrentHistoryIndex(newIndex);
    }
  }, [currentHistoryIndex, tabHistory, setActiveTabId, setCurrentHistoryIndex]);

  useEffect(() => {
    const handleGlobalClick = (event: MouseEvent) => {
        if (contextMenuVisible) {
            // Check if the click is outside the context menu itself
            const contextMenuElement = document.querySelector('.fixed.bg-\\[var\\(--menu-dropdown-background\\)\\]'); // A selector for your context menu
            if (contextMenuElement && !contextMenuElement.contains(event.target as Node)) {
              setContextMenuVisible(false);
            } else if (!contextMenuElement) { // Failsafe if selector is bad
              setContextMenuVisible(false);
            }
        }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'b') { 
        event.preventDefault();
        toggleSidebarVisibility();
      }
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && (event.key === 'P' || event.key === 'p')) { 
        event.preventDefault();
        openCommandPalette();
      }
      if (event.key === 'Escape') {
        if (isCommandPaletteOpen) closeCommandPalette();
        if (isAboutModalOpen) closeAboutModal();
        if (contextMenuVisible) setContextMenuVisible(false);
      }
    };

    const handleGlobalContextMenu = (event: MouseEvent) => {
        event.preventDefault();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleGlobalClick);
    document.addEventListener('contextmenu', handleGlobalContextMenu);
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('click', handleGlobalClick);
        document.removeEventListener('contextmenu', handleGlobalContextMenu);
    };
  }, [toggleSidebarVisibility, openCommandPalette, isCommandPaletteOpen, closeCommandPalette, isAboutModalOpen, closeAboutModal, contextMenuVisible]);


  const handleOpenProjectTab = useCallback((projectId: string, projectTitle: string) => {
    handleOpenTab({
        id: projectId,
        fileName: projectId, // Treat it like a file name for consistency
        title: projectTitle, // Use a more descriptive title
        type: 'project_detail',
    });
  }, [handleOpenTab]);

  const handleSelectTab = useCallback((tabId: string) => {
    if (activeTabId !== tabId) {
      setActiveTabId(tabId); // This will trigger the history useEffect
    }
  }, [activeTabId, setActiveTabId]);
  
  useEffect(() => {
    if (openTabs.length === 0 && activeTabId === null && SIDEBAR_ITEMS.length > 0) {
       const defaultItem = SIDEBAR_ITEMS.find(item => item.id === 'about.json') || SIDEBAR_ITEMS[0];
       if (defaultItem) handleOpenTab(defaultItem);
    }
  }, [openTabs, activeTabId, handleOpenTab]); // Added handleOpenTab to dependencies


  const activeTabData = openTabs.find(tab => tab.id === activeTabId);
  let contentToDisplay = ""; 
  if (activeTabData) {
    if (activeTabData.type === 'project_detail') {
      contentToDisplay = generateProjectDetailContent(activeTabData.id, portfolioData);
    } else if (activeTabData.type === 'file') {
      contentToDisplay = generateFileContent(activeTabData.id, portfolioData);
    } else if (activeTabData.type === 'json_preview' && activeTabData.fileName) {
      contentToDisplay = generateFileContent(activeTabData.fileName, portfolioData);
    }
  }
  
  const commands = useMemo<Command[]>(() => {
    const allCommands: Command[] = [];
     // File commands
    SIDEBAR_ITEMS.forEach(item => {
        allCommands.push({
            id: `open_${item.fileName}`,
            label: `Go to File: ${item.fileName}`,
            action: () => { handleOpenTab(item); closeCommandPalette(); },
            icon: item.icon,
            group: "Go to File",
        });
    });
    // General commands
    allCommands.push({
        id: 'toggle_sidebar',
        label: isSidebarVisible ? 'Hide Sidebar' : 'Show Sidebar',
        action: () => { toggleSidebarVisibility(); closeCommandPalette(); },
        icon: isSidebarVisible ? EyeOff : Eye,
        group: "View",
    });
    allCommands.push({
        id: 'open_ai_chat',
        label: 'Open AI Assistant',
        action: () => { handleOpenAIChatTab(); closeCommandPalette(); },
        icon: BotIcon,
        group: "View",
    });
    allCommands.push({
        id: 'command_palette', // To re-open itself, though usually not needed if already open
        label: 'Command Palette',
        action: () => { closeCommandPalette(); openCommandPalette(); }, // Close then open to refresh if needed
        icon: CommandIcon,
        group: "View",
    });
     // Theme commands
    PREDEFINED_THEMES.forEach(theme => {
        allCommands.push({
            id: `theme_${theme.name.toLowerCase().replace(/\s+/g, '_')}`,
            label: `Theme: ${theme.name}`,
            action: () => { handleThemeChange(theme.name); closeCommandPalette(); },
            icon: ICONS.theme_command,
            group: "Preferences: Theme",
            value: theme.name,
            isSelected: currentThemeName === theme.name,
        });
    });
    // Font family commands
    FONT_FAMILY_OPTIONS.forEach(font => {
        allCommands.push({
            id: `font_family_${font.id}`,
            label: `Font: ${font.label}`,
            action: () => { handleFontFamilyChange(font.id); closeCommandPalette(); },
            icon: ICONS.font_command,
            group: "Preferences: Font Family",
            value: font.id,
            isSelected: currentFontFamilyId === font.id,
        });
    });
    // Font size commands
    FONT_SIZE_OPTIONS.forEach(size => {
        allCommands.push({
            id: `font_size_${size.id}`,
            label: `Font Size: ${size.label}`,
            action: () => { handleFontSizeChange(size.id); closeCommandPalette(); },
            icon: ICONS.font_command, // Consider a specific size icon
            group: "Preferences: Font Size",
            value: size.id,
            isSelected: currentFontSizeId === size.id,
        });
    });
    allCommands.push({
        id: 'about_portfolio',
        label: 'About Portfolio',
        action: () => { openAboutModal(); closeCommandPalette(); },
        icon: ICONS.about_portfolio,
        group: "Help",
    });
    return allCommands;
  }, [handleOpenTab, toggleSidebarVisibility, openAboutModal, closeCommandPalette, isSidebarVisible, handleThemeChange, currentThemeName, handleFontFamilyChange, currentFontFamilyId, handleFontSizeChange, currentFontSizeId, openCommandPalette, handleOpenAIChatTab]);


  const canNavigateBack = currentHistoryIndex > 0;
  const canNavigateForward = currentHistoryIndex < tabHistory.length - 1 && tabHistory.length > 0;

  return (
    <div className="flex flex-col h-screen bg-[var(--app-background)] text-[var(--text-default)]" style={{ fontFamily: 'var(--editor-font-family)', fontSize: 'var(--editor-font-size)', lineHeight: 'var(--editor-line-height)' }}>
      <TitleBar 
        onToggleSidebar={toggleSidebarVisibility}
        isSidebarVisible={isSidebarVisible}
        onOpenCommandPalette={openCommandPalette}
        onOpenAboutModal={openAboutModal}
        canNavigateBack={canNavigateBack}
        canNavigateForward={canNavigateForward}
        onNavigateBack={navigateTabHistoryBack}
        onNavigateForward={navigateTabHistoryForward}
        themes={PREDEFINED_THEMES}
        currentThemeName={currentThemeName}
        onThemeChange={handleThemeChange}
        fontFamilies={FONT_FAMILY_OPTIONS}
        currentFontFamilyId={currentFontFamilyId}
        onFontFamilyChange={handleFontFamilyChange}
        fontSizes={FONT_SIZE_OPTIONS}
        currentFontSizeId={currentFontSizeId}
        onFontSizeChange={handleFontSizeChange}
      />
      <div className="flex flex-1 overflow-hidden">
        <ActivityBar 
          onSelectExplorerView={handleSelectExplorerView}
          onOpenAIChat={handleOpenAIChatTab}
          activeViewId={activeTabId === 'ai_chat_tab' ? 'ai_chat_tab' : (isSidebarVisible ? 'explorer' : null)}
        />
        <Sidebar 
          items={SIDEBAR_ITEMS} 
          onOpenTab={handleOpenTab} 
          isVisible={isSidebarVisible} 
          activeTabId={activeTabId}
        />
        <div className="flex flex-col flex-1 min-w-0"> 
          <EditorTabs
            tabs={openTabs}
            activeTabId={activeTabId}
            onSelectTab={handleSelectTab}
            onCloseTab={handleCloseTab}
            onContextMenuRequest={handleContextMenuRequest} 
          />
          <Breadcrumbs 
            activeTab={activeTabData} 
            portfolioData={portfolioData} 
            onOpenTab={(fileName) => {
                const itemToOpen = SIDEBAR_ITEMS.find(item => item.fileName === fileName);
                if(itemToOpen) handleOpenTab(itemToOpen);
            }}
          />
          <main className="flex-1 p-0 overflow-hidden bg-[var(--editor-background)] relative">
             <div key={activeTabId || 'empty-tab-placeholder'} className="animate-fadeIn h-full w-full overflow-auto">
              {activeTabData ? (
                <TabContent
                  key={activeTabData.id} 
                  tab={activeTabData}
                  content={contentToDisplay} 
                  portfolioData={portfolioData}
                  onOpenProjectTab={handleOpenProjectTab}
                  currentThemeName={currentThemeName}
                  onContextMenuRequest={handleContextMenuRequest}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-[var(--text-muted)] p-4">
                  <ICONS.terminal_square_icon size={64} className="mb-4" />
                  <p className="text-xl">No files open</p>
                  <p>Select a file from the explorer or open AI Assistant from Activity Bar.</p>
                </div>
              )}
            </div>
          </main>
          <footer className="bg-[var(--statusbar-background)] px-3 py-1.5 text-xs border-t border-[var(--statusbar-border)] flex justify-between items-center text-[var(--statusbar-foreground)]">
            <div className="flex items-center space-x-2">
                <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="flex items-center hover:bg-[var(--statusbar-item-hover-background)] p-0.5 rounded">
                    <ICONS.git_fork_icon size={14} className="mr-1" />
                    <span>main*</span>
                </a>
                {/* Add more status bar items here */}
            </div>
            <div className="flex items-center space-x-2">
                <span>Ln ?, Col ?</span> {/* Placeholder for line/col */}
                <span>Spaces: 2</span>
                <span>UTF-8</span>
                <span>CRLF</span>
                <button
                  title="Notifications (Not Implemented)"
                  aria-label="Notifications (Not Implemented)"
                  className="p-0.5 rounded hover:bg-[var(--statusbar-item-hover-background)] focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-offset-[var(--statusbar-background)] focus:ring-[var(--focus-border)]"
                  // onClick={() => console.log("Notifications clicked (not implemented)")} // Placeholder for future functionality
                >
                  <ICONS.bell_icon size={14} />
                </button>
            </div>
          </footer>
        </div>
      </div>
      {isCommandPaletteOpen && ( <CommandPalette isOpen={isCommandPaletteOpen} onClose={closeCommandPalette} commands={commands} /> )}
      {isAboutModalOpen && ( <AboutModal isOpen={isAboutModalOpen} onClose={closeAboutModal} /> )}
      <ContextMenu 
        x={contextMenuPosition.x}
        y={contextMenuPosition.y}
        items={contextMenuItems}
        visible={contextMenuVisible}
        onClose={() => setContextMenuVisible(false)}
      />
    </div>
  );
};

export default App;
