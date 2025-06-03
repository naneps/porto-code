
import React, { useState, useRef, useEffect } from 'react';
import MenuBar from './MenuBar'; 
import { ICONS, PORTFOLIO_DATA } from '../constants';
import { AppMenuItem, Theme, FontFamilyOption, FontSizeOption } from '../types'; 
import { Command, Eye, EyeOff, Check } from 'lucide-react';


interface TitleBarProps {
  onToggleSidebar: () => void;
  isSidebarVisible: boolean;
  onOpenCommandPalette: () => void;
  onOpenAboutModal: () => void;
  canNavigateBack: boolean;
  canNavigateForward: boolean;
  onNavigateBack: () => void;
  onNavigateForward: () => void;
  // Theme props
  themes: Theme[];
  currentThemeName: string;
  onThemeChange: (themeName: string) => void;
  fontFamilies: FontFamilyOption[];
  currentFontFamilyId: string;
  onFontFamilyChange: (fontId: string) => void;
  fontSizes: FontSizeOption[];
  currentFontSizeId: string;
  onFontSizeChange: (sizeId: string) => void;
}

const TitleBar: React.FC<TitleBarProps> = (props) => {
  const { 
    onToggleSidebar, isSidebarVisible, onOpenCommandPalette, onOpenAboutModal,
    canNavigateBack, canNavigateForward, onNavigateBack, onNavigateForward,
    themes, currentThemeName, onThemeChange,
    fontFamilies, currentFontFamilyId, onFontFamilyChange,
    fontSizes, currentFontSizeId, onFontSizeChange
  } = props;

  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = (menuName: string) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuConfig: { name: string; subItems?: AppMenuItem[] }[] = [
    { name: 'File' }, // Placeholder
    { name: 'Edit' }, // Placeholder
    { name: 'Selection' }, // Placeholder
    { 
      name: 'View', 
      subItems: [
        { label: 'Command Palette...', action: onOpenCommandPalette, icon: Command },
        { 
          label: 'Appearance', 
          icon: ICONS.theme_command,
          subItems: [ 
            { 
              label: 'Toggle Sidebar', 
              action: onToggleSidebar, 
              icon: isSidebarVisible ? EyeOff : Eye
            },
            { separator: true },
            {
              label: 'Theme',
              icon: ICONS.theme_command,
              subItems: themes.map(theme => ({
                label: theme.name,
                action: () => onThemeChange(theme.name),
                value: theme.name,
                isSelected: currentThemeName === theme.name,
                icon: currentThemeName === theme.name ? Check : undefined,
              })),
            },
            {
              label: 'Font Family',
              icon: ICONS.font_command,
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
              icon: ICONS.font_command, // Could use a dedicated size icon
              subItems: fontSizes.map(size => ({
                label: size.label,
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
        { label: 'About Portfolio', action: onOpenAboutModal, icon: ICONS.about_portfolio },
      ] 
    },
  ];
  
  const MenuDropdownIcon = ICONS.chevron_down_icon;

  const renderSubItems = (items: AppMenuItem[], level = 0): JSX.Element => (
    <div 
        className={`absolute top-full ${level > 0 ? 'left-full -mt-7' : 'left-0'} mt-1 
                   bg-[var(--menu-dropdown-background)] border border-[var(--menu-dropdown-border)] 
                   rounded shadow-lg py-1 z-50 min-w-[220px] text-[var(--menu-item-foreground)]`}
        style={{ marginLeft: level > 0 ? '0.25rem' : '0' }} // Small offset for sub-sub-menus
    >
      {items.map((subItem, index) => {
        if (subItem.separator) {
          return <hr key={`sep-${index}`} className="my-1 border-[var(--menubar-separator-color)]" />;
        }
        // For non-separator items, subItem.label is expected to be present based on menuConfig structure
        const itemKey = subItem.label || `menu-item-${index}`; 

        return subItem.subItems ? (
          <div key={itemKey} className="relative group/submenu">
            <button
              className={`w-full text-left px-3 py-1.5 text-xs flex justify-between items-center transition-colors
                          ${subItem.isSelected ? 'bg-[var(--menu-item-selected-background)] text-[var(--menu-item-selected-foreground)]' : 'hover:bg-[var(--menu-item-hover-background)] hover:text-[var(--menu-item-hover-foreground)]'}`}
            >
              <div className="flex items-center">
                {subItem.icon && <subItem.icon size={14} className="mr-2 text-[var(--menu-item-icon-foreground)]" />}
                {subItem.label}
              </div>
              {MenuDropdownIcon && <MenuDropdownIcon size={14} className="-rotate-90 text-[var(--menu-item-icon-foreground)]" />}
            </button>
            <div className="absolute left-full top-0 hidden group-hover/submenu:block group-focus-within/submenu:block -mt-1">
                {renderSubItems(subItem.subItems, level + 1)}
            </div>
          </div>
        ) : (
          <button
            key={itemKey}
            onClick={() => {
              if (subItem.action) subItem.action();
              setActiveMenu(null); 
            }}
            className={`w-full text-left px-3 py-1.5 text-xs flex items-center transition-colors
                        ${subItem.isSelected ? 'bg-[var(--menu-item-selected-background)] text-[var(--menu-item-selected-foreground)]' : 'hover:bg-[var(--menu-item-hover-background)] hover:text-[var(--menu-item-hover-foreground)]'}`}
          >
            {subItem.icon && <subItem.icon size={14} className={`mr-2 ${subItem.isSelected ? 'text-[var(--menu-item-selected-foreground)]' : 'text-[var(--menu-item-icon-foreground)]'}`} />}
            <span className="flex-grow">{subItem.label}</span>
            {/* Alternative checkmark placement */}
            {/* {subItem.isSelected && !subItem.icon && <Check size={14} className="ml-auto text-[var(--menu-item-selected-foreground)]" />} */}
          </button>
        )
      })}
    </div>
  );


  return (
    <div className="bg-[var(--titlebar-background)] text-[var(--titlebar-foreground)] px-2 py-1.5 border-b border-[var(--titlebar-border)] flex items-center justify-between text-xs h-[36px] flex-shrink-0">
      <div className="flex items-center space-x-1" ref={menuRef}>
        <ICONS.file_code_icon size={20} className="text-[var(--titlebar-icon-blue)] ml-1" /> {/* Changed to FileCode */}
        <MenuBar menuItems={menuConfig} activeMenu={activeMenu} toggleMenu={toggleMenu} renderSubItems={renderSubItems} />

        <button 
            title="Back" 
            onClick={onNavigateBack}
            disabled={!canNavigateBack}
            className="p-1 rounded hover:bg-[var(--titlebar-button-hover-background)] focus:outline-none transition-colors duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Go back in tab history"
        >
            <ICONS.arrow_left_icon size={18} className="text-[var(--titlebar-icon-blue)]" />
        </button>
        <button 
            title="Forward" 
            onClick={onNavigateForward}
            disabled={!canNavigateForward}
            className="p-1 rounded hover:bg-[var(--titlebar-button-hover-background)] focus:outline-none transition-colors duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Go forward in tab history"
        >
            <ICONS.arrow_right_icon size={18} className="text-[var(--titlebar-icon-blue)]" />
        </button>
      </div>

      <div className="flex-1 flex justify-center items-center min-w-0 px-2">
        <div className="bg-[var(--menubar-background)] border border-[var(--menubar-separator-color)] rounded-md px-3 py-1 flex items-center max-w-md w-full">
          <ICONS.file_code_icon size={14} className="text-[var(--titlebar-icon-blue)] mr-2 flex-shrink-0" />
          <span className="truncate text-[var(--titlebar-foreground)] text-xs">
            vscode-portfolio -- {PORTFOLIO_DATA.name}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-1.5">
        <button title="Split Editor (Not Implemented)" className="p-1 hover:bg-[var(--titlebar-button-hover-background)] rounded text-[var(--titlebar-foreground)]">
          <ICONS.split_square_horizontal_icon size={16} />
        </button>
        <button title="Toggle Panel Layout (Not Implemented)" className="p-1 hover:bg-[var(--titlebar-button-hover-background)] rounded text-[var(--titlebar-foreground)]">
          <ICONS.layout_grid_icon size={16} />
        </button>
        <button title="Profile (Not Implemented)" className="p-1 hover:bg-[var(--titlebar-button-hover-background)] rounded text-[var(--titlebar-foreground)]">
          <ICONS.user_profile_icon size={16} />
        </button>
        
        <div className="h-4 w-px bg-[var(--menubar-separator-color)] mx-1"></div>

        <button title="Minimize (Not Implemented)" className="p-1.5 hover:bg-[var(--titlebar-button-hover-background)] rounded text-[var(--titlebar-foreground)]">
          <ICONS.minus_icon size={16} />
        </button>
        <button title="Maximize/Restore (Not Implemented)" className="p-1.5 hover:bg-[var(--titlebar-button-hover-background)] rounded text-[var(--titlebar-foreground)]">
          <ICONS.square_icon size={14} />
        </button>
        <button title="Close (Not Implemented)" className="p-1.5 hover:bg-red-600 rounded text-[var(--titlebar-foreground)] hover:text-white">
          <ICONS.x_icon size={16} />
        </button>
      </div>
    </div>
  );
};

export default TitleBar;