
import { FontFamilyOption, FontSizeOption, Theme, ThemeProperties } from './types';

// VSCode Dark+ (Based on default VSCode dark theme)
const vscodeDarkPlusProperties: ThemeProperties = {
  // App & General UI
  '--app-background': '#1e1e1e', 
  '--text-default': '#d4d4d4', 
  '--text-muted': '#808080',   
  '--text-accent': '#9E69F2FF',  
  '--text-inverse': '#1E1E1E', 
  '--border-color': '#333333', 
  '--focus-border': '#007ACC', 
  '--link-foreground': '#3794FF',
  '--link-hover-foreground': '#6EB0FF',

  // Title Bar
  '--titlebar-background': '#3C3C3C',
  '--titlebar-foreground': '#CCCCCC',
  '--titlebar-inactive-foreground': '#999999',
  '--titlebar-border': '#4A4A4A',
  '--titlebar-button-hover-background': '#505050',
  '--titlebar-icon-blue': '#007ACC', 
  '--titlebar-menu-active-background': '#505050',

  // Menu Bar (within TitleBar or separate)
  '--menubar-background': '#3C3C3C', 
  '--menubar-foreground': '#CCCCCC',
  '--menubar-hover-background': '#505050',
  '--menubar-separator-color': '#4A4A4A',
  '--menu-dropdown-background': '#252526',
  '--menu-dropdown-border': '#3E3E3E',
  '--menu-item-hover-background': '#094771', 
  '--menu-item-selected-background': '#073655',
  '--menu-item-selected-foreground': '#FFFFFF',
  '--menu-item-foreground': '#CCCCCC',
  '--menu-item-icon-foreground': '#C5C5C5',


  // Activity Bar
  '--activitybar-background': '#333333',
  '--activitybar-foreground': '#D4D4D4',
  '--activitybar-inactive-foreground': '#858585',
  '--activitybar-active-border': '#007ACC', 
  '--activitybar-active-background': '#404040', 
  '--activitybar-hover-background': '#4A4A4A',

  // Sidebar (Explorer)
  '--sidebar-background': '#252526',
  '--sidebar-foreground': '#CCCCCC',
  '--sidebar-border': '#333333',
  '--sidebar-section-header-foreground': '#BBBBBB',
  '--sidebar-item-hover-background': '#2A2D2E',
  '--sidebar-item-focus-background': '#094771', 
  '--sidebar-item-focus-foreground': '#FFFFFF',

  // Editor Area & Tabs
  '--editor-background': '#1E1E1E',
  '--editor-foreground': '#D4D4D4', 
  '--editor-line-number-foreground': '#858585',
  '--editor-tab-background': '#2D2D2D', 
  '--editor-tab-inactive-background': '#2D2D2D', 
  '--editor-tab-active-background': '#1E1E1E', 
  '--editor-tab-active-foreground': '#FFFFFF',
  '--editor-tab-inactive-foreground': '#999999',
  '--editor-tab-hover-background': '#37373D', 
  '--editor-tab-border': '#252525', 
  '--editor-tab-active-border-top': '#007ACC', 
  '--editor-tab-icon-foreground': '#C5C5C5',
  '--editor-tab-icon-active-foreground': '#9E69F2FF',


  // Breadcrumbs
  '--breadcrumbs-background': '#1E1E1E', 
  '--breadcrumbs-foreground': '#CCCCCC',
  '--breadcrumbs-focus-foreground': '#E0E0E0',
  '--breadcrumbs-separator-color': '#4A4A4A',
  '--breadcrumbs-icon-foreground': '#9E69F2FF',

  // Status Bar
  '--statusbar-background': '#007ACC', 
  '--statusbar-foreground': '#FFFFFF',
  '--statusbar-border': 'transparent', 
  '--statusbar-item-hover-background': 'rgba(255, 255, 255, 0.12)',

  // Modals (Command Palette, About)
  '--modal-backdrop-background': 'rgba(0, 0, 0, 0.6)',
  '--modal-background': '#252526',
  '--modal-foreground': '#CCCCCC',
  '--modal-border': '#3E3E3E',
  '--modal-input-background': '#3C3C3C',
  '--modal-input-placeholder': '#A0A0A0',
  '--modal-input-border': '#3C3C3C',
  '--modal-selected-item-background': '#094771',
  '--modal-selected-item-foreground': '#FFFFFF',
  '--modal-button-background': '#0E639C',
  '--modal-button-hover-background': '#1177BB',
  '--modal-button-foreground': '#FFFFFF',

  // Scrollbar
  '--scrollbar-track-background': '#252526', 
  '--scrollbar-thumb-background': '#424242',
  '--scrollbar-thumb-hover-background': '#555555',

  // Terminal Panel (content area)
  '--terminal-background': '#181818',
  '--terminal-foreground': '#CCCCCC',
  '--terminal-border': '#333333', 
  '--terminal-cursor-color': '#CCCCCC',
  '--terminal-toolbar-background': '#252526', 
  '--terminal-close-button-hover-background': '#37373D',


  // Bottom Panel Tabs (New)
  '--bottom-panel-tab-background': '#252526', 
  '--bottom-panel-tab-inactive-background': '#252526',
  '--bottom-panel-tab-active-background': '#1E1E1E', 
  '--bottom-panel-tab-active-foreground': '#E0E0E0',
  '--bottom-panel-tab-inactive-foreground': '#888888',
  '--bottom-panel-tab-hover-background': '#2A2D2E',
  '--bottom-panel-tab-border': '#333333', 
  '--bottom-panel-tab-active-border-bottom': '#007ACC', 
  '--bottom-panel-tab-icon-foreground': '#AAAAAA',
  '--bottom-panel-tab-icon-active-foreground': '#B384FFFF',

  // Linear Progress Bar
  '--progress-bar-background': 'var(--editor-tab-border)', 
  '--progress-bar-indicator': 'var(--focus-border)',   

  // Article Tags (Active State)
  '--tag-active-background': 'var(--text-muted)',      
  '--tag-active-text': 'var(--text-inverse)',       

  // Syntax Highlighting (simplified, main colors)
  '--syntax-string': '#CE9178',      
  '--syntax-keyword': '#569CD6',     
  '--syntax-comment': '#6A9955',     
  '--syntax-number': '#B5CEA8',      
  '--syntax-boolean': '#569CD6',    
  '--syntax-property': '#9CDCFE',    
  '--syntax-operator': '#D4D4D4',    
  '--syntax-punctuation': '#D4D4D4', 
  '--syntax-function': '#DCDCAA',    
  '--syntax-base-text': '#D4D4D4',
  
  // Notification Colors (Soft Dark for Dark Theme)
  '--notification-success-background': 'rgb(21,54,36)',   // Dark Green
  '--notification-success-foreground': 'rgb(134,239,172)', // Light Green Text
  '--notification-success-border': 'rgb(34,90,56)',
  '--notification-success-icon': 'rgb(74,222,128)',
  '--notification-error-background': 'rgb(70,26,29)',     // Dark Red
  '--notification-error-foreground': 'rgb(252,165,165)',   // Light Red Text
  '--notification-error-border': 'rgb(120,36,42)',
  '--notification-error-icon': 'rgb(248,113,113)',
  '--notification-info-background': 'rgb(29,54,82)',      // Dark Blue
  '--notification-info-foreground': 'rgb(147,197,253)',   // Light Blue Text
  '--notification-info-border': 'rgb(39,74,122)',
  '--notification-info-icon': 'rgb(96,165,250)',
  '--notification-warning-background': 'rgb(70,51,20)',   // Dark Yellow/Orange
  '--notification-warning-foreground': 'rgb(252,211,77)', // Light Yellow Text
  '--notification-warning-border': 'rgb(110,71,30)',
  '--notification-warning-icon': 'rgb(251,191,36)',
};

