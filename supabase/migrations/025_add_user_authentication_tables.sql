-- Migration: Add User Authentication and Quiz Progress Tables
-- Description: Create tables for user profiles, quiz progress, and quiz history
-- Author: Claude Code
-- Date: 2026-02-01

-- 1. Create user_profiles table (extends Supabase Auth users)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create quiz_sessions table (tracks individual quiz sessions)
CREATE TABLE IF NOT EXISTS quiz_sessions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  application VARCHAR(50) NOT NULL,
  difficulty VARCHAR(20),
  score INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL DEFAULT 0,
  correct_answers INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE
);

-- 3. Create quiz_history table (detailed answer history)
CREATE TABLE IF NOT EXISTS quiz_history (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  session_id BIGINT REFERENCES quiz_sessions(id) ON DELETE CASCADE,
  shortcut_id BIGINT REFERENCES shortcuts(id) ON DELETE SET NULL,
  was_correct BOOLEAN NOT NULL,
  answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_quiz_history_user FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE,
  CONSTRAINT fk_quiz_history_session FOREIGN KEY (session_id) REFERENCES quiz_sessions(id) ON DELETE CASCADE,
  CONSTRAINT fk_quiz_history_shortcut FOREIGN KEY (shortcut_id) REFERENCES shortcuts(id) ON DELETE SET NULL
);

-- 4. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_user_id ON quiz_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_application ON quiz_sessions(application);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_completed_at ON quiz_sessions(completed_at);
CREATE INDEX IF NOT EXISTS idx_quiz_history_user_id ON quiz_history(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_history_session_id ON quiz_history(session_id);
CREATE INDEX IF NOT EXISTS idx_quiz_history_shortcut_id ON quiz_history(shortcut_id);

-- 5. Enable Row-Level Security (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_history ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS Policies for user_profiles
-- Allow users to read their own profile
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 7. Create RLS Policies for quiz_sessions
-- Allow users to read their own quiz sessions
CREATE POLICY "Users can view own quiz sessions"
  ON quiz_sessions FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to insert their own quiz sessions
CREATE POLICY "Users can insert own quiz sessions"
  ON quiz_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own quiz sessions
CREATE POLICY "Users can update own quiz sessions"
  ON quiz_sessions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 8. Create RLS Policies for quiz_history
-- Allow users to read their own quiz history
CREATE POLICY "Users can view own quiz history"
  ON quiz_history FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to insert their own quiz history
CREATE POLICY "Users can insert own quiz history"
  ON quiz_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 9. Create function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Create trigger to automatically create user profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- 11. Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 12. Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 13. Create view for user quiz statistics
CREATE OR REPLACE VIEW user_quiz_stats AS
SELECT
  user_id,
  application,
  COUNT(DISTINCT id) as total_sessions,
  SUM(correct_answers) as total_correct,
  SUM(total_questions) as total_questions,
  CASE
    WHEN SUM(total_questions) > 0 THEN
      ROUND((SUM(correct_answers)::DECIMAL / SUM(total_questions)::DECIMAL * 100), 2)
    ELSE 0
  END as overall_accuracy,
  MAX(completed_at) as last_quiz_date
FROM quiz_sessions
WHERE completed_at IS NOT NULL
GROUP BY user_id, application;

-- Grant access to authenticated users
GRANT SELECT ON user_quiz_stats TO authenticated;

-- Comments for documentation
COMMENT ON TABLE user_profiles IS 'Extended user profile information linked to Supabase Auth users';
COMMENT ON TABLE quiz_sessions IS 'Individual quiz session records with scores and metadata';
COMMENT ON TABLE quiz_history IS 'Detailed answer history for each question in a quiz session';
COMMENT ON VIEW user_quiz_stats IS 'Aggregated quiz statistics per user and application';
