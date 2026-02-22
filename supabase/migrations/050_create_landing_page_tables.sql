-- ============================================================================
-- Landing Page CMS Tables
-- ============================================================================

-- FAQs Table
CREATE TABLE IF NOT EXISTS faqs (
  id BIGSERIAL PRIMARY KEY,
  question_en TEXT NOT NULL,
  question_ja TEXT NOT NULL,
  answer_en TEXT NOT NULL,
  answer_ja TEXT NOT NULL,
  category VARCHAR(50),
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_faqs_display_order ON faqs(display_order);
CREATE INDEX IF NOT EXISTS idx_faqs_category ON faqs(category);
CREATE INDEX IF NOT EXISTS idx_faqs_active ON faqs(is_active);

-- Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
  id BIGSERIAL PRIMARY KEY,
  name_en VARCHAR(100) NOT NULL,
  name_ja VARCHAR(100) NOT NULL,
  role_en VARCHAR(100),
  role_ja VARCHAR(100),
  comment_en TEXT NOT NULL,
  comment_ja TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_testimonials_display_order ON testimonials(display_order);
CREATE INDEX IF NOT EXISTS idx_testimonials_rating ON testimonials(rating);
CREATE INDEX IF NOT EXISTS idx_testimonials_active ON testimonials(is_active);

-- Landing Page Sections Table
CREATE TABLE IF NOT EXISTS landing_sections (
  id BIGSERIAL PRIMARY KEY,
  section_key VARCHAR(100) NOT NULL UNIQUE,
  section_type VARCHAR(50) NOT NULL,
  title_en VARCHAR(200),
  title_ja VARCHAR(200),
  subtitle_en TEXT,
  subtitle_ja TEXT,
  content_en TEXT,
  content_ja TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_landing_sections_key ON landing_sections(section_key);
CREATE INDEX IF NOT EXISTS idx_landing_sections_type ON landing_sections(section_type);
CREATE INDEX IF NOT EXISTS idx_landing_sections_order ON landing_sections(display_order);

-- Landing Page Features/Benefits Table
CREATE TABLE IF NOT EXISTS landing_features (
  id BIGSERIAL PRIMARY KEY,
  feature_key VARCHAR(100) NOT NULL UNIQUE,
  category VARCHAR(50) NOT NULL,
  icon_name VARCHAR(100),
  title_en VARCHAR(200) NOT NULL,
  title_ja VARCHAR(200) NOT NULL,
  description_en TEXT NOT NULL,
  description_ja TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_landing_features_key ON landing_features(feature_key);
CREATE INDEX IF NOT EXISTS idx_landing_features_category ON landing_features(category);
CREATE INDEX IF NOT EXISTS idx_landing_features_order ON landing_features(display_order);

-- Enable Row Level Security
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE landing_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE landing_features ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to active faqs"
  ON faqs FOR SELECT
  USING (is_active = true);

CREATE POLICY "Allow public read access to active testimonials"
  ON testimonials FOR SELECT
  USING (is_active = true);

CREATE POLICY "Allow public read access to active landing_sections"
  ON landing_sections FOR SELECT
  USING (is_active = true);

CREATE POLICY "Allow public read access to active landing_features"
  ON landing_features FOR SELECT
  USING (is_active = true);

-- Add triggers to update updated_at timestamp
CREATE TRIGGER update_faqs_updated_at
  BEFORE UPDATE ON faqs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON testimonials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_landing_sections_updated_at
  BEFORE UPDATE ON landing_sections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_landing_features_updated_at
  BEFORE UPDATE ON landing_features
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments
COMMENT ON TABLE faqs IS 'Frequently Asked Questions for the landing page';
COMMENT ON TABLE testimonials IS 'User testimonials and reviews';
COMMENT ON TABLE landing_sections IS 'Configurable sections for the landing page';
COMMENT ON TABLE landing_features IS 'Features and benefits displayed on the landing page';
COMMENT ON COLUMN landing_features.category IS 'Category: feature, benefit, target, etc.';