// VSCode Light+ (Based on default VSCode light theme)
const vscodeLightPlusProperties: ThemeProperties = {
  // App & General UI
  '--app-background': '#ffffff',
  '--text-default': '#24292E',
  '--text-muted': '#586069',
  '--text-accent': '#0366D6',
  '--text-inverse': '#FFFFFF',
  '--border-color': '#E1E4E8',
  '--focus-border': '#0366D6',
  '--link-foreground': '#0366D6',
  '--link-hover-foreground': '#0052CC',


  // Title Bar
  '--titlebar-background': '#DDDDDD',
  '--titlebar-foreground': '#333333',
  '--titlebar-inactive-foreground': '#666666',
  '--titlebar-border': '#CCCCCC',
  '--titlebar-button-hover-background': '#CACACA',
  '--titlebar-icon-blue': '#005FB8',
  '--titlebar-menu-active-background': '#CACACA',

  // Menu Bar
  '--menubar-background': '#DDDDDD',
  '--menubar-foreground': '#333333',
  '--menubar-hover-background': '#CACACA',
  '--menubar-separator-color': '#CCCCCC',
  '--menu-dropdown-background': '#F3F3F3',
  '--menu-dropdown-border': '#D1D1D1',
  '--menu-item-hover-background': '#0060C0',
  '--menu-item-hover-foreground': '#FFFFFF',
  '--menu-item-selected-background': '#0052CC',
  '--menu-item-selected-foreground': '#FFFFFF',
  '--menu-item-foreground': '#1F1F1F',
  '--menu-item-icon-foreground': '#424242',


  // Activity Bar
  '--activitybar-background': '#F8F8F8',
  '--activitybar-foreground': '#24292E',
  '--activitybar-inactive-foreground': '#586069',
  '--activitybar-active-border': '#0366D6',
  '--activitybar-active-background': '#E7E7E7',
  '--activitybar-hover-background': '#EDEDED',

  // Sidebar (Explorer)
  '--sidebar-background': '#F3F3F3',
  '--sidebar-foreground': '#24292E',
  '--sidebar-border': '#E1E4E8',
  '--sidebar-section-header-foreground': '#333333',
  '--sidebar-item-hover-background': '#E8E8E8',
  '--sidebar-item-focus-background': '#CDE4F6',
  '--sidebar-item-focus-foreground': '#005FB8', 

  // Editor Area & Tabs
  '--editor-background': '#FFFFFF',
  '--editor-foreground': '#24292E',
  '--editor-line-number-foreground': '#AAAAAA',
  '--editor-tab-background': '#ECECEC',
  '--editor-tab-inactive-background': '#ECECEC',
  '--editor-tab-active-background': '#FFFFFF',
  '--editor-tab-active-foreground': '#000000',
  '--editor-tab-inactive-foreground': '#586069',
  '--editor-tab-hover-background': '#DADADA',
  '--editor-tab-border': '#D1D1D1',
  '--editor-tab-active-border-top': '#0366D6', 
  '--editor-tab-icon-foreground': '#424242',
  '--editor-tab-icon-active-foreground': '#0366D6',


  // Breadcrumbs
  '--breadcrumbs-background': '#FFFFFF',
  '--breadcrumbs-foreground': '#586069',
  '--breadcrumbs-focus-foreground': '#24292E',
  '--breadcrumbs-separator-color': '#D1D1D1',
  '--breadcrumbs-icon-foreground': '#0366D6',


  // Status Bar
  '--statusbar-background': '#007ACC', 
  '--statusbar-foreground': '#FFFFFF',
  '--statusbar-border': 'transparent', 
  '--statusbar-item-hover-background': 'rgba(0, 0, 0, 0.08)',

  // Modals
  '--modal-backdrop-background': 'rgba(24, 29, 33, 0.6)',
  '--modal-background': '#FDFDFD',
  '--modal-foreground': '#24292E',
  '--modal-border': '#D1D1D1',
  '--modal-input-background': '#FFFFFF',
  '--modal-input-placeholder': '#6A737D',
  '--modal-input-border': '#D1D1D1',
  '--modal-selected-item-background': '#0060C0',
  '--modal-selected-item-foreground': '#FFFFFF',
  '--modal-button-background': '#0366D6',
  '--modal-button-hover-background': '#0056BA',
  '--modal-button-foreground': '#FFFFFF',


  // Scrollbar
  '--scrollbar-track-background': '#F3F3F3',
  '--scrollbar-thumb-background': '#C1C1C1',
  '--scrollbar-thumb-hover-background': '#A8A8A8',

  // Terminal Panel (content area)
  '--terminal-background': '#F0F0F0',
  '--terminal-foreground': '#333333',
  '--terminal-border': '#CCCCCC',
  '--terminal-cursor-color': '#333333',
  '--terminal-toolbar-background': '#E0E0E0', 
  '--terminal-close-button-hover-background': '#D0D0D0',

  // Bottom Panel Tabs (New)
  '--bottom-panel-tab-background': '#F3F3F3', 
  '--bottom-panel-tab-inactive-background': '#F3F3F3',
  '--bottom-panel-tab-active-background': '#FFFFFF', 
  '--bottom-panel-tab-active-foreground': '#333333',
  '--bottom-panel-tab-inactive-foreground': '#666666',
  '--bottom-panel-tab-hover-background': '#E8E8E8',
  '--bottom-panel-tab-border': '#D1D1D1', 
  '--bottom-panel-tab-active-border-bottom': '#0366D6',
  '--bottom-panel-tab-icon-foreground': '#555555',
  '--bottom-panel-tab-icon-active-foreground': '#0366D6',

  // Linear Progress Bar
  '--progress-bar-background': 'var(--editor-tab-border)',
  '--progress-bar-indicator': 'var(--focus-border)',  

  // Article Tags (Active State)
  '--tag-active-background': 'var(--text-accent)',
  '--tag-active-text': 'var(--text-inverse)',

  // Syntax Highlighting
  '--syntax-string': '#032F62',      
  '--syntax-keyword': '#D73A49',     
  '--syntax-comment': '#6A737D',     
  '--syntax-number': '#005CC5',      
  '--syntax-boolean': '#D73A49',    
  '--syntax-property': '#E36209',    
  '--syntax-operator': '#24292E',    
  '--syntax-punctuation': '#24292E', 
  '--syntax-function': '#6F42C1',    
  '--syntax-base-text': '#24292E',
  
  // Notification Colors (Adjusted for Light Theme - can be softer if needed)
  '--notification-success-background': 'rgb(220,252,231)', // green-100
  '--notification-success-foreground': 'rgb(21,128,61)',   // green-700
  '--notification-success-border': 'rgb(134,239,172)',     // green-300
  '--notification-success-icon': 'rgb(34,197,94)',         // green-500
  '--notification-error-background': 'rgb(254,226,226)',   // red-100
  '--notification-error-foreground': 'rgb(153,27,27)',     // red-700
  '--notification-error-border': 'rgb(252,165,165)',       // red-300
  '--notification-error-icon': 'rgb(239,68,68)',           // red-500
  '--notification-info-background': 'rgb(219,234,254)',    // blue-100
  '--notification-info-foreground': 'rgb(30,64,175)',      // blue-700
  '--notification-info-border': 'rgb(147,197,253)',        // blue-300
  '--notification-info-icon': 'rgb(59,130,246)',           // blue-500
  '--notification-warning-background': 'rgb(254,249,195)', // yellow-100
  '--notification-warning-foreground': 'rgb(133,77,14)',   // yellow-700
  '--notification-warning-border': 'rgb(252,211,77)',      // yellow-300
  '--notification-warning-icon': 'rgb(234,179,8)',         // yellow-500
};

