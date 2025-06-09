
import { Command, SidebarItemConfig, Theme, FontFamilyOption, FontSizeOption, Tab, EditorPaneId, LogLevel } from '../App/types';
import { LucideIcon, EyeOff, Eye, Command as CommandIcon, Bot as BotIcon, Search as SearchIconLucide, Newspaper as ArticlesIconLucide, BarChart3 as StatisticsIconLucide, FileTerminal, Cat, Volume2, VolumeX, Play, Settings, Palette, Type as FontTypeIcon, Columns, Rows, ArrowLeftRight, ListChecks, Github, MessageSquare } from 'lucide-react';
import { playSound } from './audioUtils';


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
  handleToggleGitHubPanel: () => void; // This will now open the GitHub Profile Tab
  handleOpenGuestBook: () => void; // Added for Guest Book
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
}

const createCommandAction = (action: () => void, closePalette: () => void, soundName: string = 'command-execute', commandLabel: string, addAppLog: GenerateCommandsArgs['addAppLog']) => {
  return () => {
    addAppLog('action', `Command executed: ${commandLabel}`, 'CommandPalette');
    action();
    playSound(soundName);
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
  handleToggleGitHubPanel, // This is now handleOpenGitHubProfileTab passed from App.tsx
  handleOpenGuestBook, // Added
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
}: GenerateCommandsArgs): Command[] => {
  const allCommands: Command[] = [];

  sidebarItems.forEach(item => {
    if (item.fileName) {
        const commandLabel = `Go to File: ${item.fileName}`;
        allCommands.push({
            id: `open_${item.fileName}`,
            label: commandLabel,
            action: createCommandAction(() => handleOpenTab(item), closeCommandPalette, 'tab-open', commandLabel, addAppLog),
            icon: item.icon,
            group: "Go to File",
        });
    } else if (item.type === 'guest_book') { // Handle Guest Book from sidebar items
        const commandLabel = `Go to: ${item.label}`;
         allCommands.push({
            id: `open_${item.id}`,
            label: commandLabel,
            action: createCommandAction(() => handleOpenTab(item), closeCommandPalette, 'ui-click', commandLabel, addAppLog),
            icon: item.icon,
            group: "Go to View",
        });
    }
  });
  
  const runCVGeneratorLabel = 'Run CV Generator Script';
  allCommands.push({
    id: 'run_cv_generator',
    label: runCVGeneratorLabel,
    action: createCommandAction(handleRunCVGenerator, closeCommandPalette, 'terminal-run', runCVGeneratorLabel, addAppLog),
    icon: icons.generate_cv_icon || Play,
    group: "Run",
    description: "Simulates generating Nandang's CV and opens a preview."
  });

  const toggleSidebarLabel = isSidebarVisible ? 'Hide Explorer Sidebar' : 'Show Explorer Sidebar';
  allCommands.push({
    id: 'toggle_sidebar',
    label: toggleSidebarLabel,
    action: createCommandAction(toggleSidebarVisibility, closeCommandPalette, 'panel-toggle', toggleSidebarLabel, addAppLog),
    icon: isSidebarVisible ? EyeOff : Eye,
    group: "View",
  });

  const toggleSearchLabel = 'Toggle Search Panel';
  allCommands.push({
    id: 'toggle_search_panel',
    label: toggleSearchLabel,
    action: createCommandAction(handleToggleSearchPanel, closeCommandPalette, 'panel-toggle', toggleSearchLabel, addAppLog),
    icon: SearchIconLucide,
    group: "View",
  });

  const toggleArticlesLabel = 'Toggle Articles Panel';
   allCommands.push({
    id: 'toggle_articles_panel',
    label: toggleArticlesLabel,
    action: createCommandAction(handleToggleArticlesPanel, closeCommandPalette, 'panel-toggle', toggleArticlesLabel, addAppLog),
    icon: ArticlesIconLucide,
    group: "View",
  });

  const toggleStatsLabel = 'Toggle Statistics Panel';
  allCommands.push({
    id: 'toggle_statistics_panel',
    label: toggleStatsLabel,
    action: createCommandAction(handleToggleStatisticsPanel, closeCommandPalette, 'panel-toggle', toggleStatsLabel, addAppLog),
    icon: icons.statistics_icon || StatisticsIconLucide,
    group: "View",
  });

  const toggleGitHubLabel = 'View: Open GitHub Profile Tab'; // Updated label
  allCommands.push({
    id: 'toggle_github_panel', // ID can remain the same or change, action matters
    label: toggleGitHubLabel,
    action: createCommandAction(handleToggleGitHubPanel, closeCommandPalette, 'panel-toggle', toggleGitHubLabel, addAppLog), // handleToggleGitHubPanel is now handleOpenGitHubProfileTab
    icon: icons.github_icon || Github,
    group: "View",
    description: "Open the GitHub Profile tab." // Updated description
  });
  
  const openGuestBookLabel = 'View: Open Guest Book';
  allCommands.push({
    id: 'open_guest_book',
    label: openGuestBookLabel,
    action: createCommandAction(handleOpenGuestBook, closeCommandPalette, 'ui-click', openGuestBookLabel, addAppLog),
    icon: icons.guest_book_icon || MessageSquare,
    group: "View",
    description: "Open the Guest Book tab."
  });


  const toggleTerminalLabel = 'Toggle Terminal';
  allCommands.push({
    id: 'toggle_terminal_panel',
    label: toggleTerminalLabel,
    action: createCommandAction(toggleTerminalVisibility, closeCommandPalette, 'panel-toggle', toggleTerminalLabel, addAppLog),
    icon: icons.TerminalIcon || FileTerminal,
    group: "View",
    description: "Show, hide, or focus the Terminal tab in the bottom panel (Ctrl+` or Cmd+`)",
  });

  const togglePetsLabel = 'Toggle Pets Panel';
   allCommands.push({
    id: 'toggle_pets_panel',
    label: togglePetsLabel,
    action: createCommandAction(togglePetsPanelVisibility, closeCommandPalette, 'panel-toggle', togglePetsLabel, addAppLog),
    icon: icons.CatIcon || Cat,
    group: "View",
    description: "Show, hide, or focus the Pets tab in the bottom panel (Ctrl+Alt+Shift+P or Cmd+Alt+Shift+P)",
  });

  const toggleLogsLabel = 'Toggle Logs Panel';
   allCommands.push({
    id: 'toggle_logs_panel',
    label: toggleLogsLabel,
    action: createCommandAction(toggleLogsPanelVisibility, closeCommandPalette, 'panel-toggle', toggleLogsLabel, addAppLog),
    icon: icons.LogsIcon || ListChecks,
    group: "View",
    description: "Show, hide, or focus the Logs tab in the bottom panel.",
  });

  const openAIChatLabel = 'Open AI Assistant';
  allCommands.push({
    id: 'open_ai_chat',
    label: openAIChatLabel,
    action: createCommandAction(handleOpenAIChatTab, closeCommandPalette, 'ui-click', openAIChatLabel, addAppLog),
    icon: BotIcon,
    group: "View",
  });

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

  const openSettingsLabel = 'Preferences: Open Settings (UI)';
  allCommands.push({
    id: 'open_settings_ui',
    label: openSettingsLabel,
    action: createCommandAction(handleOpenSettingsEditor, closeCommandPalette, 'ui-click', openSettingsLabel, addAppLog),
    icon: icons.settings_icon || Settings,
    group: "Preferences",
    description: "Open the user interface for settings."
  });

  const toggleSoundLabel = isSoundMuted ? 'Preferences: Unmute Sound Effects' : 'Preferences: Mute Sound Effects';
  allCommands.push({
    id: 'toggle_sound_effects',
    label: toggleSoundLabel,
    action: createCommandAction(handleToggleSoundMute, closeCommandPalette, 'setting-change', toggleSoundLabel, addAppLog),
    icon: isSoundMuted ? (icons.VolumeXIcon || VolumeX) : (icons.Volume2Icon || Volume2),
    group: "Preferences",
    isSelected: !isSoundMuted,
  });

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
