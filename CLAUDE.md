# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Keyboard Visualizer** is a React + TypeScript web application that visualizes keyboard shortcuts in real-time and provides an interactive quiz system for learning 1,146+ shortcuts across 7 applications (Windows 11, macOS, Chrome, Excel, Slack, Gmail, VS Code).

**Tech Stack:**
- React 18.3.1 + TypeScript 5.9
- Vite 5.4 (build tool)
- Supabase PostgreSQL (backend database)
- Vitest (testing)

**Live Demo:** https://nishis2rp.github.io/keyboard-visualizer/

## Development Commands

### Essential Commands

```bash
# Start development server (with HMR)
npm run dev
# Access at http://localhost:5173/keyboard-visualizer/

# Build for production
npm run build

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Preview production build locally
npm run preview
```

### Docker Commands (Recommended)

```bash
# Start development server in Docker
docker-compose up
# Access at http://localhost:5173

# Start in background
docker-compose up -d

# Stop containers
docker-compose down

# Rebuild and start
docker-compose up --build

# Run tests in Docker
docker-compose exec app npm test

# Run migrations in Docker
docker-compose exec app npm run db:migrate

# Production build test with Nginx
docker-compose -f docker-compose.prod.yml up --build
# Access at http://localhost:8080
```

**Docker Benefits:**
- Consistent environment across team
- No need to install Node.js locally
- Isolated dependencies
- Hot reload works with volume mounting
- `usePolling: true` in vite.config.ts for file watching in Docker volumes

### Database Commands

```bash
# Run all migrations (requires .env with DATABASE_URL)
npm run db:migrate

# Generate SQL from data files
npm run db:generate-sql

# Run a single migration
npm run db:run-migration
```

### Utility Scripts

Scripts in `scripts/` directory for database management:

```bash
# Check protection levels for specific shortcuts
npx tsx scripts/check-protection-levels.ts

# Find a specific shortcut in the database
npx tsx scripts/find-shortcut.ts "Ctrl + C"

# Add new shortcuts to database
npx tsx scripts/add-chrome-shortcuts.ts

# Reset protection levels for specific shortcuts
npx tsx scripts/reset-excluded-shortcuts.ts
```

## Architecture Overview

### Data Flow

```
User Browser
    ↓
main.tsx (React entry point)
    ↓
ErrorBoundary
    ↓
AppProvider (AppContext)
    ├─→ useShortcuts() hook ──→ Supabase API
    │                           .from('shortcuts').select('*')
    │                           ↓
    │                      Returns RichShortcut[]
    │
    └─→ Global state: selectedApp, keyboardLayout, isQuizMode, richShortcuts
    ↓
QuizProvider (QuizContext) - Quiz state machine
    ↓
App.tsx
    ├─→ showSetup? → SetupScreen.tsx
    └─→ isQuizMode?
        ├─→ true  → QuizModeView.tsx
        └─→ false → NormalModeView.tsx
```

### Key Architectural Patterns

1. **Context API for State Management:**
   - `AppContext.tsx`: Global app state (shortcuts data, app selection, layout)
   - `QuizContext.tsx`: Quiz-specific state with reducer pattern

2. **Custom Hooks for Logic:**
   - `useShortcuts.ts`: Fetches data from Supabase, transforms to `RichShortcut[]` and `AllShortcuts` formats
   - `useKeyboardShortcuts.ts`: Handles keyboard events, normalizes input, returns matched shortcuts
   - `useQuizInputHandler.ts`: Validates quiz answers, handles sequential shortcuts

3. **Normalization First:**
   - All shortcuts are normalized before comparison: `normalizeShortcut("ctrl + A")` → `"Ctrl+A"`
   - Modifier key order: Ctrl → Alt → Meta → Shift → MainKeys

4. **Set-based Lookups:**
   - `ALWAYS_PROTECTED`, `FULLSCREEN_PREVENTABLE` as Sets for O(1) lookup performance

## Important Concepts

### Protection Level System

Three categories of shortcuts based on system behavior:

1. **`none`**: No system protection, safe to use
2. **`preventable_fullscreen`**: Browser shortcuts that can be captured in fullscreen mode (Ctrl+W, Ctrl+T, F11)
3. **`always-protected`**: System shortcuts that cannot be prevented (Alt+F4, Cmd+Q, Ctrl+Alt+Delete)

