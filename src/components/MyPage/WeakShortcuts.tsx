import React from 'react';
import { WeakShortcut } from '../../types';
import { APP_DISPLAY_NAMES } from '../../constants/app';

interface WeakShortcutsProps {
  weakShortcuts: WeakShortcut[];
  loading: boolean;
}

const WeakShortcuts: React.FC<WeakShortcutsProps> = ({ weakShortcuts, loading }) => {
  if (loading) {
    return <div className="text-center py-4 text-sf-gray text-sm animate-pulse">分析中...</div>;
  }

  if (weakShortcuts.length === 0) {
    return (
      <div className="text-center py-6 bg-sf-green-ultralight/30 rounded-apple-lg border border-sf-green-light/20">
        <p className="text-sf-green-dark font-medium text-sm">完璧です！苦手なショートカットは見つかりませんでした。</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {weakShortcuts.map((shortcut) => (
        <div key={shortcut.id} className="flex justify-between items-center p-4 bg-sf-gray-ultralight rounded-apple-lg border-l-4 border-l-sf-red border border-gray-100 transition-all hover:translate-x-1">
          <div className="flex-1">
            <div className="flex items-center gap-1.5 mb-2">
              {shortcut.keys.split(' + ').map((key, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <span className="text-sf-gray text-[10px] font-bold">+</span>}
                  <kbd className="apple-kbd">{key}</kbd>
                </React.Fragment>
              ))}
            </div>
            <div className="text-sm font-bold text-sf-primary leading-tight mb-1">{shortcut.description}</div>
            <div className="text-[10px] text-sf-gray font-bold uppercase tracking-wider">
              {APP_DISPLAY_NAMES[shortcut.application] || shortcut.application}
            </div>
          </div>
          <div className="text-right min-w-[100px]">
            <div className="text-[10px] text-sf-gray font-bold uppercase tracking-wider mb-0.5">正解率</div>
            <div className="text-xl font-black text-sf-red-dark leading-none">{(shortcut.accuracy * 100).toFixed(0)}%</div>
            <div className="text-[9px] text-sf-gray font-medium mt-1">
              ミス {shortcut.wrong_count} / {shortcut.wrong_count + shortcut.correct_count} 挑戦
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WeakShortcuts;
