-- Update Alt-key sequences and similar patterns to sequential
UPDATE shortcuts
SET press_type = 'sequential'
WHERE
    keys ~* '^Alt \+ [A-Z0-9] \+ [A-Z0-9]( \+ [A-Z0-9])?(\ \+ [A-Z0-9])?$'
    OR keys ~* '^Ctrl \+ [A-Z0-9] \+ Ctrl \+ [A-Z0-9]$';
-- This regex is designed to match patterns like "Alt + H + O + R" and "Ctrl + K + Ctrl + S".
-- It assumes that individual keys in the sequence are separated by " + ".
-- Adjust the regex if other patterns for sequential presses are identified.