# Reference: TypeScript Types & Interfaces

This document is the authoritative reference for all public types and interfaces exported from `src/App/types.ts`.

---

## Portfolio Data Types

### `PortfolioData`

The root data structure. One instance (`PORTFOLIO_DATA`) is exported from `constants.tsx` and passed throughout the app.

```ts
interface PortfolioData {
  name: string;
  nickname: string;
  email: string;
  phone: string;
  address: Address;
  summary?: string;
  education: EducationEntry[];
  current_position: Position;
  work_experience: WorkExperienceEntry[];
  skills: string[];
  projects: ProjectDetail[];
  linkedIn: string;
  instagram?: string;
  tiktok?: string;
  otherSocial?: { name: string; url: string };
  avatarUrl?: string;
  role?: string;
}
```

---

### `Address`

```ts
interface Address {
  city: string;
  full: string;
}
```

---

### `EducationEntry`

```ts
interface EducationEntry {
  school: string;
  major: string;
  period: string;
}
```

---

### `Position`

```ts
interface Position {
  role: string;
  company: string;
  period: string;
  description?: string;
}
```

`WorkExperienceEntry` extends `Position` with no additional fields.

---

### `ProjectDetail`

```ts
interface ProjectDetail {
  id: string;            // Unique; also used as the tab ID
  title: string;
  description: string;
  technologies: string[];
  year?: number;
  related_skills?: string[];   // Used by AI project suggestions
  webLink?: string;
  imageUrls?: string[];
}
```

---

### `ProjectListingItem`

A slimmed-down version of `ProjectDetail` used in the `projects.json` listing view.

```ts
interface ProjectListingItem {
  id: string;
  title: string;
  imageUrls?: string[];
  technologies?: string[];   // Only first 3 are included
}
```

---

## Tab & Navigation Types

### `Tab`

Represents a single open editor tab.

```ts
interface Tab {
  id: string;
  title: string;
  type: TabType;
  fileName?: string;
  articleSlug?: string;
  articleId?: number;
  githubUsername?: string;
}

type TabType =
  | 'file'
  | 'project_detail'
  | 'ai_chat'
  | 'json_preview'
  | 'article_detail'
  | 'cv_preview'
  | 'settings_editor'
  | 'github_profile_view'
  | 'guest_book';
```

---

### `EditorPaneState`

```ts
interface EditorPaneState {
  openTabs: Tab[];
  activeTabId: string | null;
  tabHistory: string[];          // Ordered list of tab IDs for back/forward nav
  currentHistoryIndex: number;
}

type EditorPaneId = 'left' | 'right';
```

---

### `ActivityBarSelection`

Controls which panel is shown in the sidebar area.

```ts
type ActivityBarSelection =
  | 'explorer'
  | 'ai_chat_tab'
  | 'search'
  | 'articles'
  | 'statistics'
  | 'github_profile_view'
  | 'guest_book_activity'
  | null;
```

---

### `SidebarItemConfig`

Configuration for items in the file explorer sidebar.

```ts
interface SidebarItemConfig {
  id: string;
  label: string;
  icon: LucideIcon;
  fileName?: string;
  type?: Tab['type'];
  title?: string;
  isFolder?: boolean;
  children?: SidebarItemConfig[];
  actionType?: 'open_tab' | 'run_cv_generator';
  defaultOpen?: boolean;
  featureId?: FeatureId;
}
```

---

## Feature System Types

### `FeatureId`

Union of all controllable feature identifiers.

```ts
type FeatureId =
  | 'explorer'
  | 'searchPanel'
  | 'aiChat'
  | 'articlesPanel'
  | 'guestBook'
  | 'statisticsPanel'
  | 'githubProfileView'
  | 'terminal'
  | 'petsPanel'
  | 'logsPanel'
  | 'settingsEditor'
  | 'cvGenerator'
  | 'projectSuggestions'
  | 'projectsView'
  | 'featureStatusAdminPanel';
```

---

### `FeatureStatus`

```ts
type FeatureStatus = 'active' | 'maintenance' | 'disabled';
```

---

### `FeaturesStatusState`