**Database columns:**
- `windows_protection_level`: Protection level for Windows OS
- `macos_protection_level`: Protection level for macOS

**Important files:**
- `src/constants/systemProtectedShortcuts.ts`: Legacy constants (being phased out)
- Database migration `019_set_fullscreen_preventable_shortcuts_level.sql`: Sets protection levels
- `src/components/ShortcutCard/ShortcutCard.tsx`: Displays visual indicators (blue border for fullscreen-preventable)

### Sequential Shortcuts

Three types handled differently:

1. **Excel**: `Alt + H + O + I` - Alt held, keys pressed sequentially
2. **VS Code**: `Ctrl + K, Ctrl + S` - Full release between sequences
3. **Gmail**: `g + i` - Pure key sequences

Processing logic in:
- `src/utils/sequentialShortcuts.ts`: `SequentialKeyRecorder` class
- `src/utils/quizEngine.ts`: `checkAnswer()` function validates sequential input

### Alternative Shortcuts

Equivalent shortcuts for the same action:
- `Ctrl+C` = `Ctrl+Insert` (copy)
- `Ctrl+V` = `Shift+Insert` (paste)
- `Ctrl+Tab` = `Ctrl+PageDown` (next tab)

Defined in: `src/constants/alternativeShortcuts.ts`

### RichShortcut Type

The core data type from Supabase:

```typescript
interface RichShortcut {
  id: number;
  keys: string;                    // "Ctrl + C"
  description: string;             // "コピー"
  difficulty: 'basic' | 'standard' | 'hard' | 'madmax';
  application: string;             // 'chrome', 'excel', etc.
  category: string | null;
  platform: string | null;         // 'Windows', 'macOS', 'Cross-Platform'
  windows_keys: string | null;     // Windows-specific variant
  macos_keys: string | null;       // macOS-specific variant
  windows_protection_level: string | null;
  macos_protection_level: string | null;
  created_at: string;
}
```

## Database Schema

### shortcuts table

```sql
CREATE TABLE shortcuts (
  id BIGSERIAL PRIMARY KEY,
  application VARCHAR(50),           -- 'windows11', 'chrome', 'excel', etc.
  keys VARCHAR(100),                 -- "Ctrl+C", "Alt+H+O+I"
  description TEXT,                  -- "Copy to clipboard"
  category VARCHAR(100),             -- "Edit", "Navigation", etc.
  difficulty VARCHAR(20),            -- 'basic', 'standard', 'hard', 'madmax'
  platform VARCHAR(50),              -- 'Windows', 'macOS', 'Cross-Platform'
  windows_keys VARCHAR(100),         -- Windows-specific variant
  macos_keys VARCHAR(100),           -- macOS-specific variant
  windows_protection_level TEXT,     -- 'none', 'preventable_fullscreen', 'always-protected'
  macos_protection_level TEXT,       -- 'none', 'preventable_fullscreen', 'always-protected'
  created_at TIMESTAMP,
  UNIQUE(application, keys)
);

-- Indexes for performance
CREATE INDEX idx_shortcuts_application ON shortcuts(application);
CREATE INDEX idx_shortcuts_keys ON shortcuts(keys);
```

**Row-level security:** Public read-only access enabled

### Migration System

Migrations are in `supabase/migrations/` with sequential numbering:
- `001_create_shortcuts_table.sql`: Initial schema
- `002_insert_data.sql`: Base shortcut data (~1,100+ shortcuts)
- `003-017_*.sql`: Feature additions and refinements
- `018_add_protection_level_columns.sql`: Add protection level support
- `019_set_fullscreen_preventable_shortcuts_level.sql`: Set protection levels

**Running migrations:**
1. Set `.env` with `DATABASE_URL=postgresql://postgres:...`
2. Run `npm run db:migrate`

## Component Architecture

### Three-Tier Structure

1. **View Components** (mode routing)
   - `NormalModeView.tsx`: Visualization mode
   - `QuizModeView.tsx`: Quiz/learning mode

2. **Container Components** (state + logic)
   - `KeyDisplay/`: Shows pressed keys and shortcut descriptions
   - `Quiz/QuestionCard.tsx`: Quiz question with answer validation

