/**
 * マッピング: アプリケーションID/カテゴリID -> SVGファイル名
 */
export const ICON_MAPPING: Record<string, string> = {
  // アプリケーション
  'windows11': 'windows.svg',
  'windows': 'windows.svg', // エイリアス
  'macos': 'macos.svg',
  'chrome': 'chrome.svg',
  'excel': 'excel.svg',
  'word': 'word.svg',
  'powerpoint': 'powerpoint.svg',
  'slack': 'slack.svg',
  'gmail': 'gmail.svg',
  'vscode': 'vscode.svg',
  'terminal': 'terminal.svg',
  'xcode': 'xcode.svg',
  
  // モード・設定
  'visualizer': 'visualizer.svg',
  'quiz': 'quiz.svg',
  'fullscreen': 'fullscreen.svg',
  'windowed': 'windows.svg',
  
  // レイアウト
  'windows-jis': 'windows.svg',
  'windows-us': 'windows.svg',
  'mac-jis': 'macos.svg',
  'mac-us': 'macos.svg',
  
  // 難易度・その他
  'basic': 'basic.svg',
  'standard': 'standard.svg',
  'hard': 'hard.svg',
  'madmax': 'madmax.svg',
  'allrange': 'allrange.svg',
  'random': 'allrange.svg',
};