```ts
type FeaturesStatusState = Record<FeatureId, FeatureStatus>;
```

---

## Notification & Log Types

### `NotificationItem`

```ts
interface NotificationItem {
  id: string;
  message: string;
  type: NotificationType;   // 'success' | 'error' | 'info' | 'warning'
  duration?: number;        // Auto-dismiss after N milliseconds; 0 = sticky
  actions?: NotificationAction[];
  icon?: LucideIcon;
  isLoadingProgressBar?: boolean;
  progressId?: string;
}

interface NotificationAction {
  label: string;
  onClick: () => void;
}
```

---

### `LogEntry`

```ts
interface LogEntry {
  id: string;
  timestamp: Date;
  level: LogLevel;   // 'info' | 'action' | 'warning' | 'error' | 'debug'
  message: string;
  source?: string;
  details?: Record<string, any>;
}
```

---

## Guest Book Types

### `GuestBookEntry`

```ts
interface GuestBookEntry {
  id: string;
  userId: string;
  authProvider: 'google' | 'github';
  nickname: string;
  avatarUrl?: string;
  githubLogin?: string;
  message: string;
  timestamp: Date;
  aiValidationStatus: AIValidationStatus;
  reactions: ReactionsMap;
  isNew?: boolean;   // Client-side only; triggers spawn animation
}

type AIValidationStatus =
  | 'validated_ok'
  | 'validated_flagged'
  | 'validation_skipped'
  | 'validation_error'
  | 'pending';

type ReactionsMap = { [emoji: string]: string[] };  // emoji → array of user IDs
```

---

## Theme & UI Types

### `Theme`

```ts
interface Theme {
  name: string;
  properties: ThemeProperties;   // { '--css-var': 'value' }
}

type ThemeProperties = { [key: string]: string };
```

---

### `ChatMessage`

```ts
interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  error?: boolean;
  recommendedFiles?: string[];   // Filenames to render as quick-open widgets
}
```

---

### `StatisticsData`

```ts
interface StatisticsData {
  app_loads?: { total?: number };
  tab_views?: { [tabId: string]: { count?: number } };
  action_counts?: {
    cv_downloads?: number;
    ai_project_suggestions?: number;
  };
  guestbook?: { total_entries?: number };
  theme_usage?: { [themeKey: string]: { count?: number } };
}
```

---

## Terminal Types

### `CommandDefinition`

```ts
interface CommandDefinition {
  handler: (args: string[], context: TerminalCommandContext) => string | string[] | void;
  description: string;
  usage?: string;
  featureId?: FeatureId;
}
```

### `TerminalCommandContext`

The context object passed to every terminal command handler.

```ts
interface TerminalCommandContext {
  sidebarItems: SidebarItemConfig[];
  portfolioData: PortfolioData;
  themes: Theme[];
  currentThemeName: string;
  featuresStatus: FeaturesStatusState;
  openTab: (...) => void;
  changeTheme: (themeName: string) => void;
  appendToOutput: (text: string | string[]) => void;
  clearOutput: () => void;
  runScript: (scriptName: string, durationMs?: number, customSteps?: string[]) => void;
  addAppLog: (level: LogLevel, message: string, source?: string, details?: Record<string, any>) => void;
  addNotification: (message: string, type: NotificationType, ...) => void;
}
```

---

## GitHub Types

### `GitHubUser`

Matches the GitHub REST API `/users/{username}` response shape (subset).

```ts
interface GitHubUser {
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
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}
```

### `GitHubRepo`

```ts
interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  fork: boolean;
  stargazers_count: number;
  language: string | null;
  languages_url: string;
  created_at: string;
  updated_at: string;
  forks_count: number;
  open_issues_count: number;
  license: { name: string } | null;
}
```

### `MockGitHubStats`

Used for the contribution graph since the GitHub API doesn't expose it to anonymous clients.

```ts
interface MockGitHubStats {
  totalContributionsLastYear: number;
  commitStreak: number;
  topLanguages: { name: string; percentage: number; color: string }[];
  contributionGraphData: number[][];   // [week][day] = activity level 0–4
}
```
