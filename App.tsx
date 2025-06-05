

import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { Tab, PortfolioData, SidebarItemConfig, Command, ContextMenuItem, ActivityBarSelection, SearchResultItem, Theme, FontFamilyOption, FontSizeOption, ArticleItem, ProjectDetail, MockStatistics, ActivityBarItemDefinition, ActivityBarItemConfig, NotificationItem, EditorPaneId, EditorPaneState, LogEntry, LogLevel, NotificationType, BottomPanelTabId, ChatMessage } from './types';
import { PORTFOLIO_DATA, SIDEBAR_ITEMS as DEFAULT_SIDEBAR_ITEMS, generateFileContent, generateProjectDetailContent, ICONS, REPO_URL, APP_VERSION, DEFAULT_ACTIVITY_BAR_ITEMS, MAX_LOG_ENTRIES, MOCK_GITHUB_STATS } from './constants';
import { SAMPLE_ARTICLES } from './components/Articles/articlesData';
import { PREDEFINED_THEMES, FONT_FAMILY_OPTIONS, FONT_SIZE_OPTIONS, TERMINAL_FONT_SIZE_OPTIONS, DEFAULT_TERMINAL_FONT_SIZE_ID, DEFAULT_THEME_NAME, DEFAULT_FONT_FAMILY_ID, DEFAULT_FONT_SIZE_ID } from './themes';
import TitleBar from './components/TitleBar/TitleBar';
import ActivityBar from './components/ActivityBar';
import { Sidebar } from './components/Sidebar';
import EditorTabs from './components/EditorTabs';
import TabContent from './components/TabContent';
import Breadcrumbs from './components/Breadcrumbs';
import CommandPalette from './components/CommandPalette';
import AboutModal from './components/AboutModal';
import ContextMenu from './components/ContextMenu';
import WelcomeView from './components/WelcomeView';
import SearchPanel from './components/Search/SearchPanel';
import ArticlesPanel from './components/Articles/ArticlesPanel';
import StatisticsPanel from './components/StatisticsPanel';
import GitHubProfileView from './components/GitHubProfileView'; // Import GitHubProfileView
import TerminalPanel from './components/TerminalPanel';
import PetsPanel from './components/PetsPanel';
import LogsPanel from './components/LogsPanel'; // Import LogsPanel
import BottomPanelTabs from './components/BottomPanelTabs';
import NotificationContainer from './components/notifications/NotificationContainer';
import PasskeyPromptModal from './components/PasskeyPromptModal'; // Import new modal
import StatusBar from './components/StatusBar'; // Import StatusBar
import ProfilePopup from './components/ProfilePopup'; // Import ProfilePopup


import { useThemeManager } from './hooks/useThemeManager';
// useTabHistory hook is removed and its logic integrated into App.tsx
import { useFullscreen } from './hooks/useFullscreen';
import { useGlobalEventHandlers } from './hooks/useGlobalEventHandlers';
import { useNotifications } from './hooks/useNotifications';
import { useGeminiChat } from './hooks/useGeminiChat'; // Added for persistent chat
import { generateCommands } from './utils/commandUtils';
import { playSound, toggleMute, getMuteStatus } from './utils/audioUtils';
import { fetchAIProjectSuggestion } from './utils/aiUtils';
import './utils/firebase';
import { createCV_PDF } from './utils/cvGenerator'; // Added import


const DEFAULT_LEFT_PANEL_WIDTH = 256;
const MIN_LEFT_PANEL_WIDTH = 150;
const MAX_LEFT_PANEL_WIDTH = 600;

const DEFAULT_BOTTOM_PANEL_HEIGHT = 200;
const MIN_BOTTOM_PANEL_HEIGHT = 75;
const MAX_BOTTOM_PANEL_HEIGHT = 600;

const DEFAULT_EDITOR_SPLIT_PERCENTAGE = 50;


const initialPaneState: EditorPaneState = {
  openTabs: [],
  activeTabId: null,
  tabHistory: [],
  currentHistoryIndex: -1,
};

