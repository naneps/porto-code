# How-to: Add a New Feature Panel

This guide shows how to add a brand-new panel to the Porto Code Activity Bar — for example, a **Certifications** panel. You will register a new feature ID, create the panel component, wire it up to the Activity Bar, and expose it through the sidebar.

**Assumed knowledge:** Basic React and TypeScript.

---

## Step 1 — Register the Feature ID

Open `src/App/types.ts` and add your new feature name to the `FeatureId` union type:

```ts
// src/App/types.ts
export type FeatureId =
  | 'explorer'
  | 'searchPanel'
  | 'aiChat'
  // ... existing IDs ...
  | 'certificationsPanel';  // 👈 Add this
```

---

## Step 2 — Add a Default Status

Open `src/App/constants.tsx` and update both `ALL_FEATURE_IDS` and `DEFAULT_FEATURE_STATUSES`:

```ts
// src/App/constants.tsx

export const ALL_FEATURE_IDS: Record<FeatureId, string> = {
  // ... existing entries ...
  certificationsPanel: 'Certifications Panel',  // 👈 Add this
};

export const DEFAULT_FEATURE_STATUSES: FeaturesStatusState = {
  // ... existing entries ...
  certificationsPanel: 'active',  // 👈 Add this
};
```

---

## Step 3 — Add an Activity Bar Item

Still in `constants.tsx`, add an entry to `DEFAULT_ACTIVITY_BAR_ITEMS`. Pick an appropriate icon name from the `ICONS` map (or add a new one):

```ts
export const DEFAULT_ACTIVITY_BAR_ITEMS: ActivityBarItemDefinition[] = [
  // ... existing items ...
  {
    id: 'certifications-activity',
    label: 'Certifications',
    iconName: 'FileBadge',           // Key from the ICONS map
    viewId: 'certificationsPanel',   // New value for ActivityBarSelection
    featureId: 'certificationsPanel',
  },
];
```

You also need to add `'certificationsPanel'` to the `ActivityBarSelection` type in `types.ts`:

```ts
// src/App/types.ts
export type ActivityBarSelection =
  | 'explorer'
  | 'ai_chat_tab'
  // ... existing ...
  | 'certificationsPanel'  // 👈 Add this
  | null;
```

---

## Step 4 — Create the Panel Component

Create a new directory and component file:

```
src/features/Certifications/CertificationsPanel.tsx
```

Minimal starting template:

```tsx
// src/features/Certifications/CertificationsPanel.tsx
import React from 'react';
import { FeatureStatus } from '../../App/types';
import MaintenanceView from '../../UI/MaintenanceView';

interface CertificationsPanelProps {
  isVisible: boolean;
  onClose: () => void;
  featureStatus: FeatureStatus;
}

const CertificationsPanel: React.FC<CertificationsPanelProps> = ({
  isVisible,
  onClose,
  featureStatus,
}) => {
  if (!isVisible) return null;

  if (featureStatus !== 'active') {
    return <MaintenanceView featureName="Certifications Panel" status={featureStatus} />;
  }

  return (
    <div className="flex flex-col h-full p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-semibold uppercase tracking-widest">
          Certifications
        </h2>
        <button onClick={onClose} aria-label="Close certifications panel">✕</button>
      </div>
      {/* TODO: Render your certification cards here */}
      <p className="text-sm text-gray-400">No certifications added yet.</p>
    </div>
  );
};

export default CertificationsPanel;
```

---

## Step 5 — Wire Up in App.tsx

Open `src/App/App.tsx` and make three additions:

### 5a — Import the component

```tsx
import CertificationsPanel from '../features/Certifications/CertificationsPanel';
```

### 5b — Add state for visibility

```tsx
const [isCertificationsPanelVisible, setIsCertificationsPanelVisible] = useState(false);
```

### 5c — Add the panel to the Activity Bar handler

Find the large `handleActivityBarItemClick` (or equivalent) callback and add a case for your new `viewId`:

```tsx
case 'certificationsPanel':
  setIsCertificationsPanelVisible(prev => !prev);
  // Close other panels if needed:
  setIsSidebarVisible(false);
  setIsSearchPanelVisible(false);
  break;
```

### 5d — Render the panel

Inside the JSX layout (alongside `SearchPanel`, `ArticlesPanel`, etc.):

```tsx
<CertificationsPanel
  isVisible={isCertificationsPanelVisible}
  onClose={() => setIsCertificationsPanelVisible(false)}
  featureStatus={featuresStatus.certificationsPanel}
/>
```

---

## Step 6 — Verify

1. Restart the dev server if needed.
2. The new icon should appear in the Activity Bar.
3. Clicking it toggles your `CertificationsPanel`.
4. Set `certificationsPanel: 'maintenance'` in Firebase to verify the maintenance fallback renders correctly.

---

## See Also

- [Manage Feature Status via Firebase](./manage-feature-status.md)
- [Feature System Explanation](../explanation/feature-system.md)
- [Reference: Types](../reference/types.md)
