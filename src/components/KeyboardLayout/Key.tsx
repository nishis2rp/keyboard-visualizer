import React, { memo } from 'react';
import { KeyDefinition } from '../../types';

interface KeyProps {
  keyObj: KeyDefinition;
  isPressed: boolean;
  isModifier: boolean;
  isWinKey: boolean;
  isSpecial: boolean;
  gridColumn: string;
  gridRow: string;
  shortcuts: { combo: string; desc: string }[];
}

const Key = memo(({
  keyObj,
  isPressed,
  isModifier,
  isWinKey,
  isSpecial,
  gridColumn,
  gridRow,
  shortcuts
}: KeyProps) => {
  const keyClasses = ['key-cap'];
  if (isPressed) keyClasses.push('active');
  if (isWinKey) keyClasses.push('windows');
  else if (isModifier) keyClasses.push('modifier');
  else if (isSpecial) keyClasses.push('special');

  return (
    <div
      className={keyClasses.join(' ')}
      style={{
        gridColumn,
        gridRow
      }}
      title={shortcuts.length > 0 ? shortcuts.map(s => `${s.combo}: ${s.desc}`).join('\n') : ''}
    >
      <div className="key-label">{keyObj.display}</div>
      {shortcuts.length > 0 && (
        <div className="key-shortcuts-popup">
          {shortcuts.map((shortcut, idx) => (
            <div key={idx} className="key-shortcut-item">
              <strong>{shortcut.combo}</strong>: {shortcut.desc}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

Key.displayName = 'Key';

export default Key;
