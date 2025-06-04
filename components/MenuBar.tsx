
import React from 'react';
import { AppMenuItem } from '../types'; // For type consistency if used directly by MenuBar

interface MenuBarProps {
  menuItems: { name: string; subItems?: AppMenuItem[] }[]; // From TitleBar
  activeMenu: string | null;
  toggleMenu: (menuName: string) => void;
  renderSubItems: (items: AppMenuItem[], level?: number) => JSX.Element | null;
}


const MenuBar: React.FC<MenuBarProps> = ({ menuItems, activeMenu, toggleMenu, renderSubItems }) => {
  return (
    <>
      {menuItems.map((menu) => (
         <div key={menu.name} className="relative">
          <button
            onClick={() => menu.subItems && toggleMenu(menu.name)}
            className={`px-2 py-0.5 rounded focus:outline-none transition-colors duration-150 ease-in-out text-xs text-[var(--menubar-foreground)]
              ${activeMenu === menu.name ? 'bg-[var(--titlebar-menu-active-background)]' : 'hover:bg-[var(--menubar-hover-background)]'}`}
            title={menu.subItems ? menu.name : `${menu.name} (Not Implemented)`}
            aria-haspopup={!!menu.subItems}
            aria-expanded={activeMenu === menu.name}
          >
            {menu.name}
          </button>
          {menu.subItems && activeMenu === menu.name && renderSubItems(menu.subItems)}
        </div>
      ))}
    </>
  );
};

export default MenuBar;