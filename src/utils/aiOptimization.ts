import { RichShortcut } from '../types';

/**
 * AI Deduction Engine (推論エンジン)
 * クイズの正解と選択肢から、ユーザーが混同しやすいポイントを分析しヒントを生成する
 */
export const analyzeShortcutComplexity = (
  target: RichShortcut,
  allShortcuts: RichShortcut[]
) => {
  // 1. キーの重複度を分析 (Ctrl系か、Alt系か、単体キーか)
  const isModifierHeavy = target.keys.includes('+');
  const modifiers = ['Ctrl', 'Alt', 'Shift', 'Win', 'Cmd', 'Option'];
  const usedModifiers = modifiers.filter(mod => target.keys.includes(mod));

  // 2. 類似したショートカットを抽出 (Deduction logic)
  // 同じ修飾キーを持つ他のショートカットを「紛らわしい候補」として認識
  const confusingShortcuts = allShortcuts.filter(s => 
    s.id !== target.id && 
    usedModifiers.every(mod => s.keys.includes(mod)) &&
    s.application === target.application
  ).slice(0, 3);

  return {
    complexityScore: isModifierHeavy ? usedModifiers.length * 2 : 1,
    confusingShortcuts,
    hint: generateSmartHint(target, confusingShortcuts)
  };
};

const generateSmartHint = (target: RichShortcut, confusing: RichShortcut[]) => {
  if (confusing.length === 0) return "このアプリ独自のユニークな操作です。";
  
  const targetKey = target.keys.split('+').pop()?.trim();
  return `似た操作（${confusing.map(c => c.keys).join(', ')}）と区別しましょう。ポイントは「${targetKey}」キーです。`;
};

/**
 * 入力遅延に基づいたパフォーマンススコアの計算
 */
export const calculatePerformanceScore = (frameTimes: number[]) => {
  if (frameTimes.length === 0) return 100;
  const avg = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
  // 16.6ms (60fps) を基準とする
  return Math.max(0, Math.min(100, 100 - (avg - 16.6) * 2));
};
