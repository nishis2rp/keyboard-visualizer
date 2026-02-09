-- Migration 048: Update application icons to be more realistic
UPDATE applications SET icon = '🌍' WHERE id = 'chrome';
UPDATE applications SET icon = '🟦' WHERE id = 'vscode';
UPDATE applications SET icon = '🍏' WHERE id = 'macos';
