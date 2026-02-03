-- Update minor and advanced shortcuts to madmax difficulty
-- This reduces the standard category and increases madmax for better difficulty balance

-- Excel: Minor sequential shortcuts (rarely used ribbon shortcuts)
-- スパークライン、トレース矢印、セル結合、シート操作、表示設定など
UPDATE shortcuts
SET difficulty = 'madmax'
WHERE id IN (
  268, 269, 270, -- スパークライン系 (Alt + N + S + L/C/W)
  253, 254, 255, -- トレース矢印系 (Alt + M + P/D/A + A)
  251, 252, -- セル結合系 (Alt + H + M + C/U)
  241, 242, -- シート削除/名前変更 (Alt + H + D + S, Alt + H + O + R)
  243, 244, -- 枠線/見出し表示切替 (Alt + W + V + G/H)
  134, -- ルールの管理 (Alt + H + L + R)
  265, -- ブックのプロパティ (Alt + F + I + S)
  247 -- ユーザー設定の並べ替え (Alt + A + S + S)
);

-- Excel: VBA/マクロ関連 (advanced developer features)
UPDATE shortcuts
SET difficulty = 'madmax'
WHERE id IN (129, 130); -- Alt + F8 (マクロダイアログ), Alt + F11 (VBエディタ)

-- Windows: Very advanced system shortcuts
UPDATE shortcuts
SET difficulty = 'madmax'
WHERE id = 828; -- Win + Ctrl + Shift + B (グラフィックドライバー再起動)

-- macOS: Very advanced system shortcuts
UPDATE shortcuts
SET difficulty = 'madmax'
WHERE id IN (
  574, -- Cmd + Option + Shift + N (新規音声収録)
  638 -- Ctrl + Option + Cmd + 8 (色を反転)
);
