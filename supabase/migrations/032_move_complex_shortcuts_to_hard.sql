-- Move 200 complex shortcuts from standard to hard difficulty
-- Selected based on complexity scoring algorithm considering:
-- - Key count (3+ keys)
-- - Modifier count (2+ modifiers)
-- - Sequential patterns
-- - Advanced keywords (ピボット, マクロ, VBA, etc.)
-- - F-key usage
-- - Alt key combinations

-- Breakdown by application:
-- macos: 103 shortcuts
-- excel: 45 shortcuts
-- vscode: 25 shortcuts
-- word: 8 shortcuts
-- windows11: 8 shortcuts
-- slack: 7 shortcuts
-- powerpoint: 2 shortcuts
-- chrome: 2 shortcuts

UPDATE shortcuts
SET difficulty = 'hard'
WHERE id = ANY(ARRAY[
  1080, 1064, 230, 941, 889, 195, 963, 245, 246, 235, 240, 132, 131, 232, 231, 135, 267, 89, 80, 634, 610, 525, 933, 934, 1311, 1312, 1313, 806, 1347, 229, 220, 221, 225, 226, 227, 224, 222, 951, 1261, 936, 1260, 819, 818, 817, 823, 769, 248, 136, 138, 137, 512, 513, 511, 596, 642, 520, 408, 482, 567, 597, 637, 517, 518, 578, 579, 1072, 1073, 636, 524, 618, 592, 561, 635, 476, 466, 568, 475, 641, 480, 600, 474, 595, 397, 463, 573, 611, 624, 469, 381, 416, 387, 488, 462, 1081, 431, 430, 432, 433, 418, 404, 405, 406, 407, 388, 564, 478, 396, 535, 599, 392, 489, 468, 499, 376, 552, 1065, 1058, 491, 521, 386, 1078, 1059, 393, 617, 566, 467, 390, 555, 494, 522, 394, 594, 509, 613, 493, 529, 477, 1067, 380, 614, 588, 527, 549, 464, 391, 1063, 510, 1055, 395, 490, 593, 461, 565, 455, 389, 492, 609, 417, 1066, 559, 479, 211, 1087, 204, 228, 205, 942, 210, 206, 208, 959, 209, 1225, 1325, 842, 198, 199, 1226, 1326, 843, 196, 197, 1291, 1399, 236, 1290, 1398, 263, 203, 207, 1232, 219, 212, 1227, 1228, 213, 1229, 214, 1231, 215
]::bigint[])
AND difficulty = 'standard';
