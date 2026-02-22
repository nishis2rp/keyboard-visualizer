-- Create translations table for database-driven i18n
CREATE TABLE IF NOT EXISTS translations (
  id BIGSERIAL PRIMARY KEY,
  translation_key VARCHAR(200) NOT NULL UNIQUE,
  context VARCHAR(100),
  en_text TEXT NOT NULL,
  ja_text TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for fast key lookups
CREATE INDEX idx_translations_key ON translations(translation_key);
CREATE INDEX idx_translations_context ON translations(context);

-- Enable Row Level Security
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access to translations"
  ON translations FOR SELECT
  USING (true);

-- Add trigger to update updated_at timestamp
CREATE TRIGGER update_translations_updated_at
  BEFORE UPDATE ON translations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE translations IS 'Database-driven internationalization strings for the application';
COMMENT ON COLUMN translations.translation_key IS 'Unique key for the translation (e.g., "common.save", "quiz.start")';
COMMENT ON COLUMN translations.context IS 'Grouping context (e.g., "common", "quiz", "landing")';
COMMENT ON COLUMN translations.en_text IS 'English translation text';
COMMENT ON COLUMN translations.ja_text IS 'Japanese translation text';
