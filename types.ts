
import { LucideIcon } from 'lucide-react';

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
  projects: string[]; // Project titles
  linkedIn: string;
  instagram?: string;
  tiktok?: string;
  otherSocial?: {
    name: string;
    url: string;
  };
}

export interface ProjectDetail {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  year?: number; 
  related_skills?: string[]; 
}

export interface Tab {
  id: string;
  title: string;
  type: 'file' | 'project_detail' | 'ai_chat' | 'json_preview' | 'article_detail';
  fileName?: string; // For file-based tabs and json_preview of files or projects
  articleSlug?: string; 
}

export interface SidebarItemConfig {
  id: string;
  label: string;
  fileName: string;
  icon: LucideIcon;
  type?: 'file';
  title?: string; // Added title for consistency, can be same as fileName or a more descriptive label
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
export type ActivityBarSelection = 'explorer' | 'ai_chat_tab' | 'search' | 'articles' | null;

// For Global Search Results
export interface SearchResultItem {
  id: string;
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
