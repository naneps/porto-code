

import { LucideIcon, ImageIcon as ImageIconType, ExternalLink as ExternalLinkIcon } from 'lucide-react'; // Added ImageIconType and ExternalLinkIcon

export interface Address {
  city: string;
  full: string;
}

export interface EducationEntry {
  school: string;
  major: string;
  period: string;
}

export interface Position {
  role: string;
  company: string;
  period: string;
  description?: string; // Added description
}

export interface WorkExperienceEntry extends Position {}

export interface ProjectDetail {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  year?: number;
  related_skills?: string[];
  webLink?: string;
  imageUrls?: string[];
}

export interface PortfolioData {
  name: string;
  nickname: string;
  email: string;
  phone: string;
  address: Address;
  summary?: string; // Added summary
  education: EducationEntry[];
  current_position: Position;
  work_experience: WorkExperienceEntry[];
  skills: string[];
  projects: ProjectDetail[]; // Changed from string[]
  linkedIn: string;
  instagram?: string;
  tiktok?: string;
  otherSocial?: {
    name: string;
    url: string;
  };
  avatarUrl?: string; // Added avatarUrl
  role?: string; // Added top-level role
}


export interface Tab {
  id: string;
  title: string;
  type: 'file' | 'project_detail' | 'ai_chat' | 'json_preview' | 'article_detail' | 'cv_preview' | 'settings_editor';
  fileName?: string; // For file-based tabs and json_preview of files or projects
  articleSlug?: string;
}

export interface SidebarItemConfig {
  id: string;
  label: string;
  icon: LucideIcon; // Icon for the item itself
  fileName?: string; // For file-like items that open a standard file tab
  type?: 'file'; // Relevant if it opens a standard file tab
  title?: string; // Display title, can be same as fileName or label
  isFolder?: boolean;
  children?: SidebarItemConfig[];
  actionType?: 'open_tab' | 'run_cv_generator'; // Default to 'open_tab'
  defaultOpen?: boolean; // For folders, initial expanded state
}


export interface Command {
  id: string;
  label: string;
  action: () => void;
  icon?: LucideIcon;
  group?: string;
  description?: string;
  value?: string;
  isSelected?: boolean;
}

// Type for TitleBar menu items, allowing for nesting
export interface AppMenuItem {
  label?: string;
  action?: () => void;
  icon?: LucideIcon | undefined; // Allow undefined for conditional icons like Check
  subItems?: AppMenuItem[];
  value?: string;
  isSelected?: boolean;
  separator?: boolean;
}

// Theme related types
export interface ThemeProperties {
  [key: string]: string;
}

export interface Theme {
  name: string;
  properties: ThemeProperties;
}

export interface FontFamilyOption {
  id: string;
  label: string;
  value: string;
}

export interface FontSizeOption {
  id: string;
  label: string;
  value: string;
  lineHeight?: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  error?: boolean;
}

// Context Menu Types
export interface ContextMenuItem {
  label: string;
  action: () => void;
  icon?: LucideIcon;
  disabled?: boolean;
}

export interface ContextMenuProps {
  x: number;
  y: number;
  items: ContextMenuItem[];
  visible: boolean;
  onClose: () => void;
}

// For ActivityBar selection
export type ActivityBarSelection = 'explorer' | 'ai_chat_tab' | 'search' | 'articles' | 'statistics' | null;

// For Global Search Results
export interface SearchResultItem {
  id:string;
  fileId: string;
  fileDisplayPath: string;
  lineNumber: number;
  lineContent: string;
  fullContent?: string;
  tabType: Tab['type'];
}

// For Articles/Blog
export interface ArticleItem {
  id: string;
  title: string;
  date: string;
  summary: string;
  tags?: string[];
  contentMarkdown: string;
  slug: string;
  imageUrl?: string;
}

// For Statistics Panel
export interface MockStatistics {
  liveVisitors: number;
  todayVisits: number;
  uptime: string; // e.g., "1h 23m 45s"
  mostVisitedPage: string;
  currentlyViewed: string[];
}

// For reorderable Activity Bar items
export interface ActivityBarItemDefinition {
  id: string; // Unique ID for D&D, e.g., 'explorer-activity'
  label: string;
  iconName: string; // Key to ICONS map in constants.tsx
  viewId: ActivityBarSelection; // The view this item activates
}

export interface ActivityBarItemConfig extends ActivityBarItemDefinition {
  icon: LucideIcon;
  action: () => void;
}

// For Notifications
export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface NotificationAction {
  label: string;
  onClick: () => void;
}

export interface NotificationItem {
  id: string;
  message: string;
  type: NotificationType;
  duration?: number; // in milliseconds, auto-dismiss if provided
  actions?: NotificationAction[];
  icon?: LucideIcon;
}

// For content of projects.json
export interface ProjectListingItem {
  id: string;
  title: string;
  imageUrls?: string[];
  technologies?: string[]; // Added to display key tech on cards
}

// Editor Pane Types for Split View
export type EditorPaneId = 'left' | 'right';

export interface EditorPaneState {
  openTabs: Tab[];
  activeTabId: string | null;
  tabHistory: string[];
  currentHistoryIndex: number;
}

// Log Entry Types
export type LogLevel = 'info' | 'action' | 'warning' | 'error' | 'debug';

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: LogLevel;
  message: string;
  source?: string; // e.g., 'User', 'System', 'AI'
  details?: Record<string, any>; // Optional structured details
}

// For BottomPanelTabs
export type BottomPanelTabId = 'terminal' | 'pets' | 'logs';


// Adding specific Lucide icons if they are not already part of the general LucideIcon type
export type { ImageIconType as ImageIcon, ExternalLinkIcon };