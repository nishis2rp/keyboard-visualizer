# ⌨️ キーボードビジュアライザー
URL https://nishis2rp.github.io/keyboard-visualizer/
アプリケーション別のキーボードショートカットをリアルタイムで視覚的に表示するReactアプリケーションです。

![GitHub Pages](https://img.shields.io/badge/demo-live-success)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![Vite](https://img.shields.io/badge/Vite-5.4.11-646CFF)

## 🌟 主な機能

### キーボード入力の可視化
- **リアルタイム表示**: キーボード入力をリアルタイムで視覚的に表示
- **複数キー同時押し対応**: Ctrl+Shift+Aなどの組み合わせキーに完全対応
- **特殊キーの区別**: 修飾キー（Ctrl、Shift、Alt、Win/Meta）を視覚的に強調表示

### アプリケーション別ショートカット対応
対応アプリケーション：
- **Windows 11**: システムレベルのショートカット（Win+X、Win+L等）
- **macOS**: macOS固有のショートカット（Cmd+Space、Cmd+Tab等）
- **Chrome**: ブラウザショートカット（Ctrl+T、Ctrl+W等）
- **Excel**: スプレッドシート操作（Ctrl+C、Alt+E+S等）
- **Slack**: チャットアプリケーション（Ctrl+K、Ctrl+/等）
- **Gmail**: メール操作（c、e、r等の単独キーショートカット）

### キーボード配列切り替え
- **Windows JIS配列**: 日本語キーボード（106/109キー）
- **Windows US配列**: 英語キーボード（101/104キー）
- **Mac JIS配列**: Mac日本語キーボード
- **Mac US配列**: Mac英語キーボード

### 全画面モード & Keyboard Lock API
- **全画面モード**: ショートカットキーの競合を軽減
- **Keyboard Lock API**: ブラウザレベルでキーをキャプチャ（Win+Tabなども取得可能）
- **システム保護ショートカット表示**: OS保護のため取得不可のショートカットを🔒マークと赤色で表示（Win+L、Ctrl+Alt+Delete等）

### インテリジェントなショートカット表示
- **利用可能なショートカット一覧**: 修飾キーを押すと、続けて押せるショートカット候補を表示
- **優先順位付きソート**: 修飾キー数 → ファンクションキー → 数字キー → QWERTY順で整列
- **単独キーショートカット**: Gmailなど単独キーで操作できるアプリでは、初期状態で利用可能なキーを一覧表示

## 🚀 クイックスタート

```bash
# 依存パッケージのインストール
npm install

# 開発サーバーの起動（ホットリロード対応）
npm run dev

# プロダクションビルド
npm run build

# プレビュー（ビルド後の動作確認）
npm run preview

# GitHub Pagesへデプロイ
npm run deploy
```

## 💻 使い方

1. **開発サーバーを起動**
   ```bash
   npm run dev
   ```
   ブラウザで `http://localhost:5173/keyboard-visualizer/` にアクセス

2. **アプリケーションを選択**
   画面上部のタブから使用したいアプリケーション（Windows 11、Chrome、Gmail等）を選択

3. **キーボード配列を選択**
   使用しているキーボードレイアウト（Windows JIS、Mac US等）を選択

4. **キーを押す**
   - キーを押すと画面にリアルタイムで表示されます
   - 対応するショートカットがあれば、その説明が表示されます
   - 修飾キー（Ctrl、Shift等）を押すと、利用可能なショートカット候補が表示されます

5. **全画面モードを活用（推奨）**
   右上の「⛶ 全画面モード」ボタンをクリック
   - ブラウザのショートカット競合（Ctrl+W、Ctrl+T等）を回避
   - Keyboard Lock APIによりWin+Tab等もキャプチャ可能
   - ※Win+L（ロック）等のシステム保護ショートカットは取得不可

## 🏗️ 技術スタック

- **React 18.3.1** - UIライブラリ
- **Vite 5.4.11** - ビルドツール & 開発サーバー
- **PropTypes** - 型チェック
- **Keyboard Lock API** - 全画面モード時のキーボードイベントキャプチャ
- **Fullscreen API** - 全画面表示機能
- **CSS3** - アニメーション & グラデーション効果

## 📁 プロジェクト構造

```
keyboard-visualizer/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions自動デプロイ設定
├── public/                     # 静的アセット
├── src/
│   ├── components/             # Reactコンポーネント
│   │   ├── AppHeader/          # ヘッダー（タイトル+全画面ボタン）
│   │   ├── AppSelector/        # アプリケーション選択UI
│   │   ├── KeyboardLayoutSelector/  # キーボード配列選択UI
│   │   ├── KeyDisplay/         # キー表示とショートカット候補
│   │   ├── KeyboardLayout/     # キーボードレイアウト表示
│   │   └── ShortcutCard/       # ショートカットカード（個別表示）
│   ├── config/                 # 設定ファイル
│   │   ├── apps.js             # アプリケーション定義
│   │   ├── keyboards.js        # キーボード配列定義
│   │   └── index.js
│   ├── constants/              # 定数定義
│   │   ├── keys.js             # 特殊キー定義
│   │   ├── systemProtectedShortcuts.js  # システム保護ショートカット
│   │   └── index.js
│   ├── data/                   # データファイル
│   │   ├── layouts/            # キーボードレイアウトデータ
│   │   │   ├── windowsJis.js
│   │   │   ├── macJis.js
│   │   │   └── ...
│   │   └── shortcuts/          # アプリケーション別ショートカット
│   │       ├── windows11.js
│   │       ├── gmail.js
│   │       └── ...
│   ├── hooks/                  # カスタムフック
│   │   ├── useKeyboardShortcuts.js  # キーボード入力管理
│   │   └── index.js
│   ├── styles/                 # スタイル
│   │   └── global.css
│   ├── utils/                  # ユーティリティ関数
│   │   ├── fullscreen.js       # 全画面モード制御
│   │   ├── keyboard.js         # キーボード処理ロジック
│   │   └── index.js
│   ├── App.jsx                 # ルートコンポーネント
│   └── main.jsx                # エントリーポイント
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🎨 設計の特徴

### コンポーネント設計
- **関心の分離**: 各コンポーネントが単一の責務を持つ設計
- **React Hooks活用**: useState、useMemo、useCallbackで最適化
- **PropTypes**: 型安全性の確保
- **memo最適化**: 不要な再レンダリングを防止

### ユーザビリティ
- **インテリジェントなソート**: ショートカット候補を使いやすい順序で表示
- **視覚的フィードバック**: アクティブなキー、システム保護ショートカットを色分け
- **レスポンシブデザイン**: 様々な画面サイズに対応

### パフォーマンス
- **効率的なレンダリング**: useMemoとuseCallbackによるメモ化
- **Set/Mapデータ構造**: 高速な検索とマッチング
- **Vite HMR**: 開発時の高速なホットリロード

## 🔧 カスタマイズ

### 新しいアプリケーションの追加

1. `src/data/shortcuts/`に新しいファイルを作成：
```javascript
// src/data/shortcuts/myapp.js
export const myappShortcuts = {
  'Ctrl + N': '新規作成',
  'Ctrl + S': '保存',
  // ...
}
```

2. `src/data/shortcuts/index.js`に追加：
```javascript
export { myappShortcuts } from './myapp'

export const allShortcuts = {
  // ...
  myapp: myappShortcuts,
}
```

3. `src/config/apps.js`に追加：
```javascript
export const apps = [
  // ...
  { id: 'myapp', name: 'My App', icon: '🚀' },
]
```

### キーボードレイアウトの追加

同様に`src/data/layouts/`と`src/config/keyboards.js`を編集してください。

## 🚢 デプロイ

### GitHub Pages（自動デプロイ設定済み）

mainブランチにpushすると自動的にGitHub Pagesにデプロイされます。

手動デプロイ：
```bash
npm run deploy
```

## 📝 ライセンス

MIT License

## 🙏 謝辞

このプロジェクトは以下の技術を活用しています：
- React Team - UIライブラリ
- Vite Team - 高速ビルドツール
- MDNウェブドキュメント - Keyboard Lock API / Fullscreen APIリファレンス
