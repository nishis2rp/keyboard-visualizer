import React from 'react';
import { WeakShortcut } from '../../types';
import { APP_DISPLAY_NAMES } from '../../constants/app';

interface WeakShortcutsProps {
  weakShortcuts: WeakShortcut[];
  loading: boolean;
}

const WeakShortcuts: React.FC<WeakShortcutsProps> = ({ weakShortcuts, loading }) => {
  if (loading) {
    return <div className="loading-small">分析中...</div>;
  }

  if (weakShortcuts.length === 0) {
    return (
      <div className="empty-state-small">
        <p>完璧です！苦手なショートカットは見つかりませんでした。</p>
      </div>
    );
  }

  return (
    <div className="weak-shortcuts-list">
      {weakShortcuts.map((shortcut) => (
        <div key={shortcut.id} className="weak-shortcut-item">
          <div className="weak-shortcut-info">
            <div className="weak-shortcut-keys">
              {shortcut.keys.split(' + ').map((key, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <span className="key-plus">+</span>}
                  <kbd className="key-badge">{key}</kbd>
                </React.Fragment>
              ))}
            </div>
            <div className="weak-shortcut-desc">{shortcut.description}</div>
            <div className="weak-shortcut-meta">
              <span className="weak-shortcut-app">
                {APP_DISPLAY_NAMES[shortcut.application] || shortcut.application}
              </span>
            </div>
          </div>
          <div className="weak-shortcut-stats">
            <div className="weak-stat-label">正解率</div>
            <div className="weak-stat-value">{(shortcut.accuracy * 100).toFixed(0)}%</div>
            <div className="weak-stat-detail">
              ミス {shortcut.wrong_count}回 / 挑戦 {shortcut.wrong_count + shortcut.correct_count}回
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WeakShortcuts;
