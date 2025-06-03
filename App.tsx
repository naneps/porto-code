
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Tab, PortfolioData, SidebarItemConfig, Command, ContextMenuItem, ActivityBarSelection, SearchResultItem, Theme, FontFamilyOption, FontSizeOption, ArticleItem } from './types';
import { PORTFOLIO_DATA, SIDEBAR_ITEMS as DEFAULT_SIDEBAR_ITEMS, generateFileContent, generateProjectDetailContent, ICONS, REPO_URL, APP_VERSION, SAMPLE_ARTICLES } from './constants';
import { PREDEFINED_THEMES, FONT_FAMILY_OPTIONS, FONT_SIZE_OPTIONS } from './themes';
import TitleBar from './components/TitleBar/TitleBar';
import ActivityBar from './components/ActivityBar';
import Sidebar from './components/Sidebar';
import EditorTabs from './components/EditorTabs';
import TabContent from './components/TabContent';
import Breadcrumbs from './components/Breadcrumbs';
import CommandPalette from './components/CommandPalette';
import AboutModal from './components/AboutModal';
import ContextMenu from './components/ContextMenu';
import WelcomeView from './components/WelcomeView';
import SearchPanel from './components/SearchPanel';
import ArticlesPanel from './components/ArticlesPanel';

import { useThemeManager } from './hooks/useThemeManager';
import { useTabHistory } from './hooks/useTabHistory';
import { useFullscreen } from './hooks/useFullscreen';
import { useGlobalEventHandlers } from './hooks/useGlobalEventHandlers';
import { generateCommands } from './utils/commandUtils';


