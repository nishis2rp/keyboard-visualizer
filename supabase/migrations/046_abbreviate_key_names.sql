-- Migration: Abbreviate key names for compact display
-- Date: 2026-02-20
-- Description: Shorten common key names to abbreviations
--   Backspace → BS
--   Escape → Esc
--   PageDown → PgDn
--   PageUp → PgUp
--   Insert → Ins
--   Delete → Del
--   Enter → ↵ (keeping Enter for clarity)
--   Space → Space (keeping as-is)

-- Update keys column
UPDATE shortcuts
SET keys = REGEXP_REPLACE(
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        REGEXP_REPLACE(
          REGEXP_REPLACE(
            keys,
            '(^|\s|\+)Backspace(\s|\+|$)', '\1BS\2', 'gi'
          ),
          '(^|\s|\+)Escape(\s|\+|$)', '\1Esc\2', 'gi'
        ),
        '(^|\s|\+)PageDown(\s|\+|$)', '\1PgDn\2', 'gi'
      ),
      '(^|\s|\+)PageUp(\s|\+|$)', '\1PgUp\2', 'gi'
    ),
    '(^|\s|\+)Insert(\s|\+|$)', '\1Ins\2', 'gi'
  ),
  '(^|\s|\+)Delete(\s|\+|$)', '\1Del\2', 'gi'
)
WHERE keys ~* '(Backspace|Escape|PageDown|PageUp|Insert|Delete)';

-- Update windows_keys column
UPDATE shortcuts
SET windows_keys = REGEXP_REPLACE(
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        REGEXP_REPLACE(
          REGEXP_REPLACE(
            windows_keys,
            '(^|\s|\+)Backspace(\s|\+|$)', '\1BS\2', 'gi'
          ),
          '(^|\s|\+)Escape(\s|\+|$)', '\1Esc\2', 'gi'
        ),
        '(^|\s|\+)PageDown(\s|\+|$)', '\1PgDn\2', 'gi'
      ),
      '(^|\s|\+)PageUp(\s|\+|$)', '\1PgUp\2', 'gi'
    ),
    '(^|\s|\+)Insert(\s|\+|$)', '\1Ins\2', 'gi'
  ),
  '(^|\s|\+)Delete(\s|\+|$)', '\1Del\2', 'gi'
)
WHERE windows_keys ~* '(Backspace|Escape|PageDown|PageUp|Insert|Delete)';

-- Update macos_keys column
UPDATE shortcuts
SET macos_keys = REGEXP_REPLACE(
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        REGEXP_REPLACE(
          REGEXP_REPLACE(
            macos_keys,
            '(^|\s|\+)Backspace(\s|\+|$)', '\1BS\2', 'gi'
          ),
          '(^|\s|\+)Escape(\s|\+|$)', '\1Esc\2', 'gi'
        ),
        '(^|\s|\+)PageDown(\s|\+|$)', '\1PgDn\2', 'gi'
      ),
      '(^|\s|\+)PageUp(\s|\+|$)', '\1PgUp\2', 'gi'
    ),
    '(^|\s|\+)Insert(\s|\+|$)', '\1Ins\2', 'gi'
  ),
  '(^|\s|\+)Delete(\s|\+|$)', '\1Del\2', 'gi'
)
WHERE macos_keys ~* '(Backspace|Escape|PageDown|PageUp|Insert|Delete)';
