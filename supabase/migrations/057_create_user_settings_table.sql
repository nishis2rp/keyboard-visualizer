-- Migration 057: Create user_settings table for persistent user preferences
-- Description: Stores user-specific settings like layout, difficulty, and theme
-- Date: 2026-02-20

CREATE TABLE IF NOT EXISTS public.user_settings (
  user_id UUID PRIMARY KEY REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Users can view own settings"
  ON public.user_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings"
  ON public.user_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON public.user_settings FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON public.user_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Update handle_new_user function to also initialize user_settings
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into user_profiles
  INSERT INTO public.user_profiles (id, display_name, avatar_url, bio, goal)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'bio',
    NEW.raw_user_meta_data->>'goal'
  );

  -- Initialize user_settings with defaults
  INSERT INTO public.user_settings (user_id, settings)
  VALUES (
    NEW.id,
    jsonb_build_object(
      'layout', 'windows-jis',
      'difficulty', 'allrange',
      'theme', 'system',
      'showLandingVisualizer', true
    )
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comments for documentation
COMMENT ON TABLE public.user_settings IS 'Stores persistent user preferences and application settings';
COMMENT ON COLUMN public.user_settings.settings IS 'JSONB object containing various user settings (layout, difficulty, theme, etc.)';
