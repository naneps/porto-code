# How-to: Manage Feature Status via Firebase

Porto Code has a built-in maintenance system powered by **Firebase Realtime Database**. Each feature can be set to `active`, `maintenance`, or `disabled` through the database — without redeploying the app. This is useful for gracefully handling outages, rolling deployments, or seasonal shutdowns.

---

## Prerequisites

- A Firebase project connected to the app (see [Getting Started](../tutorials/getting-started.md)).
- Access to the [Firebase Console](https://console.firebase.google.com/).

---

## Understanding the Data Structure

The app reads from the `feature_statuses` node in your Firebase Realtime Database. The structure is a flat map of `featureId → status`:

```json
{
  "feature_statuses": {
    "explorer": "active",
    "aiChat": "maintenance",
    "guestBook": "active",
    "cvGenerator": "disabled",
    "articlesPanel": "active",
    "searchPanel": "active",
    "statisticsPanel": "active",
    "githubProfileView": "active",
    "terminal": "active",
    "petsPanel": "active",
    "logsPanel": "active",
    "settingsEditor": "active",
    "projectSuggestions": "active",
    "projectsView": "active",
    "featureStatusAdminPanel": "disabled"
  }
}
```

### Status Values

| Value | Effect |
|---|---|
| `active` | Feature works normally. |
| `maintenance` | A `MaintenanceView` placeholder is shown inside the tab/panel. The tab/panel is still openable. |
| `disabled` | Same visual effect as `maintenance` from the user's perspective. Reserved for features that are completely unavailable. |

---

## Method 1 — Edit via Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/) → your project → **Realtime Database**.
2. Navigate to the `feature_statuses` node.
3. Click the value next to any feature key (e.g., `aiChat`).
4. Change it to `"maintenance"` or `"active"`.
5. Press **Enter** to save.

The change propagates to all open sessions in **real-time** (no page refresh needed) because the app uses `onValue()` for live listening.

---

## Method 2 — Use the In-App Admin Panel

An in-app admin panel (`FeatureStatusAdminPanel`) is available but restricted to **dev mode**.

### Enable Dev Mode

1. Open **Settings** (gear icon in Activity Bar, or `File → Preferences → Settings`).
2. Scroll to the **Developer** section.
3. Toggle **Dev Mode** on.

Once dev mode is active, the `Feature Status Admin Panel` option becomes accessible (via the `featureStatusAdminPanel` feature being set to `active` in Firebase or locally).

### Using the Admin Panel

1. Open the Command Palette (`Ctrl+Shift+P`).
2. Search for **"Feature Status Admin"** and run it.
3. A modal opens listing all features with their statuses.
4. Change any status and click **Save to Firebase**.

> **Note:** The admin panel writes directly to `feature_statuses` in Firebase, so you must be authenticated and have write access in your Database Rules.

---

## Method 3 — Firebase Admin SDK / REST API

For automated CI/CD pipelines, you can update feature statuses programmatically:

```bash
# Using curl with the Firebase REST API
curl -X PATCH \
  "https://YOUR_PROJECT_ID.firebaseio.com/feature_statuses.json?auth=YOUR_DATABASE_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"aiChat": "maintenance"}'
```

---

## Setting Up Firebase Security Rules

Ensure your Database Rules allow the app to read feature statuses. A recommended minimal setup:

```json
{
  "rules": {
    "feature_statuses": {
      ".read": true,        // Public read — everyone can check feature status
      ".write": "auth != null && auth.token.admin === true"  // Only admins write
    },
    "app_statistics": {
      ".read": "auth != null",
      ".write": true        // Allow anonymous increments for statistics
    },
    "guest_book": {
      ".read": true,
      ".write": "auth != null"
    }
  }
}
```

---

## Fallback Behavior

If the Firebase read fails (e.g., no internet, wrong config), the app falls back to `DEFAULT_FEATURE_STATUSES` defined in `src/App/constants.tsx`. All features default to `active`, so the app is fully functional offline without Firebase.

---

## See Also

- [Feature System Explanation](../explanation/feature-system.md)
- [Reference: Types — FeatureStatus](../reference/types.md#featurestatus)
