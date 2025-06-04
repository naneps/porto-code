

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import AboutModal from './components/AboutModal';
import ActivityBar from './components/ActivityBar';
import { SAMPLE_ARTICLES } from './components/Articles/articlesData';
import ArticlesPanel from './components/Articles/ArticlesPanel';
import BottomPanelTabs from './components/BottomPanelTabs';
import Breadcrumbs from './components/Breadcrumbs';
import CommandPalette from './components/CommandPalette';
import ContextMenu from './components/ContextMenu';
import EditorTabs from './components/EditorTabs';
import NotificationContainer from './components/notifications/NotificationContainer';
import PetsPanel from './components/PetsPanel';
import SearchPanel from './components/Search/SearchPanel';
import { Sidebar } from './components/Sidebar';
import StatisticsPanel from './components/StatisticsPanel';
import TabContent from './components/TabContent';
import TerminalPanel from './components/TerminalPanel';
import TitleBar from './components/TitleBar/TitleBar';
import WelcomeView from './components/WelcomeView';
import { APP_VERSION, DEFAULT_ACTIVITY_BAR_ITEMS, SIDEBAR_ITEMS as DEFAULT_SIDEBAR_ITEMS, generateFileContent, generateProjectDetailContent, ICONS, PORTFOLIO_DATA, REPO_URL } from './constants';
import { FONT_FAMILY_OPTIONS, FONT_SIZE_OPTIONS, PREDEFINED_THEMES } from './themes';
import { ActivityBarItemConfig, ActivityBarItemDefinition, ActivityBarSelection, ArticleItem, ContextMenuItem, MockStatistics, ProjectDetail, SearchResultItem, SidebarItemConfig, Tab } from './types';
import { createCV_PDF } from './utils/cvGenerator'; // Import CV generator


import { useFullscreen } from './hooks/useFullscreen';
import { useGlobalEventHandlers } from './hooks/useGlobalEventHandlers';
import { useNotifications } from './hooks/useNotifications';
import { useTabHistory } from './hooks/useTabHistory';
import { useThemeManager } from './hooks/useThemeManager';
import { fetchAIProjectSuggestion } from './utils/aiUtils';
import { getMuteStatus, playSound, toggleMute } from './utils/audioUtils';
import { generateCommands } from './utils/commandUtils';
import './utils/firebase';


export type BottomPanelTabId = 'terminal' | 'pets';

const DEFAULT_LEFT_PANEL_WIDTH = 256;
const MIN_LEFT_PANEL_WIDTH = 150;
const MAX_LEFT_PANEL_WIDTH = 600;

const DEFAULT_BOTTOM_PANEL_HEIGHT = 200;
const MIN_BOTTOM_PANEL_HEIGHT = 75;
const MAX_BOTTOM_PANEL_HEIGHT = 600; 

