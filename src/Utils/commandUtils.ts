
import { Command, SidebarItemConfig, Theme, FontFamilyOption, FontSizeOption, Tab, EditorPaneId, LogLevel, FeaturesStatusState, FeatureId, NotificationType } from '../App/types';
import { LucideIcon, EyeOff, Eye, Command as CommandIcon, Bot as BotIcon, Search as SearchIconLucide, Newspaper as ArticlesIconLucide, BarChart3 as StatisticsIconLucide, FileTerminal, Cat, Volume2, VolumeX, Play, Settings, Palette, Type as FontTypeIcon, Columns, Rows, ArrowLeftRight, ListChecks, Github, MessageSquare, ListFilter } from 'lucide-react';
import { playSound } from './audioUtils';
import { ALL_FEATURE_IDS, ICONS as AppIcons } from '../App/constants';


interface GenerateCommandsArgs {
  sidebarItems: SidebarItemConfig[];
  handleOpenTab: (item: SidebarItemConfig | { id?: string, fileName?: string, type?: Tab['type'], title?: string, articleSlug?: string }, isRunAction?: boolean, targetPaneId?: EditorPaneId) => void;
  closeCommandPalette: () => void;
  isSidebarVisible: boolean;
  toggleSidebarVisibility: () => void;
  handleOpenAIChatTab: () => void;
  openCommandPalette: () => void;
  predefinedThemes: Theme[]; 
  handleThemeChange: (themeName: string) => void; 
  currentThemeName: string; 
  fontFamilyOptions: FontFamilyOption[]; 
  handleFontFamilyChange: (fontId: string) => void; 
  currentFontFamilyId: string; 
  fontSizeOptions: FontSizeOption[]; 
  handleFontSizeChange: (sizeId: string) => void; 
  currentFontSizeId: string; 
  openAboutModal: () => void;
  icons: { [key: string]: LucideIcon };
  handleToggleSearchPanel: () => void;
  handleToggleArticlesPanel: () => void;
  handleToggleStatisticsPanel: () => void;
  handleToggleGitHubPanel: () => void; 
  handleOpenGuestBook: () => void; 
  toggleTerminalVisibility: () => void;
  togglePetsPanelVisibility: () => void;
  toggleLogsPanelVisibility: () => void; 
  handleToggleSoundMute: () => void;
  isSoundMuted: boolean;
  handleRunCVGenerator: () => void;
  handleOpenSettingsEditor: () => void;
  terminalFontSizes: FontSizeOption[]; 
  currentTerminalFontSizeId: string; 
  handleTerminalFontSizeChange: (sizeId: string) => void; 
  handleToggleRightEditorPane: () => void;
  handleFocusEditorPane: (paneId: EditorPaneId) => void;
  handleMoveEditorToOtherPane: () => void;
  addAppLog: (level: LogLevel, message: string, source?: string, details?: Record<string, any>) => void; 
  featuresStatus: FeaturesStatusState;
  addNotification: (message: string, type: NotificationType, duration?: number, actions?: any[], icon?: LucideIcon) => void;
  isDevModeEnabled: boolean; // Added for dev mode check
  toggleFeatureStatusAdminPanel: () => void; // Added for admin panel
}

const createCommandAction = (
    originalAction: () => void, 
    closePalette: () => void, 
    soundName: string = 'command-execute', 
    commandLabel: string, 
    addAppLog: GenerateCommandsArgs['addAppLog'],
    featureId?: FeatureId,
    featuresStatus?: FeaturesStatusState,
    addNotification?: GenerateCommandsArgs['addNotification']
) => {
  return () => {
    if (featureId && featuresStatus && featuresStatus[featureId] !== 'active' && addNotification) {
        addNotification(`The ${ALL_FEATURE_IDS[featureId]} feature is currently under maintenance.`, 'warning', 5000, undefined, AppIcons.HardHatIcon);
        addAppLog('warning', `Command '${commandLabel}' blocked due to maintenance of feature '${featureId}'.`, 'CommandPalette');
        closePalette();
        return;
    }
    addAppLog('action', `Command executed: ${commandLabel}`, 'CommandPalette');
    originalAction();
    // Play sound only if the feature (if specified) is active, or if no featureId is specified (general command)
    if ((featureId && featuresStatus && featuresStatus[featureId] === 'active') || !featureId) {
        playSound(soundName);
    }
    closePalette();
  };
};


