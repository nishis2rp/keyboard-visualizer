# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Keyboard Visualizer** is a React + TypeScript web application that visualizes keyboard shortcuts in real-time and provides an interactive quiz system for learning 1,146+ shortcuts across 9 applications (Windows 11, macOS, Chrome, Excel, Slack, Gmail, VS Code, Word, PowerPoint).

**Tech Stack:**
- React 18.3.1 + TypeScript 5.9
- Vite 5.4 (build tool)
- Tailwind CSS 4.1 (styling with @theme and CSS variables)
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

# Run authentication tables migration
npx tsx scripts/run-auth-migration.ts

# Generate SQL from data files
npm run db:generate-sql

# Run a single migration
npm run db:run-migration
```

### Utility Scripts

Scripts in `scripts/` directory for database management and debugging:

**Database Query Scripts:**
```bash
# Find a specific shortcut in the database
npx tsx scripts/find-shortcut.ts "Ctrl + C"

# Check protection levels for specific shortcuts
npx tsx scripts/check-protection-levels.ts

# Check all protection levels across the database
npx tsx scripts/check-all-protection-levels.ts

# Check table structure
npx tsx scripts/check-table-structure.ts

# Verify data integrity
npx tsx scripts/verify-data.ts
```

**Migration Scripts:**
```bash
# Run new migrations
npx tsx scripts/run-new-migrations.ts

# Run protection level migrations
npx tsx scripts/run-protection-migration.ts

# Run protection level fixes
npx tsx scripts/run-protection-fix.ts

# Run PageUp/PageDown normalization
npx tsx scripts/run-pageup-migration.ts
```

**Update Scripts:**
```bash
# Update Chrome Alt+Shift shortcuts (example)
npx tsx scripts/update-chrome-alt-shift-shortcuts-pg.ts

# Check Chrome Alt+Shift shortcuts
npx tsx scripts/check-chrome-alt-shift-shortcuts.ts
```

**Important Notes:**
- Read-only operations use Supabase client (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
- Write operations require PostgreSQL client (DATABASE_URL)
- Scripts ending with `-pg.ts` use direct PostgreSQL connection for write operations
- Always test queries with check scripts before running update scripts

## Authentication & User Features

### Overview

The application supports optional user authentication for saving quiz progress and scores. Users can:
- Use the app without logging in (full functionality)
- Log in to save quiz history and track progress
- Sign in with Google, GitHub, or Email/Password

### Authentication Architecture

**Authentication Flow:**
```
User clicks "ログイン" button
    ↓
AuthModal opens
    ↓
User chooses auth method:
├─→ Google OAuth → Supabase Auth → Redirect back
├─→ GitHub OAuth → Supabase Auth → Redirect back
└─→ Email/Password → Supabase Auth → Direct sign-in
    ↓
AuthContext updates with user session
    ↓
UserMenu appears in AppHeader
    ↓
Quiz progress automatically saved to database
```

**Key Components:**
- `AuthContext.tsx`: Global authentication state management
- `AuthModal.tsx`: Login/signup modal UI
- `UserMenu.tsx`: User profile dropdown menu
- `useQuizProgress.ts`: Hook for saving quiz sessions and history

### Database Schema for Authentication

**user_profiles** (extends Supabase Auth):
- `id`: UUID (foreign key to auth.users)
- `display_name`: User's display name
- `avatar_url`: Profile picture URL
- `created_at`, `updated_at`: Timestamps

**quiz_sessions** (quiz session records):
- `id`: Session ID
- `user_id`: UUID (foreign key to user_profiles)
- `application`: App being quizzed (chrome, excel, etc.)
- `difficulty`: Quiz difficulty level
- `score`: Final score (0-100)
- `total_questions`: Number of questions
- `correct_answers`: Number correct
- `started_at`, `completed_at`: Timestamps

**quiz_history** (detailed answer records):
- `id`: Answer ID
- `user_id`: UUID
- `session_id`: Foreign key to quiz_sessions
- `shortcut_id`: Foreign key to shortcuts
- `was_correct`: Boolean
- `answered_at`: Timestamp

**user_quiz_stats** (view):
- Aggregated statistics per user and application
- Total sessions, accuracy, last quiz date

### Supabase Auth Setup

To enable authentication, configure OAuth providers in Supabase Dashboard:

**Google OAuth:**
1. Go to Authentication → Providers → Google
2. Enable Google provider
3. Add authorized redirect URLs:
   - `https://nishis2rp.github.io/keyboard-visualizer/`
   - `http://localhost:5173/keyboard-visualizer/` (for development)
