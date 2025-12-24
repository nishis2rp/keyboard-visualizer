# キーボードビジュアライザー

キーボードのショートカットをリアルタイムで視覚的に表示するReactアプリケーションです。

## 機能

- リアルタイムでキーボード入力を表示
- 複数キーの同時押しに対応
- ショートカット履歴の記録（最大10件）
- クリップボードへのコピー機能
- 特殊キー（Ctrl、Shift、Alt等）の視覚的な区別

## セットアップ

```bash
# 依存パッケージのインストール
npm install

# 開発サーバーの起動
npm run dev

# ビルド
npm run build

# プレビュー
npm run preview
```

## 使い方

1. 開発サーバーを起動（`npm run dev`）
2. ブラウザで表示されたURLにアクセス
3. キーボードを押すと画面に表示されます
4. 複数のキーを同時に押すと組み合わせが表示されます

## 技術スタック

- React 18
- Vite
- CSS3 (アニメーション)

## ディレクトリ構造

```
keyboard-visualizer/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── KeyDisplay.jsx
│   │   └── HistoryList.jsx
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── package.json
├── vite.config.js
└── README.md
```