3. **Presentational Components** (UI only)
   - `KeyboardLayout/`: Visual keyboard grid
   - `ShortcutCard/`: Individual shortcut display card
   - `common/Selector.tsx`, `common/StyledButton.tsx`: Reusable UI elements

### Key Components

**AppContext** (`src/context/AppContext.tsx`):
- Provides: `richShortcuts`, `allShortcuts`, `selectedApp`, `keyboardLayout`, `isQuizMode`
- Uses `useShortcuts()` hook to fetch from Supabase
- Single source of truth for app state

**QuizContext** (`src/context/QuizContext.tsx`):
- State machine with reducer pattern
- Actions: `START_QUIZ`, `SET_QUESTION`, `ANSWER_QUESTION`, `SKIP_QUESTION`, `FINISH_QUIZ`
- Tracks: current question, score, history, pressed keys, sequential progress

**useKeyboardShortcuts** (`src/hooks/useKeyboardShortcuts.ts`):
- Listens to keydown/keyup events
- Tracks pressed keys in a Set
- Normalizes key combinations
- Returns: `pressedKeys`, `currentDescription`, `availableShortcuts`

**ShortcutCard** (`src/components/ShortcutCard/ShortcutCard.tsx`):
- Displays individual shortcuts with visual indicators
- Blue border (🔵) for `preventable_fullscreen` shortcuts
- Red border (🔒) for `always-protected` shortcuts
- Uses className-based styling (not inline styles)

## Important Files & Their Roles

### Core Logic
- `src/utils/quizEngine.ts`: Quiz logic, answer validation, normalization
- `src/utils/keyboard.ts`: Keyboard event processing, shortcut matching
- `src/utils/keyMapping.ts`: Key code → display name mapping
- `src/utils/sequentialShortcuts.ts`: Sequential shortcut detection

### Constants
- `src/constants/systemProtectedShortcuts.ts`: Protection level definitions
- `src/constants/alternativeShortcuts.ts`: Equivalent shortcut mappings
- `src/constants/shortcutDifficulty.ts`: Difficulty classification logic
- `src/config/apps.ts`: Application definitions (id, name, icon, OS)

### Data
- `src/data/layouts/`: Keyboard layout definitions (Windows JIS/US, Mac JIS/US)
- `src/lib/supabase.ts`: Supabase client initialization

### Styling
- `src/styles/global.css`: Global layout and structure
- `src/styles/components.css`: Component-specific styles
- `src/styles/keyboard.css`: Keyboard visualization styles
- `src/styles/variables.css`: CSS custom properties (colors, spacing)

### Docker
- `Dockerfile`: Multi-stage build (development, build, production with Nginx)
- `docker-compose.yml`: Development environment configuration
- `docker-compose.prod.yml`: Production test environment with Nginx
- `nginx.conf`: Nginx configuration for production (Gzip, caching, SPA routing)
- `.dockerignore`: Excludes node_modules, .env, dist from Docker context

## Common Development Tasks

### Adding a New Application

1. **Add shortcuts to database:**
   ```sql
   INSERT INTO shortcuts (application, keys, description, difficulty, platform)
   VALUES ('my_app', 'Ctrl + N', 'New File', 'basic', 'Cross-Platform');
   ```

2. **Add app definition to frontend:**
   Edit `src/config/apps.ts`:
   ```typescript
   export const apps: App[] = [
     // ... existing apps
     {
       id: 'my_app',  // Must match database 'application' column
       name: 'My App',
       icon: '🚀',
       os: 'cross-platform'  // or 'windows' | 'mac'
     },
   ]
   ```

### Updating Protection Levels

1. **Modify the migration file:**
   Edit `supabase/migrations/019_set_fullscreen_preventable_shortcuts_level.sql`

2. **Create a script to update existing data:**
   ```typescript
   // scripts/update-protection-levels.ts
   const result = await client.query(
     `UPDATE shortcuts
      SET windows_protection_level = 'preventable_fullscreen',
          macos_protection_level = 'preventable_fullscreen'
      WHERE keys IN ('Ctrl + W', 'Ctrl + N', 'Ctrl + T')`
   );
   ```

3. **Run the script:**
   ```bash
   npx tsx scripts/update-protection-levels.ts
   ```

