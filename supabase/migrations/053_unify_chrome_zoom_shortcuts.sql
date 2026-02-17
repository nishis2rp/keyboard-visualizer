-- ChromeのCtrl + +, Ctrl + ; を同一判定にする（同じalternative_group_idを割り当てる）
-- Ctrl + + と Ctrl + = は既にグループID 12が割り当てられているはず
UPDATE shortcuts
SET alternative_group_id = 12
WHERE keys IN ('Ctrl + +', 'Ctrl + ;')
  AND application = 'chrome';
