# Architecture Overview

This document explains how Porto Code is structured at a high level — why the source tree is organized the way it is, how data flows through the application, and where to look when you want to change something specific.

---

## Project Layout

```
porto-code/
├── index.html          # HTML shell; loads TailwindCSS CDN and module map
├── index.tsx           # React entry point — mounts <App />
├── src/
│   ├── App/            # Application core
│   │   ├── App.tsx     # Root component — all state lives here
│   │   ├── constants.tsx   # PORTFOLIO_DATA, ICONS, SIDEBAR_ITEMS, feature defaults
│   │   ├── themes.ts       # Theme definitions and font options
│   │   ├── types.ts        # All TypeScript interfaces and types
│   │   └── global.d.ts     # Module declaration shims
│   ├── features/       # Self-contained feature modules
│   │   ├── AIChat/
│   │   ├── Admin/
│   │   ├── Editor/
│   │   ├── GitHub/
│   │   ├── GuestBook/
│   │   ├── Modals/
│   │   ├── Notifications/
│   │   ├── Pets/
│   │   ├── Search/
│   │   ├── Settings/
│   │   ├── Statistics/
│   │   ├── Terminal/
│   │   ├── articles/
│   │   ├── Commands/
│   │   └── logs/
│   ├── Layout/         # VS Code shell chrome
│   │   ├── ActivityBar/
│   │   ├── BottomPanelTabs/
│   │   ├── Breadcrumbs/
│   │   ├── EditorTabs/
│   │   ├── Sidebar/
│   │   ├── StatusBar/
│   │   └── TitleBar/
│   ├── UI/             # Generic, reusable UI components
│   │   ├── CodeBlock/
│   │   ├── ContextMenu/
│   │   ├── MenuBar/
│   │   ├── ProjectCard/
│   │   └── MaintenanceView.tsx
│   ├── Hooks/          # Custom React hooks (side-effects, data fetching)
│   ├── Utils/          # Pure utility functions (no React)
│   ├── Assets/         # Static TS asset files (e.g., mock CV code)
│   └── public/         # Served as-is (sounds, images)
```

---

## Layered Architecture

Porto Code follows a deliberate layering that roughly mirrors how VS Code itself is organized:

```
┌─────────────────────────────────────────────────────────┐
│                        App.tsx                          │  ← Single source of truth
│  (All global state + all side-effect orchestration)     │
└────────────┬───────────────────────────────┬────────────┘
             │ props / callbacks             │ hooks
    ┌────────▼────────┐            ┌─────────▼──────────┐
    │    Layout/      │            │      Hooks/         │
    │  (Shell chrome) │            │ (Data fetching,     │
    │  ActivityBar    │            │  theme, fullscreen, │
    │  TitleBar       │            │  notifications…)    │
    │  StatusBar      │            └────────────────────┘
    │  Sidebar        │
    │  EditorTabs     │
    └────────┬────────┘
             │ props
    ┌────────▼────────┐
    │    features/    │  ← Domain-specific feature panels
    │   (AIChat,      │     each renders independently
    │    GuestBook,   │     behind a featureStatus gate
    │    GitHub…)     │
    └────────┬────────┘
             │ imports
    ┌────────▼────────┐
    │     Utils/      │  ← Pure functions, no React
    └─────────────────┘
```

---

## State Management

Porto Code does **not** use Redux or Zustand. All state is managed directly in `App.tsx` using React's built-in `useState` and `useCallback`. This is intentional for a portfolio-scale app — it avoids boilerplate while keeping the data flow predictable.

### Key State Buckets in `App.tsx`

| State | Type | Purpose |
|---|---|---|
| `editorPanes` | `Record<EditorPaneId, EditorPaneState>` | Tracks open tabs, active tab, and history for both the left and right editor panes |
| `featuresStatus` | `FeaturesStatusState` | Live-synced from Firebase; controls which features are active/maintenance/disabled |
| `activityBarSelection` | `ActivityBarSelection` | Which Activity Bar view is currently active |
| `chatMessages` | `ChatMessage[]` | AI chat history (managed by `useGeminiChat` hook) |
| `logs` | `LogEntry[]` | In-memory application log buffer (capped at 250 entries) |
| `statisticsData` | `StatisticsData \| null` | Usage statistics fetched from Firebase |
| `isSidebarVisible` etc. | `boolean` | Individual panel visibility flags |

All state is persisted to `localStorage` via dedicated `useEffect` hooks so the UI state survives page refreshes.

---

## Data Flow: Opening a Tab

This is the most central user interaction. Here's the call chain:

```
User clicks sidebar item
    └── Sidebar.onAction() 
        └── App.handleSidebarAction()
            └── App.handleOpenTab(item, isRunAction, targetPaneId)
                ├── Checks featuresStatus[featureId]
                ├── Increments Firebase statistic (tab_views/...)
                ├── Updates editorPanes[targetPaneId].openTabs
                ├── Sets activeTabId in the target pane
                └── Updates tabHistory for back/forward navigation
```

`TabContent` in `src/features/Editor/TabContent.tsx` is then re-rendered with the new active tab and displays the correct view based on `tab.type`.

---

## External Integrations

| Service | Used for | Config location |
|---|---|---|
| **Firebase Auth** | Guest Book sign-in (Google/GitHub OAuth) | `src/Utils/firebase.ts` |
| **Firebase Realtime DB** | Feature statuses, statistics, guest book entries | `src/Utils/firebase.ts` |
| **Google Gemini AI** | AI chat assistant | `src/Hooks/useGeminiChat.ts` + `src/Utils/aiUtils.ts` |
| **dev.to API** | Articles feed | `src/Hooks/useDevToArticles.ts` |
| **GitHub REST API** | GitHub profile data | `src/features/GitHub/` |
| **pdf-lib** | CV PDF generation in-browser | `src/Utils/cvGenerator.ts` |

---

## Theming System

Themes are defined in `src/App/themes.ts` as arrays of CSS custom property maps. The `useThemeManager` hook applies the selected theme's properties directly to the `<html>` element's `style` attribute, making every component automatically theme-aware via `var(--css-variable)` references.

Custom color overrides are stored in `localStorage` per theme name, layered on top of the base theme.

---

## Sound System

All UI sounds (tab open, tab close, error, notification, terminal run/complete) are handled by `src/Utils/audioUtils.ts`. Sounds can be muted globally via the status bar or Settings. The mute state is persisted in `localStorage`.

---

## See Also

- [Feature System Explanation](./feature-system.md)
- [Reference: Types](../reference/types.md)
- [Reference: Hooks](../reference/hooks.md)