const App: React.FC = () => {
  const {
    currentThemeName,
    currentFontFamilyId,
    currentFontSizeId,
    handleThemeChange,
    handleFontFamilyChange,
    handleFontSizeChange,
  } = useThemeManager();

  const [openTabs, setOpenTabs] = useState<Tab[]>(() => {
    const saved = localStorage.getItem('portfolio-openTabs');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTabId, setActiveTabIdState] = useState<string | null>(() => {
    return localStorage.getItem('portfolio-activeTabId') || null;
  });

  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(() => {
    const saved = localStorage.getItem('portfolio-isSidebarVisible');
    return saved ? JSON.parse(saved) : false;
  });

  const [isSearchPanelVisible, setIsSearchPanelVisible] = useState<boolean>(() => {
    const saved = localStorage.getItem('portfolio-isSearchPanelVisible');
    return saved ? JSON.parse(saved) : false;
  });

  const [isArticlesPanelVisible, setIsArticlesPanelVisible] = useState<boolean>(() => {
    const saved = localStorage.getItem('portfolio-isArticlesPanelVisible');
    return saved ? JSON.parse(saved) : false;
  });


  const [globalSearchTerm, setGlobalSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [activityBarSelection, setActivityBarSelection] = useState<ActivityBarSelection>(null);

  const [orderedSidebarItems, setOrderedSidebarItems] = useState<SidebarItemConfig[]>(() => {
    const savedOrderIds = localStorage.getItem('portfolio-sidebarItemOrder');
    if (savedOrderIds) {
      try {
        const ids: string[] = JSON.parse(savedOrderIds);
        const itemsFromStorage: SidebarItemConfig[] = [];
        const defaultItemsMap = new Map(DEFAULT_SIDEBAR_ITEMS.map(item => [item.id, item]));

        ids.forEach(id => {
          if (defaultItemsMap.has(id)) {
            itemsFromStorage.push(defaultItemsMap.get(id)!);
            defaultItemsMap.delete(id);
          }
        });
        defaultItemsMap.forEach(newItem => itemsFromStorage.push(newItem));
        return itemsFromStorage;
      } catch (e) {
        console.error("Failed to parse saved sidebar order:", e);
        return [...DEFAULT_SIDEBAR_ITEMS];
      }
    }
    return [...DEFAULT_SIDEBAR_ITEMS];
  });

  const {
    tabHistory,
    currentHistoryIndex,
    updateTabHistoryOnActivation,
    navigateTabHistoryBack,
    navigateTabHistoryForward,
    cleanTabHistoryOnClose,
  } = useTabHistory(activeTabId, setActiveTabIdState);

  const { isFullscreen, handleToggleFullscreen } = useFullscreen();

  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [contextMenuState, setContextMenuState] = useState<{ x: number; y: number; items: ContextMenuItem[]; visible: boolean; tabId?: string }>({ x: 0, y: 0, items: [], visible: false });

  const setActiveTabId = useCallback((id: string | null) => {
    setActiveTabIdState(id);
    if (id) {
      updateTabHistoryOnActivation(id);
    }
  }, [updateTabHistoryOnActivation]);

  useEffect(() => localStorage.setItem('portfolio-openTabs', JSON.stringify(openTabs)), [openTabs]);
  useEffect(() => localStorage.setItem('portfolio-activeTabId', activeTabId || ''), [activeTabId]);
  useEffect(() => localStorage.setItem('portfolio-isSidebarVisible', JSON.stringify(isSidebarVisible)), [isSidebarVisible]);
  useEffect(() => localStorage.setItem('portfolio-isSearchPanelVisible', JSON.stringify(isSearchPanelVisible)), [isSearchPanelVisible]);
  useEffect(() => localStorage.setItem('portfolio-isArticlesPanelVisible', JSON.stringify(isArticlesPanelVisible)), [isArticlesPanelVisible]);
  useEffect(() => {
    localStorage.setItem('portfolio-sidebarItemOrder', JSON.stringify(orderedSidebarItems.map(item => item.id)));
  }, [orderedSidebarItems]);


  useEffect(() => {
    const activeTab = openTabs.find(tab => tab.id === activeTabId);
    if (activeTab) {
      document.title = `${activeTab.title} - ${PORTFOLIO_DATA.name} | PORTO CODE`;
    } else {
      document.title = `PORTO CODE - ${PORTFOLIO_DATA.name}`;
    }
  }, [activeTabId, openTabs]);

  const currentActiveTab = openTabs.find(tab => tab.id === activeTabId);

  useEffect(() => {
    if (currentActiveTab?.type === 'article_detail') {
      setActivityBarSelection('articles');
    } else if (currentActiveTab?.type === 'ai_chat') {
      setActivityBarSelection('ai_chat_tab');
    } else if (isArticlesPanelVisible) {
      setActivityBarSelection('articles');
    } else if (isSearchPanelVisible) {
      setActivityBarSelection('search');
    } else if (isSidebarVisible) {
      setActivityBarSelection('explorer');
    } else {
      setActivityBarSelection(null);
    }
  }, [currentActiveTab, isSidebarVisible, isSearchPanelVisible, isArticlesPanelVisible]);


  const handleOpenTab = useCallback((itemOrConfig: SidebarItemConfig | { id?: string, fileName?: string, type?: Tab['type'], title?: string, articleSlug?: string }) => {
    let idToOpen: string;
    let tabTitle: string;
    let tabType: Tab['type'];
    let tabFileName: string | undefined;
    let tabArticleSlug: string | undefined;

    if ('icon' in itemOrConfig) {
        const config = itemOrConfig as SidebarItemConfig;
        idToOpen = config.id;
        tabTitle = config.fileName;
        tabType = config.type || 'file';
        tabFileName = config.fileName;
    } else {
        const config = itemOrConfig as { id?: string, fileName?: string, type?: Tab['type'], title?: string, articleSlug?: string };
        idToOpen = config.id || config.fileName || `unknown-tab-${Date.now()}`;
        tabTitle = config.title || config.fileName || "Untitled";
        tabType = config.type || 'file';
        tabFileName = config.fileName;
        tabArticleSlug = config.articleSlug;
    }

    const existingTab = openTabs.find(tab => tab.id === idToOpen);
    let newTabToActivateId = idToOpen;

    if (existingTab) {
      setActiveTabId(existingTab.id);
    } else {
      const newTab: Tab = {
        id: idToOpen,
        title: tabTitle,
        type: tabType,
        fileName: tabFileName,
        articleSlug: tabArticleSlug,
      };
      setOpenTabs(prev => [...prev, newTab]);
      setActiveTabId(newTab.id);
      newTabToActivateId = newTab.id;
    }

    // Panel Management based on new tab type
    if (tabType === 'article_detail') {
        setIsSearchPanelVisible(false);
        setIsSidebarVisible(false);
        // isArticlesPanelVisible state is preserved; set to true in handleOpenArticleTab if needed
    } else if (tabType === 'ai_chat') {
        setIsSearchPanelVisible(false);
        setIsSidebarVisible(false);
        setIsArticlesPanelVisible(false);
    } else { // For 'file', 'project_detail', 'json_preview'
        setIsSearchPanelVisible(false);
        setIsArticlesPanelVisible(false); 
    }
  }, [openTabs, setActiveTabId]);


  const handleOpenProjectTab = useCallback((projectId: string, projectTitle: string) => {
    handleOpenTab({
      id: projectId,
      fileName: projectId,
      title: projectTitle,
      type: 'project_detail',
    });
  }, [handleOpenTab]);

  const handleOpenPreviewTab = useCallback((originalFileTabId: string) => {
    const originalTab = openTabs.find(tab => tab.id === originalFileTabId);
    if (!originalTab || originalTab.type !== 'file') return;

    const previewTabId = `${originalFileTabId}_preview`;
    const previewTabTitle = `Preview: ${originalTab.title}`;

    handleOpenTab({
      id: previewTabId,
      fileName: originalTab.fileName,
      title: previewTabTitle,
      type: 'json_preview',
    });
  }, [openTabs, handleOpenTab]);

  const handleOpenArticleTab = useCallback((article: ArticleItem) => {
    handleOpenTab({
        id: `article-detail-${article.slug}`,
        title: article.title,
        type: 'article_detail',
        articleSlug: article.slug,
    });
    setIsArticlesPanelVisible(true); // Ensure Articles panel is visible when an article is opened from the panel
  }, [handleOpenTab]);


  const handleSelectTab = useCallback((tabId: string) => {
    setActiveTabId(tabId);
  }, [setActiveTabId]);

  const handleCloseTab = useCallback((tabIdToClose: string) => {
    setOpenTabs(prevTabs => {
      const newTabs = prevTabs.filter(tab => tab.id !== tabIdToClose);
      let newActiveTabId: string | null = null;

      if (activeTabId === tabIdToClose) {
        if (newTabs.length > 0) {
          const historyWithoutClosed = tabHistory.filter(id => id !== tabIdToClose);
          const lastValidHistoryIndex = historyWithoutClosed.length -1;

          if (lastValidHistoryIndex >= 0 && newTabs.find(t => t.id === historyWithoutClosed[lastValidHistoryIndex])) {
            newActiveTabId = historyWithoutClosed[lastValidHistoryIndex];
          } else if (newTabs.length > 0) {
            newActiveTabId = newTabs[newTabs.length - 1].id;
          }
        }
      } else {
        newActiveTabId = activeTabId;
      }

      setActiveTabId(newActiveTabId);
      cleanTabHistoryOnClose(tabIdToClose, newActiveTabId);
      return newTabs;
    });
  }, [activeTabId, setActiveTabId, cleanTabHistoryOnClose, tabHistory]);

  const toggleSidebarVisibility = useCallback(() => {
    setIsSidebarVisible(prev => !prev);
    setIsSearchPanelVisible(false);
    setIsArticlesPanelVisible(false);
  }, []);

  const handleOpenAIChatTab = useCallback(() => {
    handleOpenTab({
      id: 'ai_chat_tab',
      fileName: 'AI Assistant',
      title: 'AI Assistant',
      type: 'ai_chat',
    });
  }, [handleOpenTab]);


  const openCommandPalette = useCallback(() => setIsCommandPaletteOpen(true), []);
  const closeCommandPalette = useCallback(() => setIsCommandPaletteOpen(false), []);
  const openAboutModal = useCallback(() => setIsAboutModalOpen(true), []);
  const closeAboutModal = useCallback(() => setIsAboutModalOpen(false), []);


  const handleContextMenuRequest = useCallback((x: number, y: number, tabId: string) => {
    const tab = openTabs.find(t => t.id === tabId);
    if (!tab) return;

    const items: ContextMenuItem[] = [
      { label: 'Close', action: () => handleCloseTab(tabId), icon: ICONS.x_icon },
      { label: 'Close Others', action: () => {
          setOpenTabs([tab]);
          setActiveTabId(tab.id);
          cleanTabHistoryOnClose("all_others", tab.id);
          updateTabHistoryOnActivation(tab.id);
      }, icon: ICONS.minus_icon },
      { label: 'Close All', action: () => {
          setOpenTabs([]);
          setActiveTabId(null);
          cleanTabHistoryOnClose("all", null);
      }, icon: ICONS.x_icon },
    ];

    if (tab.type === 'file' && ['about.json', 'experience.json', 'skills.json', 'contact.json'].includes(tab.fileName || '')) {
      items.push({
        label: `Preview ${tab.title}`,
        action: () => handleOpenPreviewTab(tab.id),
        icon: ICONS.Eye
      });
    }

    setContextMenuState({ x, y, items, visible: true, tabId });
  }, [openTabs, handleCloseTab, setActiveTabId, handleOpenPreviewTab, cleanTabHistoryOnClose, updateTabHistoryOnActivation]);

  const closeContextMenu = useCallback(() => {
    setContextMenuState(prev => ({ ...prev, visible: false }));
  }, []);


  useGlobalEventHandlers({
    toggleSidebarVisibility,
    openCommandPalette,
    isCommandPaletteOpen,
    closeCommandPalette,
    isAboutModalOpen,
    closeAboutModal,
    contextMenuVisible: contextMenuState.visible,
    setContextMenuVisible: (visible) => setContextMenuState(prev => ({ ...prev, visible })),
  });

  const handleToggleSearchPanel = useCallback(() => {
    const newSearchPanelVisible = !isSearchPanelVisible;
    setIsSearchPanelVisible(newSearchPanelVisible);
    if (newSearchPanelVisible) {
      setIsSidebarVisible(false);
      setIsArticlesPanelVisible(false);
    }
  }, [isSearchPanelVisible]);

  const handleToggleArticlesPanel = useCallback(() => {
    const newArticlesPanelVisible = !isArticlesPanelVisible;
    setIsArticlesPanelVisible(newArticlesPanelVisible);
    if (newArticlesPanelVisible) {
      setIsSidebarVisible(false);
      setIsSearchPanelVisible(false);
    }
  }, [isArticlesPanelVisible]);

  const handleReorderSidebarItems = useCallback((draggedItemId: string, targetItemId: string) => {
    setOrderedSidebarItems(prevItems => {
      const draggedIndex = prevItems.findIndex(item => item.id === draggedItemId);
      const targetIndex = prevItems.findIndex(item => item.id === targetItemId);

      if (draggedIndex === -1 || targetIndex === -1 || draggedIndex === targetIndex) {
        return prevItems;
      }

      const newItems = [...prevItems];
      const [draggedItem] = newItems.splice(draggedIndex, 1);
      newItems.splice(targetIndex, 0, draggedItem);
      return newItems;
    });
  }, []);

  const commands = useMemo(() => generateCommands({
    sidebarItems: orderedSidebarItems,
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
    handleToggleSearchPanel,
    handleToggleArticlesPanel,
  }), [
    orderedSidebarItems, handleOpenTab, closeCommandPalette, isSidebarVisible, toggleSidebarVisibility,
    handleOpenAIChatTab, openCommandPalette, handleThemeChange, currentThemeName,
    handleFontFamilyChange, currentFontFamilyId, handleFontSizeChange, currentFontSizeId,
    openAboutModal, handleToggleSearchPanel, handleToggleArticlesPanel
  ]);


  const activeContentDetails = useMemo(() => {
    if (!currentActiveTab) return "";

    if (currentActiveTab.type === 'file' || (currentActiveTab.type === 'json_preview' && currentActiveTab.fileName)) {
      return generateFileContent(currentActiveTab.fileName || currentActiveTab.id, PORTFOLIO_DATA);
    }
    if (currentActiveTab.type === 'project_detail') {
      return generateProjectDetailContent(currentActiveTab.id, PORTFOLIO_DATA);
    }
    if (currentActiveTab.type === 'article_detail' && currentActiveTab.articleSlug) {
        const article = SAMPLE_ARTICLES.find(a => a.slug === currentActiveTab.articleSlug);
        return article
          ? { markdown: article.contentMarkdown, imageUrl: article.imageUrl }
          : { markdown: "Article content not found." };
    }
    return ""; // Should not happen if tab type is known
  }, [currentActiveTab]);


  const handleGlobalSearch = useCallback((term: string) => {
    setGlobalSearchTerm(term);
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    const results: SearchResultItem[] = [];
    const searchTermLower = term.toLowerCase();

    orderedSidebarItems.forEach(item => {
      const content = generateFileContent(item.fileName, PORTFOLIO_DATA);
      const lines = content.split('\n');
      lines.forEach((line, index) => {
        if (line.toLowerCase().includes(searchTermLower)) {
          const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
          const highlightedLine = line.replace(regex, match => `<mark>${match}</mark>`);
          results.push({
            id: `${item.id}-${index}`,
            fileId: item.id,
            fileDisplayPath: item.fileName,
            lineNumber: index + 1,
            lineContent: highlightedLine,
            tabType: item.type || 'file',
          });
        }
      });
    });

    PORTFOLIO_DATA.projects.forEach((projectTitle, projectIdx) => {
      const projectId = `project_${projectIdx}_${projectTitle.toLowerCase().replace(/\s+/g, '_').replace(/[^\w-]+/g, '')}.json`;
      const content = generateProjectDetailContent(projectId, PORTFOLIO_DATA);
      const lines = content.split('\n');
      lines.forEach((line, index) => {
        if (line.toLowerCase().includes(searchTermLower)) {
           const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
           const highlightedLine = line.replace(regex, match => `<mark>${match}</mark>`);
          results.push({
            id: `${projectId}-${index}`,
            fileId: projectId,
            fileDisplayPath: `Project: ${projectTitle}`,
            lineNumber: index + 1,
            lineContent: highlightedLine,
            tabType: 'project_detail',
          });
        }
      });
    });
    setSearchResults(results);
  }, [setGlobalSearchTerm, setSearchResults, orderedSidebarItems]);

  const handleOpenTabFromSearchResult = useCallback((result: SearchResultItem) => {
    if (result.tabType === 'project_detail') {
      const projectTitleMatch = result.fileDisplayPath.match(/Project: (.*)/);
      const projectTitle = projectTitleMatch ? projectTitleMatch[1] : result.fileId;
      handleOpenProjectTab(result.fileId, projectTitle);
    } else {
      const sidebarItem = orderedSidebarItems.find(item => item.id === result.fileId);
      if (sidebarItem) {
        handleOpenTab(sidebarItem);
      } else {
        handleOpenTab({ fileName: result.fileId, type: 'file', title: result.fileDisplayPath });
      }
    }
  }, [handleOpenTab, handleOpenProjectTab, orderedSidebarItems]);

  const handleSelectExplorerView = () => {
    const newSidebarVisible = !isSidebarVisible;
    setIsSidebarVisible(newSidebarVisible);
    if (newSidebarVisible) {
        setIsSearchPanelVisible(false);
        setIsArticlesPanelVisible(false);
        if (activeTabId !== 'ai_chat_tab' && currentActiveTab?.type !== 'article_detail' && !openTabs.find(tab => tab.id === activeTabId && (tab.type === 'file' || tab.type === 'project_detail'))) {
            const aboutFile = orderedSidebarItems.find(item => item.id === 'about.json');
            if (aboutFile) {
                handleOpenTab(aboutFile);
            }
        }
    }
  };

  const activeArticleSlug = useMemo(() => {
    return currentActiveTab?.type === 'article_detail' ? currentActiveTab.articleSlug : null;
  }, [currentActiveTab]);


  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <TitleBar
        onToggleSidebar={toggleSidebarVisibility}
        isSidebarVisible={isSidebarVisible}
        onOpenCommandPalette={openCommandPalette}
        onOpenAboutModal={openAboutModal}
        canNavigateBack={currentHistoryIndex > 0}
        canNavigateForward={currentHistoryIndex < tabHistory.length - 1}
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
      <div className="flex flex-1 min-h-0">
        <ActivityBar
          onSelectExplorerView={handleSelectExplorerView}
          onOpenAIChat={handleOpenAIChatTab}
          onToggleSearchPanel={handleToggleSearchPanel}
          onToggleArticlesPanel={handleToggleArticlesPanel}
          activeViewId={activityBarSelection}
        />
        {isArticlesPanelVisible && (
          <ArticlesPanel
            isVisible={isArticlesPanelVisible}
            articles={SAMPLE_ARTICLES}
            onClose={() => setIsArticlesPanelVisible(false)}
            onSelectArticle={handleOpenArticleTab}
            activeArticleSlug={activeArticleSlug} // Pass active slug
          />
        )}
        {isSearchPanelVisible && !isArticlesPanelVisible && (
          <SearchPanel
            isVisible={isSearchPanelVisible}
            searchTerm={globalSearchTerm}
            onSearchTermChange={handleGlobalSearch}
            results={searchResults}
            onResultClick={handleOpenTabFromSearchResult}
            onClose={() => setIsSearchPanelVisible(false)}
          />
        )}
        {!isSearchPanelVisible && !isArticlesPanelVisible && (
            <Sidebar
                items={orderedSidebarItems}
                onOpenTab={handleOpenTab}
                isVisible={isSidebarVisible}
                activeTabId={activeTabId}
                onReorderItems={handleReorderSidebarItems}
            />
        )}
        <main className="flex-1 flex flex-col min-w-0">
          <EditorTabs
            tabs={openTabs}
            activeTabId={activeTabId}
            onSelectTab={handleSelectTab}
            onCloseTab={handleCloseTab}
            onContextMenuRequest={handleContextMenuRequest}
          />
          <Breadcrumbs activeTab={currentActiveTab} portfolioData={PORTFOLIO_DATA} onOpenTab={handleOpenTab} />
          <div className="flex-1 bg-[var(--editor-background)] overflow-auto animate-fadeIn">
            {currentActiveTab ? (
              <TabContent
                tab={currentActiveTab}
                content={activeContentDetails}
                portfolioData={PORTFOLIO_DATA}
                onOpenProjectTab={handleOpenProjectTab}
                currentThemeName={currentThemeName}
                onContextMenuRequest={handleContextMenuRequest}
              />
            ) : (
              <WelcomeView
                portfolioData={PORTFOLIO_DATA}
                onOpenTab={handleOpenTab}
                onOpenAIChat={handleOpenAIChatTab}
              />
            )}
          </div>
        </main>
      </div>
      <footer className="h-6 bg-[var(--statusbar-background)] text-[var(--statusbar-foreground)] text-xs flex items-center justify-between px-3 border-t border-[var(--statusbar-border)] flex-shrink-0">
        <div className="flex items-center space-x-2">
          <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="flex items-center hover:bg-[var(--statusbar-item-hover-background)] px-1 rounded">
            {ICONS.GitFork && <ICONS.GitFork size={14} className="mr-1" />}
            main
          </a>
        </div>
        <div className="flex items-center space-x-2">
          <span>Ln {Math.floor(Math.random()*100+1)}, Col {Math.floor(Math.random()*50+1)}</span>
          <span>UTF-8</span>
          <span>{APP_VERSION}</span>
          {ICONS.bell_icon && <ICONS.bell_icon size={14} />}
        </div>
      </footer>

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={closeCommandPalette}
        commands={commands}
      />
      <AboutModal isOpen={isAboutModalOpen} onClose={closeAboutModal} />
      <ContextMenu
        x={contextMenuState.x}
        y={contextMenuState.y}
        items={contextMenuState.items}
        visible={contextMenuState.visible}
        onClose={closeContextMenu}
      />
    </div>
  );
};

export default App;