const App: React.FC = () => {
  const [currentTerminalFontSizeId, setCurrentTerminalFontSizeId] = useState<string>(() => localStorage.getItem('portfolio-terminal-font-size') || DEFAULT_TERMINAL_FONT_SIZE_ID);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const notificationsHook = useNotifications();


  const addAppLog = useCallback((level: LogLevel, message: string, source?: string, details?: Record<string, any>) => {
    setLogs(prevLogs => {
      const newLog: LogEntry = {
        id: crypto.randomUUID(),
        timestamp: new Date(),
        level,
        message,
        source: source || 'System',
        details,
      };
      const updatedLogs = [...prevLogs, newLog]; // Append new log
      if (updatedLogs.length > MAX_LOG_ENTRIES) {
        return updatedLogs.slice(-MAX_LOG_ENTRIES); // Keep the last MAX_LOG_ENTRIES
      }
      return updatedLogs;
    });
  }, []);

  // AI Chat State - Lifted to App.tsx for persistence
  const {
    messages: chatMessages,
    setMessages: setChatMessages, // Keep setMessages if useGeminiChat still needs to update it internally after loading from localStorage
    input: chatInput,
    setInput: setChatInput,
    isLoading: chatIsLoading,
    error: chatError,
    apiKeyAvailable: chatApiKeyAvailable,
    handleSendMessage: handleChatSendMessage,
  } = useGeminiChat(PORTFOLIO_DATA, addAppLog);


  const {
    currentThemeName,
    currentFontFamilyId,
    currentFontSizeId: currentEditorFontSizeId,
    handleThemeChange: rawHandleThemeChange,
    handleFontFamilyChange: rawHandleFontFamilyChange,
    handleFontSizeChange: rawHandleEditorFontSizeChange,
  } = useThemeManager(
    DEFAULT_THEME_NAME,
    DEFAULT_FONT_FAMILY_ID,
    DEFAULT_FONT_SIZE_ID,
    currentTerminalFontSizeId,
    TERMINAL_FONT_SIZE_OPTIONS
  );

  const [editorPanes, setEditorPanes] = useState<Record<EditorPaneId, EditorPaneState>>(() => {
    const saved = localStorage.getItem('portfolio-editorPanes');
    try {
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          left: { ...initialPaneState, ...(parsed.left || {}) },
          right: { ...initialPaneState, ...(parsed.right || {}) },
        };
      }
    } catch (e) { console.error("Failed to parse saved editorPanes state:", e); addAppLog('error', 'Failed to parse saved editor panes state from localStorage.', 'System', { error: e });}
    return { left: { ...initialPaneState }, right: { ...initialPaneState } };
  });

  const [focusedEditorPaneId, setFocusedEditorPaneId] = useState<EditorPaneId>(() => (localStorage.getItem('portfolio-focusedEditorPaneId') as EditorPaneId) || 'left');
  const [isRightEditorPaneVisible, setIsRightEditorPaneVisible] = useState<boolean>(() => localStorage.getItem('portfolio-isRightEditorPaneVisible') === 'true' || false);
  const [editorSplitPercentage, setEditorSplitPercentage] = useState<number>(() => {
    const saved = localStorage.getItem('portfolio-editorSplitPercentage');
    return saved ? parseInt(saved, 10) : DEFAULT_EDITOR_SPLIT_PERCENTAGE;
  });

  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(() => localStorage.getItem('portfolio-isSidebarVisible') === 'true' || false);
  const [isSearchPanelVisible, setIsSearchPanelVisible] = useState<boolean>(() => localStorage.getItem('portfolio-isSearchPanelVisible') === 'true' || false);
  const [isArticlesPanelVisible, setIsArticlesPanelVisible] = useState<boolean>(() => localStorage.getItem('portfolio-isArticlesPanelVisible') === 'true' || false);
  const [isStatisticsPanelVisible, setIsStatisticsPanelVisible] = useState<boolean>(() => localStorage.getItem('portfolio-isStatisticsPanelVisible') === 'true' || false);
  const [leftPanelWidth, setLeftPanelWidth] = useState<number>(() => { const saved = localStorage.getItem('portfolio-leftPanelWidth'); return saved ? parseInt(saved, 10) : DEFAULT_LEFT_PANEL_WIDTH; });
  const [bottomPanelHeight, setBottomPanelHeight] = useState<number>(() => { const saved = localStorage.getItem('portfolio-bottomPanelHeight'); return saved ? parseInt(saved, 10) : DEFAULT_BOTTOM_PANEL_HEIGHT; });
  const [globalSearchTerm, setGlobalSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [activityBarSelection, setActivityBarSelection] = useState<ActivityBarSelection>(null);
  const [orderedSidebarItems, setOrderedSidebarItems] = useState<SidebarItemConfig[]>(() => { const savedOrderRaw = localStorage.getItem('portfolio-sidebarItemOrder'); if (savedOrderRaw) { try { return [...DEFAULT_SIDEBAR_ITEMS]; } catch (e) { addAppLog('error', 'Failed to parse sidebar item order from localStorage.', 'System', { error: e }); return [...DEFAULT_SIDEBAR_ITEMS]; } } return [...DEFAULT_SIDEBAR_ITEMS]; });
  const [orderedActivityBarItemDefinitions, setOrderedActivityBarItemDefinitions] = useState<ActivityBarItemDefinition[]>(() => { const savedOrder = localStorage.getItem('portfolio-activityBarOrder'); if (savedOrder) { try { const ids: string[] = JSON.parse(savedOrder); const itemsFromStorage: ActivityBarItemDefinition[] = []; const defaultItemsMap = new Map(DEFAULT_ACTIVITY_BAR_ITEMS.map(item => [item.id, item])); ids.forEach(id => { if (defaultItemsMap.has(id)) { itemsFromStorage.push(defaultItemsMap.get(id)!); defaultItemsMap.delete(id); } }); defaultItemsMap.forEach(newItem => itemsFromStorage.push(newItem)); return itemsFromStorage; } catch (e) { addAppLog('error', 'Failed to parse activity bar order from localStorage.', 'System', { error: e }); return [...DEFAULT_ACTIVITY_BAR_ITEMS]; } } return [...DEFAULT_ACTIVITY_BAR_ITEMS]; });

  const { isFullscreen, handleToggleFullscreen: rawHandleToggleFullscreen } = useFullscreen();
  
  const addNotificationAndLog = useCallback((message: string, type: NotificationType, duration?: number, actions?: { label: string; onClick: () => void; }[], icon?: any) => {
      notificationsHook.addNotification(message, type, duration, actions, icon);
      let logLevel: LogLevel = 'info';
      if (type === 'error') logLevel = 'error';
      else if (type === 'warning') logLevel = 'warning';
      else if (type === 'success') logLevel = 'info'; // Map success to info for logs
      addAppLog(logLevel, `Notification shown: "${message}"`, 'SystemUI', { notificationType: type, duration, actions: actions?.map(a => a.label) });
  }, [notificationsHook, addAppLog]);


  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isPasskeyPromptOpen, setIsPasskeyPromptOpen] = useState(false); 
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false); 
  const [profilePopupAnchorEl, setProfilePopupAnchorEl] = useState<HTMLElement | null>(null); 

  const [editorContextMenuState, setEditorContextMenuState] = useState<{ x: number; y: number; items: ContextMenuItem[]; visible: boolean; tabId?: string, paneId?: EditorPaneId }>({ x: 0, y: 0, items: [], visible: false });
  const [sidebarContextMenuState, setSidebarContextMenuState] = useState<{ x: number; y: number; items: ContextMenuItem[]; visible: boolean; itemId?: string }>({ x: 0, y: 0, items: [], visible: false });
  const [isPreviewTabLoading, setIsPreviewTabLoading] = useState(false);
  const [isGeneratingCV, setIsGeneratingCV] = useState(false);
  const loadingTimeoutRef = useRef<number | null>(null);
  const [isBottomPanelVisible, setIsBottomPanelVisible] = useState<boolean>(() => localStorage.getItem('portfolio-isBottomPanelVisible') === 'true' || false);
  const [activeBottomPanelId, setActiveBottomPanelId] = useState<BottomPanelTabId>(() => (localStorage.getItem('portfolio-activeBottomPanelId') as BottomPanelTabId | null) || 'terminal');
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [isTerminalRunningCommand, setIsTerminalRunningCommand] = useState(false);
  const terminalAnimationIntervalRef = useRef<number | null>(null);
  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(getMuteStatus());
  const [aiGeneratedProjects, setAiGeneratedProjects] = useState<ProjectDetail[]>([]);
  const [isAISuggestingProject, setIsAISuggestingProject] = useState(false);
  const [mockStats, setMockStats] = useState<MockStatistics>({ liveVisitors: Math.floor(Math.random() * 5) + 1, todayVisits: Math.floor(Math.random() * 20) + 5, uptime: '0s', mostVisitedPage: DEFAULT_SIDEBAR_ITEMS[0]?.children?.[0]?.fileName || 'about.json', currentlyViewed: ['about.json', 'projects.json'], });
  const appLoadTimeRef = useRef<Date>(new Date());
  const isLeftPanelResizing = useRef(false);
  const isBottomPanelResizing = useRef(false);
  const isEditorResizing = useRef(false);
  
  const leftPanelContainerRef = useRef<HTMLDivElement>(null); 
  const leftResizerRef = useRef<HTMLDivElement>(null); 

  const bottomResizerRef = useRef<HTMLDivElement>(null);
  const editorResizerRef = useRef<HTMLDivElement>(null);
  const [isDevModeEnabled, setIsDevModeEnabled] = useState<boolean>(() => localStorage.getItem('portfolio-isDevModeEnabled') === 'true' || false);


  useEffect(() => { localStorage.setItem('portfolio-editorPanes', JSON.stringify(editorPanes)); }, [editorPanes]);
  useEffect(() => { localStorage.setItem('portfolio-focusedEditorPaneId', focusedEditorPaneId); }, [focusedEditorPaneId]);
  useEffect(() => { localStorage.setItem('portfolio-isRightEditorPaneVisible', String(isRightEditorPaneVisible)); }, [isRightEditorPaneVisible]);
  useEffect(() => { localStorage.setItem('portfolio-editorSplitPercentage', String(editorSplitPercentage)); }, [editorSplitPercentage]);
  useEffect(() => { localStorage.setItem('portfolio-isDevModeEnabled', String(isDevModeEnabled)); }, [isDevModeEnabled]);


  useEffect(() => { localStorage.setItem('portfolio-isSidebarVisible', String(isSidebarVisible)); }, [isSidebarVisible]);
  useEffect(() => { localStorage.setItem('portfolio-isSearchPanelVisible', String(isSearchPanelVisible)); }, [isSearchPanelVisible]);
  useEffect(() => { localStorage.setItem('portfolio-isArticlesPanelVisible', String(isArticlesPanelVisible)); }, [isArticlesPanelVisible]);
  useEffect(() => { localStorage.setItem('portfolio-isStatisticsPanelVisible', String(isStatisticsPanelVisible)); }, [isStatisticsPanelVisible]);
  useEffect(() => { localStorage.setItem('portfolio-leftPanelWidth', String(leftPanelWidth)); }, [leftPanelWidth]);
  useEffect(() => { localStorage.setItem('portfolio-bottomPanelHeight', String(bottomPanelHeight)); }, [bottomPanelHeight]);
  useEffect(() => { localStorage.setItem('portfolio-isBottomPanelVisible', String(isBottomPanelVisible)); }, [isBottomPanelVisible]);
  useEffect(() => { localStorage.setItem('portfolio-activeBottomPanelId', activeBottomPanelId); }, [activeBottomPanelId]);
  useEffect(() => { localStorage.setItem('portfolio-activityBarOrder', JSON.stringify(orderedActivityBarItemDefinitions.map(item => item.id)));}, [orderedActivityBarItemDefinitions]);
  useEffect(() => { localStorage.setItem('portfolio-terminal-font-size', currentTerminalFontSizeId); }, [currentTerminalFontSizeId]);

  const updateTabHistoryOnActivation = useCallback((paneId: EditorPaneId, newActiveTabId: string | null) => {
    setEditorPanes(prevPanes => {
      const pane = prevPanes[paneId];
      if (newActiveTabId === null) return prevPanes;

      const newHistoryBase = pane.tabHistory.slice(0, pane.currentHistoryIndex + 1);
      if (newHistoryBase[newHistoryBase.length - 1] !== newActiveTabId) {
        newHistoryBase.push(newActiveTabId);
      }
      return {
        ...prevPanes,
        [paneId]: {
          ...pane,
          tabHistory: newHistoryBase,
          currentHistoryIndex: newHistoryBase.length - 1,
        },
      };
    });
  }, []);

  const cleanTabHistoryOnClose = useCallback((paneId: EditorPaneId, closedTabId: string, newActiveTabIdForPane: string | null) => {
    setEditorPanes(prevPanes => {
      const pane = prevPanes[paneId];
      const filteredHistory = pane.tabHistory.filter(id => id !== closedTabId);
      let newIndex = -1;
      if (newActiveTabIdForPane) {
        newIndex = filteredHistory.indexOf(newActiveTabIdForPane);
        if (newIndex === -1 && filteredHistory.length > 0) newIndex = filteredHistory.length - 1;
      } else if (filteredHistory.length > 0) {
        newIndex = filteredHistory.length - 1;
      }
      return {
        ...prevPanes,
        [paneId]: { ...pane, tabHistory: filteredHistory, currentHistoryIndex: newIndex },
      };
    });
  }, []);

  const navigateTabHistoryBack = useCallback((paneId: EditorPaneId) => {
    setEditorPanes(prevPanes => {
      const pane = prevPanes[paneId];
      if (pane.currentHistoryIndex > 0) {
        const newIndex = pane.currentHistoryIndex - 1;
        addAppLog('action', `Navigated back in tab history in ${paneId} pane. New active tab: ${pane.tabHistory[newIndex]}.`, 'User');
        return {
          ...prevPanes,
          [paneId]: { ...pane, activeTabId: pane.tabHistory[newIndex], currentHistoryIndex: newIndex },
        };
      }
      return prevPanes;
    });
    playSound('ui-click');
  }, [addAppLog]);

  const navigateTabHistoryForward = useCallback((paneId: EditorPaneId) => {
    setEditorPanes(prevPanes => {
      const pane = prevPanes[paneId];
      if (pane.currentHistoryIndex < pane.tabHistory.length - 1) {
        const newIndex = pane.currentHistoryIndex + 1;
        addAppLog('action', `Navigated forward in tab history in ${paneId} pane. New active tab: ${pane.tabHistory[newIndex]}.`, 'User');
        return {
          ...prevPanes,
          [paneId]: { ...pane, activeTabId: pane.tabHistory[newIndex], currentHistoryIndex: newIndex },
        };
      }
      return prevPanes;
    });
    playSound('ui-click');
  }, [addAppLog]);

  const setActiveTabIdForPane = useCallback((paneId: EditorPaneId, tabId: string | null) => {
    setEditorPanes(prevPanes => ({
      ...prevPanes,
      [paneId]: { ...prevPanes[paneId], activeTabId: tabId }
    }));
    if (tabId) {
        addAppLog('action', `Selected tab: ${tabId} in ${paneId} pane.`, 'User');
        updateTabHistoryOnActivation(paneId, tabId);
    }
  }, [updateTabHistoryOnActivation, addAppLog]);

  const handleLeftPanelDragging = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isLeftPanelResizing.current || !leftPanelContainerRef.current) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const mainLeft = leftPanelContainerRef.current.getBoundingClientRect().left;
    const newWidth = clientX - mainLeft;
    setLeftPanelWidth(Math.max(MIN_LEFT_PANEL_WIDTH, Math.min(newWidth, MAX_LEFT_PANEL_WIDTH)));
  }, []);

  const handleLeftPanelResizeStart = useCallback((e: React.MouseEvent | React.TouchEvent) => { isLeftPanelResizing.current = true; document.body.style.cursor = 'col-resize'; document.addEventListener('mousemove', handleLeftPanelDragging); document.addEventListener('mouseup', handleLeftPanelResizeEnd); document.addEventListener('touchmove', handleLeftPanelDragging as any); document.addEventListener('touchend', handleLeftPanelResizeEnd as any);}, [handleLeftPanelDragging]);
  const handleLeftPanelResizeEnd = useCallback(() => { isLeftPanelResizing.current = false; document.body.style.cursor = 'default'; document.removeEventListener('mousemove', handleLeftPanelDragging); document.removeEventListener('mouseup', handleLeftPanelResizeEnd); document.removeEventListener('touchmove', handleLeftPanelDragging as any); document.removeEventListener('touchend', handleLeftPanelResizeEnd as any); addAppLog('debug', `Resized left panel to ${leftPanelWidth}px.`, 'User') }, [addAppLog, leftPanelWidth, handleLeftPanelDragging]);
  
  const handleBottomPanelResizeStart = useCallback((e: React.MouseEvent | React.TouchEvent) => { isBottomPanelResizing.current = true; document.body.style.cursor = 'row-resize'; document.addEventListener('mousemove', handleBottomPanelDragging); document.addEventListener('mouseup', handleBottomPanelResizeEnd); document.addEventListener('touchmove', handleBottomPanelDragging as any); document.addEventListener('touchend', handleBottomPanelResizeEnd as any); }, []);
  const handleBottomPanelDragging = useCallback((e: MouseEvent | TouchEvent) => { if (!isBottomPanelResizing.current) return; const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY; const newHeight = window.innerHeight - clientY - (bottomResizerRef.current?.parentElement?.querySelector('footer')?.offsetHeight || 0); setBottomPanelHeight(Math.max(MIN_BOTTOM_PANEL_HEIGHT, Math.min(newHeight, MAX_BOTTOM_PANEL_HEIGHT))); }, []);
  const handleBottomPanelResizeEnd = useCallback(() => { isBottomPanelResizing.current = false; document.body.style.cursor = 'default'; document.removeEventListener('mousemove', handleBottomPanelDragging); document.removeEventListener('mouseup', handleBottomPanelResizeEnd); document.removeEventListener('touchmove', handleBottomPanelDragging as any); document.removeEventListener('touchend', handleBottomPanelResizeEnd as any); addAppLog('debug', `Resized bottom panel to ${bottomPanelHeight}px.`, 'User')}, [addAppLog, bottomPanelHeight]);

  const handleEditorResizeStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    isEditorResizing.current = true;
    document.body.style.cursor = 'col-resize';
    document.addEventListener('mousemove', handleEditorDragging);
    document.addEventListener('mouseup', handleEditorResizeEnd);
    document.addEventListener('touchmove', handleEditorDragging as any);
    document.addEventListener('touchend', handleEditorResizeEnd as any);
  }, []);

  const handleEditorDragging = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isEditorResizing.current || !editorResizerRef.current?.parentElement) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const parentRect = editorResizerRef.current.parentElement.getBoundingClientRect();
    const newLeftWidth = clientX - parentRect.left;
    const newPercentage = (newLeftWidth / parentRect.width) * 100;
    setEditorSplitPercentage(Math.max(10, Math.min(newPercentage, 90)));
  }, []);

  const handleEditorResizeEnd = useCallback(() => {
    isEditorResizing.current = false;
    document.body.style.cursor = 'default';
    document.removeEventListener('mousemove', handleEditorDragging);
    document.removeEventListener('mouseup', handleEditorResizeEnd);
    document.removeEventListener('touchmove', handleEditorDragging as any);
    document.removeEventListener('touchend', handleEditorResizeEnd as any);
    addAppLog('debug', `Resized editor split to ${editorSplitPercentage.toFixed(1)}%.`, 'User');
  }, [addAppLog, editorSplitPercentage]);

  const handleToggleSoundMute = useCallback(() => { const newMuteStatus = toggleMute(); setIsSoundMuted(newMuteStatus); addAppLog('action', `Sound effects ${newMuteStatus ? 'muted' : 'unmuted'}.`, 'User'); }, [addAppLog]);

  const currentActiveTabForFocusedPane = useMemo(() => editorPanes[focusedEditorPaneId].openTabs.find(tab => tab.id === editorPanes[focusedEditorPaneId].activeTabId), [editorPanes, focusedEditorPaneId]);

  useEffect(() => {
    document.title = currentActiveTabForFocusedPane ? `${currentActiveTabForFocusedPane.title} - ${PORTFOLIO_DATA.name} | PORTO CODE` : `PORTO CODE - ${PORTFOLIO_DATA.name}`;
  }, [currentActiveTabForFocusedPane, PORTFOLIO_DATA.name]);

  useEffect(() => {
    const currentTab = currentActiveTabForFocusedPane;
    if (currentTab?.type === 'article_detail') setActivityBarSelection('articles');
    else if (currentTab?.type === 'ai_chat') setActivityBarSelection('ai_chat_tab');
    else if (currentTab?.type === 'github_profile_view') setActivityBarSelection('github_profile_view');
    else if (isStatisticsPanelVisible) setActivityBarSelection('statistics');
    else if (isArticlesPanelVisible) setActivityBarSelection('articles');
    else if (isSearchPanelVisible) setActivityBarSelection('search');
    else if (isSidebarVisible) setActivityBarSelection('explorer');
    else setActivityBarSelection(null);
  }, [currentActiveTabForFocusedPane, isSidebarVisible, isSearchPanelVisible, isArticlesPanelVisible, isStatisticsPanelVisible]);

  const appendToTerminalOutput = useCallback((text: string) => { setTerminalOutput(prev => { const newOutput = [...prev, text]; return newOutput.length > 200 ? newOutput.slice(newOutput.length - 200) : newOutput; }); }, []);
  const clearTerminalOutput = useCallback(() => setTerminalOutput([]), []);
  
  useEffect(() => {
    const randomUserId = Math.floor(Math.random() * 9000) + 1000;
    addAppLog('info', 'Application initialized.', 'System', { version: APP_VERSION });
    appendToTerminalOutput("Initializing PORTO CODE environment...");
    setTimeout(() => {
      appendToTerminalOutput(`🐾 New session started. Virtual companion 'CodeCat_${randomUserId}' assigned.`);
      appendToTerminalOutput(`Welcome, User #${randomUserId}! Explore the portfolio.`);
      addAppLog('info', `New session for User #${randomUserId}. Companion: CodeCat_${randomUserId}.`, 'System');
    }, 500);
  }, [appendToTerminalOutput, addAppLog]);

  const simulateTerminalRun = useCallback((commandName: string, durationMs: number = 2000, customSteps?: string[]) => { if (terminalAnimationIntervalRef.current) clearInterval(terminalAnimationIntervalRef.current); playSound('terminal-run'); setIsBottomPanelVisible(true); setActiveBottomPanelId('terminal'); clearTerminalOutput(); setIsTerminalRunningCommand(true); appendToTerminalOutput(`> Running ${commandName}...`); addAppLog('action', `Terminal command started: ${commandName}.`, 'System'); if (customSteps && customSteps.length > 0) { let stepIndex = 0; const stepDuration = durationMs / customSteps.length; terminalAnimationIntervalRef.current = window.setInterval(() => { if (stepIndex < customSteps.length) { appendToTerminalOutput(customSteps[stepIndex]); stepIndex++; } if (stepIndex >= customSteps.length) { if (terminalAnimationIntervalRef.current) clearInterval(terminalAnimationIntervalRef.current); terminalAnimationIntervalRef.current = null; appendToTerminalOutput(`${commandName} finished successfully.`); setIsTerminalRunningCommand(false); playSound('terminal-complete'); addAppLog('info', `Terminal command finished: ${commandName}.`, 'System'); } }, stepDuration); } else { let dots = 0; const maxDots = 3; const animationSteps = durationMs / 500; let currentStep = 0; terminalAnimationIntervalRef.current = window.setInterval(() => { dots = (dots + 1) % (maxDots + 1); appendToTerminalOutput(`Processing${'.'.repeat(dots)}`); currentStep++; if (currentStep >= animationSteps) { if (terminalAnimationIntervalRef.current) clearInterval(terminalAnimationIntervalRef.current); terminalAnimationIntervalRef.current = null; appendToTerminalOutput(`${commandName} finished successfully.`); setIsTerminalRunningCommand(false); playSound('terminal-complete'); addAppLog('info', `Terminal command finished: ${commandName}.`, 'System'); } }, 500); } }, [appendToTerminalOutput, clearTerminalOutput, addAppLog]);

  const handleOpenTab = useCallback((itemOrConfig: SidebarItemConfig | { id?: string, fileName?: string, type?: Tab['type'], title?: string, articleSlug?: string, githubUsername?: string }, isRunAction: boolean = false, targetPaneId: EditorPaneId = focusedEditorPaneId) => {
    if ('isFolder' in itemOrConfig && itemOrConfig.isFolder) return;

    let idToOpen: string, tabTitle: string, tabType: Tab['type'], tabFileName: string | undefined, tabArticleSlug: string | undefined, tabGitHubUsername: string | undefined;
    
    if ('icon' in itemOrConfig && 'label' in itemOrConfig) { // SidebarItemConfig
      const config = itemOrConfig as SidebarItemConfig;
      idToOpen = config.id; tabTitle = config.title || config.fileName || config.label; tabType = config.type || 'file'; tabFileName = config.fileName;
    } else { // Direct config object
      const config = itemOrConfig as { id?: string, fileName?: string, type?: Tab['type'], title?: string, articleSlug?: string, githubUsername?: string };
      idToOpen = config.id || config.fileName || (config.type === 'github_profile_view' && config.githubUsername ? `github_profile_${config.githubUsername}` : (config.type === 'ai_chat' ? 'ai_chat_tab' : `unknown-tab-${Date.now()}` ) );
      tabTitle = config.title || config.fileName || (config.type === 'github_profile_view' && config.githubUsername ? `${config.githubUsername} - GitHub` : (config.type === 'ai_chat' ? 'AI Assistant' : "Untitled") );
      tabType = config.type || 'file';
      tabFileName = config.fileName;
      tabArticleSlug = config.articleSlug;
      tabGitHubUsername = config.githubUsername;
    }
    addAppLog('action', `Opening tab: "${tabTitle}" (Type: ${tabType}, ID: ${idToOpen}) in ${targetPaneId} pane. Run action: ${isRunAction}.`, 'User', { fileName: tabFileName, articleSlug: tabArticleSlug, githubUsername: tabGitHubUsername });


    if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
    if (isRunAction && tabType === 'json_preview') {
      simulateTerminalRun(tabTitle);
      setIsPreviewTabLoading(true);
      loadingTimeoutRef.current = window.setTimeout(() => setIsPreviewTabLoading(false), 1200);
    } else if (tabType !== 'cv_preview' && tabType !== 'settings_editor' && tabType !== 'github_profile_view') {
      playSound('tab-open');
    }

    setEditorPanes(prevPanes => {
      const pane = prevPanes[targetPaneId];
      const existingTab = pane.openTabs.find(tab => tab.id === idToOpen);
      let newPaneState = { ...pane };

      if (existingTab) {
        newPaneState.activeTabId = existingTab.id;
        if(tabType !== 'cv_preview' && tabType !== 'settings_editor' && tabType !== 'github_profile_view') playSound('tab-select');
      } else {
        const newTab: Tab = { id: idToOpen, title: tabTitle, type: tabType, fileName: tabFileName, articleSlug: tabArticleSlug, githubUsername: tabGitHubUsername };
        newPaneState.openTabs = [...pane.openTabs, newTab];
        newPaneState.activeTabId = newTab.id;
      }

      if (newPaneState.activeTabId) {
        const newHistoryBase = newPaneState.tabHistory.slice(0, newPaneState.currentHistoryIndex + 1);
        if (newHistoryBase[newHistoryBase.length - 1] !== newPaneState.activeTabId) {
            newHistoryBase.push(newPaneState.activeTabId);
        }
        newPaneState.tabHistory = newHistoryBase;
        newPaneState.currentHistoryIndex = newHistoryBase.length - 1;
      }
      return { ...prevPanes, [targetPaneId]: newPaneState };
    });
    if (!isRightEditorPaneVisible && targetPaneId === 'right') {
      setIsRightEditorPaneVisible(true); 
    }
    setFocusedEditorPaneId(targetPaneId);

    if (tabType === 'article_detail' || tabType === 'ai_chat' || tabType === 'settings_editor' || tabType === 'github_profile_view') {
      setIsSearchPanelVisible(false); setIsSidebarVisible(false); setIsStatisticsPanelVisible(false); 
      if (tabType === 'ai_chat' || tabType === 'settings_editor' || tabType === 'github_profile_view') setIsArticlesPanelVisible(false);
    } else if (!isRunAction && tabType !== 'cv_preview') {
      setIsSearchPanelVisible(false); setIsArticlesPanelVisible(false); setIsStatisticsPanelVisible(false);
    }
  }, [focusedEditorPaneId, simulateTerminalRun, isRightEditorPaneVisible, addAppLog]);

  const handleRunCVGenerator = useCallback(async () => { addAppLog('action', 'CV generation process started.', 'User'); setIsGeneratingCV(true); const cvSteps = [ "Starting CV generation...", "Fetching portfolio data...", "Initializing PDF document with pdf-lib...", "Formatting header and contact information...", "Adding summary section...", "Processing work experience entries...", "Detailing education background...", "Listing key skills...", "Compiling PDF structure...", "Finalizing PDF document...", ]; simulateTerminalRun("generate_cv.ts", 5000, cvSteps); let pdfBytes: Uint8Array | null = null; try { pdfBytes = await createCV_PDF(PORTFOLIO_DATA); appendToTerminalOutput("PDF bytes generated successfully."); } catch (error) { console.error("Error generating CV PDF:", error); appendToTerminalOutput(`Error during PDF generation: ${error instanceof Error ? error.message : String(error)}`); addNotificationAndLog("Failed to generate CV PDF.", 'error', 7000, undefined, ICONS.FileText); addAppLog('error', 'CV PDF generation failed.', 'System', { error }); playSound('error'); setIsGeneratingCV(false); return; } setTimeout(() => { setIsGeneratingCV(false); const cvTabId = 'cv_nandang_eka_prasetya.pdf'; const cvTabTitle = 'Nandang_Eka_Prasetya_CV.pdf'; if (pdfBytes) { const blob = new Blob([pdfBytes], { type: 'application/pdf' }); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = cvTabTitle; document.body.appendChild(link); link.click(); document.body.removeChild(link); URL.revokeObjectURL(link.href); appendToTerminalOutput(`${cvTabTitle} download initiated.`); addNotificationAndLog( `CV downloaded: ${cvTabTitle}`, 'success', 7000, [{ label: 'Open Preview', onClick: () => handleOpenTab({ id: cvTabId, title: cvTabTitle, type: 'cv_preview' }) }], ICONS.cv_preview_icon ); addAppLog('info', `CV downloaded: ${cvTabTitle}.`, 'System'); } else { addNotificationAndLog("CV PDF generation failed. Preview unavailable.", 'error', 7000, undefined, ICONS.FileText); addAppLog('error', 'CV PDF generation failed, preview unavailable.', 'System'); } handleOpenTab({ id: cvTabId, title: cvTabTitle, type: 'cv_preview', fileName: cvTabId, }, false, focusedEditorPaneId); playSound('notification'); }, 5100); }, [simulateTerminalRun, handleOpenTab, addNotificationAndLog, appendToTerminalOutput, focusedEditorPaneId, addAppLog]);
  const handleSidebarAction = useCallback((actionType: SidebarItemConfig['actionType'], item: SidebarItemConfig) => { if (item.actionType === 'open_tab' || !item.actionType) { handleOpenTab(item, false, focusedEditorPaneId); } else { console.warn("Unhandled sidebar action type:", actionType); addAppLog('warning', `Unhandled sidebar action: ${actionType} for item ${item.label}.`, 'System'); } }, [handleOpenTab, focusedEditorPaneId, addAppLog]);
  const handleOpenProjectTab = useCallback((projectId: string, projectTitle: string) => { handleOpenTab({ id: projectId, fileName: projectId, type: 'project_detail', title: projectTitle }, false, focusedEditorPaneId); }, [handleOpenTab, focusedEditorPaneId]);

  const handleOpenPreviewTab = useCallback((originalFileTabId: string, isRunContext: boolean = false, targetPaneId: EditorPaneId = focusedEditorPaneId) => {
    const paneToSearch = editorPanes[targetPaneId];
    let originalItemSource: Tab | SidebarItemConfig | undefined = paneToSearch.openTabs.find(t => t.id === originalFileTabId);
    if (!originalItemSource) { const findInSidebar = (items: SidebarItemConfig[]): SidebarItemConfig | undefined => { for (const item of items) { if (item.id === originalFileTabId && !item.isFolder) return item; if (item.isFolder && item.children) { const found = findInSidebar(item.children); if (found) return found; } } return undefined; }; originalItemSource = findInSidebar(orderedSidebarItems); }
    if (!originalItemSource || !originalItemSource.fileName) { console.warn("Could not find original file to preview:", originalFileTabId); addAppLog('warning', `Could not find original file to preview: ${originalFileTabId}.`, 'System'); playSound('error'); return; }
    const previewTabId = `${originalItemSource.id}_preview`; const previewTabTitle = `Preview: ${originalItemSource.title || originalItemSource.fileName}`;
    handleOpenTab({ id: previewTabId, fileName: originalItemSource.fileName, type: 'json_preview', title: previewTabTitle, }, isRunContext, targetPaneId);
  }, [editorPanes, handleOpenTab, orderedSidebarItems, focusedEditorPaneId, addAppLog]);

  const handleOpenArticleTab = useCallback((article: ArticleItem) => { handleOpenTab({ id: `article_${article.slug}`, type: 'article_detail', title: article.title, articleSlug: article.slug, }, false, focusedEditorPaneId); }, [handleOpenTab, focusedEditorPaneId]);
  const handleOpenSettingsEditor = useCallback(() => { const settingsTabId = 'settings_editor_tab'; const settingsTabTitle = 'Settings'; handleOpenTab({ id: settingsTabId, title: settingsTabTitle, type: 'settings_editor', }, false, focusedEditorPaneId); addAppLog('action', 'Opened Settings editor.', 'User'); }, [handleOpenTab, focusedEditorPaneId, addAppLog]);
  
  const handleOpenGitHubProfileTab = useCallback(() => {
    const githubUrl = PORTFOLIO_DATA.otherSocial?.url;
    let username = 'github_user'; 
    if (PORTFOLIO_DATA.otherSocial?.name === 'GitHub' && githubUrl) {
        const parts = githubUrl.split('/');
        const potentialUsername = parts.pop() || parts.pop(); 
        if (potentialUsername) username = potentialUsername;
    }
    const tabId = `github_profile_${username}`;
    const tabTitle = `${username} - GitHub`;
    handleOpenTab({ id: tabId, title: tabTitle, type: 'github_profile_view', githubUsername: username }, false, focusedEditorPaneId);
    addAppLog('action', `Opened GitHub Profile tab for ${username}.`, 'User');
  }, [handleOpenTab, focusedEditorPaneId, addAppLog]);


  const handleSelectTab = useCallback((paneId: EditorPaneId, tabId: string) => {
    playSound('tab-select');
    setActiveTabIdForPane(paneId, tabId);
    setFocusedEditorPaneId(paneId);
  }, [setActiveTabIdForPane]);

  const handleCloseTab = useCallback((paneId: EditorPaneId, tabIdToClose: string) => {
    playSound('tab-close');
    addAppLog('action', `Closed tab: ${tabIdToClose} in ${paneId} pane.`, 'User');
    let newActiveTabIdForPane: string | null = null;
    const pane = editorPanes[paneId];
    const closedTabIndex = pane.openTabs.findIndex(tab => tab.id === tabIdToClose);

    if (tabIdToClose === pane.activeTabId) {
      const historyWithoutClosed = pane.tabHistory.filter(id => id !== tabIdToClose);
      let newIndex = pane.currentHistoryIndex;
      if (pane.tabHistory.indexOf(tabIdToClose) <= newIndex) {
        newIndex--;
      }
      newIndex = Math.max(-1, newIndex); 

      if (newIndex >= 0 && newIndex < historyWithoutClosed.length && pane.openTabs.some(t => t.id === historyWithoutClosed[newIndex] && t.id !== tabIdToClose)) {
        newActiveTabIdForPane = historyWithoutClosed[newIndex];
      } else if (closedTabIndex > 0 && pane.openTabs.length > 1) {
        newActiveTabIdForPane = pane.openTabs[closedTabIndex - 1].id;
      } else if (pane.openTabs.length > 1 && closedTabIndex < pane.openTabs.length - 1 ) {
        newActiveTabIdForPane = pane.openTabs[closedTabIndex + 1].id;
      } else if (pane.openTabs.length > 1) { 
        newActiveTabIdForPane = pane.openTabs.find(t => t.id !== tabIdToClose)?.id || null;
      }
    } else {
      newActiveTabIdForPane = pane.activeTabId;
    }

    const newOpenTabsForPane = pane.openTabs.filter(tab => tab.id !== tabIdToClose);
    if (newOpenTabsForPane.length > 0 && !newOpenTabsForPane.some(t => t.id === newActiveTabIdForPane)) {
        newActiveTabIdForPane = newOpenTabsForPane[0].id;
    } else if (newOpenTabsForPane.length === 0) {
        newActiveTabIdForPane = null;
    }

    setEditorPanes(prevPanes => ({
      ...prevPanes,
      [paneId]: { ...prevPanes[paneId], openTabs: newOpenTabsForPane, activeTabId: newActiveTabIdForPane }
    }));
    cleanTabHistoryOnClose(paneId, tabIdToClose, newActiveTabIdForPane);
    if (newActiveTabIdForPane) updateTabHistoryOnActivation(paneId, newActiveTabIdForPane);

  }, [editorPanes, cleanTabHistoryOnClose, updateTabHistoryOnActivation, addAppLog]);

  const handleReorderOpenTabs = useCallback((paneId: EditorPaneId, draggedTabId: string, targetTabId: string | null) => {
    setEditorPanes(prevPanes => {
      const pane = prevPanes[paneId];
      const draggedTabIndex = pane.openTabs.findIndex(tab => tab.id === draggedTabId);
      if (draggedTabIndex === -1) return prevPanes;

      const newTabs = [...pane.openTabs];
      const [draggedTab] = newTabs.splice(draggedTabIndex, 1);

      if (targetTabId === null) { newTabs.push(draggedTab); }
      else { const targetTabIndex = newTabs.findIndex(tab => tab.id === targetTabId); if (targetTabIndex === -1) return prevPanes; newTabs.splice(targetTabIndex, 0, draggedTab); }
      playSound('ui-click');
      addAppLog('debug', `Reordered tab ${draggedTabId} to be near ${targetTabId || 'end'} in ${paneId} pane.`, 'User');
      return { ...prevPanes, [paneId]: { ...pane, openTabs: newTabs } };
    });
  }, [addAppLog]);

  const toggleSidebarVisibility = useCallback(() => { const newVisibility = !isSidebarVisible; setIsSidebarVisible(newVisibility); playSound('panel-toggle'); addAppLog('action', `Explorer sidebar ${newVisibility ? 'shown' : 'hidden'}.`, 'User'); if (newVisibility) { setActivityBarSelection('explorer'); setIsSearchPanelVisible(false); setIsArticlesPanelVisible(false); setIsStatisticsPanelVisible(false); } else if (activityBarSelection === 'explorer') { setActivityBarSelection(null); } }, [isSidebarVisible, activityBarSelection, addAppLog]);
  const handleOpenAIChatTab = useCallback(() => { handleOpenTab({ id: 'ai_chat_tab', title: 'AI Assistant', type: 'ai_chat' }, false, focusedEditorPaneId); }, [handleOpenTab, focusedEditorPaneId]);
  const openCommandPalette = useCallback(() => { setIsCommandPaletteOpen(true); playSound('modal-toggle'); addAppLog('action', 'Opened Command Palette.', 'User'); }, [addAppLog]);
  const closeCommandPalette = useCallback(() => { setIsCommandPaletteOpen(false); }, []);
  const openAboutModal = useCallback(() => { setIsAboutModalOpen(true); playSound('modal-toggle'); addAppLog('action', 'Opened About modal.', 'User'); }, [addAppLog]);
  const closeAboutModal = useCallback(() => { setIsAboutModalOpen(false); playSound('ui-click'); }, []);

  const handleEditorContextMenuRequest = useCallback((x: number, y: number, tabId: string, paneId: EditorPaneId, isCVGeneratorContext?: boolean) => {
    const targetTab = editorPanes[paneId].openTabs.find(tab => tab.id === tabId);
    if (!targetTab) return;
    let items: ContextMenuItem[] = [];
    if (isCVGeneratorContext && targetTab.fileName === 'generate_cv.ts') { items.push({ label: 'Run CV Generator Script', action: () => { handleRunCVGenerator(); playSound('command-execute'); }, icon: ICONS.PlayIcon, }); }
    else if (targetTab.type !== 'settings_editor' && targetTab.type !== 'github_profile_view') { 
      items.push({ label: `Close ${targetTab.title}`, action: () => handleCloseTab(paneId, tabId) });
      items.push({ label: 'Close Others', action: () => { setEditorPanes(prev => ({ ...prev, [paneId]: { ...prev[paneId], openTabs: [targetTab], activeTabId: targetTab.id, tabHistory: [targetTab.id], currentHistoryIndex: 0 }})); addAppLog('action', `Closed other tabs, kept ${targetTab.title} in ${paneId} pane.`, 'User'); playSound('ui-click'); }});
      items.push({ label: 'Close All', action: () => { setEditorPanes(prev => ({ ...prev, [paneId]: { ...initialPaneState }})); addAppLog('action', `Closed all tabs in ${paneId} pane.`, 'User'); playSound('ui-click'); }});
      const eligibleForPreview = ['about.json', 'experience.json', 'skills.json', 'contact.json', 'projects.json'].includes(targetTab.fileName || '');
      if (targetTab.type === 'file' && eligibleForPreview && !targetTab.id.endsWith('_preview')) { items.push({ label: `Open Preview for ${targetTab.title}`, action: () => handleOpenPreviewTab(tabId, false, paneId) }); }
      if (targetTab.type === 'project_detail' && !targetTab.id.startsWith('ai_project_') && !targetTab.id.endsWith('_preview')) { items.push({ label: `Open Preview for ${targetTab.title}`, action: () => handleOpenPreviewTab(tabId, false, paneId) }); }
    }
    if (items.length > 0) { setEditorContextMenuState({ x, y, items, visible: true, tabId, paneId }); playSound('ui-click'); addAppLog('debug', `Opened context menu for tab ${targetTab.title}.`, 'User'); }
  }, [editorPanes, handleCloseTab, handleOpenPreviewTab, handleRunCVGenerator, addAppLog]);

  const closeEditorContextMenu = useCallback(() => setEditorContextMenuState(prev => ({ ...prev, visible: false })), []);
  const handleSidebarItemContextMenuRequest = useCallback((event: React.MouseEvent, item: SidebarItemConfig) => { const items: ContextMenuItem[] = []; if (item.id === 'generate_cv.ts') { items.push({ label: 'Run CV Generator Script', action: () => { handleRunCVGenerator(); playSound('command-execute'); }, icon: ICONS.PlayIcon, }); } if (items.length > 0) { setSidebarContextMenuState({ x: event.pageX, y: event.pageY, items, visible: true, itemId: item.id }); playSound('ui-click'); addAppLog('debug', `Opened context menu for sidebar item ${item.label}.`, 'User');} }, [handleRunCVGenerator, addAppLog]);
  const closeSidebarContextMenu = useCallback(() => setSidebarContextMenuState(prev => ({ ...prev, visible: false })), []);
  const toggleTerminalPanel = useCallback(() => { playSound('panel-toggle'); if (isBottomPanelVisible && activeBottomPanelId === 'terminal') { setIsBottomPanelVisible(false); addAppLog('action', `Terminal panel hidden.`, 'User'); } else { setIsBottomPanelVisible(true); setActiveBottomPanelId('terminal'); addAppLog('action', `Terminal panel shown.`, 'User'); } }, [isBottomPanelVisible, activeBottomPanelId, addAppLog]);
  const togglePetsPanel = useCallback(() => { playSound('panel-toggle'); if (isBottomPanelVisible && activeBottomPanelId === 'pets') { setIsBottomPanelVisible(false); addAppLog('action', `Pets panel hidden.`, 'User'); } else { setIsBottomPanelVisible(true); setActiveBottomPanelId('pets'); addAppLog('action', `Pets panel shown.`, 'User'); } }, [isBottomPanelVisible, activeBottomPanelId, addAppLog]);
  const toggleLogsPanel = useCallback(() => { playSound('panel-toggle'); if (isBottomPanelVisible && activeBottomPanelId === 'logs') { setIsBottomPanelVisible(false); addAppLog('action', `Logs panel hidden.`, 'User'); } else { setIsBottomPanelVisible(true); setActiveBottomPanelId('logs'); addAppLog('action', `Logs panel shown.`, 'User'); } }, [isBottomPanelVisible, activeBottomPanelId, addAppLog]);

  const handleSelectBottomPanelTab = useCallback((panelId: BottomPanelTabId) => { playSound('ui-click'); setActiveBottomPanelId(panelId); if (!isBottomPanelVisible) { setIsBottomPanelVisible(true); } addAppLog('action', `Selected bottom panel tab: ${panelId}.`, 'User'); }, [isBottomPanelVisible, addAppLog]);
  const handleCloseBottomPanel = useCallback(() => { setIsBottomPanelVisible(false); playSound('panel-toggle'); addAppLog('action', 'Bottom panel closed.', 'User'); }, [addAppLog]);
  
  const handleSuggestNewAIProject = useCallback(async (userKeywords?: string) => {
    if (isAISuggestingProject) return;
    setIsAISuggestingProject(true);
    appendToTerminalOutput(`> Fetching AI project suggestion ${userKeywords ? `with keywords: "${userKeywords}"` : ''}...`);
    addAppLog('action', `AI project suggestion started ${userKeywords ? `with keywords: "${userKeywords}"` : ''}.`, 'System');
    playSound('terminal-run');
    const suggestion = await fetchAIProjectSuggestion(PORTFOLIO_DATA.skills, addAppLog, userKeywords);
    setIsAISuggestingProject(false);
    if (suggestion) {
      const newAIProjectId = `ai_project_${Date.now()}_${suggestion.title.toLowerCase().replace(/\s+/g, '_').replace(/[^\w-]+/g, '')}`;
      const newAIProject: ProjectDetail = { ...suggestion, id: newAIProjectId };
      setAiGeneratedProjects(prev => [...prev, newAIProject]);
      appendToTerminalOutput(`AI Suggested Project: "${newAIProject.title}"`);
      appendToTerminalOutput(`Opening details for ${newAIProject.title}...`);
      playSound('terminal-complete');
      handleOpenTab({ id: newAIProject.id, fileName: newAIProject.id, type: 'project_detail', title: `✨ ${newAIProject.title} (AI)`, }, false, focusedEditorPaneId);
      addAppLog('info', `AI suggested project: "${newAIProject.title}".`, 'System', { project: newAIProject, userKeywords });
    } else {
      appendToTerminalOutput("Failed to get AI project suggestion. Please check logs or try again.");
      playSound('error');
      addAppLog('error', `Failed to get AI project suggestion.`, 'System', {userKeywords});
    }
  }, [isAISuggestingProject, appendToTerminalOutput, PORTFOLIO_DATA.skills, handleOpenTab, focusedEditorPaneId, addAppLog]);


  const handlePasskeySubmit = useCallback((passkey: string | null) => {
    setIsPasskeyPromptOpen(false); 
    if (passkey === "10102002") {
      setIsDevModeEnabled(true);
      addNotificationAndLog("Developer Mode Enabled.", 'success', 3000);
      addAppLog('action', 'Developer Mode enabled.', 'User');
      playSound('setting-change');
    } else if (passkey === null) { 
      addNotificationAndLog("Developer Mode enabling was cancelled.", 'info', 4000);
      addAppLog('info', 'Developer Mode enabling cancelled.', 'User');
      playSound('ui-click');
    } else if (passkey === "") {
      addNotificationAndLog("Passkey cannot be empty. Developer Mode remains disabled.", 'warning', 5000);
      addAppLog('warning', 'Developer Mode enabling failed: Empty passkey.', 'User');
      playSound('error');
    } else { 
      addNotificationAndLog("Incorrect passkey. Developer Mode remains disabled.", 'error', 5000);
      addAppLog('warning', 'Developer Mode enabling failed: Incorrect passkey.', 'User');
      playSound('error');
    }
  }, [addNotificationAndLog, addAppLog]);

  const handleToggleDevMode = useCallback(() => {
    if (isDevModeEnabled) {
      setIsDevModeEnabled(false);
      addNotificationAndLog("Developer Mode Disabled.", 'info', 3000);
      addAppLog('action', 'Developer Mode disabled.', 'User');
      playSound('setting-change');
    } else {
      setIsPasskeyPromptOpen(true); 
      playSound('modal-toggle');
    }
  }, [isDevModeEnabled, addNotificationAndLog, addAppLog]);

  const handleToggleProfilePopup = (event?: React.MouseEvent<HTMLButtonElement>) => {
    const currentAnchor = event ? event.currentTarget : null;
    setIsProfilePopupOpen(prevIsOpen => {
      const newIsOpen = !prevIsOpen;
      if (newIsOpen) {
        setProfilePopupAnchorEl(currentAnchor);
      } else {
        setProfilePopupAnchorEl(null);
      }
      addAppLog('action', `Profile popup ${newIsOpen ? 'opened' : 'closed'}.`, 'User');
      return newIsOpen;
    });
    playSound('ui-click');
  };


  useGlobalEventHandlers({ toggleSidebarVisibility, openCommandPalette, isCommandPaletteOpen, closeCommandPalette, isAboutModalOpen, closeAboutModal, contextMenuVisible: editorContextMenuState.visible || sidebarContextMenuState.visible, setContextMenuVisible: (visible) => { if (!visible) { closeEditorContextMenu(); closeSidebarContextMenu();}}, toggleTerminalVisibility: toggleTerminalPanel, togglePetsPanelVisibility: togglePetsPanel, isDevModeEnabled });

  const handleToggleSearchPanel = useCallback(() => { const newVisibility = !isSearchPanelVisible; setIsSearchPanelVisible(newVisibility); playSound('panel-toggle'); addAppLog('action', `Search panel ${newVisibility ? 'shown' : 'hidden'}.`, 'User'); if (newVisibility) { setActivityBarSelection('search'); setIsSidebarVisible(false); setIsArticlesPanelVisible(false); setIsStatisticsPanelVisible(false); } else if (activityBarSelection === 'search') { setActivityBarSelection(null); } }, [isSearchPanelVisible, activityBarSelection, addAppLog]);
  const handleToggleArticlesPanel = useCallback(() => { const newVisibility = !isArticlesPanelVisible; setIsArticlesPanelVisible(newVisibility); playSound('panel-toggle'); addAppLog('action', `Articles panel ${newVisibility ? 'shown' : 'hidden'}.`, 'User'); if (newVisibility) { setActivityBarSelection('articles'); setIsSidebarVisible(false); setIsSearchPanelVisible(false); setIsStatisticsPanelVisible(false); } else if (activityBarSelection === 'articles') { setActivityBarSelection(null); } }, [isArticlesPanelVisible, activityBarSelection, addAppLog]);
  const handleToggleStatisticsPanel = useCallback(() => { const newVisibility = !isStatisticsPanelVisible; setIsStatisticsPanelVisible(newVisibility); playSound('panel-toggle'); addAppLog('action', `Statistics panel ${newVisibility ? 'shown' : 'hidden'}.`, 'User'); if (newVisibility) { setActivityBarSelection('statistics'); setIsSidebarVisible(false); setIsSearchPanelVisible(false); setIsArticlesPanelVisible(false); } else if (activityBarSelection === 'statistics') { setActivityBarSelection(null); } }, [isStatisticsPanelVisible, activityBarSelection, addAppLog]);
  const handleReorderSidebarItems = useCallback((draggedItemId: string, targetItemId: string, parentId?: string) => { setOrderedSidebarItems(prevItems => { const reorder = (items: SidebarItemConfig[], currentParentId?: string): SidebarItemConfig[] => { if (currentParentId === parentId) { const newItems = [...items]; const draggedIndex = newItems.findIndex(item => item.id === draggedItemId); const targetIndex = newItems.findIndex(item => item.id === targetItemId); if (draggedIndex !== -1 && targetIndex !== -1 && draggedIndex !== targetIndex) { const [dragged] = newItems.splice(draggedIndex, 1); newItems.splice(targetIndex, 0, dragged); playSound('ui-click'); addAppLog('debug', `Reordered sidebar item ${draggedItemId} to be near ${targetItemId}.`, 'User'); return newItems; } return items; } return items.map(item => { if (item.isFolder && item.children) { return { ...item, children: reorder(item.children, item.id) }; } return item; }); }; return reorder(prevItems, undefined); }); }, [addAppLog]);
  const handleReorderActivityBarItems = useCallback((draggedItemId: string, targetItemId: string) => { setOrderedActivityBarItemDefinitions(prevItems => { const draggedItemIndex = prevItems.findIndex(item => item.id === draggedItemId); const targetItemIndex = prevItems.findIndex(item => item.id === targetItemId); if (draggedItemIndex === -1 || targetItemIndex === -1 || draggedItemIndex === targetItemIndex) { return prevItems; } const newItems = [...prevItems]; const [draggedItem] = newItems.splice(draggedItemIndex, 1); newItems.splice(targetItemIndex, 0, draggedItem); playSound('ui-click'); addAppLog('debug', `Reordered activity bar item ${draggedItemId} to be near ${targetItemId}.`, 'User'); return newItems; }); }, [addAppLog]);

  const activityBarItems: ActivityBarItemConfig[] = useMemo(() => { return orderedActivityBarItemDefinitions.map(def => { let actionToCall: () => void; switch (def.viewId) { case 'explorer': actionToCall = toggleSidebarVisibility; break; case 'search': actionToCall = handleToggleSearchPanel; break; case 'articles': actionToCall = handleToggleArticlesPanel; break; case 'statistics': actionToCall = handleToggleStatisticsPanel; break; case 'github_profile_view': actionToCall = handleOpenGitHubProfileTab; break; case 'ai_chat_tab':actionToCall = handleOpenAIChatTab; break; default: actionToCall = () => {console.warn("Unknown activity bar item:", def.viewId); addAppLog('warning', `Unknown activity bar item action: ${def.viewId}`, 'System');} } return { ...def, icon: ICONS[def.iconName] || ICONS.default, action: actionToCall, }; }); }, [ orderedActivityBarItemDefinitions, toggleSidebarVisibility, handleToggleSearchPanel, handleToggleArticlesPanel, handleToggleStatisticsPanel, handleOpenGitHubProfileTab, handleOpenAIChatTab, addAppLog ]);
  const handleThemeChange = useCallback((themeName: string) => { rawHandleThemeChange(themeName); playSound('setting-change'); addAppLog('action', `Theme changed to: ${themeName}.`, 'User'); }, [rawHandleThemeChange, addAppLog]);
  const handleEditorFontFamilyChange = useCallback((fontId: string) => { rawHandleFontFamilyChange(fontId); playSound('setting-change'); const fontLabel = FONT_FAMILY_OPTIONS.find(f=>f.id === fontId)?.label || fontId; addAppLog('action', `Editor font family changed to: ${fontLabel}.`, 'User'); }, [rawHandleFontFamilyChange, addAppLog]);
  const handleEditorFontSizeChange = useCallback((sizeId: string) => { rawHandleEditorFontSizeChange(sizeId); playSound('setting-change'); const sizeLabel = FONT_SIZE_OPTIONS.find(s=>s.id === sizeId)?.label || sizeId; addAppLog('action', `Editor font size changed to: ${sizeLabel}.`, 'User'); }, [rawHandleEditorFontSizeChange, addAppLog]);
  const handleTerminalFontSizeChange = useCallback((sizeId: string) => { setCurrentTerminalFontSizeId(sizeId); playSound('setting-change'); const sizeLabel = TERMINAL_FONT_SIZE_OPTIONS.find(s=>s.id === sizeId)?.label || sizeId; addAppLog('action', `Terminal font size changed to: ${sizeLabel}.`, 'User'); }, [addAppLog]);
  const handleToggleFullscreen = useCallback(() => { rawHandleToggleFullscreen(); playSound('ui-click'); addAppLog('action', `Fullscreen mode ${isFullscreen ? 'exited' : 'entered'}.`, 'User'); }, [rawHandleToggleFullscreen, isFullscreen, addAppLog]);

  const handleToggleRightEditorPane = useCallback(() => {
    setIsRightEditorPaneVisible(prev => {
      const newVisibility = !prev;
      addAppLog('action', `Right editor pane ${newVisibility ? 'shown' : 'hidden'}.`, 'User');
      if (!newVisibility && focusedEditorPaneId === 'right') {
        setFocusedEditorPaneId('left');
      } else if (newVisibility && editorPanes.right.openTabs.length === 0 && editorPanes.left.activeTabId && editorPanes.left.openTabs.length > 1) {
        const tabToMove = editorPanes.left.openTabs.find(t => t.id !== editorPanes.left.activeTabId) || editorPanes.left.openTabs[0];
        if (tabToMove) {
            setEditorPanes(prevPanes => ({
                ...prevPanes,
                left: { ...prevPanes.left, openTabs: prevPanes.left.openTabs.filter(t => t.id !== tabToMove.id), activeTabId: prevPanes.left.activeTabId === tabToMove.id ? (prevPanes.left.openTabs.filter(t => t.id !== tabToMove.id)[0]?.id || null) : prevPanes.left.activeTabId },
                right: { ...prevPanes.right, openTabs: [tabToMove], activeTabId: tabToMove.id }
            }));
            setFocusedEditorPaneId('right');
            addAppLog('info', `Moved tab ${tabToMove.title} to right pane automatically.`, 'System');
        }
      }
      return newVisibility;
    });
    playSound('panel-toggle');
  }, [focusedEditorPaneId, editorPanes, addAppLog]);

  const handleFocusEditorPane = useCallback((paneId: EditorPaneId) => {
    if (paneId === 'right' && !isRightEditorPaneVisible) {
        setIsRightEditorPaneVisible(true); 
        addAppLog('info', `Right editor pane shown due to focus.`, 'System');
    }
    setFocusedEditorPaneId(paneId);
    playSound('ui-click');
    addAppLog('action', `Focused ${paneId} editor pane.`, 'User');
  }, [isRightEditorPaneVisible, addAppLog]);

  const handleMoveEditorToOtherPane = useCallback(() => {
    const sourcePaneId = focusedEditorPaneId;
    const targetPaneId: EditorPaneId = sourcePaneId === 'left' ? 'right' : 'left';
    const sourcePane = editorPanes[sourcePaneId];
    const activeTabInSource = sourcePane.openTabs.find(t => t.id === sourcePane.activeTabId);

    if (!activeTabInSource) return;
    addAppLog('action', `Moving tab "${activeTabInSource.title}" from ${sourcePaneId} to ${targetPaneId} pane.`, 'User');

    if (targetPaneId === 'right' && !isRightEditorPaneVisible) {
        setIsRightEditorPaneVisible(true);
        addAppLog('info', `Right editor pane shown for tab move.`, 'System');
    }

    const newSourceOpenTabs = sourcePane.openTabs.filter(t => t.id !== activeTabInSource.id);
    let newSourceActiveTabId: string | null = null;
    const sourceHistoryWithoutClosed = sourcePane.tabHistory.filter(id => id !== activeTabInSource.id);
    let newSourceHistoryIndex = sourcePane.currentHistoryIndex;
    if (sourcePane.tabHistory.indexOf(activeTabInSource.id) <= newSourceHistoryIndex) newSourceHistoryIndex--;
    newSourceHistoryIndex = Math.max(-1, newSourceHistoryIndex);

    if (newSourceHistoryIndex >= 0 && newSourceHistoryIndex < sourceHistoryWithoutClosed.length) {
      newSourceActiveTabId = sourceHistoryWithoutClosed[newSourceHistoryIndex];
    } else if (newSourceOpenTabs.length > 0) {
      newSourceActiveTabId = newSourceOpenTabs[0].id;
    }

    const targetPane = editorPanes[targetPaneId];
    const existingInTarget = targetPane.openTabs.find(t => t.id === activeTabInSource.id);
    let newTargetOpenTabs = [...targetPane.openTabs];
    if (!existingInTarget) {
        newTargetOpenTabs.push(activeTabInSource);
    }
    const newTargetActiveTabId = activeTabInSource.id;

    const newTargetHistoryBase = targetPane.tabHistory.slice(0, targetPane.currentHistoryIndex + 1);
    if (newTargetHistoryBase[newTargetHistoryBase.length -1] !== newTargetActiveTabId) {
        newTargetHistoryBase.push(newTargetActiveTabId);
    }

    setEditorPanes(prev => ({
        ...prev,
        [sourcePaneId]: {
            ...prev[sourcePaneId],
            openTabs: newSourceOpenTabs,
            activeTabId: newSourceActiveTabId,
            tabHistory: sourceHistoryWithoutClosed,
            currentHistoryIndex: newSourceHistoryIndex,
        },
        [targetPaneId]: {
            ...prev[targetPaneId],
            openTabs: newTargetOpenTabs,
            activeTabId: newTargetActiveTabId,
            tabHistory: newTargetHistoryBase,
            currentHistoryIndex: newTargetHistoryBase.length - 1,
        }
    }));

    setFocusedEditorPaneId(targetPaneId);
    playSound('ui-click');

  }, [editorPanes, focusedEditorPaneId, isRightEditorPaneVisible, addAppLog]);

  const commands = useMemo(() => generateCommands({
    sidebarItems: orderedSidebarItems.flatMap(item => item.isFolder && item.children ? item.children.filter(child => !child.isFolder) : (item.isFolder ? [] : [item])),
    handleOpenTab, closeCommandPalette, isSidebarVisible, toggleSidebarVisibility, handleOpenAIChatTab, openCommandPalette,
    predefinedThemes: PREDEFINED_THEMES, handleThemeChange, currentThemeName,
    fontFamilyOptions: FONT_FAMILY_OPTIONS, handleFontFamilyChange: handleEditorFontFamilyChange, currentFontFamilyId: currentFontFamilyId,
    fontSizeOptions: FONT_SIZE_OPTIONS, handleFontSizeChange: handleEditorFontSizeChange, currentFontSizeId: currentEditorFontSizeId,
    openAboutModal, icons: ICONS, handleToggleSearchPanel, handleToggleArticlesPanel, handleToggleStatisticsPanel, 
    handleToggleGitHubPanel: handleOpenGitHubProfileTab, 
    toggleTerminalVisibility: toggleTerminalPanel, togglePetsPanelVisibility: togglePetsPanel, toggleLogsPanelVisibility: toggleLogsPanel,
    handleToggleSoundMute, isSoundMuted, handleRunCVGenerator, handleOpenSettingsEditor,
    terminalFontSizes: TERMINAL_FONT_SIZE_OPTIONS, currentTerminalFontSizeId, handleTerminalFontSizeChange,
    handleToggleRightEditorPane, handleFocusEditorPane, handleMoveEditorToOtherPane, addAppLog,
  }), [
    orderedSidebarItems, handleOpenTab, closeCommandPalette, isSidebarVisible, toggleSidebarVisibility, handleOpenAIChatTab,
    openCommandPalette, PREDEFINED_THEMES, handleThemeChange, currentThemeName, FONT_FAMILY_OPTIONS, handleEditorFontFamilyChange,
    currentFontFamilyId, FONT_SIZE_OPTIONS, handleEditorFontSizeChange, currentEditorFontSizeId, openAboutModal, ICONS,
    handleToggleSearchPanel, handleToggleArticlesPanel, handleToggleStatisticsPanel, handleOpenGitHubProfileTab, 
    toggleTerminalPanel, togglePetsPanel, toggleLogsPanel,
    handleToggleSoundMute, isSoundMuted, handleRunCVGenerator, handleOpenSettingsEditor,
    currentTerminalFontSizeId, handleTerminalFontSizeChange,
    handleToggleRightEditorPane, handleFocusEditorPane, handleMoveEditorToOtherPane, addAppLog,
  ]);

  const getGitHubUsername = (): string | undefined => {
    if (PORTFOLIO_DATA.otherSocial?.name === 'GitHub' && PORTFOLIO_DATA.otherSocial.url) {
        const parts = PORTFOLIO_DATA.otherSocial.url.split('/');
        return parts.pop() || parts.pop(); 
    }
    return undefined;
  };


  const activeContentDetailsForLeftPane = useMemo(() => {
    const activeTab = editorPanes.left.openTabs.find(tab => tab.id === editorPanes.left.activeTabId);
    if (!activeTab) return null;
    if (activeTab.type === 'ai_chat') {
        return { 
            messages: chatMessages, 
            input: chatInput, 
            setInput: setChatInput, 
            isLoading: chatIsLoading, 
            error: chatError, 
            apiKeyAvailable: chatApiKeyAvailable,
            onSendMessage: handleChatSendMessage,
            handleOpenTab: handleOpenTab, 
            currentPaneIdForChat: 'left' as EditorPaneId 
        };
    }
    if (activeTab.type === 'project_detail') return aiGeneratedProjects.find(p => p.id === activeTab.id) || JSON.parse(generateProjectDetailContent(activeTab.id, PORTFOLIO_DATA));
    if (activeTab.type === 'json_preview' && activeTab.fileName) { const originalFile = editorPanes.left.openTabs.find(t => t.id === activeTab.fileName) || orderedSidebarItems.flatMap(item => item.children || [item]).find(item => item.id === activeTab.fileName); if (originalFile?.id?.startsWith('project_')) return JSON.parse(generateProjectDetailContent(originalFile.id, PORTFOLIO_DATA)); return generateFileContent(activeTab.fileName, PORTFOLIO_DATA); }
    if (activeTab.type === 'article_detail' && activeTab.articleSlug) { const article = SAMPLE_ARTICLES.find(a => a.slug === activeTab.articleSlug); return article ? { markdown: article.contentMarkdown, imageUrl: article.imageUrl } : { markdown: "# Article Not Found", imageUrl: undefined }; }
    if (activeTab.type === 'cv_preview') return PORTFOLIO_DATA;
    if (activeTab.type === 'settings_editor') return { isSoundMuted, handleToggleSoundMute, themes: PREDEFINED_THEMES, currentThemeName, onThemeChange: handleThemeChange, fontFamilies: FONT_FAMILY_OPTIONS, currentFontFamilyId, onFontFamilyChange: handleEditorFontFamilyChange, editorFontSizes: FONT_SIZE_OPTIONS, currentEditorFontSizeId, onEditorFontSizeChange: handleEditorFontSizeChange, terminalFontSizes: TERMINAL_FONT_SIZE_OPTIONS, currentTerminalFontSizeId, onTerminalFontSizeChange: handleTerminalFontSizeChange, isDevModeEnabled, onToggleDevMode: handleToggleDevMode, };
    if (activeTab.type === 'github_profile_view') return { username: activeTab.githubUsername || getGitHubUsername(), mockStats: MOCK_GITHUB_STATS };
    if (activeTab.fileName) return generateFileContent(activeTab.fileName, PORTFOLIO_DATA);
    return null;
  }, [editorPanes.left.activeTabId, editorPanes.left.openTabs, PORTFOLIO_DATA, orderedSidebarItems, aiGeneratedProjects, isSoundMuted, handleToggleSoundMute, currentThemeName, handleThemeChange, currentFontFamilyId, handleEditorFontFamilyChange, currentEditorFontSizeId, handleEditorFontSizeChange, currentTerminalFontSizeId, handleTerminalFontSizeChange, isDevModeEnabled, handleToggleDevMode, chatMessages, chatInput, setChatInput, chatIsLoading, chatError, chatApiKeyAvailable, handleChatSendMessage, handleOpenTab]);
  
  const activeContentDetailsForRightPane = useMemo(() => {
    const activeTab = editorPanes.right.openTabs.find(tab => tab.id === editorPanes.right.activeTabId);
    if (!activeTab) return null;
    if (activeTab.type === 'ai_chat') {
        return { 
            messages: chatMessages, 
            input: chatInput, 
            setInput: setChatInput, 
            isLoading: chatIsLoading, 
            error: chatError, 
            apiKeyAvailable: chatApiKeyAvailable,
            onSendMessage: handleChatSendMessage,
            handleOpenTab: handleOpenTab,
            currentPaneIdForChat: 'right' as EditorPaneId
        };
    }
    if (activeTab.type === 'project_detail') return aiGeneratedProjects.find(p => p.id === activeTab.id) || JSON.parse(generateProjectDetailContent(activeTab.id, PORTFOLIO_DATA));
    if (activeTab.type === 'json_preview' && activeTab.fileName) { const originalFile = editorPanes.right.openTabs.find(t => t.id === activeTab.fileName) || orderedSidebarItems.flatMap(item => item.children || [item]).find(item => item.id === activeTab.fileName); if (originalFile?.id?.startsWith('project_')) return JSON.parse(generateProjectDetailContent(originalFile.id, PORTFOLIO_DATA)); return generateFileContent(activeTab.fileName, PORTFOLIO_DATA); }
    if (activeTab.type === 'article_detail' && activeTab.articleSlug) { const article = SAMPLE_ARTICLES.find(a => a.slug === activeTab.articleSlug); return article ? { markdown: article.contentMarkdown, imageUrl: article.imageUrl } : { markdown: "# Article Not Found", imageUrl: undefined }; }
    if (activeTab.type === 'cv_preview') return PORTFOLIO_DATA;
    if (activeTab.type === 'settings_editor') return { isSoundMuted, handleToggleSoundMute, themes: PREDEFINED_THEMES, currentThemeName, onThemeChange: handleThemeChange, fontFamilies: FONT_FAMILY_OPTIONS, currentFontFamilyId, onFontFamilyChange: handleEditorFontFamilyChange, editorFontSizes: FONT_SIZE_OPTIONS, currentEditorFontSizeId, onEditorFontSizeChange: handleEditorFontSizeChange, terminalFontSizes: TERMINAL_FONT_SIZE_OPTIONS, currentTerminalFontSizeId, onTerminalFontSizeChange: handleTerminalFontSizeChange, isDevModeEnabled, onToggleDevMode: handleToggleDevMode, };
    if (activeTab.type === 'github_profile_view') return { username: activeTab.githubUsername || getGitHubUsername(), mockStats: MOCK_GITHUB_STATS };
    if (activeTab.fileName) return generateFileContent(activeTab.fileName, PORTFOLIO_DATA);
    return null;
  }, [editorPanes.right.activeTabId, editorPanes.right.openTabs, PORTFOLIO_DATA, orderedSidebarItems, aiGeneratedProjects, isSoundMuted, handleToggleSoundMute, currentThemeName, handleThemeChange, currentFontFamilyId, handleEditorFontFamilyChange, currentEditorFontSizeId, handleEditorFontSizeChange, currentTerminalFontSizeId, handleTerminalFontSizeChange, isDevModeEnabled, handleToggleDevMode, chatMessages, chatInput, setChatInput, chatIsLoading, chatError, chatApiKeyAvailable, handleChatSendMessage, handleOpenTab]);

  const renderEditorPane = (paneId: EditorPaneId) => {
    const paneState = editorPanes[paneId];
    const activeContent = paneId === 'left' ? activeContentDetailsForLeftPane : activeContentDetailsForRightPane;
    const currentActiveTab = paneState.openTabs.find(tab => tab.id === paneState.activeTabId);

    return (
      <div className="flex flex-col h-full overflow-hidden" onClick={() => handleFocusEditorPane(paneId)} role="tabpanel" aria-labelledby={`pane-tab-${paneId}`}>
        <EditorTabs
          tabs={paneState.openTabs}
          activeTabId={paneState.activeTabId}
          onSelectTab={(tabId) => handleSelectTab(paneId, tabId)}
          onCloseTab={(tabId) => handleCloseTab(paneId, tabId)}
          onContextMenuRequest={(x, y, tabId, isCVContext) => handleEditorContextMenuRequest(x, y, tabId, paneId, isCVContext)}
          isLoading={isPreviewTabLoading && paneState.activeTabId?.endsWith('_preview')}
          onReorderTabs={(draggedTabId, targetTabId) => handleReorderOpenTabs(paneId, draggedTabId, targetTabId)}
          onRunCVGeneratorFromTab={handleRunCVGenerator}
          className={focusedEditorPaneId === paneId ? 'border-b-2 border-[var(--focus-border)] -mb-px z-10' : ''}
          paneId={paneId}
        />
        <Breadcrumbs activeTab={currentActiveTab} portfolioData={PORTFOLIO_DATA} onOpenTab={(config) => handleOpenTab(config, false, paneId)} paneId={paneId}/>
        <div className="flex-1 overflow-auto relative animate-fadeIn bg-[var(--editor-background)]">
          {currentActiveTab && activeContent ? ( 
            <TabContent
              key={currentActiveTab.id}
              tab={currentActiveTab}
              content={activeContent} 
              portfolioData={PORTFOLIO_DATA}
              onOpenProjectTab={(projectId, projectTitle) => handleOpenProjectTab(projectId, projectTitle)}
              currentThemeName={currentThemeName}
              onContextMenuRequest={(x, y, tabId, isCVContext) => handleEditorContextMenuRequest(x,y,tabId,paneId,isCVContext)}
              aiGeneratedProjects={aiGeneratedProjects}
              onSuggestNewAIProject={handleSuggestNewAIProject}
              isAISuggestingProject={isAISuggestingProject}
              paneId={paneId} 
              addAppLog={addAppLog}
            />
          ) : (
            <WelcomeView portfolioData={PORTFOLIO_DATA} onOpenTab={(config) => handleOpenTab(config, false, paneId)} onOpenAIChat={handleOpenAIChatTab} />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-[var(--app-background)] text-[var(--text-default)] overflow-hidden">
      <TitleBar
        onToggleSidebar={toggleSidebarVisibility}
        isSidebarVisible={isSidebarVisible}
        onOpenCommandPalette={openCommandPalette}
        onOpenAboutModal={openAboutModal}
        canNavigateBack={editorPanes[focusedEditorPaneId].currentHistoryIndex > 0}
        canNavigateForward={editorPanes[focusedEditorPaneId].currentHistoryIndex < editorPanes[focusedEditorPaneId].tabHistory.length - 1}
        onNavigateBack={() => navigateTabHistoryBack(focusedEditorPaneId)}
        onNavigateForward={() => navigateTabHistoryForward(focusedEditorPaneId)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        sidebarItems={orderedSidebarItems}
        projectsData={PORTFOLIO_DATA.projects}
        onRunItem={(config) => handleOpenTab(config, true, focusedEditorPaneId)}
        onRunCVGenerator={handleRunCVGenerator}
        onToggleTerminal={toggleTerminalPanel}
        onTogglePetsPanel={togglePetsPanel}
        onToggleLogsPanel={toggleLogsPanel}
        onToggleStatisticsPanel={handleToggleStatisticsPanel}
        onToggleGitHubPanel={handleOpenGitHubProfileTab} 
        isSoundMuted={isSoundMuted}
        onToggleSoundMute={handleToggleSoundMute}
        onOpenSettingsEditor={handleOpenSettingsEditor}
        onToggleRightEditorPane={handleToggleRightEditorPane}
        onFocusEditorPane={handleFocusEditorPane}
        onMoveEditorToOtherPane={handleMoveEditorToOtherPane}
        onToggleProfilePopup={handleToggleProfilePopup} 
      />
      <main className="flex-1 flex overflow-hidden">
        <ActivityBar
          items={activityBarItems}
          onReorder={handleReorderActivityBarItems}
          activeViewId={activityBarSelection}
          onOpenSettingsEditor={handleOpenSettingsEditor}
        />
        {(isSidebarVisible || isSearchPanelVisible || isArticlesPanelVisible || isStatisticsPanelVisible) && ( 
          <div ref={leftPanelContainerRef} className="flex"> 
            <div className="flex-shrink-0 overflow-y-auto" style={{ width: leftPanelWidth }}> 
              {isSidebarVisible && <Sidebar items={orderedSidebarItems} onOpenTab={(item) => handleOpenTab(item, false, focusedEditorPaneId)} onRunAction={handleSidebarAction} isVisible={isSidebarVisible} activeTabId={editorPanes[focusedEditorPaneId].activeTabId} onReorderItems={handleReorderSidebarItems} onContextMenuRequest={handleSidebarItemContextMenuRequest} />}
              {isSearchPanelVisible && <SearchPanel isVisible={isSearchPanelVisible} searchTerm={globalSearchTerm} onSearchTermChange={setGlobalSearchTerm} results={searchResults} onResultClick={(result) => handleOpenTab({ id: result.fileId, fileName: result.fileId, type: result.tabType, title: result.fileDisplayPath.split('/').pop() || result.fileId }, false, focusedEditorPaneId)} onClose={() => {setIsSearchPanelVisible(false); setActivityBarSelection(null);}}/>}
              {isArticlesPanelVisible && <ArticlesPanel isVisible={isArticlesPanelVisible} articles={SAMPLE_ARTICLES} onClose={() => {setIsArticlesPanelVisible(false); setActivityBarSelection(null);}} onSelectArticle={handleOpenArticleTab} activeArticleSlug={currentActiveTabForFocusedPane?.type === 'article_detail' ? currentActiveTabForFocusedPane.articleSlug || null : null} />}
              {isStatisticsPanelVisible && <StatisticsPanel isVisible={isStatisticsPanelVisible} stats={mockStats} onClose={() => {setIsStatisticsPanelVisible(false); setActivityBarSelection(null);}}/>}
            </div>
            <div
              ref={leftResizerRef} 
              className="resizer resizer-x"
              onMouseDown={handleLeftPanelResizeStart}
              onTouchStart={handleLeftPanelResizeStart}
            />
          </div>
        )}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 flex overflow-hidden">
            <div style={{ width: isRightEditorPaneVisible ? `${editorSplitPercentage}%` : '100%' }} className="h-full overflow-hidden">
              {renderEditorPane('left')}
            </div>
            {isRightEditorPaneVisible && (
              <>
                <div
                  ref={editorResizerRef}
                  className="editor-resizer-x"
                  onMouseDown={handleEditorResizeStart}
                  onTouchStart={handleEditorResizeStart}
                />
                <div style={{ width: `${100 - editorSplitPercentage}%` }} className="h-full overflow-hidden">
                  {renderEditorPane('right')}
                </div>
              </>
            )}
          </div>

          {isBottomPanelVisible && (
            <>
              <div
                ref={bottomResizerRef}
                className="resizer resizer-y"
                onMouseDown={handleBottomPanelResizeStart}
                onTouchStart={handleBottomPanelResizeStart}
              />
              <div className="flex-shrink-0" style={{ height: bottomPanelHeight }}>
                  <BottomPanelTabs
                    tabs={[
                      { id: 'terminal', title: 'Terminal', icon: ICONS.TerminalIcon },
                      { id: 'pets', title: 'Pets', icon: ICONS.CatIcon },
                      { id: 'logs', title: 'Logs', icon: ICONS.LogsIcon },
                    ]}
                    activeTabId={activeBottomPanelId}
                    onSelectTab={handleSelectBottomPanelTab}
                  />
                  <div className="h-[calc(100%-38px)]"> 
                    {activeBottomPanelId === 'terminal' && <TerminalPanel output={terminalOutput} isRunning={isTerminalRunningCommand} onClose={handleCloseBottomPanel} />}
                    {activeBottomPanelId === 'pets' && <PetsPanel onClose={handleCloseBottomPanel} />}
                    {activeBottomPanelId === 'logs' && <LogsPanel logs={logs} onClose={handleCloseBottomPanel} />}
                  </div>
              </div>
            </>
          )}
        </div>
      </main>
      <StatusBar
        version={APP_VERSION}
        currentThemeName={currentThemeName}
        isSoundMuted={isSoundMuted}
        onToggleSoundMute={handleToggleSoundMute}
        notificationsCount={notificationsHook.notifications.length}
        onOpenCommandPalette={openCommandPalette}
        onOpenAboutModal={openAboutModal}
      />
      {isCommandPaletteOpen && <CommandPalette isOpen={isCommandPaletteOpen} onClose={closeCommandPalette} commands={commands} />}
      {isAboutModalOpen && <AboutModal isOpen={isAboutModalOpen} onClose={closeAboutModal} />}
      {isPasskeyPromptOpen && <PasskeyPromptModal isOpen={isPasskeyPromptOpen} onClose={() => { setIsPasskeyPromptOpen(false); handlePasskeySubmit(null);}} onSubmit={handlePasskeySubmit} />}
      <ProfilePopup 
        isOpen={isProfilePopupOpen} 
        onClose={() => { setIsProfilePopupOpen(false); setProfilePopupAnchorEl(null); }} 
        anchorEl={profilePopupAnchorEl} 
        portfolioData={PORTFOLIO_DATA}
      />
      <ContextMenu {...editorContextMenuState} onClose={closeEditorContextMenu} />
      <ContextMenu {...sidebarContextMenuState} onClose={closeSidebarContextMenu} />
      <NotificationContainer notifications={notificationsHook.notifications} onDismissNotification={notificationsHook.removeNotification} />
    </div>
  );
};

export default App;