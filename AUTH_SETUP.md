# Authentication Setup Guide

This document explains how to set up and use the authentication features in Keyboard Visualizer.

## Overview

The application now supports optional user authentication with the following features:
- **Google OAuth** - Sign in with your Google account
- **GitHub OAuth** - Sign in with your GitHub account
- **Email/Password** - Create an account with email and password

**Benefits of logging in:**
- Save quiz history across sessions
- Track progress and improvement over time
- View detailed statistics per application
- Access quiz history from any device

**Important:** The app works fully without login. Authentication is optional and only required if you want to save your quiz progress.

## Database Setup

### Step 1: Run the Migration

The authentication tables have been created with migration `025_add_user_authentication_tables.sql`.

To apply this migration to your Supabase database:

```bash
# Make sure your .env file contains DATABASE_URL
npx tsx scripts/run-auth-migration.ts
```

This will create the following tables:
- `user_profiles` - Extended user information
- `quiz_sessions` - Quiz session records
- `quiz_history` - Detailed answer history
- `user_quiz_stats` (view) - Aggregated statistics

### Step 2: Configure OAuth Providers in Supabase

#### Google OAuth

1. Go to [Supabase Dashboard](https://app.supabase.com) → Your Project → Authentication → Providers
2. Find "Google" and click to expand
3. Enable the Google provider
4. Create a Google OAuth Client:
   - Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - Create a new OAuth 2.0 Client ID
   - Set Authorized JavaScript origins:
     - `https://nishis2rp.github.io`
     - `http://localhost:5173` (for development)
   - Set Authorized redirect URIs:
     - `https://[YOUR-PROJECT-ID].supabase.co/auth/v1/callback`
5. Copy the Client ID and Client Secret to Supabase

#### GitHub OAuth

1. In Supabase Dashboard → Authentication → Providers → GitHub
2. Enable the GitHub provider
3. Create a GitHub OAuth App:
   - Go to [GitHub Developer Settings](https://github.com/settings/developers)
   - Click "New OAuth App"
   - Set Homepage URL:
     - `https://nishis2rp.github.io/keyboard-visualizer/`
   - Set Authorization callback URL:
     - `https://[YOUR-PROJECT-ID].supabase.co/auth/v1/callback`
4. Copy the Client ID and Client Secret to Supabase

#### Email/Password

Email/Password authentication is enabled by default in Supabase.

**Optional Settings:**
- Email Confirmation: Enable in Settings → Auth → Email Auth
  - Recommended for production
  - Users must verify their email before logging in
- Password Requirements: Configure minimum length, character requirements, etc.

## Environment Variables

No additional environment variables are required! The authentication system uses the existing Supabase configuration:

```bash
# .env file (already configured)
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
DATABASE_URL=postgresql://postgres:[password]@db.xxxxx.supabase.co:5432/postgres
```

## Using Authentication in the App

### For Users

1. **Login:**
   - Click the "ログイン" button in the top-right corner
   - Choose your preferred authentication method
   - After successful login, you'll see your profile icon

2. **Take a Quiz:**
   - Start a quiz as usual
   - Your progress will be automatically saved if you're logged in
   - Complete the quiz to save your score

3. **View Your Stats:**
   - Future feature: Dashboard to view quiz history and statistics

4. **Logout:**
   - Click your profile icon in the top-right corner
   - Click "ログアウト"

### For Developers

#### Check Authentication Status

```typescript
import { useAuth } from './context/AuthContext';

function MyComponent() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return <div>Welcome, {profile?.display_name}!</div>;
  }

  return <div>Please log in</div>;
}
```

#### Save Quiz Progress

```typescript
import { useQuizProgress } from './hooks/useQuizProgress';

function QuizComponent() {
  const { startQuizSession, recordAnswer, completeQuizSession } = useQuizProgress();

  // When quiz starts
  const handleStartQuiz = async () => {
    const sessionId = await startQuizSession('chrome', 'standard');
    console.log('Quiz session started:', sessionId);
  };

  // For each answer
  const handleAnswer = async (shortcutId: number, wasCorrect: boolean) => {
    await recordAnswer(shortcutId, wasCorrect);
  };

  // When quiz completes
  const handleCompleteQuiz = async (score: number, total: number, correct: number) => {
    await completeQuizSession(score, total, correct);
  };
}
```

#### Get Quiz Statistics

```typescript
import { useQuizProgress } from './hooks/useQuizProgress';

function StatsComponent() {
  const { getQuizStats, getRecentSessions } = useQuizProgress();

  const loadStats = async () => {
    // Get stats for specific app
    const chromeStats = await getQuizStats('chrome');
    console.log('Chrome stats:', chromeStats);
    // { total_sessions, total_correct, total_questions, overall_accuracy, last_quiz_date }

    // Get recent quiz sessions
    const recentSessions = await getRecentSessions(10);
    console.log('Recent sessions:', recentSessions);
  };
}
```

## Database Schema

### user_profiles

Extends Supabase Auth users with additional profile information.

```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### quiz_sessions

Records individual quiz sessions with scores and metadata.

```sql
CREATE TABLE quiz_sessions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id),
  application VARCHAR(50) NOT NULL,
  difficulty VARCHAR(20),
  score INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL DEFAULT 0,
  correct_answers INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);
