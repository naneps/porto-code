
import { Command, SidebarItemConfig, Theme, FontFamilyOption, FontSizeOption } from '../types';
import { LucideIcon, EyeOff, Eye, Command as CommandIcon, Bot as BotIcon, Search as SearchIconLucide, Newspaper as ArticlesIconLucide, BarChart3 as StatisticsIconLucide, FileTerminal, Cat, Volume2, VolumeX, Play } from 'lucide-react';
import { playSound } from './audioUtils';


interface GenerateCommandsArgs {
  sidebarItems: SidebarItemConfig[]; 
  handleOpenTab: (item: SidebarItemConfig | { id?: string, fileName: string, type?: 'file' | 'project_detail' | 'ai_chat' | 'json_preview' | 'cv_preview', title?: string }, isRunAction?: boolean) => void;
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
  toggleTerminalVisibility: () => void; 
  togglePetsPanelVisibility: () => void; 
  handleToggleSoundMute: () => void;
  isSoundMuted: boolean;
  handleRunCVGenerator: () => void; // New arg for CV Generator
}

const createCommandAction = (action: () => void, closePalette: () => void, soundName: string = 'command-execute') => {
  return () => {
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
  predefinedThemes,
  handleThemeChange,
  currentThemeName,
  fontFamilyOptions,
  handleFontFamilyChange,
  currentFontFamilyId,
  fontSizeOptions,
  handleFontSizeChange,
  currentFontSizeId,
  openAboutModal,
  icons,
  handleToggleSearchPanel,
  handleToggleArticlesPanel,
  handleToggleStatisticsPanel, 
  toggleTerminalVisibility,
  togglePetsPanelVisibility, 
  handleToggleSoundMute,
  isSoundMuted,
  handleRunCVGenerator, // Destructure new arg
}: GenerateCommandsArgs): Command[] => {
  const allCommands: Command[] = [];

  // Go to File commands
  sidebarItems.forEach(item => {
    if (item.fileName) { // Ensure fileName exists before creating command
        allCommands.push({
            id: `open_${item.fileName}`,
            label: `Go to File: ${item.fileName}`,
            action: createCommandAction(() => handleOpenTab(item), closeCommandPalette, 'tab-open'),
            icon: item.icon,
            group: "Go to File",
        });
    }
  });

  // Run commands
  allCommands.push({
    id: 'run_cv_generator',
    label: 'Run CV Generator Script',
    action: createCommandAction(handleRunCVGenerator, closeCommandPalette, 'terminal-run'),
    icon: icons.generate_cv_icon || Play,
    group: "Run",
    description: "Simulates generating Nandang's CV and opens a preview."
  });


  // View commands
  allCommands.push({
    id: 'toggle_sidebar',
    label: isSidebarVisible ? 'Hide Explorer Sidebar' : 'Show Explorer Sidebar',
    action: createCommandAction(toggleSidebarVisibility, closeCommandPalette, 'panel-toggle'),
    icon: isSidebarVisible ? EyeOff : Eye,
    group: "View",
  });
  allCommands.push({
    id: 'toggle_search_panel',
    label: 'Toggle Search Panel',
    action: createCommandAction(handleToggleSearchPanel, closeCommandPalette, 'panel-toggle'),
    icon: SearchIconLucide,
    group: "View",
  });
   allCommands.push({
    id: 'toggle_articles_panel',
    label: 'Toggle Articles Panel',
    action: createCommandAction(handleToggleArticlesPanel, closeCommandPalette, 'panel-toggle'),
    icon: ArticlesIconLucide, 
    group: "View",
  });
  allCommands.push({
    id: 'toggle_statistics_panel', 
    label: 'Toggle Statistics Panel',
    action: createCommandAction(handleToggleStatisticsPanel, closeCommandPalette, 'panel-toggle'),
    icon: icons.statistics_icon || StatisticsIconLucide,
    group: "View",
  });
  allCommands.push({
    id: 'toggle_terminal_panel', 
    label: 'Toggle Terminal', 
    action: createCommandAction(toggleTerminalVisibility, closeCommandPalette, 'panel-toggle'),
    icon: icons.TerminalIcon || FileTerminal, 
    group: "View",
    description: "Show, hide, or focus the Terminal tab in the bottom panel (Ctrl+` or Cmd+`)",
  });
   allCommands.push({
    id: 'toggle_pets_panel', 
    label: 'Toggle Pets Panel',
    action: createCommandAction(togglePetsPanelVisibility, closeCommandPalette, 'panel-toggle'),
    icon: icons.CatIcon || Cat, 
    group: "View",
    description: "Show, hide, or focus the Pets tab in the bottom panel (Ctrl+Alt+Shift+P or Cmd+Alt+Shift+P)",
  });
  allCommands.push({
    id: 'open_ai_chat',
    label: 'Open AI Assistant',
    action: createCommandAction(handleOpenAIChatTab, closeCommandPalette, 'ui-click'),
    icon: BotIcon,
    group: "View",
  });
  allCommands.push({
    id: 'command_palette_command',
    label: 'Command Palette',
    action: createCommandAction(() => { openCommandPalette(); }, closeCommandPalette, 'modal-toggle'), 
    icon: CommandIcon,
    group: "View",
    description: "Open the command palette to search for commands and files."
  });

  // Preferences: Theme commands
  predefinedThemes.forEach(theme => {
    allCommands.push({
      id: `theme_${theme.name.toLowerCase().replace(/\s+/g, '_')}`,
      label: `Theme: ${theme.name}`,
      action: createCommandAction(() => handleThemeChange(theme.name), closeCommandPalette, 'setting-change'),
      icon: icons.theme_command,
      group: "Preferences: Theme",
      value: theme.name,
      isSelected: currentThemeName === theme.name,
    });
  });

  // Preferences: Font Family commands
  fontFamilyOptions.forEach(font => {
    allCommands.push({
      id: `font_family_${font.id}`,
      label: `Font: ${font.label}`,
      action: createCommandAction(() => handleFontFamilyChange(font.id), closeCommandPalette, 'setting-change'),
      icon: icons.font_command,
      group: "Preferences: Font Family",
      value: font.id,
      isSelected: currentFontFamilyId === font.id,
    });
  });

  // Preferences: Font Size commands
  fontSizeOptions.forEach(size => {
    allCommands.push({
      id: `font_size_${size.id}`,
      label: `Font Size: ${size.label} (${size.value})`,
      action: createCommandAction(() => handleFontSizeChange(size.id), closeCommandPalette, 'setting-change'),
      icon: icons.font_command, 
      group: "Preferences: Font Size",
      value: size.id,
      isSelected: currentFontSizeId === size.id,
    });
  });

  // Preferences: Sound
  allCommands.push({
    id: 'toggle_sound_effects',
    label: isSoundMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects',
    action: createCommandAction(handleToggleSoundMute, closeCommandPalette, 'setting-change'),
    icon: isSoundMuted ? (icons.VolumeXIcon || VolumeX) : (icons.Volume2Icon || Volume2),
    group: "Preferences: Sound",
    isSelected: !isSoundMuted, 
  });

  // Help commands
  allCommands.push({
    id: 'about_portfolio',
    label: 'About Portfolio',
    action: createCommandAction(openAboutModal, closeCommandPalette, 'modal-toggle'),
    icon: icons.about_portfolio,
    group: "Help",
  });

  return allCommands;
};