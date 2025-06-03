
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Tab, PortfolioData, SidebarItemConfig, Command, ContextMenuItem } from './types';
import { PORTFOLIO_DATA, SIDEBAR_ITEMS, generateFileContent, generateProjectDetailContent, ICONS, REPO_URL } from './constants';
import { PREDEFINED_THEMES, FONT_FAMILY_OPTIONS, FONT_SIZE_OPTIONS } from './themes';
import Sidebar from './components/Sidebar';
import EditorTabs from './components/EditorTabs';
import TabContent from './components/TabContent';
import ActivityBar from './components/ActivityBar';
import TitleBar from './components/TitleBar/TitleBar';
import Breadcrumbs from './components/Breadcrumbs';
import CommandPalette from './components/CommandPalette';
import AboutModal from './components/AboutModal';
import ContextMenu from './components/ContextMenu';
import { useThemeManager } from './hooks/useThemeManager';
import { useTabHistory } from './hooks/useTabHistory';
import { useFullscreen } from './hooks/useFullscreen';
import { useGlobalEventHandlers } from './hooks/useGlobalEventHandlers';
import { generateCommands } from './utils/commandUtils';

// Simple placeholder component for diagnostics
const SimpleIconPlaceholder: React.FC<{size?: number; className?: string}> = ({ className }) => (
  <div style={{ width: 64, height: 64, backgroundColor: 'rgba(128,128,128,0.3)', border: '1px dashed grey', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: 'grey' }} className={className}>
    ICON
  </div>
);

const App: React.FC = () => {
  const [openTabs, setOpenTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [portfolioData] = useState<PortfolioData>(PORTFOLIO_DATA);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  const {
    currentThemeName,
    currentFontFamilyId,
    currentFontSizeId,
    handleThemeChange,
    handleFontFamilyChange,
    handleFontSizeChange,
  } = useThemeManager();

  const {
    tabHistory,
    currentHistoryIndex,
    updateTabHistoryOnActivation,
    navigateTabHistoryBack,
    navigateTabHistoryForward,
    cleanTabHistoryOnClose,
  } = useTabHistory(activeTabId, setActiveTabId);
  
  const { isFullscreen, handleToggleFullscreen } = useFullscreen();

  // Context Menu State
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [contextMenuItems, setContextMenuItems] = useState<ContextMenuItem[]>([]);

  const activeTabData = useMemo(() => openTabs.find(tab => tab.id === activeTabId), [openTabs, activeTabId]);

  useEffect(() => {
    const portfolioOwnerName = portfolioData.name;
    const appName = "PORTO CODE";

    if (activeTabData) {
      document.title = `${activeTabData.title} - ${portfolioOwnerName} | ${appName}`;
    } else {
      document.title = `${appName} - ${portfolioOwnerName}`;
    }
  }, [activeTabData, portfolioData.name]);

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
        fileName: item.fileName 
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
    
    const existingPreviewTab = openTabs.find(tab => tab.id === previewTabId);
    if (existingPreviewTab) {
        setActiveTabId(existingPreviewTab.id);
    } else {
        const newPreviewTab: Tab = {
            id: previewTabId,
            title: previewTabTitle,
            type: 'json_preview',
            fileName: originalFileId
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
        
        cleanTabHistoryOnClose(tabIdToClose, newActiveId); 
        setActiveTabId(newActiveId); 
        return newTabs;
    });
  }, [activeTabId, setActiveTabId, setOpenTabs, cleanTabHistoryOnClose]);

  useEffect(() => {
    if (activeTabId) {
        updateTabHistoryOnActivation(activeTabId);
    }
  }, [activeTabId, updateTabHistoryOnActivation]);


  const handleOpenAIChatTab = useCallback(() => {
    handleOpenTab({
      id: 'ai_chat_tab', 
      fileName: 'ai_chat_tab',
      title: 'AI Assistant',
      type: 'ai_chat',
    });
  }, [handleOpenTab]);

  const handleSelectExplorerView = useCallback(() => {
    if (activeTabId === 'ai_chat_tab') {
        setIsSidebarVisible(true);
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
            icon: ICONS.FileText || ICONS.default, 
        });
    }
    
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


  useGlobalEventHandlers({
    toggleSidebarVisibility,
    openCommandPalette,
    isCommandPaletteOpen,
    closeCommandPalette,
    isAboutModalOpen,
    closeAboutModal,
    contextMenuVisible,
    setContextMenuVisible,
  });


  const handleOpenProjectTab = useCallback((projectId: string, projectTitle: string) => {
    handleOpenTab({
        id: projectId,
        fileName: projectId, 
        title: projectTitle, 
        type: 'project_detail',
    });
  }, [handleOpenTab]);

  const handleSelectTab = useCallback((tabId: string) => {
    if (activeTabId !== tabId) {
      setActiveTabId(tabId); 
    }
  }, [activeTabId, setActiveTabId]);
  
  useEffect(() => {
    if (openTabs.length === 0 && activeTabId === null && SIDEBAR_ITEMS.length > 0) {
       const defaultItem = SIDEBAR_ITEMS.find(item => item.id === 'about.json') || SIDEBAR_ITEMS[0];
       if (defaultItem) handleOpenTab(defaultItem);
    }
  }, [openTabs, activeTabId, handleOpenTab]);


  
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
  
  const commands = useMemo<Command[]>(() => generateCommands({
    sidebarItems: SIDEBAR_ITEMS,
    handleOpenTab,
    closeCommandPalette,
    isSidebarVisible,
    toggleSidebarVisibility,
    handleOpenAIChatTab,
    openCommandPalette,
    predefinedThemes: PREDEFINED_THEMES,
    handleThemeChange,
    currentThemeName,
    fontFamilyOptions: FONT_FAMILY_OPTIONS,
    handleFontFamilyChange,
    currentFontFamilyId,
    fontSizeOptions: FONT_SIZE_OPTIONS,
    handleFontSizeChange,
    currentFontSizeId,
    openAboutModal,
    icons: ICONS,
  }), [
    handleOpenTab, closeCommandPalette, isSidebarVisible, toggleSidebarVisibility, handleOpenAIChatTab, openCommandPalette,
    handleThemeChange, currentThemeName, handleFontFamilyChange, currentFontFamilyId, handleFontSizeChange, currentFontSizeId,
    openAboutModal
  ]);


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
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
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
                  <SimpleIconPlaceholder className="mb-4" />
                  <p className="text-xl">No files open</p>
                  <p>Select a file from the explorer or open AI Assistant from Activity Bar.</p>
                </div>
              )}
            </div>
          </main>
          <footer className="bg-[var(--statusbar-background)] px-3 py-1.5 text-xs border-t border-[var(--statusbar-border)] flex justify-between items-center text-[var(--statusbar-foreground)]">
            <div className="flex items-center space-x-2">
                <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="flex items-center hover:bg-[var(--statusbar-item-hover-background)] p-0.5 rounded">
                    {ICONS.git_fork_icon ? <ICONS.git_fork_icon size={14} className="mr-1" /> : null}
                    <span>main*</span>
                </a>
            </div>
            <div className="flex items-center space-x-2">
                <span>Ln ?, Col ?</span>
                <span>Spaces: 2</span>
                <span>UTF-8</span>
                <span>CRLF</span>
                <button
                  title="Notifications (Not Implemented)"
                  aria-label="Notifications (Not Implemented)"
                  className="p-0.5 rounded hover:bg-[var(--statusbar-item-hover-background)] focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-offset-[var(--statusbar-background)] focus:ring-[var(--focus-border)]"
                >
                  {ICONS.bell_icon ? <ICONS.bell_icon size={14} /> : null}
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
