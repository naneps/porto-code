
import { AppMenuItem, Theme, FontFamilyOption, FontSizeOption, SidebarItemConfig, Tab, ProjectDetail } from '../../types';
import { LucideIcon, Command, Eye, EyeOff, Check, Play, FileTerminal, Cat } from 'lucide-react';

interface MenuConfigArgs {
  onOpenCommandPalette: () => void;
  onToggleSidebar: () => void;
  isSidebarVisible: boolean;
  themes: Theme[];
  currentThemeName: string;
  onThemeChange: (themeName: string) => void;
  fontFamilies: FontFamilyOption[];
  currentFontFamilyId: string;
  onFontFamilyChange: (fontId: string) => void;
  fontSizes: FontSizeOption[];
  currentFontSizeId: string;
  onFontSizeChange: (sizeId: string) => void;
  onOpenAboutModal: () => void;
  icons: { [key: string]: LucideIcon };
  sidebarItems: SidebarItemConfig[];
  projects: string[]; 
  onRunItem: (config: { id: string, fileName: string, title: string, type: Tab['type'] }) => void;
  onToggleTerminal: () => void;
  onTogglePetsPanel: () => void; 
}

export const generateMenuConfig = (args: MenuConfigArgs): { name: string; subItems?: AppMenuItem[] }[] => [
  { name: 'File' }, 
  { name: 'Edit' }, 
  { name: 'Selection' }, 
  { 
    name: 'View', 
    subItems: [
      { label: 'Command Palette...', action: args.onOpenCommandPalette, icon: Command },
      { 
        label: 'Appearance', 
        icon: args.icons.theme_command,
        subItems: [ 
          { 
            label: 'Toggle Explorer Sidebar', 
            action: args.onToggleSidebar, 
            icon: args.isSidebarVisible ? EyeOff : Eye
          },
          { separator: true },
          {
            label: 'Theme',
            icon: args.icons.theme_command,
            subItems: args.themes.map(theme => ({
              label: theme.name,
              action: () => args.onThemeChange(theme.name),
              value: theme.name,
              isSelected: args.currentThemeName === theme.name,
              icon: args.currentThemeName === theme.name ? Check : undefined, 
            })),
          },
          {
            label: 'Font Family',
            icon: args.icons.font_command,
            subItems: args.fontFamilies.map(font => ({
              label: font.label,
              action: () => args.onFontFamilyChange(font.id),
              value: font.id,
              isSelected: args.currentFontFamilyId === font.id,
              icon: args.currentFontFamilyId === font.id ? Check : undefined,
            })),
          },
          {
            label: 'Font Size',
            icon: args.icons.font_command, 
            subItems: args.fontSizes.map(size => ({
              label: `${size.label} (${size.value})`,
              action: () => args.onFontSizeChange(size.id),
              value: size.id,
              isSelected: args.currentFontSizeId === size.id,
              icon: args.currentFontSizeId === size.id ? Check : undefined,
            })),
          },
        ]
      },
      { separator: true },
      { 
        label: 'Toggle Terminal', 
        action: args.onToggleTerminal, 
        icon: args.icons.TerminalIcon || FileTerminal,
      },
      { 
        label: 'Toggle Pets Panel', 
        action: args.onTogglePetsPanel, 
        icon: args.icons.CatIcon || Cat, 
      },
    ] 
  },
  { 
    name: 'Go' 
  }, 
  {
    name: 'Run',
    subItems: [
      ...args.sidebarItems.map(item => ({
        label: `Run ${item.fileName}`,
        action: () => args.onRunItem({
          id: `${item.id}_preview`, 
          fileName: item.fileName,  
          title: `Preview: ${item.title || item.fileName}`,
          type: 'json_preview',
        }),
        icon: args.icons.PlayIcon, 
      })),
      ...(args.projects.length > 0 && args.sidebarItems.length > 0 ? [{ separator: true }] : []),
      ...args.projects.map((projectTitle, index) => {
        const projectId = `project_${index}_${projectTitle.toLowerCase().replace(/\s+/g, '_').replace(/[^\w-]+/g, '')}.json`;
        return {
          label: `Run Project: ${projectTitle}`,
          action: () => args.onRunItem({
            id: `${projectId}_preview`, 
            fileName: projectId,        
            title: `Preview: ${projectTitle}`,
            type: 'json_preview',
          }),
          icon: args.icons.PlayIcon,
        };
      }),
    ],
  },
  { 
    name: 'Terminal', 
    subItems: [
        {
            label: 'New Terminal', // This action will toggle and focus terminal tab
            action: args.onToggleTerminal,
            icon: args.icons.TerminalIcon || FileTerminal,
        }
    ]
  }, 
  { 
    name: 'Help', 
    subItems: [
      { label: 'About Portfolio', action: args.onOpenAboutModal, icon: args.icons.about_portfolio },
    ] 
  },
];