export const PREDEFINED_THEMES: Theme[] = [
  { name: 'VSCode Dark+', properties: vscodeDarkPlusProperties },
  { name: 'VSCode Light+', properties: vscodeLightPlusProperties },
];

export const FONT_FAMILY_OPTIONS: FontFamilyOption[] = [
  { id: 'fira-code', label: 'Fira Code', value: '"Fira Code", "JetBrains Mono", Consolas, "Courier New", monospace' },
  { id: 'jetbrains-mono', label: 'JetBrains Mono', value: '"JetBrains Mono", "Fira Code", Consolas, "Courier New", monospace' },
  { id: 'consolas', label: 'Consolas', value: 'Consolas, "Courier New", monospace' },
  { id: 'courier-new', label: 'Courier New', value: '"Courier New", monospace' },
  { id: 'monospace', label: 'System Monospace', value: 'monospace' },
];

export const FONT_SIZE_OPTIONS: FontSizeOption[] = [
  { id: 'small', label: 'Small (12px)', value: '12px', lineHeight: '1.4' },
  { id: 'medium', label: 'Medium (14px)', value: '14px', lineHeight: '1.5' },
  { id: 'large', label: 'Large (16px)', value: '16px', lineHeight: '1.5' },
  { id: 'xlarge', label: 'X-Large (18px)', value: '18px', lineHeight: '1.6' },
];

export const DEFAULT_THEME_NAME = PREDEFINED_THEMES[0].name;
export const DEFAULT_FONT_FAMILY_ID = FONT_FAMILY_OPTIONS[0].id;
export const DEFAULT_FONT_SIZE_ID = FONT_SIZE_OPTIONS[1].id;


export function generateCSSVariables(properties: ThemeProperties): string {
  return Object.entries(properties)
    .map(([key, value]) => `${key}: ${value};`)
    .join('\n');
}