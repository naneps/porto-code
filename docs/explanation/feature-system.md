# Feature System Explanation

Porto Code has a first-class system for marking individual features as `active`, `maintenance`, or `disabled` — controlled live from Firebase Realtime Database without a redeployment. This document explains why the system was designed this way and how all its pieces connect.

---

## The Problem it Solves

A portfolio app often integrates with volatile external services (Gemini AI quotas, Firebase outages, dev.to API downtime). Without a control system, a failing integration causes a broken page visible to all visitors.

The Feature Status system lets you:
- **Gracefully degrade** — show a polished "under maintenance" view instead of a broken component.
- **Control rollout** — enable a half-finished feature for dev review before making it public.
- **React in real-time** — flip a switch in Firebase and all open sessions update without a refresh.

---

## The Three Layers

### Layer 1 — The Type System (`src/App/types.ts`)

Every controllable feature is named in the `FeatureId` union:

```ts
export type FeatureId =
  | 'explorer' | 'searchPanel' | 'aiChat'
  | 'articlesPanel' | 'guestBook' | 'statisticsPanel'
  | 'githubProfileView' | 'terminal' | 'petsPanel'
  | 'logsPanel' | 'settingsEditor' | 'cvGenerator'
  | 'projectSuggestions' | 'projectsView'
  | 'featureStatusAdminPanel';

export type FeatureStatus = 'active' | 'maintenance' | 'disabled';
export type FeaturesStatusState = Record<FeatureId, FeatureStatus>;
```

This gives compile-time safety — you cannot reference an unknown feature.

### Layer 2 — The Defaults (`src/App/constants.tsx`)

`DEFAULT_FEATURE_STATUSES` defines what each feature falls back to if Firebase is unreachable:

```ts
export const DEFAULT_FEATURE_STATUSES: FeaturesStatusState = {
  explorer: 'active',
  aiChat: 'active',
  guestBook: 'active',
  // ... most features default to 'active'
  featureStatusAdminPanel: 'disabled',  // Restricted by default; only in dev mode
};
```

`ALL_FEATURE_IDS` is a parallel record mapping each ID to a human-readable name for display in notifications and the admin panel.

### Layer 3 — The Live Sync (`src/App/App.tsx`)

On mount, `App.tsx` subscribes to the `feature_statuses` node in Firebase using `onValue()`:

```ts
const featureStatusesRef = ref(database, 'feature_statuses');
const unsubscribe = onValue(featureStatusesRef, (snapshot) => {
  const data = snapshot.val();
  // Merges Firebase data over defaults, validates keys
  setFeaturesStatus({ ...DEFAULT_FEATURE_STATUSES, ...fetchedStatuses });
});
```

Because `onValue` uses Firebase's WebSocket connection, changes in the database propagate to all connected clients within milliseconds.

---

## How Features Use Their Status

The `featuresStatus` state object is passed as a `featureStatus` prop to every panel and feature component. Each component is responsible for its own rendering decision:

```tsx
// Example: ArticlesPanel
if (featureStatus !== 'active') {
  return (
    <MaintenanceView
      featureName="Articles Panel"
      status={featureStatus}
    />
  );
}
// Normal render...
```

`MaintenanceView` (`src/UI/MaintenanceView.tsx`) is a generic placeholder that shows an appropriate icon and message depending on whether the status is `maintenance` or `disabled`.

---

## The Gate in `handleOpenTab`

Even before a tab renders its content, `App.tsx` checks the feature status when a tab is being opened:

```ts
if (featureIdForTab && featuresStatus[featureIdForTab] !== 'active') {
  // Tab still opens, but its content will show MaintenanceView
  addAppLog('info', `Opening tab for feature in maintenance: "${tabTitle}"`);
}
```

This means the tab always opens (preserving the IDE feel), but the content gracefully degrades.

---

## The Admin Panel

`src/features/Admin/FeatureStatusAdminPanel.tsx` is a modal that reads the current `featuresStatus` and posts changes back to Firebase. It is gated behind two conditions:

1. `featuresStatus.featureStatusAdminPanel === 'active'` (set in Firebase)
2. Dev mode enabled in Settings (checked locally, stored in `localStorage`)

This double-gate prevents accidental exposure of the admin panel in production.

---

## Adding a New Feature to the System

See the step-by-step guide: [How-to: Add a New Feature Panel](../how-to/add-feature-panel.md).

In summary:
1. Add your ID to the `FeatureId` union in `types.ts`.
2. Add display name to `ALL_FEATURE_IDS` in `constants.tsx`.
3. Add a default status to `DEFAULT_FEATURE_STATUSES`.
4. Add the node to your Firebase Realtime Database.
5. Pass `featureStatus` as a prop to your component.
6. Render `<MaintenanceView />` when `featureStatus !== 'active'`.

---

## Design Decisions

**Why Firebase Realtime DB instead of Firestore?**  
Real-time listeners (`onValue`) work natively with the Realtime Database SDK and are simpler to set up for a key-value flat structure. Firestore would add overhead for this use case.

**Why a flat union type for `FeatureId`?**  
TypeScript narrows to the exact set of valid keys, so a typo like `'guestbook'` (instead of `'guestBook'`) fails at compile time rather than silently producing a `null` status.

**Why pass `featureStatus` as a prop instead of using a context?**  
For a portfolio-scale app with a small component tree, prop drilling is more explicit and easier to trace. It avoids the "magic" of context while keeping the status gate visible at each component's props interface.
