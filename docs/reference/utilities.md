# Reference: Utility Modules

All utility functions live in `src/Utils/`. They are pure functions (no React hooks, no JSX) that can be imported anywhere.

---

## `firebase.ts`

**Path:** `src/Utils/firebase.ts`

Initializes the Firebase app and exports references to Auth and Realtime Database services, along with re-exported SDK functions for convenience.

### Exports

| Export | Type | Description |
|---|---|---|
| `app` | `FirebaseApp` | The initialized Firebase app instance |
| `auth` | `Auth` | Firebase Auth instance |
| `database` | `Database` | Firebase Realtime Database instance |
| `ref` | function | `ref()` from `firebase/database` |
| `onValue` | function | `onValue()` — real-time listener |
| `set` | function | `set()` — overwrite a database node |
| `push` | function | `push()` — append to a list node |
| `get` | function | `get()` — one-time read |
| `update` | function | `update()` — partial update |
| `remove` | function | `remove()` — delete a node |
| `onAuthStateChanged` | function | Auth state listener |
| `signInWithPopup` | function | OAuth popup sign-in |
| `GoogleAuthProvider` | class | Google OAuth provider |
| `GithubAuthProvider` | class | GitHub OAuth provider |
| `signOut` | function | Sign out current user |
| `FirebaseUser` | type | Alias for `User` from `firebase/auth` |

### Configuration

Firebase is configured via `VITE_*` environment variables. If any variable is missing, the module still initializes but database/auth operations will fail with Firebase errors.

---

## `statisticsUtils.ts`

**Path:** `src/Utils/statisticsUtils.ts`

Provides helpers for reading and writing usage statistics to Firebase Realtime Database.

### Functions

#### `incrementStatistic(path: string): Promise<void>`

Atomically increments a numeric counter at the given Firebase path (relative to `app_statistics/`).

```ts
// Examples
await incrementStatistic('app_loads/total');
await incrementStatistic('tab_views/about_json/count');
await incrementStatistic('action_counts/cv_downloads');
```

Uses a Firebase transaction to avoid race conditions when multiple sessions increment simultaneously.

#### `fetchStatistics(): Promise<StatisticsData | null>`

Reads the entire `app_statistics` node from Firebase and returns it as a `StatisticsData` object. Returns `null` on error.

---

## `aiUtils.ts`

**Path:** `src/Utils/aiUtils.ts`

Handles AI-powered features beyond the main chat: specifically, AI-generated project suggestions.

### Functions

#### `fetchAIProjectSuggestion(portfolioData: PortfolioData, userKeywords?: string, addAppLog?: ...): Promise<ProjectDetail | null>`

Calls the Gemini API to generate a fictional project suggestion based on the portfolio owner's skills and the user's optional keyword hints. Returns a `ProjectDetail` object or `null` on failure.

---

## `audioUtils.ts`

**Path:** `src/Utils/audioUtils.ts`

Manages UI sound effects.

### Functions

#### `playSound(soundName: SoundName): void`

Plays a sound effect. The `SoundName` type is a union of all available sound keys. Silently no-ops if muted or if the sound asset is unavailable.

**Available sound names:**

| Sound Name | Triggered by |
|---|---|
| `tab-open` | Opening a new tab |
| `tab-select` | Switching to an existing tab |
| `tab-close` | Closing a tab |
| `terminal-run` | Starting a terminal command |
| `terminal-complete` | Terminal command finishes |
| `notification` | Showing a success notification |
| `error` | Error event |
| `ui-click` | Tab history navigation |

#### `getMuteStatus(): boolean`

Returns the current mute state from `localStorage`.

#### `toggleMute(): boolean`

Toggles the mute state and persists it to `localStorage`. Returns the new mute state.

---

## `cvGenerator.ts`

**Path:** `src/Utils/cvGenerator.ts`

Generates a PDF CV entirely in the browser using [pdf-lib](https://pdf-lib.js.org/).

### Functions

#### `createCV_PDF(data: PortfolioData): Promise<Uint8Array>`

Builds a formatted CV PDF from the provided `PortfolioData` and returns the raw bytes as a `Uint8Array`. The caller is responsible for triggering the download.

**Sections included:**
- Header (name, role, contact info, LinkedIn)
- Professional Summary
- Work Experience
- Education
- Skills

---

## `commandUtils.ts`

**Path:** `src/Utils/commandUtils.ts`

Builds the dynamic list of `Command` objects for the Command Palette.

### Functions

#### `generateCommands(context: { ... }): Command[]`

Returns an array of `Command` objects that the Command Palette uses for fuzzy search. Commands include: opening files, changing themes, toggling panels, opening the About modal, and feature-specific actions.

The context argument includes `sidebarItems`, `themes`, `currentThemeName`, `featuresStatus`, and all the action handlers from `App.tsx`.

---

## `terminalCommands.ts`

**Path:** `src/Utils/terminalCommands.ts`

Implements the interactive terminal command handler.

### Functions

#### `processCommand(input: string, context: TerminalCommandContext): void`

Parses a raw input string and executes the matching command. Calls `context.appendToOutput()` with results. All available commands, their descriptions, and usages are defined as a `CommandDefinition` map inside this file.

**Built-in commands:**

| Command | Description |
|---|---|
| `help` | List all commands |
| `ls` | List portfolio files |
| `cat <file>` | Display file content |
| `open <file>` | Open a file in the editor |
| `theme <name>` | Change the active theme |
| `themes` | List all available themes |
| `run <script>` | Simulate running a script |
| `clear` | Clear terminal output |
| `whoami` | Display portfolio owner info |
| `skills` | List skills |
| `projects` | List projects |
| `history` | Show command history |
| `neofetch` | Display a fun system info summary |

---

## `guestBookUtils.ts`

**Path:** `src/Utils/guestBookUtils.ts`

Firebase helpers for the Guest Book feature.

### Functions

#### `fetchGuestBookEntries(): Promise<GuestBookEntry[]>`

Reads all entries from the `guest_book` Firebase node, sorted by timestamp descending.

#### `submitGuestBookEntry(entry: Omit<GuestBookEntry, 'id'>): Promise<string>`

Pushes a new entry to the `guest_book` Firebase node. Returns the generated document ID.

#### `addReactionToEntry(entryId: string, emoji: string, userId: string): Promise<void>`

Adds or removes a user's reaction on a guest book entry.

---

## `syntaxHighlighterUtils.ts`

**Path:** `src/Utils/syntaxHighlighterUtils.ts`

Helpers for configuring `react-syntax-highlighter` component props based on the current theme.

### Functions

#### `getSyntaxHighlighterTheme(currentThemeName: string): { style: object; customStyle: object }`

Returns the appropriate `react-syntax-highlighter` style object and custom CSS overrides matching the current Porto Code theme. Supports dark and light theme variants.
