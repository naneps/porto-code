
import { Command, SidebarItemConfig, Theme, FontFamilyOption, FontSizeOption } from '../types';
import { LucideIcon, EyeOff, Eye, Command as CommandIcon, Bot as BotIcon } from 'lucide-react';

interface GenerateCommandsArgs {
  sidebarItems: SidebarItemConfig[];
  handleOpenTab: (item: SidebarItemConfig | { id?: string, fileName: string, type?: 'file' | 'project_detail' | 'ai_chat' | 'json_preview', title?: string }) => void;
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
}: GenerateCommandsArgs): Command[] => {
  const allCommands: Command[] = [];

  // File commands
  sidebarItems.forEach(item => {
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
    id: 'command_palette_command', // Renamed to avoid conflict with other 'command_palette' id potentially
    label: 'Command Palette',
    action: () => { closeCommandPalette(); openCommandPalette(); },
    icon: CommandIcon,
    group: "View",
  });

  // Theme commands
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

  // Font family commands
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

  // Font size commands
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

  allCommands.push({
    id: 'about_portfolio',
    label: 'About Portfolio',
    action: () => { openAboutModal(); closeCommandPalette(); },
    icon: icons.about_portfolio,
    group: "Help",
  });

  return allCommands;
};