### Adding Visual Indicators

Protection level borders are defined in `src/styles/components.css`:

```css
/* Blue border for fullscreen-preventable shortcuts */
.shortcut-card.preventable-fullscreen {
  border: 2px solid #0078D4;
  background: linear-gradient(135deg, rgba(0, 120, 212, 0.08) 0%, rgba(0, 120, 212, 0.05) 100%);
}

/* Red border for always-protected shortcuts */
.shortcut-card.always-protected {
  border: 2px solid #FF3B30;
  background: linear-gradient(135deg, rgba(255, 59, 48, 0.08) 0%, rgba(255, 59, 48, 0.05) 100%);
}
```

Applied in `ShortcutCard.tsx` via className based on protection level.

### Debugging Keyboard Input

Enable debug logging in `ShortcutCard.tsx`:

```typescript
<ShortcutCard
  shortcut={item.shortcut}
  description={item.description}
  showDebugLog={true}  // Enable console.log for debugging
  windows_protection_level={item.windows_protection_level}
  macos_protection_level={item.macos_protection_level}
/>
```

## Testing

- Framework: Vitest with jsdom environment
- Test files: `src/tests/`
- Key test file: `quizEngine.test.ts` (tests normalization, answer checking)

```bash
npm test              # Run all tests
npm run test:watch   # Watch mode
```

## Environment Variables

Required for development (`.env` file):

```bash
# Supabase connection (frontend)
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...

# PostgreSQL connection (for migration scripts only)
DATABASE_URL=postgresql://postgres:[password]@db.xxxxx.supabase.co:5432/postgres

# Base path (optional, auto-set in Docker)
# VITE_BASE_PATH=/
```

**GitHub Secrets** (for deployment):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

**Docker Environment:**
- `VITE_BASE_PATH` is automatically set to `/` in Docker (see `docker-compose.yml`)
- GitHub Pages uses `/keyboard-visualizer/` as base path
- Vite config reads from `process.env.VITE_BASE_PATH` with fallback

## Deployment

### Automatic Deployment (GitHub Actions)

Push to `main` branch triggers:
1. Build with Vite (`npm run build`)
2. Deploy to GitHub Pages
3. Accessible at: https://nishis2rp.github.io/keyboard-visualizer/

Workflow: `.github/workflows/deploy.yml`

### Manual Deployment

```bash
npm run build    # Creates dist/ folder
npm run preview  # Preview locally
```

## Code Style & Best Practices

1. **TypeScript everywhere:** All files use TypeScript with proper type definitions
2. **Normalization first:** Always normalize shortcuts before comparison
3. **Set-based lookups:** Use `Set` for O(1) lookup performance
4. **Context for global state:** `AppContext` for app data, `QuizContext` for quiz logic
5. **Custom hooks for logic:** Separate UI from business logic
6. **Memo optimization:** Use `useMemo` and `useCallback` to prevent unnecessary re-renders
7. **CSS className over inline styles:** Use className-based styling for better maintainability

## Common Pitfalls

1. **Don't mutate `pressedKeys` Set directly:** Always create a new Set
2. **Always normalize shortcuts before comparison:** Use `normalizeShortcut()` from `quizEngine.ts`
3. **Check OS before using protection levels:** Use `detectOS()` to get correct protection level column
4. **Handle null values:** Database columns can be null, always provide fallbacks
5. **Use proper key codes:** KeyboardEvent.code (e.g., "ControlLeft") not KeyboardEvent.key
6. **Sequential shortcuts need special handling:** Use `SequentialKeyRecorder` class

## Recent Major Changes

1. **Full TypeScript migration** (commit 9e8ae89): Converted all .js to .ts/.tsx
2. **Database-driven protection levels** (commit 8a5456d): Moved from constants to database columns
3. **CSS refactoring** (commit b229689): Removed duplicate styles from global.css
4. **Protection level visual indicators** (commit c6f063d): Added blue/red borders for shortcuts
5. **PageUp/PageDown duplicate cleanup**: Removed old "Page Up" (space) variants, kept "PageUp" (no space)

## Git Workflow

- Main branch: `main`
- Auto-deploy on push to `main`
- Commit messages use conventional commits format
- All commits include: `🤖 Generated with [Claude Code](https://claude.com/claude-code)`
