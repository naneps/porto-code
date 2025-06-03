
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
}

export interface WorkExperienceEntry extends Position {}

export interface PortfolioData {
  name: string;
  nickname: string;
  email: string;
  phone: string;
  address: Address;
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
  year?: number; // Optional, as original data doesn't have it
  related_skills?: string[]; // Skills from the main list that might be relevant
}

export interface Tab {
  id: string; // e.g., "about.json", "about.json_preview", "project_pos_system.json", "ai_chat_tab"
  title: string; // e.g., "about.json", "Preview: about.json", "Project: POS System", "AI Assistant"
  type: 'file' | 'project_detail' | 'ai_chat' | 'json_preview'; // Differentiates tab types
  fileName?: string; // For 'json_preview' tabs, this would be the original fileName e.g. "about.json"
}

export interface SidebarItemConfig {
  id: string; // Unique ID for the sidebar item, often same as fileName
  label: string; // Display label in sidebar
  fileName: string; // The "file" that gets opened
  icon: LucideIcon;
  type?: 'file'; // Specify tab type for sidebar item, default to 'file'
}

export interface Command {
  id: string; // Unique ID for the command
  label: string; // Text displayed in the command palette
  action: () => void; // Function to execute
  icon?: LucideIcon; // Optional icon
  group?: string; // Optional group like "Go to File"
  description?: string; // Optional more detailed description
  value?: string; // For commands that set a value, like theme or font
  isSelected?: boolean; // To indicate if this command's value is currently active
}

// Type for TitleBar menu items, allowing for nesting
export interface AppMenuItem {
  label?: string; // Made optional
  action?: () => void;
  icon?: LucideIcon; 
  subItems?: AppMenuItem[];
  value?: string; // For menu items that represent a selectable value (e.g., theme name, font name)
  isSelected?: boolean; // To show a checkmark or different styling for selected items
  separator?: boolean; // To render a separator before this item
}

// Theme related types
export interface ThemeProperties {
  [key: string]: string; // e.g., '--editor-background': '#1E1E1E'
}

export interface Theme {
  name: string;
  properties: ThemeProperties;
}

export interface FontFamilyOption {
  id: string; // e.g., 'fira-code'
  label: string; // e.g., 'Fira Code'
  value: string; // e.g., '"Fira Code", monospace'
}

export interface FontSizeOption {
  id: string; // e.g., 'small'
  label: string; // e.g., 'Small'
  value: string; // e.g., '12px'
  // Line height can also be part of this if different font sizes need different line heights
  lineHeight?: string; // e.g., '1.4'
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