4. Enter Google OAuth Client ID and Secret

**GitHub OAuth:**
1. Go to Authentication → Providers → GitHub
2. Enable GitHub provider
3. Add authorized redirect URLs (same as above)
4. Enter GitHub OAuth App credentials

**Email/Password:**
- Enabled by default
- Email confirmation can be configured in Settings → Auth

### Row-Level Security (RLS)

All user data is protected with RLS policies:
- Users can only read/write their own profiles
- Users can only see their own quiz sessions and history
- Shortcuts table is publicly readable

### Using Authentication in Code

**Check if user is logged in:**
```typescript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, profile } = useAuth();

  if (user) {
    // User is logged in
    console.log('Display name:', profile?.display_name);
  }
}
```

**Save quiz progress:**
```typescript
import { useQuizProgress } from '../hooks/useQuizProgress';

function QuizComponent() {
  const { startQuizSession, recordAnswer, completeQuizSession } = useQuizProgress();

  // Start quiz
  const sessionId = await startQuizSession('chrome', 'standard');

  // Record each answer
  await recordAnswer(shortcutId, wasCorrect);

  // Complete quiz
  await completeQuizSession(score, totalQuestions, correctAnswers);
}
```

**Get quiz statistics:**
```typescript
const { getQuizStats } = useQuizProgress();
const stats = await getQuizStats('chrome');
// Returns: total_sessions, total_correct, total_questions, overall_accuracy, last_quiz_date
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

Three types of sequential shortcuts with different input patterns:

1. **Excel-style (modifier held)**: `Alt + H + O + I`
   - Alt key held down while pressing H, O, I sequentially
   - Detected by presence of `+` between all keys
   - Common in ribbon-based applications

2. **VS Code-style (sequence with release)**: `Ctrl + K, Ctrl + S`
   - Complete release between key combinations
   - Separated by comma (`,`) in shortcut string
   - First combination is "prefix", second is "suffix"

3. **Gmail-style (pure sequence)**: `g + i`
   - Simple key sequences without modifiers
   - Each key pressed and released individually
   - Used for single-letter command sequences

**Processing logic:**
- `src/utils/sequentialShortcuts.ts`:
  - `isSequentialShortcut()`: Detects if a shortcut is sequential
  - `getSequentialKeys()`: Extracts individual keys from sequential shortcut
  - `SequentialKeyRecorder`: Class for tracking sequential input progress

- `src/utils/quizEngine.ts`:
  - `checkAnswer()`: Validates user input against correct shortcut
  - Handles both normal and sequential shortcuts
  - Returns `isCorrect` boolean and `sequentialProgress` array

**Quiz visual feedback:**
- Correct sequential keys displayed with green highlight
- Incorrect keys displayed with red highlight
- Arrow (→) between keys to show sequence
- Example: `Alt + H` → `O` → `I` (O and I in green if correct)

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

### applications table

```sql
CREATE TABLE applications (
  id VARCHAR(50) PRIMARY KEY,        -- 'windows11', 'chrome', 'excel', etc.
  name VARCHAR(100) NOT NULL,        -- 'Windows 11', 'Chrome', 'Excel', etc.
  icon VARCHAR(50),                  -- '🪟', '🌐', '📊', etc.
  os VARCHAR(20) NOT NULL,           -- 'windows', 'mac', 'cross-platform'
  display_order INTEGER DEFAULT 0    -- Order for display in UI
);
```

**Row-level security:** Public read-only access enabled

### shortcuts table

```sql
CREATE TABLE shortcuts (
  id BIGSERIAL PRIMARY KEY,
  application VARCHAR(50),           -- 'windows11', 'chrome', 'excel', etc. (references applications.id)
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
- `020_add_word_shortcuts.sql`: Add Microsoft Word shortcuts
- `021_add_powerpoint_shortcuts.sql`: Add PowerPoint shortcuts
- `022_set_word_powerpoint_protection_levels.sql`: Set protection levels for Word/PowerPoint
- `023_normalize_pageup_pagedown.sql`: Normalize PageUp/PageDown key names
- `024_fix_protection_levels.sql`: Fix protection level inconsistencies
- `037-042_*.sql`: Update requested shortcuts and difficulty levels
- `044_add_alternative_group_id.sql`: Add alternative shortcut grouping
- `045_create_applications_table.sql`: Create applications table for database-driven app config

**Running migrations:**
1. Set `.env` with `DATABASE_URL=postgresql://postgres:...`
2. Run `npm run db:migrate`

**Migration naming convention:**
- Use sequential numbers (001, 002, etc.)
- Use descriptive names with underscores
- Prefix with action verb (add, create, update, fix, etc.)

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
- Provides: `richShortcuts`, `allShortcuts`, `apps`, `selectedApp`, `keyboardLayout`, `isQuizMode`
- Uses `useShortcuts()` hook to fetch shortcuts and apps from Supabase
- Single source of truth for app state
- Apps list is now dynamically fetched from `applications` table instead of hardcoded

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
- `src/constants/systemProtectedShortcuts.ts`: Protection level definitions (legacy, being phased out)
- `src/constants/alternativeShortcuts.ts`: Equivalent shortcut mappings

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

## Script Architecture Pattern

### Two-Client Architecture

The project uses a dual-client architecture for database operations:

1. **Supabase Client** (Read-Only)
   - Uses: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
   - Purpose: Read-only data fetching in frontend and check scripts
   - Access: Public read access via Row-Level Security (RLS)
   - Files: Frontend code, `check-*.ts` scripts

2. **PostgreSQL Client** (Read-Write)
   - Uses: `DATABASE_URL` (full connection string)
   - Purpose: Database migrations and write operations
   - Access: Full database access with credentials
   - Files: Migration scripts, `*-pg.ts` update scripts

### Script Naming Convention

- **Check scripts**: `check-[feature].ts` - Use Supabase client for read-only verification
- **Update scripts**: `update-[feature]-pg.ts` - Use PostgreSQL client for write operations
- **Migration scripts**: `run-[feature]-migration.ts` - Use PostgreSQL client to execute SQL migrations

### Creating Update Scripts

When creating scripts to update the database:

1. Create a check script first to verify current state
2. Create an update script with `-pg` suffix
3. Use the pattern from `scripts/update-chrome-alt-shift-shortcuts-pg.ts`:
   - Import `pg` and `dotenv`
   - Connect with `DATABASE_URL`
   - Use parameterized queries or safe SQL
   - Always use `RETURNING *` to verify changes
   - Close connection in `finally` block

## Common Development Tasks

### Adding a New Application

1. **Add application to database:**
   ```sql
   -- Add to applications table
   INSERT INTO applications (id, name, icon, os, display_order)
   VALUES ('my_app', 'My App', '🚀', 'cross-platform', 100);
   ```

2. **Add shortcuts to database:**
   ```sql
   INSERT INTO shortcuts (application, keys, description, difficulty, platform)
   VALUES ('my_app', 'Ctrl + N', 'New File', 'basic', 'Cross-Platform');
   ```

3. **Frontend automatically updates:**
   - `useShortcuts()` hook fetches apps from database via `applications` table
   - No frontend code changes needed - apps are now fully database-driven

### Updating Protection Levels

**Workflow for updating protection levels:**

1. **Check current protection levels:**
   ```bash
   npx tsx scripts/check-chrome-alt-shift-shortcuts.ts
   ```

2. **Create an update script using PostgreSQL client:**
   ```typescript
   // scripts/update-[feature]-shortcuts-pg.ts
   import pg from 'pg';
   import * as dotenv from 'dotenv';

   dotenv.config();
   const { Client } = pg;

   const client = new Client({
     connectionString: process.env.DATABASE_URL,
     ssl: { rejectUnauthorized: false }
   });

   await client.connect();

   const result = await client.query(
     `UPDATE shortcuts
      SET windows_protection_level = 'preventable_fullscreen',
          macos_protection_level = 'preventable_fullscreen'
      WHERE application = 'chrome'
        AND id IN (80, 89)
      RETURNING *`
   );

   await client.end();
   ```

3. **Run the script:**
   ```bash
   npx tsx scripts/update-[feature]-shortcuts-pg.ts
   ```

4. **Verify the update:**
   ```bash
   npx tsx scripts/check-chrome-alt-shift-shortcuts.ts
   ```

**Important Notes:**
- Use Supabase client for read-only operations (check scripts)
- Use PostgreSQL client (`pg`) for write operations (update scripts)
- Supabase ANON_KEY has read-only access for security
- Always verify changes after running update scripts

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

### Test Framework Setup

- **Framework:** Vitest with jsdom environment
- **Configuration:** `vite.config.ts` (test section)
- **Setup file:** `src/tests/setup.ts`
- **Test files:** `src/tests/` directory

### Running Tests

```bash
npm test              # Run all tests once
npm run test:watch   # Watch mode for development
npm run test:coverage # Generate coverage report (not in package.json, add if needed)
```

### Key Test Files

- **`quizEngine.test.ts`**: Core quiz logic tests
  - Shortcut normalization (`normalizeShortcut`)
  - Answer checking (`checkAnswer`)
  - Sequential shortcut handling
  - Alternative shortcut recognition

### Test Configuration

From `vite.config.ts`:
```typescript
test: {
  globals: true,           // No need to import describe, it, expect
  environment: 'jsdom',    // DOM environment for React components
  setupFiles: './src/tests/setup.ts',
  css: false,              // Skip CSS processing for speed
  coverage: {
    provider: 'v8',
    reporter: ['text', 'html', 'lcov'],
  },
}
```

### Writing Tests

- Use `describe()` blocks to group related tests
- Use `it()` or `test()` for individual test cases
- Import functions directly from source files
- Mock Supabase client if testing data fetching
- Test both normal and edge cases (empty strings, null values, etc.)

**Example pattern:**
```typescript
import { describe, it, expect } from 'vitest';
import { normalizeShortcut } from '../utils/quizEngine';

describe('normalizeShortcut', () => {
  it('should normalize modifier key order', () => {
    expect(normalizeShortcut('Shift+Ctrl+A')).toBe('Ctrl+Shift+A');
  });

  it('should handle null input', () => {
    expect(normalizeShortcut('')).toBe('');
  });
});
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
   - **Note:** `strict` mode is disabled in `tsconfig.json` for gradual migration
   - Use explicit types where possible, but `any` is allowed during refactoring
   - All component props should have interface definitions

2. **Normalization first:** Always normalize shortcuts before comparison
   - Use `normalizeShortcut()` from `utils/quizEngine.ts`
   - Modifier key order: Ctrl → Alt → Meta → Shift → MainKeys
   - Example: `normalizeShortcut("ctrl + A")` → `"Ctrl+A"`

3. **Set-based lookups:** Use `Set` for O(1) lookup performance
   - `pressedKeys: Set<string>` for keyboard input tracking
   - `usedShortcuts: Set<string>` for quiz history
   - Protection level checks use Sets for fast lookups

4. **Context for global state:**
   - `AppContext` for app data, shortcuts, layout selection
   - `QuizContext` for quiz logic with reducer pattern
   - Never mutate state directly; always create new objects/Sets

5. **Custom hooks for logic:** Separate UI from business logic
   - `useShortcuts`: Data fetching and transformation
   - `useKeyboardShortcuts`: Keyboard event handling
   - `useQuizInputHandler`: Quiz answer validation
   - `useLocalStorage`: Settings persistence

6. **Memo optimization:** Use `useMemo` and `useCallback` to prevent unnecessary re-renders
   - Memoize expensive computations (filtering, sorting)
   - Memoize callback functions passed to child components
   - See `KeyboardLayout.tsx` for optimization examples

7. **CSS className over inline styles:** Use className-based styling for better maintainability
   - Protection level styles in `src/styles/components.css`
   - Apply via className concatenation: `\`shortcut-card \${protectionClass}\``
   - Avoid inline styles except for dynamic positioning

## Common Pitfalls

1. **Don't mutate `pressedKeys` Set directly**
   - ❌ Wrong: `pressedKeys.add(key)` (mutates existing Set)
   - ✅ Correct: `setPressedKeys(new Set([...pressedKeys, key]))` (creates new Set)
   - React won't detect mutations to Sets/Maps; always create new instances

2. **Always normalize shortcuts before comparison**
   - ❌ Wrong: `if (userInput === "ctrl + A")` (case-sensitive, order-dependent)
   - ✅ Correct: `if (normalizeShortcut(userInput) === normalizeShortcut(expected))`
   - Use `normalizeShortcut()` from `quizEngine.ts`
   - Handles modifier key order, case differences, and spacing variations

3. **Check OS before using protection levels**
   - ❌ Wrong: Using `windows_protection_level` on macOS
   - ✅ Correct: `const level = currentOS === 'mac' ? shortcut.macos_protection_level : shortcut.windows_protection_level`
   - Use `detectOS()` from `utils/os.ts` to get current operating system
   - Protection levels are OS-specific (e.g., Cmd+Tab protected on Mac, not Windows)

4. **Handle null values from database**
   - ❌ Wrong: `shortcut.windows_protection_level.includes('protected')` (can be null)
   - ✅ Correct: `shortcut.windows_protection_level?.includes('protected') ?? false`
   - Database columns: `category`, `windows_keys`, `macos_keys`, `windows_protection_level`, `macos_protection_level` can all be null
   - Always provide fallbacks: `shortcut.category || 'Uncategorized'`

5. **Use proper key codes, not key values**
   - ❌ Wrong: `KeyboardEvent.key` (returns character, varies by keyboard layout)
   - ✅ Correct: `KeyboardEvent.code` (returns physical key position)
   - Example: `code: "ControlLeft"` not `key: "Control"`
   - Use `getCodeDisplayName()` from `keyMapping.ts` to convert codes to display names

6. **Sequential shortcuts need special handling**
   - ❌ Wrong: Treating `Alt + H + O + I` as a single simultaneous combination
   - ✅ Correct: Use `SequentialKeyRecorder` class to track sequential input
   - Check with `isSequentialShortcut()` before processing
   - Handle three different sequential patterns (Excel, VS Code, Gmail)

7. **Supabase client is read-only**
   - ❌ Wrong: Using `supabase.from('shortcuts').update()` (will fail silently)
   - ✅ Correct: Use PostgreSQL client with `DATABASE_URL` for write operations
   - Create scripts with `-pg` suffix for database updates
   - Use Supabase client only for frontend data fetching and check scripts

8. **Base path differs between environments**
   - ❌ Wrong: Hardcoding base path as `/` or `/keyboard-visualizer/`
   - ✅ Correct: Use `process.env.VITE_BASE_PATH || '/keyboard-visualizer/'` in vite.config.ts
   - Docker uses `/` (set in docker-compose.yml)
   - GitHub Pages uses `/keyboard-visualizer/`
   - Assets and routing must respect the base path

## Recent Major Changes

1. **Full TypeScript migration** (2025): Converted all .js to .ts/.tsx files
2. **Database-driven protection levels** (2025): Moved from hardcoded constants to database columns with OS-specific support
3. **CSS refactoring** (2025): Removed duplicate styles from global.css, consolidated to components.css
4. **Protection level visual indicators** (2025): Added blue borders for `preventable_fullscreen` and red borders for `always-protected` shortcuts
5. **PageUp/PageDown normalization** (2026-01): Normalized "Page Up" (with space) to "PageUp" (no space) across database
6. **Word and PowerPoint support** (2026-01): Added Microsoft Word and PowerPoint shortcuts with protection levels
7. **RichShortcut type refactoring** (2026-01): Introduced `RichShortcut` type for detailed shortcut data from database
8. **Script organization** (2026-01): Separated read-only scripts (Supabase client) from write scripts (PostgreSQL client with `-pg` suffix)
9. **User Authentication & Quiz Progress Tracking** (2026-02): Added optional authentication with Google, GitHub, and Email/Password. Users can now save quiz history and track progress across sessions. Implemented AuthContext, AuthModal, UserMenu, and useQuizProgress hook with database tables for user_profiles, quiz_sessions, and quiz_history
10. **Database-driven app configuration** (2026-02): Migrated from hardcoded `apps.ts` and `shortcutDifficulty.ts` to database tables. Created `applications` table for app metadata. Frontend now dynamically fetches app list from database via `useShortcuts()` hook
11. **Tailwind CSS v4 migration** (2026-02): Migrated from Tailwind CSS v3 to v4. Replaced `@tailwind` directives with `@import "tailwindcss"`, migrated to `@theme` for CSS variables, removed `@apply` directives in favor of vanilla CSS, and installed `@tailwindcss/postcss` plugin for PostCSS integration

## Git Workflow

- Main branch: `main`
- Auto-deploy on push to `main`
- Commit messages use conventional commits format
- All commits include: `🤖 Generated with [Claude Code](https://claude.com/claude-code)`
