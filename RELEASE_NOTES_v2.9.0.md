# Release Notes - v2.9.0

**リリース日**: 2026年2月19日

## 🎯 主な新機能

### ⚠️ ブラウザショートカット競合の自動検出・警告機能

Chrome以外のアプリケーション（Windows 11、Excel、VS Codeなど）を使用中に、Chromeブラウザのショートカットと競合する可能性のあるキーを自動的に検出し、専用セクションで警告表示する機能を追加しました。

#### 機能の詳細

**検出対象**:
- Chromeの`preventable_fullscreen`ショートカット（全25個）
  - タブ切り替え: Ctrl+1〜9
  - タブ操作: Ctrl+T（新規タブ）、Ctrl+W（閉じる）、Ctrl+N（新規ウィンドウ）
  - ナビゲーション: Ctrl+Tab、Ctrl+PageUp/Down
  - その他: Ctrl+Shift+N（シークレット）、Alt+Shift+B/I など

**表示形式**:
- 🟡 黄色の左ボーダーでブラウザ競合を視覚的に区別
- コンパクト表示（説明文と難易度バッジを非表示）
- キーボード配列順での並び替え
- 専用セクション「⚠️ ブラウザショートカット競合」に集約表示

**インテリジェントフィルタリング**:
- Win/Cmdキーを含む組み合わせは除外（OSレベルのショートカット）
- Win+Ctrl+1 などは「全画面で防げる」カテゴリとして正しく分類
- Chrome アプリ選択時は競合警告を非表示

## 🐛 バグ修正

### macOS でのキーボード入力の問題を修正

**問題**:
- キーボード押下後も押された状態と認識される
- 複数修飾キーを押してもショートカット候補が表示されない

**修正内容**:
1. **修飾キーの表示名を統一** (`keyMapping.ts`)
   - macOS環境でも修飾キーを英語名（Ctrl, Shift, Alt）で返すように変更
   - データベースのショートカット定義と一致させることで比較を正常化

2. **キーステート管理の最適化** (`useKeyStates.ts`)
   - コールバック関数をRefで保持し、不要なイベントリスナー再登録を防止
   - `visibilitychange`イベントを追加し、タブ切り替え時にキー状態をクリア
   - `useEffect`依存配列を最適化（`clearKeys`と`isDisabled`のみ）

3. **Chrome ショートカットの自動ロード** (`NormalModeView.tsx`)
   - Chrome以外のアプリ選択時に、自動的にChromeのショートカットも読み込み
   - ブラウザ競合検出に必要なデータを事前取得

## 🎨 UI/UX改善

### ShortcutCard コンパクトモード追加

- 新しい`compact`プロップを追加
- ブラウザ競合表示専用の省スペースレイアウト
- パディング削減（8px 10px → 6px 8px）

### 多言語対応強化

新しい翻訳キーを追加:
- `browserConflictWarning`: ブラウザショートカット競合
- `browserConflictDescription`: 競合の説明文
- 英語・日本語の両言語で完全対応

## 🔧 技術的改善

### 新規追加ファイル

- `getBrowserConflictShortcuts()`: ブラウザ競合ショートカットを検出する関数
- `scripts/check-chrome-preventable-shortcuts.ts`: Chrome の preventable_fullscreen ショートカットを確認するスクリプト
- `scripts/check-apps.ts`: データベースのアプリケーション一覧を確認するスクリプト

### 主な変更ファイル

**フック**:
- `useKeyboardShortcuts.ts`: `allRichShortcuts`パラメータ追加、`browserConflicts`を返すように拡張
- `useShortcutDetection.ts`: ブラウザ競合検出ロジックを統合
- `useKeyStates.ts`: パフォーマンス最適化とmacOS対応

**コンポーネント**:
- `ShortcutCard.tsx`: `compact`プロップ追加、ブラウザ競合判定ロジック改善
- `ShortcutsList.tsx`: ブラウザ競合セクションの表示ロジック追加
- `NormalModeView.tsx`: Chrome ショートカット自動ロード

**ユーティリティ**:
- `keyboard.ts`: `getBrowserConflictShortcuts()`関数追加、キーボード順ソート実装
- `keyMapping.ts`: macOS修飾キー表示名を統一（記号 → 英語名）

## 📊 統計

- 変更ファイル数: 13
- 新規ファイル数: 3
- 新規関数: 1
- バグ修正: 2（macOS関連）
- 新機能: 1（ブラウザ競合警告）

## 🚀 次のステップ

今後のリリースで予定している機能:
- カスタムショートカット登録機能
- ショートカット競合の詳細分析レポート
- 学習進捗のエクスポート機能

---

**アップグレード方法**:
```bash
git pull origin main
npm install
npm run build
```

**Breaking Changes**: なし

**互換性**: すべての既存機能は引き続き動作します
