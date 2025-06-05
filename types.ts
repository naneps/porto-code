
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
  type: 'file' | 'project_detail' | 'ai_chat' | 'json_preview' | 'article_detail' | 'cv_preview' | 'settings_editor' | 'github_profile_view' | 'global_guestbook'; // Added 'global_guestbook'
  fileName?: string; // For file-based tabs and json_preview of files or projects
  articleSlug?: string;
  githubUsername?: string; // For github_profile_view tab
}

export interface SidebarItemConfig {
  id: string;
  label: string;
  icon: LucideIcon; // Icon for the item itself
  fileName?: string; // For file-like items that open a standard file tab
  type?: Tab['type']; // Relevant if it opens a standard file tab, or for special tabs like 'global_guestbook'
  title?: string; // Display title, can be same as fileName or label
  isFolder?: boolean;
  children?: SidebarItemConfig[];
  actionType?: 'open_tab' | 'run_cv_generator' | 'open_global_guestbook'; // Default to 'open_tab'
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
  recommendedFiles?: string[]; // Added to hold filenames for distinct widgets
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

// For ActivityBar selection - github is now a tab, not a panel itself.
export type ActivityBarSelection = 'explorer' | 'ai_chat_tab' | 'search' | 'articles' | 'statistics' | 'github_profile_view' | 'global_guestbook_view' | null; // Added 'global_guestbook_view'


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

// GitHub API Types
export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  bio: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubRepoOwner {
    login: string;
    avatar_url: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  fork: boolean;
  stargazers_count: number;
  watchers_count: number;
  language: string | null; // Primary language
  languages_url: string; // URL to fetch detailed languages
  created_at: string;
  updated_at: string;
  pushed_at: string;
  owner: GitHubRepoOwner;
  license: { name: string } | null;
  forks_count: number;
  open_issues_count: number;
}

export interface GitHubEventPayload {
  // Common payload types. Add more as needed.
  ref?: string; // For CreateEvent (branch/tag creation)
  ref_type?: 'repository' | 'branch' | 'tag';
  action?: string; // For IssuesEvent, PullRequestEvent, etc.
  issue?: { html_url: string; title: string; number: number };
  pull_request?: { html_url: string; title: string; number: number; merged?: boolean };
  comment?: { html_url: string; body: string };
  release?: { html_url: string; tag_name: string; name: string | null; body?: string | null; }; // Added body for release notes
  forkee?: { html_url: string; full_name: string }; // For ForkEvent
  pages?: [{ page_name: string; title: string; action: string; html_url: string }]; // For GollumEvent (wiki)
  commits?: Array<{ sha: string; author: { name: string }; message: string; url: string }>; // For PushEvent
  // Add other payload types as needed
  [key: string]: any; // For other potential payload properties
}


export interface GitHubEventActor {
  id: number;
  login: string;
  display_login?: string;
  gravatar_id: string;
  url: string;
  avatar_url: string;
}

export interface GitHubEvent {
  id: string;
  type: string; // e.g., "PushEvent", "CreateEvent", "IssuesEvent"
  actor: GitHubEventActor;
  repo: {
    id: number;
    name: string; // "owner/repo"
    url: string;
  };
  payload: GitHubEventPayload;
  public: boolean;
  created_at: string;
  org?: GitHubEventActor; // Optional, if event is in an organization
}

// Mock data for illustrative GitHub stats
export interface MockGitHubStats {
    totalContributionsLastYear: number;
    commitStreak: number;
    topLanguages: { name: string; percentage: number; color: string }[];
    // For the mock contribution graph (52 weeks, 7 days)
    contributionGraphData: number[][]; // Array of weeks, each week is an array of 7 day activity levels (0-4)
}

// Firebase Page Comments
export interface PageComment {
  id?: string; // Firestore document ID
  text: string;
  author: string; // Defaults to "Anonymous"
  timestamp: any; // Firebase ServerTimestamp placeholder, will be Date on client
  avatarColor: string; // Hex color for avatar
}


// Adding specific Lucide icons if they are not already part of the general LucideIcon type
export type { ImageIconType as ImageIcon, ExternalLinkIcon };