export const generateCommands = ({
  sidebarItems,
  handleOpenTab,
  closeCommandPalette,
  isSidebarVisible,
  toggleSidebarVisibility,
  handleOpenAIChatTab,
  openCommandPalette,
  openAboutModal,
  icons,
  handleToggleSearchPanel,
  handleToggleArticlesPanel,
  handleToggleStatisticsPanel,
  handleToggleGitHubPanel, 
  handleOpenGuestBook, 
  toggleTerminalVisibility,
  togglePetsPanelVisibility,
  toggleLogsPanelVisibility,
  handleToggleSoundMute,
  isSoundMuted,
  handleRunCVGenerator,
  handleOpenSettingsEditor,
  handleToggleRightEditorPane,
  handleFocusEditorPane,
  handleMoveEditorToOtherPane,
  addAppLog, 
  featuresStatus,
  addNotification,
  isDevModeEnabled, 
  toggleFeatureStatusAdminPanel,
}: GenerateCommandsArgs): Command[] => {
  const allCommands: Command[] = [];

  const createFeatureAwareCommand = (
    baseId: string,
    baseLabel: string,
    originalAction: () => void,
    featureId: FeatureId,
    icon?: LucideIcon,
    group?: string,
    description?: string,
    sound: string = 'ui-click'
  ): Command => {
    const status = featuresStatus[featureId];
    const actualLabel = status !== 'active' ? `${baseLabel} [Maintenance]` : baseLabel;
    return {
      id: baseId,
      label: actualLabel,
      action: createCommandAction(originalAction, closeCommandPalette, sound, actualLabel, addAppLog, featureId, featuresStatus, addNotification),
      icon: status !== 'active' ? AppIcons.HardHatIcon : icon,
      group,
      description,
      featureId,
    };
  };


  sidebarItems.forEach(item => {
    if (item.fileName) {
        const commandLabel = `Go to File: ${item.fileName}`;
        allCommands.push({
            id: `open_${item.fileName}`,
            label: commandLabel,
            action: createCommandAction(() => handleOpenTab(item), closeCommandPalette, 'tab-open', commandLabel, addAppLog, item.featureId, featuresStatus, addNotification),
            icon: item.icon,
            group: "Go to File",
            featureId: item.featureId,
        });
    } else if (item.type === 'guest_book') { 
        allCommands.push(createFeatureAwareCommand(
            `open_${item.id}`,
            `Go to: ${item.label}`,
            () => handleOpenTab(item),
            'guestBook', 
            item.icon,
            "Go to View"
        ));
    }
  });
  
  allCommands.push(createFeatureAwareCommand(
    'run_cv_generator',
    'Run CV Generator Script',
    handleRunCVGenerator,
    'cvGenerator',
    icons.generate_cv_icon || Play,
    "Run",
    "Simulates generating Nandang's CV and opens a preview.",
    'terminal-run'
  ));

  allCommands.push(createFeatureAwareCommand(
    'toggle_sidebar',
    isSidebarVisible ? 'Hide Explorer Sidebar' : 'Show Explorer Sidebar',
    toggleSidebarVisibility,
    'explorer',
    isSidebarVisible ? EyeOff : Eye,
    "View",
    undefined,
    'panel-toggle'
  ));

  allCommands.push(createFeatureAwareCommand(
    'toggle_search_panel',
    'Toggle Search Panel',
    handleToggleSearchPanel,
    'searchPanel',
    SearchIconLucide,
    "View",
    undefined,
    'panel-toggle'
  ));

   allCommands.push(createFeatureAwareCommand(
    'toggle_articles_panel',
    'Toggle Articles Panel',
    handleToggleArticlesPanel,
    'articlesPanel',
    ArticlesIconLucide,
    "View",
    undefined,
    'panel-toggle'
  ));

  allCommands.push(createFeatureAwareCommand(
    'toggle_statistics_panel',
    'Toggle Statistics Panel',
    handleToggleStatisticsPanel,
    'statisticsPanel',
    icons.statistics_icon || StatisticsIconLucide,
    "View",
    undefined,
    'panel-toggle'
  ));

  allCommands.push(createFeatureAwareCommand(
    'toggle_github_panel', 
    'View: Open GitHub Profile Tab',
    handleToggleGitHubPanel,
    'githubProfileView',
    icons.github_icon || Github,
    "View",
    "Open the GitHub Profile tab.",
    'panel-toggle'
  ));
  
  allCommands.push(createFeatureAwareCommand(
    'open_guest_book',
    'View: Open Guest Book',
    handleOpenGuestBook,
    'guestBook',
    icons.guest_book_icon || MessageSquare,
    "View",
    "Open the Guest Book tab."
  ));


  allCommands.push(createFeatureAwareCommand(
    'toggle_terminal_panel',
    'Toggle Terminal',
    toggleTerminalVisibility,
    'terminal',
    icons.TerminalIcon || FileTerminal,
    "View",
    "Show, hide, or focus the Terminal tab in the bottom panel (Ctrl+` or Cmd+`)",
    'panel-toggle'
  ));

   allCommands.push(createFeatureAwareCommand(
    'toggle_pets_panel',
    'Toggle Pets Panel',
    togglePetsPanelVisibility,
    'petsPanel',
    icons.CatIcon || Cat,
    "View",
    "Show, hide, or focus the Pets tab in the bottom panel (Ctrl+Alt+Shift+P or Cmd+Alt+Shift+P)",
    'panel-toggle'
  ));

  allCommands.push(createFeatureAwareCommand(
    'toggle_logs_panel',
    'Toggle Logs Panel',
    toggleLogsPanelVisibility,
    'logsPanel',
    icons.LogsIcon || ListChecks,
    "View",
    "Show, hide, or focus the Logs tab in the bottom panel.",
    'panel-toggle'
  ));

  allCommands.push(createFeatureAwareCommand(
    'open_ai_chat',
    'Open AI Assistant',
    handleOpenAIChatTab,
    'aiChat',
    BotIcon,
    "View"
  ));

  // Command Palette itself is always active
  const commandPaletteLabel = 'Command Palette';
  allCommands.push({
    id: 'command_palette_command',
    label: commandPaletteLabel,
    action: createCommandAction(() => { openCommandPalette(); }, closeCommandPalette, 'modal-toggle', commandPaletteLabel, addAppLog),
    icon: CommandIcon,
    group: "View",
    description: "Open the command palette to search for commands and files."
  });

  const toggleSecondEditorLabel = 'View: Toggle Second Editor Group';
  allCommands.push({
    id: 'toggle_second_editor_group',
    label: toggleSecondEditorLabel,
    action: createCommandAction(handleToggleRightEditorPane, closeCommandPalette, 'panel-toggle', toggleSecondEditorLabel, addAppLog),
    icon: icons.split_square_horizontal_icon || Columns,
    group: "View",
  });

  const focusLeftEditorLabel = 'View: Focus Left Editor Group';
  allCommands.push({
    id: 'focus_left_editor_group',
    label: focusLeftEditorLabel,
    action: createCommandAction(() => handleFocusEditorPane('left'), closeCommandPalette, 'ui-click', focusLeftEditorLabel, addAppLog),
    icon: Rows, 
    group: "View",
  });

  const focusRightEditorLabel = 'View: Focus Right Editor Group';
  allCommands.push({
    id: 'focus_right_editor_group',
    label: focusRightEditorLabel,
    action: createCommandAction(() => handleFocusEditorPane('right'), closeCommandPalette, 'ui-click', focusRightEditorLabel, addAppLog),
    icon: Rows, 
    group: "View",
  });

  const moveEditorLabel = 'View: Move Active Editor to Other Group';
  allCommands.push({
    id: 'move_editor_to_other_group',
    label: moveEditorLabel,
    action: createCommandAction(handleMoveEditorToOtherPane, closeCommandPalette, 'ui-click', moveEditorLabel, addAppLog),
    icon: ArrowLeftRight,
    group: "View",
  });

  allCommands.push(createFeatureAwareCommand(
    'open_settings_ui',
    'Preferences: Open Settings (UI)',
    handleOpenSettingsEditor,
    'settingsEditor',
    icons.settings_icon || Settings,
    "Preferences",
    "Open the user interface for settings."
  ));

  const toggleSoundLabel = isSoundMuted ? 'Preferences: Unmute Sound Effects' : 'Preferences: Mute Sound Effects';
  allCommands.push({
    id: 'toggle_sound_effects',
    label: toggleSoundLabel,
    action: createCommandAction(handleToggleSoundMute, closeCommandPalette, 'setting-change', toggleSoundLabel, addAppLog),
    icon: isSoundMuted ? (icons.VolumeXIcon || VolumeX) : (icons.Volume2Icon || Volume2),
    group: "Preferences",
    isSelected: !isSoundMuted,
  });
  
  if (isDevModeEnabled) {
    const adminPanelCommandLabel = 'Developer: Open Feature Status Management Panel';
    allCommands.push({
      id: 'dev_open_feature_status_admin',
      label: adminPanelCommandLabel,
      action: () => { // Direct action: toggleFeatureStatusAdminPanel already checks dev mode.
        addAppLog('action', `Command executed: ${adminPanelCommandLabel}`, 'CommandPalette');
        toggleFeatureStatusAdminPanel();
        // Sound is played by toggleFeatureStatusAdminPanel if it proceeds
        closeCommandPalette();
      },
      icon: AppIcons.feature_status_admin_icon || ListFilter,
      group: "Developer",
      description: "Manage the active/maintenance/disabled status of application features."
      // No featureId, so it's not gated by its own status in featuresStatus
    });
  }


  const aboutPortfolioLabel = 'Help: About Portfolio';
  allCommands.push({
    id: 'about_portfolio',
    label: aboutPortfolioLabel,
    action: createCommandAction(openAboutModal, closeCommandPalette, 'modal-toggle', aboutPortfolioLabel, addAppLog),
    icon: icons.about_portfolio,
    group: "Help",
  });

  return allCommands;
};