const App: React.FC = () => {
  const {
    currentThemeName,
    currentFontFamilyId,
    currentFontSizeId,
    handleThemeChange: rawHandleThemeChange,
    handleFontFamilyChange: rawHandleFontFamilyChange,
    handleFontSizeChange: rawHandleFontSizeChange,
  } = useThemeManager();

  const [openTabs, setOpenTabs] = useState<Tab[]>(() => {
    const saved = localStorage.getItem('portfolio-openTabs');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTabId, setActiveTabIdState] = useState<string | null>(() => {
    return localStorage.getItem('portfolio-activeTabId') || null;
  });

  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(() => {
    return localStorage.getItem('portfolio-isSidebarVisible') === 'true' || false;
  });

  const [isSearchPanelVisible, setIsSearchPanelVisible] = useState<boolean>(() => {
    return localStorage.getItem('portfolio-isSearchPanelVisible') === 'true' || false;
  });

  const [isArticlesPanelVisible, setIsArticlesPanelVisible] = useState<boolean>(() => {
    return localStorage.getItem('portfolio-isArticlesPanelVisible') === 'true' || false;
  });

  const [isStatisticsPanelVisible, setIsStatisticsPanelVisible] = useState<boolean>(() => {
    return localStorage.getItem('portfolio-isStatisticsPanelVisible') === 'true' || false;
  });

  const [leftPanelWidth, setLeftPanelWidth] = useState<number>(() => {
    const saved = localStorage.getItem('portfolio-leftPanelWidth');
    return saved ? parseInt(saved, 10) : DEFAULT_LEFT_PANEL_WIDTH;
  });

  const [bottomPanelHeight, setBottomPanelHeight] = useState<number>(() => {
    const saved = localStorage.getItem('portfolio-bottomPanelHeight');
    return saved ? parseInt(saved, 10) : DEFAULT_BOTTOM_PANEL_HEIGHT;
  });

  const [globalSearchTerm, setGlobalSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [activityBarSelection, setActivityBarSelection] = useState<ActivityBarSelection>(null);

  const [orderedSidebarItems, setOrderedSidebarItems] = useState<SidebarItemConfig[]>(() => {
    const savedOrderRaw = localStorage.getItem('portfolio-sidebarItemOrder');
    if (savedOrderRaw) {
      try {
        return [...DEFAULT_SIDEBAR_ITEMS]; 
      } catch (e) { return [...DEFAULT_SIDEBAR_ITEMS]; }
    }
    return [...DEFAULT_SIDEBAR_ITEMS];
  });
  
  const [orderedActivityBarItemDefinitions, setOrderedActivityBarItemDefinitions] = useState<ActivityBarItemDefinition[]>(() => {
    const savedOrder = localStorage.getItem('portfolio-activityBarOrder');
    if (savedOrder) {
        try {
            const ids: string[] = JSON.parse(savedOrder);
            const itemsFromStorage: ActivityBarItemDefinition[] = [];
            const defaultItemsMap = new Map(DEFAULT_ACTIVITY_BAR_ITEMS.map(item => [item.id, item]));
            
            ids.forEach(id => {
                if (defaultItemsMap.has(id)) {
                    itemsFromStorage.push(defaultItemsMap.get(id)!);
                    defaultItemsMap.delete(id); 
                }
            });
            defaultItemsMap.forEach(newItem => itemsFromStorage.push(newItem));
            return itemsFromStorage;
        } catch (e) {
            return [...DEFAULT_ACTIVITY_BAR_ITEMS];
        }
    }
    return [...DEFAULT_ACTIVITY_BAR_ITEMS];
  });


  const {
    tabHistory, currentHistoryIndex, updateTabHistoryOnActivation,
    navigateTabHistoryBack: rawNavigateTabHistoryBack, navigateTabHistoryForward: rawNavigateTabHistoryForward,
    cleanTabHistoryOnClose,
  } = useTabHistory(activeTabId, setActiveTabIdState);

  const { isFullscreen, handleToggleFullscreen: rawHandleToggleFullscreen } = useFullscreen();
  const { notifications, addNotification, removeNotification } = useNotifications(); 


  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  
  const [editorContextMenuState, setEditorContextMenuState] = useState<{ x: number; y: number; items: ContextMenuItem[]; visible: boolean; tabId?: string }>({ x: 0, y: 0, items: [], visible: false });
  const [sidebarContextMenuState, setSidebarContextMenuState] = useState<{ x: number; y: number; items: ContextMenuItem[]; visible: boolean; itemId?: string }>({ x: 0, y: 0, items: [], visible: false });


  const [isPreviewTabLoading, setIsPreviewTabLoading] = useState(false); // Renamed from isTabContentLoading
  const [isGeneratingCV, setIsGeneratingCV] = useState(false); // New state for CV generation progress
  const loadingTimeoutRef = useRef<number | null>(null);

  const [isBottomPanelVisible, setIsBottomPanelVisible] = useState<boolean>(() => {
    return localStorage.getItem('portfolio-isBottomPanelVisible') === 'true' || false;
  });
  const [activeBottomPanelId, setActiveBottomPanelId] = useState<BottomPanelTabId>(() => {
    const saved = localStorage.getItem('portfolio-activeBottomPanelId') as BottomPanelTabId | null;
    return saved || 'terminal';
  });
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [isTerminalRunningCommand, setIsTerminalRunningCommand] = useState(false);
  const terminalAnimationIntervalRef = useRef<number | null>(null);

  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(getMuteStatus());
  const [aiGeneratedProjects, setAiGeneratedProjects] = useState<ProjectDetail[]>([]);
  const [isAISuggestingProject, setIsAISuggestingProject] = useState(false);

  const [mockStats, setMockStats] = useState<MockStatistics>({
    liveVisitors: Math.floor(Math.random() * 5) + 1,
    todayVisits: Math.floor(Math.random() * 20) + 5,
    uptime: '0s',
    mostVisitedPage: DEFAULT_SIDEBAR_ITEMS[0]?.children?.[0]?.fileName || 'about.json',
    currentlyViewed: ['about.json', 'projects.json'],
  });
  const appLoadTimeRef = useRef<Date>(new Date());

  const isLeftPanelResizing = useRef(false);
  const isBottomPanelResizing = useRef(false);
  const leftResizerRef = useRef<HTMLDivElement>(null);
  const bottomResizerRef = useRef<HTMLDivElement>(null);


  useEffect(() => { localStorage.setItem('portfolio-openTabs', JSON.stringify(openTabs)); }, [openTabs]);
  useEffect(() => { localStorage.setItem('portfolio-activeTabId', activeTabId || ''); }, [activeTabId]);
  useEffect(() => { localStorage.setItem('portfolio-isSidebarVisible', String(isSidebarVisible)); }, [isSidebarVisible]);
  useEffect(() => { localStorage.setItem('portfolio-isSearchPanelVisible', String(isSearchPanelVisible)); }, [isSearchPanelVisible]);
  useEffect(() => { localStorage.setItem('portfolio-isArticlesPanelVisible', String(isArticlesPanelVisible)); }, [isArticlesPanelVisible]);
  useEffect(() => { localStorage.setItem('portfolio-isStatisticsPanelVisible', String(isStatisticsPanelVisible)); }, [isStatisticsPanelVisible]);
  useEffect(() => { localStorage.setItem('portfolio-leftPanelWidth', String(leftPanelWidth)); }, [leftPanelWidth]);
  useEffect(() => { localStorage.setItem('portfolio-bottomPanelHeight', String(bottomPanelHeight)); }, [bottomPanelHeight]);
  useEffect(() => { localStorage.setItem('portfolio-isBottomPanelVisible', String(isBottomPanelVisible)); }, [isBottomPanelVisible]);
  useEffect(() => { localStorage.setItem('portfolio-activeBottomPanelId', activeBottomPanelId); }, [activeBottomPanelId]);
  useEffect(() => { localStorage.setItem('portfolio-activityBarOrder', JSON.stringify(orderedActivityBarItemDefinitions.map(item => item.id)));}, [orderedActivityBarItemDefinitions]);


  const handleLeftPanelResizeStart = useCallback((e: React.MouseEvent) => {
    isLeftPanelResizing.current = true;
    document.body.style.cursor = 'col-resize';
    document.addEventListener('mousemove', handleLeftPanelDragging);
    document.addEventListener('mouseup', handleLeftPanelResizeEnd);
  }, []);

  const handleLeftPanelDragging = useCallback((e: MouseEvent) => {
    if (!isLeftPanelResizing.current) return;
    const newWidth = e.clientX - (leftResizerRef.current?.parentElement?.getBoundingClientRect().left || 0) ;
    setLeftPanelWidth(Math.max(MIN_LEFT_PANEL_WIDTH, Math.min(newWidth, MAX_LEFT_PANEL_WIDTH)));
  }, []);

  const handleLeftPanelResizeEnd = useCallback(() => {
    isLeftPanelResizing.current = false;
    document.body.style.cursor = 'default';
    document.removeEventListener('mousemove', handleLeftPanelDragging);
    document.removeEventListener('mouseup', handleLeftPanelResizeEnd);
  }, []);

  const handleBottomPanelResizeStart = useCallback((e: React.MouseEvent) => {
    isBottomPanelResizing.current = true;
    document.body.style.cursor = 'row-resize';
    document.addEventListener('mousemove', handleBottomPanelDragging);
    document.addEventListener('mouseup', handleBottomPanelResizeEnd);
  }, []);

  const handleBottomPanelDragging = useCallback((e: MouseEvent) => {
    if (!isBottomPanelResizing.current) return;
    const newHeight = window.innerHeight - e.clientY - (bottomResizerRef.current?.parentElement?.querySelector('footer')?.offsetHeight || 0);
    setBottomPanelHeight(Math.max(MIN_BOTTOM_PANEL_HEIGHT, Math.min(newHeight, MAX_BOTTOM_PANEL_HEIGHT)));
  }, []);
  
  const handleBottomPanelResizeEnd = useCallback(() => {
    isBottomPanelResizing.current = false;
    document.body.style.cursor = 'default';
    document.removeEventListener('mousemove', handleBottomPanelDragging);
    document.removeEventListener('mouseup', handleBottomPanelResizeEnd);
  }, []);


  const handleToggleSoundMute = useCallback(() => setIsSoundMuted(toggleMute()), []);
  const setActiveTabId = useCallback((id: string | null) => {
    setActiveTabIdState(id);
    if (id) updateTabHistoryOnActivation(id);
  }, [updateTabHistoryOnActivation]);

  const currentActiveTab = useMemo(() => openTabs.find(tab => tab.id === activeTabId), [openTabs, activeTabId]);
  useEffect(() => {
    document.title = currentActiveTab ? `${currentActiveTab.title} - ${PORTFOLIO_DATA.name} | PORTO CODE` : `PORTO CODE - ${PORTFOLIO_DATA.name}`;
  }, [currentActiveTab]);

  useEffect(() => {
    if (currentActiveTab?.type === 'article_detail') setActivityBarSelection('articles');
    else if (currentActiveTab?.type === 'ai_chat') setActivityBarSelection('ai_chat_tab');
    else if (isStatisticsPanelVisible) setActivityBarSelection('statistics');
    else if (isArticlesPanelVisible) setActivityBarSelection('articles');
    else if (isSearchPanelVisible) setActivityBarSelection('search');
    else if (isSidebarVisible) setActivityBarSelection('explorer');
    else setActivityBarSelection(null);
  }, [currentActiveTab, isSidebarVisible, isSearchPanelVisible, isArticlesPanelVisible, isStatisticsPanelVisible]);

  const appendToTerminalOutput = useCallback((text: string) => {
    setTerminalOutput(prev => {
        const newOutput = [...prev, text];
        return newOutput.length > 200 ? newOutput.slice(newOutput.length - 200) : newOutput;
    });
  }, []);

  const clearTerminalOutput = useCallback(() => setTerminalOutput([]), []);

  useEffect(() => {
    const randomUserId = Math.floor(Math.random() * 9000) + 1000;
    appendToTerminalOutput("Initializing PORTO CODE environment...");
    setTimeout(() => {
        appendToTerminalOutput(`🐾 New session started. Virtual companion 'CodeCat_${randomUserId}' assigned.`);
        appendToTerminalOutput(`Welcome, User #${randomUserId}! Explore the portfolio.`);
    }, 500);
  }, [appendToTerminalOutput]);
  
  const simulateTerminalRun = useCallback((commandName: string, durationMs: number = 2000, customSteps?: string[]) => {
    if (terminalAnimationIntervalRef.current) clearInterval(terminalAnimationIntervalRef.current);
    playSound('terminal-run');
    setIsBottomPanelVisible(true);
    setActiveBottomPanelId('terminal');
    clearTerminalOutput();
    setIsTerminalRunningCommand(true);
    appendToTerminalOutput(`> Running ${commandName}...`);
    
    if (customSteps && customSteps.length > 0) {
        let stepIndex = 0;
        const stepDuration = durationMs / customSteps.length;
        terminalAnimationIntervalRef.current = window.setInterval(() => {
            if (stepIndex < customSteps.length) {
                appendToTerminalOutput(customSteps[stepIndex]);
                stepIndex++;
            }
            if (stepIndex >= customSteps.length) {
                if (terminalAnimationIntervalRef.current) clearInterval(terminalAnimationIntervalRef.current);
                terminalAnimationIntervalRef.current = null;
                appendToTerminalOutput(`${commandName} finished successfully.`);
                setIsTerminalRunningCommand(false);
                playSound('terminal-complete');
            }
        }, stepDuration);
    } else {
        let dots = 0;
        const maxDots = 3;
        const animationSteps = durationMs / 500; 
        let currentStep = 0;
        terminalAnimationIntervalRef.current = window.setInterval(() => {
            dots = (dots + 1) % (maxDots + 1);
            appendToTerminalOutput(`Processing${'.'.repeat(dots)}`);
            currentStep++;
            if (currentStep >= animationSteps) {
                if (terminalAnimationIntervalRef.current) clearInterval(terminalAnimationIntervalRef.current);
                terminalAnimationIntervalRef.current = null;
                appendToTerminalOutput(`${commandName} finished successfully.`);
                setIsTerminalRunningCommand(false);
                playSound('terminal-complete');
            }
        }, 500); 
    }
  }, [appendToTerminalOutput, clearTerminalOutput]);

  const handleOpenTab = useCallback((itemOrConfig: SidebarItemConfig | { id?: string, fileName?: string, type?: Tab['type'], title?: string, articleSlug?: string }, isRunAction: boolean = false) => {
    if ('isFolder' in itemOrConfig && itemOrConfig.isFolder) {
        return;
    }

    let idToOpen: string, tabTitle: string, tabType: Tab['type'], tabFileName: string | undefined, tabArticleSlug: string | undefined;
    if ('icon' in itemOrConfig && 'label' in itemOrConfig) { 
        const config = itemOrConfig as SidebarItemConfig;
        idToOpen = config.id; tabTitle = config.title || config.fileName || config.label; tabType = config.type || 'file'; tabFileName = config.fileName;
    } else { 
        const config = itemOrConfig as { id?: string, fileName?: string, type?: Tab['type'], title?: string, articleSlug?: string };
        idToOpen = config.id || config.fileName || `unknown-tab-${Date.now()}`; tabTitle = config.title || config.fileName || "Untitled"; tabType = config.type || 'file'; tabFileName = config.fileName; tabArticleSlug = config.articleSlug;
    }
    if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
    if (isRunAction && tabType === 'json_preview') {
        simulateTerminalRun(tabTitle); 
        setIsPreviewTabLoading(true);
        loadingTimeoutRef.current = window.setTimeout(() => setIsPreviewTabLoading(false), 1200);
    } else if (tabType !== 'cv_preview') {
        playSound('tab-open');
    }
    
    const existingTab = openTabs.find(tab => tab.id === idToOpen);
    if (existingTab) {
      setActiveTabId(existingTab.id); 
      if(tabType !== 'cv_preview') playSound('tab-select'); 
    } else {
      const newTab: Tab = { id: idToOpen, title: tabTitle, type: tabType, fileName: tabFileName, articleSlug: tabArticleSlug };
      setOpenTabs(prev => [...prev, newTab]); setActiveTabId(newTab.id);
    }
    if (tabType === 'article_detail' || tabType === 'ai_chat') {
        setIsSearchPanelVisible(false); setIsSidebarVisible(false); setIsStatisticsPanelVisible(false);
        if (tabType === 'ai_chat') setIsArticlesPanelVisible(false);
    } else if (!isRunAction && tabType !== 'cv_preview') { 
        setIsSearchPanelVisible(false); setIsArticlesPanelVisible(false); setIsStatisticsPanelVisible(false);
    }
  }, [openTabs, setActiveTabId, simulateTerminalRun]);


  const handleRunCVGenerator = useCallback(async () => {
    setIsGeneratingCV(true);
    const cvSteps = [
      "Starting CV generation...",
      "Fetching portfolio data...",
      "Initializing PDF document with pdf-lib...",
      "Formatting header and contact information...",
      "Adding summary section...",
      "Processing work experience entries...",
      "Detailing education background...",
      "Listing key skills...",
      "Compiling PDF structure...",
      "Finalizing PDF document...",
    ];
    simulateTerminalRun("generate_cv.ts", 5000, cvSteps); // Simulate terminal steps first
    
    // Generate actual PDF
    let pdfBytes: Uint8Array | null = null;
    try {
        pdfBytes = await createCV_PDF(PORTFOLIO_DATA);
        appendToTerminalOutput("PDF bytes generated successfully.");
    } catch (error) {
        console.error("Error generating CV PDF:", error);
        appendToTerminalOutput(`Error during PDF generation: ${error instanceof Error ? error.message : String(error)}`);
        addNotification("Failed to generate CV PDF.", 'error', 7000, undefined, ICONS.FileText);
        playSound('error');
        setIsGeneratingCV(false);
        return;
    }

    // After terminal simulation and PDF generation (if successful)
    setTimeout(() => {
      setIsGeneratingCV(false); // Stop progress bar
      const cvTabId = 'cv_nandang_eka_prasetya.pdf';
      const cvTabTitle = 'Nandang_Eka_Prasetya_CV.pdf';

      if (pdfBytes) {
          const blob = new Blob([pdfBytes], { type: 'application/pdf' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = cvTabTitle;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(link.href);
          appendToTerminalOutput(`${cvTabTitle} download initiated.`);
          addNotification(
              `CV downloaded: ${cvTabTitle}`,
              'success',
              7000,
              [{ label: 'Open Preview', onClick: () => handleOpenTab({ id: cvTabId, title: cvTabTitle, type: 'cv_preview' }) }],
              ICONS.cv_preview_icon
          );
      } else {
           addNotification("CV PDF generation failed. Preview unavailable.", 'error', 7000, undefined, ICONS.FileText);
      }
      
      // Open preview tab regardless of download success to show HTML version
      handleOpenTab({
          id: cvTabId,
          title: cvTabTitle,
          type: 'cv_preview',
          fileName: cvTabId,
      });
      playSound('notification');
    }, 5100); // Ensure this is after terminal simulation

  }, [simulateTerminalRun, handleOpenTab, addNotification, appendToTerminalOutput, PORTFOLIO_DATA]);

  const handleSidebarAction = useCallback((actionType: SidebarItemConfig['actionType'], item: SidebarItemConfig) => {
    if (item.actionType === 'open_tab' || !item.actionType) {
      handleOpenTab(item);
    } else {
      console.warn("Unhandled sidebar action type:", actionType);
    }
  }, [handleOpenTab]);


  const handleOpenProjectTab = useCallback((projectId: string, projectTitle: string) => {
    handleOpenTab({ id: projectId, fileName: projectId, type: 'project_detail', title: projectTitle });
  }, [handleOpenTab]);

  const handleOpenPreviewTab = useCallback((originalFileTabId: string, isRunContext: boolean = false) => {
    let originalItemSource: Tab | SidebarItemConfig | undefined = openTabs.find(t => t.id === originalFileTabId);

    if (!originalItemSource) {
        const findInSidebar = (items: SidebarItemConfig[]): SidebarItemConfig | undefined => {
            for (const item of items) {
                if (item.id === originalFileTabId && !item.isFolder) return item;
                if (item.isFolder && item.children) {
                    const found = findInSidebar(item.children);
                    if (found) return found;
                }
            }
            return undefined;
        };
        originalItemSource = findInSidebar(orderedSidebarItems);
    }
    
    if (!originalItemSource || !originalItemSource.fileName) {
      console.warn("Could not find original file to preview:", originalFileTabId);
      playSound('error');
      return;
    }

    const previewTabId = `${originalItemSource.id}_preview`;
    const previewTabTitle = `Preview: ${originalItemSource.title || originalItemSource.fileName}`;
    
    handleOpenTab({
      id: previewTabId,
      fileName: originalItemSource.fileName, 
      type: 'json_preview',
      title: previewTabTitle,
    }, isRunContext);
  }, [openTabs, handleOpenTab, orderedSidebarItems]);

  const handleOpenArticleTab = useCallback((article: ArticleItem) => {
    handleOpenTab({
      id: `article_${article.slug}`,
      type: 'article_detail',
      title: article.title,
      articleSlug: article.slug,
    });
  }, [handleOpenTab]);
  
  const handleSelectTab = useCallback((tabId: string) => {
    playSound('tab-select');
    setActiveTabId(tabId);
  }, [setActiveTabId]);
  
  const handleCloseTab = useCallback((tabIdToClose: string) => {
    playSound('tab-close');
    let newActiveTabId: string | null = null;
    const closedTabIndex = openTabs.findIndex(tab => tab.id === tabIdToClose);

    if (tabIdToClose === activeTabId) {
      if (tabHistory.length > 1) {
        const historyWithoutClosed = tabHistory.filter(id => id !== tabIdToClose);
        let potentialNewActiveIndex = historyWithoutClosed.indexOf(activeTabId) -1; 
        if (currentHistoryIndex > 0 && openTabs.some(t => t.id === tabHistory[currentHistoryIndex -1] && t.id !== tabIdToClose)) {
            newActiveTabId = tabHistory[currentHistoryIndex -1];
        } else if (closedTabIndex > 0) { 
            newActiveTabId = openTabs[closedTabIndex - 1].id;
        } else if (openTabs.length > 1 && closedTabIndex < openTabs.length -1 ) { 
            newActiveTabId = openTabs[closedTabIndex + 1].id;
        }
      } else if (openTabs.length > 1) { 
          newActiveTabId = closedTabIndex > 0 ? openTabs[closedTabIndex - 1].id : openTabs[1].id;
      }
    } else {
      newActiveTabId = activeTabId; 
    }
    
    const newOpenTabs = openTabs.filter(tab => tab.id !== tabIdToClose);
    setOpenTabs(newOpenTabs);
    
    if (!newOpenTabs.some(t => t.id === newActiveTabId) || newOpenTabs.length === 0) {
        newActiveTabId = newOpenTabs.length > 0 ? newOpenTabs[0].id : null;
    }

    setActiveTabId(newActiveTabId);
    cleanTabHistoryOnClose(tabIdToClose, newActiveTabId);
  }, [activeTabId, setActiveTabId, cleanTabHistoryOnClose, tabHistory, openTabs, currentHistoryIndex]);
  
  const handleReorderOpenTabs = useCallback((draggedTabId: string, targetTabId: string | null) => {
    setOpenTabs(prevTabs => {
      const draggedTabIndex = prevTabs.findIndex(tab => tab.id === draggedTabId);
      if (draggedTabIndex === -1) return prevTabs;

      const newTabs = [...prevTabs];
      const [draggedTab] = newTabs.splice(draggedTabIndex, 1);

      if (targetTabId === null) { 
        newTabs.push(draggedTab);
      } else {
        const targetTabIndex = newTabs.findIndex(tab => tab.id === targetTabId);
        if (targetTabIndex === -1) return prevTabs; 
        newTabs.splice(targetTabIndex, 0, draggedTab);
      }
      playSound('ui-click');
      return newTabs;
    });
  }, []);

  const toggleSidebarVisibility = useCallback(() => {
    const newVisibility = !isSidebarVisible;
    setIsSidebarVisible(newVisibility);
    playSound('panel-toggle');
    if (newVisibility) {
      setActivityBarSelection('explorer');
      setIsSearchPanelVisible(false); setIsArticlesPanelVisible(false); setIsStatisticsPanelVisible(false);
    } else if (activityBarSelection === 'explorer') {
      setActivityBarSelection(null);
    }
  }, [isSidebarVisible, activityBarSelection]);

  const handleOpenAIChatTab = useCallback(() => {
    handleOpenTab({ id: 'ai_chat_tab', title: 'AI Assistant', type: 'ai_chat' });
  }, [handleOpenTab]);

  const openCommandPalette = useCallback(() => { setIsCommandPaletteOpen(true); playSound('modal-toggle'); }, []);
  const closeCommandPalette = useCallback(() => { setIsCommandPaletteOpen(false); }, []);
  const openAboutModal = useCallback(() => { setIsAboutModalOpen(true); playSound('modal-toggle'); }, []);
  const closeAboutModal = useCallback(() => { setIsAboutModalOpen(false); playSound('ui-click'); }, []);

  const handleEditorContextMenuRequest = useCallback((x: number, y: number, tabId: string, isCVGeneratorContext?: boolean) => {
    const targetTab = openTabs.find(tab => tab.id === tabId);
    if (!targetTab) return;

    let items: ContextMenuItem[] = [];
    if (isCVGeneratorContext && targetTab.fileName === 'generate_cv.ts') {
        items.push({
            label: 'Run CV Generator Script',
            action: () => { handleRunCVGenerator(); playSound('command-execute'); },
            icon: ICONS.PlayIcon,
        });
    } else {
        items.push({ label: `Close ${targetTab.title}`, action: () => handleCloseTab(tabId) });
        items.push({ label: 'Close Others', action: () => {
            setOpenTabs([targetTab]); setActiveTabId(targetTab.id);
            cleanTabHistoryOnClose(null as any, targetTab.id); 
            updateTabHistoryOnActivation(targetTab.id);
            playSound('ui-click');
        }});
        items.push({ label: 'Close All', action: () => {
            setOpenTabs([]); setActiveTabId(null);
            cleanTabHistoryOnClose(null as any, null);
            playSound('ui-click');
        }});

        const eligibleForPreview = ['about.json', 'experience.json', 'skills.json', 'contact.json', 'projects.json'].includes(targetTab.fileName || '');
        if (targetTab.type === 'file' && eligibleForPreview && !targetTab.id.endsWith('_preview')) {
        items.push({ label: `Open Preview for ${targetTab.title}`, action: () => handleOpenPreviewTab(tabId) });
        }
        if (targetTab.type === 'project_detail' && !targetTab.id.startsWith('ai_project_') && !targetTab.id.endsWith('_preview')) {
            items.push({ label: `Open Preview for ${targetTab.title}`, action: () => handleOpenPreviewTab(tabId) });
        }
    }

    if (items.length > 0) {
        setEditorContextMenuState({ x, y, items, visible: true, tabId });
        playSound('ui-click');
    }
  }, [openTabs, handleCloseTab, setActiveTabId, handleOpenPreviewTab, cleanTabHistoryOnClose, updateTabHistoryOnActivation, handleRunCVGenerator]);

  const closeEditorContextMenu = useCallback(() => setEditorContextMenuState(prev => ({ ...prev, visible: false })), []);
  
  const handleSidebarItemContextMenuRequest = useCallback((event: React.MouseEvent, item: SidebarItemConfig) => {
    const items: ContextMenuItem[] = [];
    if (item.id === 'generate_cv.ts') {
      items.push({
        label: 'Run CV Generator Script',
        action: () => { handleRunCVGenerator(); playSound('command-execute'); },
        icon: ICONS.PlayIcon,
      });
    }
    if (items.length > 0) {
        setSidebarContextMenuState({ x: event.pageX, y: event.pageY, items, visible: true, itemId: item.id });
        playSound('ui-click');
    }
  }, [handleRunCVGenerator]);

  const closeSidebarContextMenu = useCallback(() => setSidebarContextMenuState(prev => ({ ...prev, visible: false })), []);


  const toggleTerminalPanel = useCallback(() => {
    playSound('panel-toggle');
    if (isBottomPanelVisible && activeBottomPanelId === 'terminal') {
      setIsBottomPanelVisible(false);
    } else {
      setIsBottomPanelVisible(true);
      setActiveBottomPanelId('terminal');
    }
  }, [isBottomPanelVisible, activeBottomPanelId]);

  const togglePetsPanel = useCallback(() => {
    playSound('panel-toggle');
    if (isBottomPanelVisible && activeBottomPanelId === 'pets') {
      setIsBottomPanelVisible(false);
    } else {
      setIsBottomPanelVisible(true);
      setActiveBottomPanelId('pets');
    }
  }, [isBottomPanelVisible, activeBottomPanelId]);
  
  const handleSelectBottomPanelTab = useCallback((panelId: BottomPanelTabId) => {
    playSound('ui-click');
    setActiveBottomPanelId(panelId);
    if (!isBottomPanelVisible) {
      setIsBottomPanelVisible(true);
    }
  }, [isBottomPanelVisible]);

  const handleCloseBottomPanel = useCallback(() => {
    setIsBottomPanelVisible(false);
    playSound('panel-toggle');
  }, []);

  const handleSuggestNewAIProject = useCallback(async () => {
    if (isAISuggestingProject) return;
    setIsAISuggestingProject(true);
    appendToTerminalOutput("> Fetching AI project suggestion...");
    playSound('terminal-run');

    const suggestion = await fetchAIProjectSuggestion(PORTFOLIO_DATA.skills);
    setIsAISuggestingProject(false);

    if (suggestion) {
        const newAIProjectId = `ai_project_${Date.now()}_${suggestion.title.toLowerCase().replace(/\s+/g, '_').replace(/[^\w-]+/g, '')}`;
        const newAIProject: ProjectDetail = { ...suggestion, id: newAIProjectId };
        setAiGeneratedProjects(prev => [...prev, newAIProject]);
        
        appendToTerminalOutput(`AI Suggested Project: "${newAIProject.title}"`);
        appendToTerminalOutput(`Opening details for ${newAIProject.title}...`);
        playSound('terminal-complete');

        handleOpenTab({
            id: newAIProject.id, 
            fileName: newAIProject.id, 
            type: 'project_detail',
            title: `✨ ${newAIProject.title} (AI)`, 
        });
    } else {
        appendToTerminalOutput("Failed to get AI project suggestion. Please check logs or try again.");
        playSound('error');
    }
  }, [isAISuggestingProject, appendToTerminalOutput, PORTFOLIO_DATA.skills, handleOpenTab]);
  
  useGlobalEventHandlers({ toggleSidebarVisibility, openCommandPalette, isCommandPaletteOpen, closeCommandPalette, isAboutModalOpen, closeAboutModal, contextMenuVisible: editorContextMenuState.visible || sidebarContextMenuState.visible, setContextMenuVisible: (visible) => { if (!visible) { closeEditorContextMenu(); closeSidebarContextMenu();}}, toggleTerminalVisibility: toggleTerminalPanel, togglePetsPanelVisibility: togglePetsPanel });
  
  const handleToggleSearchPanel = useCallback(() => {
    const newVisibility = !isSearchPanelVisible;
    setIsSearchPanelVisible(newVisibility);
    playSound('panel-toggle');
    if (newVisibility) {
      setActivityBarSelection('search');
      setIsSidebarVisible(false); setIsArticlesPanelVisible(false); setIsStatisticsPanelVisible(false);
    } else if (activityBarSelection === 'search') {
      setActivityBarSelection(null);
    }
  }, [isSearchPanelVisible, activityBarSelection]);

  const handleToggleArticlesPanel = useCallback(() => {
    const newVisibility = !isArticlesPanelVisible;
    setIsArticlesPanelVisible(newVisibility);
    playSound('panel-toggle');
    if (newVisibility) {
      setActivityBarSelection('articles');
      setIsSidebarVisible(false); setIsSearchPanelVisible(false); setIsStatisticsPanelVisible(false);
    } else if (activityBarSelection === 'articles') {
      setActivityBarSelection(null);
    }
  }, [isArticlesPanelVisible, activityBarSelection]);

  const handleToggleStatisticsPanel = useCallback(() => {
    const newVisibility = !isStatisticsPanelVisible;
    setIsStatisticsPanelVisible(newVisibility);
    playSound('panel-toggle');
    if (newVisibility) {
      setActivityBarSelection('statistics');
      setIsSidebarVisible(false); setIsSearchPanelVisible(false); setIsArticlesPanelVisible(false);
    } else if (activityBarSelection === 'statistics') {
      setActivityBarSelection(null);
    }
  }, [isStatisticsPanelVisible, activityBarSelection]);


  const handleReorderSidebarItems = useCallback((draggedItemId: string, targetItemId: string, parentId?: string) => {
    setOrderedSidebarItems(prevItems => {
        const reorder = (items: SidebarItemConfig[], currentParentId?: string): SidebarItemConfig[] => {
            if (currentParentId === parentId) { 
                const newItems = [...items];
                const draggedIndex = newItems.findIndex(item => item.id === draggedItemId);
                const targetIndex = newItems.findIndex(item => item.id === targetItemId);

                if (draggedIndex !== -1 && targetIndex !== -1 && draggedIndex !== targetIndex) {
                    const [dragged] = newItems.splice(draggedIndex, 1);
                    newItems.splice(targetIndex, 0, dragged);
                    playSound('ui-click');
                    return newItems;
                }
                return items; 
            }
            return items.map(item => {
                if (item.isFolder && item.children) {
                    return { ...item, children: reorder(item.children, item.id) };
                }
                return item;
            });
        };
        return reorder(prevItems, undefined); 
    });
  }, []);
  
  const handleReorderActivityBarItems = useCallback((draggedItemId: string, targetItemId: string) => {
    setOrderedActivityBarItemDefinitions(prevItems => {
      const draggedItemIndex = prevItems.findIndex(item => item.id === draggedItemId);
      const targetItemIndex = prevItems.findIndex(item => item.id === targetItemId);

      if (draggedItemIndex === -1 || targetItemIndex === -1 || draggedItemIndex === targetItemIndex) {
        return prevItems;
      }

      const newItems = [...prevItems];
      const [draggedItem] = newItems.splice(draggedItemIndex, 1);
      newItems.splice(targetItemIndex, 0, draggedItem);
      playSound('ui-click');
      return newItems;
    });
  }, []);

  const activityBarItems: ActivityBarItemConfig[] = useMemo(() => {
    return orderedActivityBarItemDefinitions.map(def => {
        let actionToCall: () => void;
        switch (def.viewId) {
            case 'explorer':   actionToCall = toggleSidebarVisibility; break;
            case 'search':     actionToCall = handleToggleSearchPanel; break;
            case 'articles':   actionToCall = handleToggleArticlesPanel; break;
            case 'statistics': actionToCall = handleToggleStatisticsPanel; break;
            case 'ai_chat_tab':actionToCall = handleOpenAIChatTab; break;
            default:           actionToCall = () => console.warn("Unknown activity bar item:", def.viewId);
        }
        return {
            ...def,
            icon: ICONS[def.iconName] || ICONS.default,
            action: actionToCall,
        };
    });
  }, [
    orderedActivityBarItemDefinitions,
    toggleSidebarVisibility,
    handleToggleSearchPanel,
    handleToggleArticlesPanel,
    handleToggleStatisticsPanel,
    handleOpenAIChatTab,
  ]);

  const handleThemeChange = useCallback((themeName: string) => { rawHandleThemeChange(themeName); playSound('setting-change'); }, [rawHandleThemeChange]);
  const handleFontFamilyChange = useCallback((fontId: string) => { rawHandleFontFamilyChange(fontId); playSound('setting-change'); }, [rawHandleFontFamilyChange]);
  const handleFontSizeChange = useCallback((sizeId: string) => { rawHandleFontSizeChange(sizeId); playSound('setting-change'); }, [rawHandleFontSizeChange]);
  const navigateTabHistoryBack = useCallback(() => { rawNavigateTabHistoryBack(); playSound('ui-click'); }, [rawNavigateTabHistoryBack]);
  const navigateTabHistoryForward = useCallback(() => { rawNavigateTabHistoryForward(); playSound('ui-click'); }, [rawNavigateTabHistoryForward]);
  const handleToggleFullscreen = useCallback(() => { rawHandleToggleFullscreen(); playSound('ui-click'); }, [rawHandleToggleFullscreen]);
  
  const commands = useMemo(() => generateCommands({ sidebarItems: orderedSidebarItems.flatMap(item => item.isFolder && item.children ? item.children : [item]), handleOpenTab, closeCommandPalette, isSidebarVisible, toggleSidebarVisibility, handleOpenAIChatTab, openCommandPalette, predefinedThemes: PREDEFINED_THEMES, handleThemeChange, currentThemeName, fontFamilyOptions: FONT_FAMILY_OPTIONS, handleFontFamilyChange, currentFontFamilyId, fontSizeOptions: FONT_SIZE_OPTIONS, handleFontSizeChange, currentFontSizeId, openAboutModal, icons: ICONS, handleToggleSearchPanel, handleToggleArticlesPanel, handleToggleStatisticsPanel, toggleTerminalVisibility: toggleTerminalPanel, togglePetsPanelVisibility: togglePetsPanel, handleToggleSoundMute, isSoundMuted, handleRunCVGenerator }), [ orderedSidebarItems, handleOpenTab, closeCommandPalette, isSidebarVisible, toggleSidebarVisibility, handleOpenAIChatTab, openCommandPalette, handleThemeChange, currentThemeName, handleFontFamilyChange, currentFontFamilyId, handleFontSizeChange, currentFontSizeId, openAboutModal, handleToggleSearchPanel, handleToggleArticlesPanel, handleToggleStatisticsPanel, toggleTerminalPanel, togglePetsPanel, handleToggleSoundMute, isSoundMuted, handleRunCVGenerator ]);
  
  const activeContentDetails = useMemo(() => {
    if (!currentActiveTab) return { content: '', type: 'none', fileName: undefined, projectId: undefined };

    switch (currentActiveTab.type) {
      case 'file':
        return {
          content: currentActiveTab.fileName ? generateFileContent(currentActiveTab.fileName, PORTFOLIO_DATA) : '{}',
          type: 'file',
          fileName: currentActiveTab.fileName
        };
      case 'project_detail':
        if (currentActiveTab.id.startsWith('ai_project_')) {
          const aiProject = aiGeneratedProjects.find(p => p.id === currentActiveTab.id);
          return { content: aiProject || { id: currentActiveTab.id, title: 'AI Project Not Found', description: '', technologies: [] }, type: 'project_detail', projectId: currentActiveTab.id };
        }
        return {
          content: generateProjectDetailContent(currentActiveTab.id, PORTFOLIO_DATA),
          type: 'project_detail',
          projectId: currentActiveTab.id
        };
      case 'ai_chat':
        return { content: "AI Chat Interface", type: 'ai_chat', fileName: undefined, projectId: undefined };
      case 'json_preview':
        if (currentActiveTab.fileName && (currentActiveTab.fileName.startsWith('project_') || currentActiveTab.fileName.startsWith('ai_project_'))) {
             if (currentActiveTab.fileName.startsWith('ai_project_')) {
                const aiProject = aiGeneratedProjects.find(p => p.id === currentActiveTab.fileName);
                return { content: aiProject ? JSON.stringify(aiProject, null, 2) : '{}', type: 'json_preview', fileName: currentActiveTab.fileName };
            }
            return { content: generateProjectDetailContent(currentActiveTab.fileName, PORTFOLIO_DATA), type: 'json_preview', fileName: currentActiveTab.fileName };
        } else if (currentActiveTab.fileName) {
             return { content: generateFileContent(currentActiveTab.fileName, PORTFOLIO_DATA), type: 'json_preview', fileName: currentActiveTab.fileName };
        }
        return { content: '{}', type: 'json_preview', fileName: currentActiveTab.fileName || 'unknown_preview_source.json' };

      case 'article_detail':
        const article = SAMPLE_ARTICLES.find(a => a.slug === currentActiveTab.articleSlug);
        return { content: article ? { markdown: article.contentMarkdown, imageUrl: article.imageUrl } : { markdown: '# Article Not Found' }, type: 'article_detail', fileName: undefined, projectId: undefined };
      case 'cv_preview': 
        return { content: PORTFOLIO_DATA, type: 'cv_preview', fileName: currentActiveTab.fileName };
      default:
        return { content: `Unsupported tab type: ${currentActiveTab.type}`, type: 'unknown', fileName: undefined, projectId: undefined };
    }
  }, [currentActiveTab, PORTFOLIO_DATA, aiGeneratedProjects, SAMPLE_ARTICLES]);

  const handleGlobalSearch = useCallback((term: string) => {
    setGlobalSearchTerm(term);
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    const results: SearchResultItem[] = [];
    const searchLower = term.toLowerCase();

    const searchInContent = (fileId: string, displayPath: string, content: string, tabType: Tab['type']) => {
      content.split('\n').forEach((line, index) => {
        if (line.toLowerCase().includes(searchLower)) {
          const highlightedLine = line.replace(new RegExp(term, 'gi'), match => `<mark>${match}</mark>`);
          results.push({
            id: `${fileId}-line-${index}`,
            fileId: fileId,
            fileDisplayPath: displayPath,
            lineNumber: index + 1,
            lineContent: highlightedLine,
            fullContent: content,
            tabType: tabType,
          });
        }
      });
    };
    
    orderedSidebarItems.forEach(folder => {
        (folder.children || [folder]).forEach(item => {
            if (!item.isFolder && item.fileName) {
                const content = generateFileContent(item.fileName, PORTFOLIO_DATA);
                searchInContent(item.id, item.fileName, content, 'file');
            }
        });
    });

    PORTFOLIO_DATA.projects.forEach((projectTitle, index) => {
      const projectId = `project_${index}_${projectTitle.toLowerCase().replace(/\s+/g, '_').replace(/[^\w-]+/g, '')}.json`;
      const content = generateProjectDetailContent(projectId, PORTFOLIO_DATA);
      searchInContent(projectId, `Project: ${projectTitle}`, content, 'project_detail');
    });

    SAMPLE_ARTICLES.forEach(article => {
        searchInContent(`article_${article.slug}`, `Article: ${article.title}`, article.contentMarkdown, 'article_detail');
    });

    setSearchResults(results);
  }, [setGlobalSearchTerm, setSearchResults, orderedSidebarItems, PORTFOLIO_DATA, SAMPLE_ARTICLES]);
  
  const handleOpenTabFromSearchResult = useCallback((result: SearchResultItem) => {
    const baseId = result.fileId.replace('_preview', '');
    const itemToOpen = 
        result.tabType === 'file' ? orderedSidebarItems.flatMap(f => f.children || [f]).find(i => i.id === baseId && i.fileName) :
        result.tabType === 'project_detail' ? { id: baseId, title: result.fileDisplayPath.replace('Project: ', ''), type: 'project_detail', fileName: baseId } :
        result.tabType === 'article_detail' ? SAMPLE_ARTICLES.find(a => `article_${a.slug}` === baseId) :
        null;

    if (itemToOpen) {
        if (result.tabType === 'article_detail' && itemToOpen) {
            handleOpenArticleTab(itemToOpen as ArticleItem);
        } else {
            handleOpenTab(itemToOpen as SidebarItemConfig | {id:string, title:string, type:Tab['type'], fileName:string});
        }
    }
    setIsSearchPanelVisible(false); 
  }, [handleOpenTab, handleOpenArticleTab, orderedSidebarItems, SAMPLE_ARTICLES]);

  const handleSelectExplorerView = () => { 
    toggleSidebarVisibility(); 
  };
  
  const activeArticleSlug = useMemo(() => currentActiveTab?.type === 'article_detail' ? currentActiveTab.articleSlug : null, [currentActiveTab]);
  const handleRunItemFromTitleBar = (config: { id: string, fileName: string, title: string, type: Tab['type'] }) => handleOpenTab(config, true);
  
  const bottomPanelTabs: { id: BottomPanelTabId; title: string; icon: React.ElementType }[] = [
    { id: 'terminal', title: 'Terminal', icon: ICONS.TerminalIcon },
    { id: 'pets', title: 'Pets', icon: ICONS.CatIcon },
  ];

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const diffMs = now.getTime() - appLoadTimeRef.current.getTime();
      const s = Math.floor((diffMs / 1000) % 60);
      const m = Math.floor((diffMs / (1000 * 60)) % 60);
      const h = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
      setMockStats(prev => ({
        ...prev,
        liveVisitors: Math.max(1, Math.min(10, prev.liveVisitors + (Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0))),
        todayVisits: prev.todayVisits + (Math.random() > 0.95 ? 1 : 0),
        uptime: `${h}h ${m}m ${s}s`,
      }));
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const isAnyLeftPanelVisible = isStatisticsPanelVisible || isArticlesPanelVisible || isSearchPanelVisible || isSidebarVisible;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[var(--app-background)]">
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
        sidebarItems={orderedSidebarItems.flatMap(item => item.isFolder && item.children ? item.children.filter(child => !child.isFolder) : (item.isFolder ? [] : [item]))}
        projects={PORTFOLIO_DATA.projects}
        onRunItem={handleRunItemFromTitleBar}
        onRunCVGenerator={handleRunCVGenerator} 
        onToggleTerminal={toggleTerminalPanel}
        onTogglePetsPanel={togglePetsPanel}
        onToggleStatisticsPanel={handleToggleStatisticsPanel}
        isSoundMuted={isSoundMuted}
        onToggleSoundMute={handleToggleSoundMute}
      />
      <div className="flex flex-1 min-h-0">
        <ActivityBar
          items={activityBarItems}
          onReorder={handleReorderActivityBarItems}
          activeViewId={activityBarSelection}
        />
        
        <div 
          id="left-panel-slot"
          className="relative flex flex-col flex-shrink-0 bg-[var(--sidebar-background)] transition-width duration-150 ease-in-out min-h-0 min-w-0"
          style={{ width: isAnyLeftPanelVisible ? `${leftPanelWidth}px` : '0px', overflow: 'hidden' }}
        >
            {isStatisticsPanelVisible && (
            <StatisticsPanel isVisible={isStatisticsPanelVisible} stats={mockStats} onClose={() => { setIsStatisticsPanelVisible(false); playSound('panel-toggle'); if (activityBarSelection === 'statistics') setActivityBarSelection(null); }} />
            )}
            {isArticlesPanelVisible && !isStatisticsPanelVisible && (
            <ArticlesPanel isVisible={isArticlesPanelVisible} articles={SAMPLE_ARTICLES} onClose={() => { setIsArticlesPanelVisible(false); playSound('panel-toggle'); if (activityBarSelection === 'articles') setActivityBarSelection(null); }} onSelectArticle={handleOpenArticleTab} activeArticleSlug={activeArticleSlug} />
            )}
            {isSearchPanelVisible && !isArticlesPanelVisible && !isStatisticsPanelVisible && (
            <SearchPanel isVisible={isSearchPanelVisible} searchTerm={globalSearchTerm} onSearchTermChange={handleGlobalSearch} results={searchResults} onResultClick={handleOpenTabFromSearchResult} onClose={() => { setIsSearchPanelVisible(false); playSound('panel-toggle'); if (activityBarSelection === 'search') setActivityBarSelection(null);}} />
            )}
            {isSidebarVisible && !isSearchPanelVisible && !isArticlesPanelVisible && !isStatisticsPanelVisible && (
                <Sidebar 
                    items={orderedSidebarItems} 
                    onOpenTab={handleOpenTab} 
                    onRunAction={handleSidebarAction} 
                    isVisible={isSidebarVisible} 
                    activeTabId={activeTabId} 
                    onReorderItems={handleReorderSidebarItems}
                    onContextMenuRequest={handleSidebarItemContextMenuRequest} 
                />
            )}
        </div>

        {isAnyLeftPanelVisible && ( <div ref={leftResizerRef} onMouseDown={handleLeftPanelResizeStart} className="resizer resizer-x cursor-col-resize w-1.5 bg-transparent hover:bg-[var(--focus-border)] transition-colors duration-100" /> )}

        <main className="flex-1 flex flex-col min-w-0 bg-[var(--editor-background)] overflow-hidden">
          <EditorTabs
            tabs={openTabs}
            activeTabId={activeTabId}
            onSelectTab={handleSelectTab}
            onCloseTab={handleCloseTab}
            onContextMenuRequest={handleEditorContextMenuRequest}
            onReorderTabs={handleReorderOpenTabs}
            isLoading={isPreviewTabLoading || isGeneratingCV} // Combined loading state
            onRunCVGeneratorFromTab={handleRunCVGenerator} // Pass handler for tab icon
          />
          <Breadcrumbs
            activeTab={currentActiveTab}
            portfolioData={PORTFOLIO_DATA}
            onOpenTab={handleOpenTab}
          />
          <div className="flex-1 overflow-hidden min-h-0 relative animate-fadeIn">
            {currentActiveTab ? (
                <TabContent
                    tab={currentActiveTab}
                    content={activeContentDetails.content}
                    portfolioData={PORTFOLIO_DATA}
                    onOpenProjectTab={handleOpenProjectTab}
                    currentThemeName={currentThemeName}
                    onContextMenuRequest={handleEditorContextMenuRequest} // Pass updated handler
                    aiGeneratedProjects={aiGeneratedProjects}
                    onSuggestNewAIProject={handleSuggestNewAIProject}
                    isAISuggestingProject={isAISuggestingProject}
                />
            ) : (
                <WelcomeView
                    portfolioData={PORTFOLIO_DATA}
                    onOpenTab={handleOpenTab}
                    onOpenAIChat={handleOpenAIChatTab}
                />
            )}
          </div>
          
          {isBottomPanelVisible && ( <div ref={bottomResizerRef} onMouseDown={handleBottomPanelResizeStart} className="resizer resizer-y cursor-row-resize h-1.5 bg-transparent hover:bg-[var(--focus-border)] transition-colors duration-100" /> )}
          {isBottomPanelVisible && (
            <div 
                className="flex flex-col bg-[var(--bottom-panel-tab-background)] transition-height duration-150 ease-in-out" 
                style={{ height: `${bottomPanelHeight}px` }}
            >
              <BottomPanelTabs tabs={bottomPanelTabs} activeTabId={activeBottomPanelId} onSelectTab={handleSelectBottomPanelTab} />
              <div className="flex-1 overflow-hidden min-h-0">
                {activeBottomPanelId === 'terminal' && <TerminalPanel output={terminalOutput} isRunning={isTerminalRunningCommand} onClose={handleCloseBottomPanel} />}
                {activeBottomPanelId === 'pets' && <PetsPanel onClose={handleCloseBottomPanel} />}
              </div>
            </div>
          )}
        </main>
      </div>
      <footer className="status-bar h-6 bg-[var(--statusbar-background)] text-[var(--statusbar-foreground)] px-3 flex items-center justify-between text-xs border-t border-[var(--statusbar-border)] flex-shrink-0">
        <div className="flex items-center space-x-3">
            <span title="Application Version">v{APP_VERSION}</span>
            <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-white" title="GitHub Repository">
                <ICONS.GitFork size={14} className="mr-1" />
                GitHub
            </a>
        </div>
        <div className="flex items-center space-x-3">
            <span>Ln ?, Col ?</span> 
            <span>Spaces: 2</span> 
            <span>UTF-8</span> 
            <button onClick={handleToggleSoundMute} title={isSoundMuted ? "Unmute Sounds" : "Mute Sounds"} className="hover:text-white">
                {isSoundMuted ? <ICONS.VolumeXIcon size={14} /> : <ICONS.Volume2Icon size={14} />}
            </button>
            <span title="Notifications">
                <ICONS.bell_icon size={14} />
            </span>
        </div>
      </footer>

      <CommandPalette isOpen={isCommandPaletteOpen} onClose={closeCommandPalette} commands={commands} />
      <AboutModal isOpen={isAboutModalOpen} onClose={closeAboutModal} />
      <ContextMenu x={editorContextMenuState.x} y={editorContextMenuState.y} items={editorContextMenuState.items} visible={editorContextMenuState.visible} onClose={closeEditorContextMenu} />
      <ContextMenu x={sidebarContextMenuState.x} y={sidebarContextMenuState.y} items={sidebarContextMenuState.items} visible={sidebarContextMenuState.visible} onClose={closeSidebarContextMenu} />
      <NotificationContainer notifications={notifications} onDismissNotification={removeNotification} />
    </div>
  );
};

export default App;
