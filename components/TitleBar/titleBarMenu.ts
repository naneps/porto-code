
import { AppMenuItem, Theme, FontFamilyOption, FontSizeOption } from '../../types';
import { LucideIcon, Command, Eye, EyeOff, Check } from 'lucide-react'; // Ensure all used icons are imported

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
}

export const generateMenuConfig = ({
  onOpenCommandPalette,
  onToggleSidebar,
  isSidebarVisible,
  themes,
  currentThemeName,
  onThemeChange,
  fontFamilies,
  currentFontFamilyId,
  onFontFamilyChange,
  fontSizes,
  currentFontSizeId,
  onFontSizeChange,
  onOpenAboutModal,
  icons,
}: MenuConfigArgs): { name: string; subItems?: AppMenuItem[] }[] => [
  { name: 'File' }, // Placeholder
  { name: 'Edit' }, // Placeholder
  { name: 'Selection' }, // Placeholder
  { 
    name: 'View', 
    subItems: [
      { label: 'Command Palette...', action: onOpenCommandPalette, icon: Command },
      { 
        label: 'Appearance', 
        icon: icons.theme_command,
        subItems: [ 
          { 
            label: 'Toggle Sidebar', 
            action: onToggleSidebar, 
            icon: isSidebarVisible ? EyeOff : Eye
          },
          { separator: true },
          {
            label: 'Theme',
            icon: icons.theme_command,
            subItems: themes.map(theme => ({
              label: theme.name,
              action: () => onThemeChange(theme.name),
              value: theme.name,
              isSelected: currentThemeName === theme.name,
              icon: currentThemeName === theme.name ? Check : undefined, // Or a more subtle icon
            })),
          },
          {
            label: 'Font Family',
            icon: icons.font_command,
            subItems: fontFamilies.map(font => ({
              label: font.label,
              action: () => onFontFamilyChange(font.id),
              value: font.id,
              isSelected: currentFontFamilyId === font.id,
              icon: currentFontFamilyId === font.id ? Check : undefined,
            })),
          },
          {
            label: 'Font Size',
            icon: icons.font_command, // Could use a dedicated size icon
            subItems: fontSizes.map(size => ({
              label: `${size.label} (${size.value})`,
              action: () => onFontSizeChange(size.id),
              value: size.id,
              isSelected: currentFontSizeId === size.id,
              icon: currentFontSizeId === size.id ? Check : undefined,
            })),
          },
        ]
      }
    ] 
  },
  { name: 'Go' }, // Placeholder
  { name: 'Run' }, // Placeholder
  { name: 'Terminal' }, // Placeholder
  { 
    name: 'Help', 
    subItems: [
      { label: 'About Portfolio', action: onOpenAboutModal, icon: icons.about_portfolio },
    ] 
  },
];