```

### quiz_history

Detailed answer history for each question in a quiz session.

```sql
CREATE TABLE quiz_history (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id),
  session_id BIGINT REFERENCES quiz_sessions(id),
  shortcut_id BIGINT REFERENCES shortcuts(id),
  was_correct BOOLEAN NOT NULL,
  answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### user_quiz_stats (view)

Aggregated quiz statistics per user and application.

```sql
CREATE VIEW user_quiz_stats AS
SELECT
  user_id,
  application,
  COUNT(DISTINCT id) as total_sessions,
  SUM(correct_answers) as total_correct,
  SUM(total_questions) as total_questions,
  ROUND((SUM(correct_answers)::DECIMAL / SUM(total_questions)::DECIMAL * 100), 2) as overall_accuracy,
  MAX(completed_at) as last_quiz_date
FROM quiz_sessions
WHERE completed_at IS NOT NULL
GROUP BY user_id, application;
```

## Row-Level Security (RLS)

All user data is protected with Row-Level Security policies:

- Users can only read/write their own profiles
- Users can only see their own quiz sessions and history
- The `shortcuts` table remains publicly readable (no login required to use the app)

## Troubleshooting

### OAuth redirect not working

**Problem:** After clicking "Sign in with Google/GitHub", nothing happens or you see an error.

**Solutions:**
1. Check that the redirect URL is correctly configured in Supabase and the OAuth provider
2. Verify that the authorized domains include your production and development URLs
3. Check browser console for CORS errors

### User profile not created automatically

**Problem:** User can sign in but `user_profiles` table is empty.

**Solutions:**
1. Check that the trigger `on_auth_user_created` is active:
   ```sql
   SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
   ```
2. Verify the `handle_new_user()` function exists and is correct
3. Re-run the migration: `npx tsx scripts/run-auth-migration.ts`

### Quiz progress not saving

**Problem:** Logged-in users' quiz progress is not saved to the database.

**Solutions:**
1. Check browser console for errors
2. Verify RLS policies allow INSERT on `quiz_sessions` and `quiz_history`
3. Check that the user is actually logged in: `const { user } = useAuth()`
4. Verify `DATABASE_URL` is correctly set for write operations

## Security Considerations

1. **Row-Level Security:** All user data is protected with RLS policies
2. **Supabase Auth:** Uses industry-standard authentication flows
3. **No sensitive data in client:** All database writes use Supabase's secure APIs
4. **Email verification:** Optional but recommended for production
5. **HTTPS only:** OAuth providers require HTTPS in production

## Next Steps

Potential features to implement:
- [ ] User dashboard with quiz statistics
- [ ] Leaderboard system
- [ ] Challenge mode (compete with friends)
- [ ] Custom quiz creation
- [ ] Export quiz history to CSV
- [ ] Achievement/badge system
- [ ] Social features (share results)

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Supabase Auth documentation: https://supabase.com/docs/guides/auth
3. Check the project's GitHub issues
4. Consult CLAUDE.md for development guidance
