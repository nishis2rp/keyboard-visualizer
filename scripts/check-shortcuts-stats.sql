-- ショートカット統計情報

-- 1. 全体のレコード数
SELECT COUNT(*) as total_shortcuts
FROM shortcuts;

-- 2. アプリケーション別レコード数
SELECT
  application,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 1) as percentage
FROM shortcuts
GROUP BY application
ORDER BY count DESC;

-- 3. 難易度別レコード数
SELECT
  COALESCE(difficulty, 'NULL (未設定)') as difficulty,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 1) as percentage
FROM shortcuts
GROUP BY difficulty
ORDER BY
  CASE difficulty
    WHEN 'basic' THEN 1
    WHEN 'standard' THEN 2
    WHEN 'hard' THEN 3
    WHEN 'madmax' THEN 4
    WHEN 'allrange' THEN 5
    ELSE 6
  END;

-- 4. アプリケーション × 難易度のクロス集計
SELECT
  application,
  COUNT(CASE WHEN difficulty = 'basic' THEN 1 END) as basic,
  COUNT(CASE WHEN difficulty = 'standard' THEN 1 END) as standard,
  COUNT(CASE WHEN difficulty = 'hard' THEN 1 END) as hard,
  COUNT(CASE WHEN difficulty = 'madmax' THEN 1 END) as madmax,
  COUNT(CASE WHEN difficulty = 'allrange' THEN 1 END) as allrange,
  COUNT(CASE WHEN difficulty IS NULL THEN 1 END) as unset,
  COUNT(*) as total
FROM shortcuts
GROUP BY application
ORDER BY total DESC;

-- 5. プラットフォーム別レコード数
SELECT
  platform,
  COUNT(*) as count
FROM shortcuts
GROUP BY platform
ORDER BY count DESC;
