
import { Command, SidebarItemConfig, Theme, FontFamilyOption, FontSizeOption } from '../types';
import { LucideIcon, EyeOff, Eye, Command as CommandIcon, Bot as BotIcon, Search as SearchIconLucide, Newspaper as ArticlesIconLucide, FileTerminal, Cat } from 'lucide-react';

interface GenerateCommandsArgs {
  sidebarItems: SidebarItemConfig[]; 
  handleOpenTab: (item: SidebarItemConfig | { id?: string, fileName: string, type?: 'file' | 'project_detail' | 'ai_chat' | 'json_preview', title?: string }, isRunAction?: boolean) => void;
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
  toggleTerminalVisibility: () => void; // Renamed for clarity, handles terminal tab
  togglePetsPanelVisibility: () => void; // Renamed for clarity, handles pets tab
}

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
  toggleTerminalVisibility,
  togglePetsPanelVisibility, 
}: GenerateCommandsArgs): Command[] => {
  const allCommands: Command[] = [];

  // Go to File commands
  sidebarItems.forEach(item => {
    allCommands.push({
      id: `open_${item.fileName}`,
      label: `Go to File: ${item.fileName}`,
      action: () => { handleOpenTab(item); closeCommandPalette(); },
      icon: item.icon,
      group: "Go to File",
    });
  });

  // View commands
  allCommands.push({
    id: 'toggle_sidebar',
    label: isSidebarVisible ? 'Hide Explorer Sidebar' : 'Show Explorer Sidebar',
    action: () => { toggleSidebarVisibility(); closeCommandPalette(); },
    icon: isSidebarVisible ? EyeOff : Eye,
    group: "View",
  });
  allCommands.push({
    id: 'toggle_search_panel',
    label: 'Toggle Search Panel',
    action: () => { handleToggleSearchPanel(); closeCommandPalette(); },
    icon: SearchIconLucide,
    group: "View",
  });
   allCommands.push({
    id: 'toggle_articles_panel',
    label: 'Toggle Articles Panel',
    action: () => { handleToggleArticlesPanel(); closeCommandPalette(); },
    icon: ArticlesIconLucide, 
    group: "View",
  });
  allCommands.push({
    id: 'toggle_terminal_panel', 
    label: 'Toggle Terminal', // Changed label for clarity
    action: () => { toggleTerminalVisibility(); closeCommandPalette(); },
    icon: icons.TerminalIcon || FileTerminal, 
    group: "View",
    description: "Show, hide, or focus the Terminal tab in the bottom panel (Ctrl+` or Cmd+`)",
  });
   allCommands.push({
    id: 'toggle_pets_panel', 
    label: 'Toggle Pets Panel',
    action: () => { togglePetsPanelVisibility(); closeCommandPalette(); },
    icon: icons.CatIcon || Cat, 
    group: "View",
    description: "Show, hide, or focus the Pets tab in the bottom panel (Ctrl+Alt+Shift+P or Cmd+Alt+Shift+P)",
  });
  allCommands.push({
    id: 'open_ai_chat',
    label: 'Open AI Assistant',
    action: () => { handleOpenAIChatTab(); closeCommandPalette(); },
    icon: BotIcon,
    group: "View",
  });
  allCommands.push({
    id: 'command_palette_command',
    label: 'Command Palette',
    action: () => { closeCommandPalette(); openCommandPalette(); }, 
    icon: CommandIcon,
    group: "View",
    description: "Open the command palette to search for commands and files."
  });

  // Preferences: Theme commands
  predefinedThemes.forEach(theme => {
    allCommands.push({
      id: `theme_${theme.name.toLowerCase().replace(/\s+/g, '_')}`,
      label: `Theme: ${theme.name}`,
      action: () => { handleThemeChange(theme.name); closeCommandPalette(); },
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
      action: () => { handleFontFamilyChange(font.id); closeCommandPalette(); },
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
      action: () => { handleFontSizeChange(size.id); closeCommandPalette(); },
      icon: icons.font_command, 
      group: "Preferences: Font Size",
      value: size.id,
      isSelected: currentFontSizeId === size.id,
    });
  });

  // Help commands
  allCommands.push({
    id: 'about_portfolio',
    label: 'About Portfolio',
    action: () => { openAboutModal(); closeCommandPalette(); },
    icon: icons.about_portfolio,
    group: "Help",
  });

  return allCommands;
};
