# ⌨️ Keyboard Visualizer

**アプリケーション別のキーボードショートカットをリアルタイムで視覚化し、クイズ形式でマスターできるWebアプリケーション**

1,300以上のショートカットデータを Supabase で管理し、タイピング体験を通じて効率的な学習をサポートします。

[![GitHub Pages](https://img.shields.io/badge/demo-live-success)](https://nishis2rp.github.io/keyboard-visualizer/)
[![React](https://img.shields.io/badge/React-18.3-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E)](https://supabase.com/)
[![Docker](https://img.shields.io/badge/Docker-Supported-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)

🔗 **Live Demo**: [https://nishis2rp.github.io/keyboard-visualizer/](https://nishis2rp.github.io/keyboard-visualizer/)

---

## 🚀 プロジェクト概要

Keyboard Visualizer は、キーボード入力を即座に画面上の仮想キーボードへ反映し、各アプリケーション（VS Code, Excel, Chrome等）で利用可能なショートカットを学習できるツールです。

- **ランディングページ**: Canvas API による動的な幾何学背景とグラスモーフィズムを採用した洗練された導入画面。
- **ビジュアライザーモード**: 修飾キーに応じたショートカット候補の動的表示。
- **クイズモード**: 順押し（Sequential）を含む複雑なショートカットの対話的学習。
- **マイページ**: プレイ履歴に基づいた「苦手なショートカット」の分析と統計の可視化。

## 🛠 技術スタック

- **Frontend**: React 18.3, TypeScript 5.9, Vite 5.4, React Context API
- **Backend**: Supabase (PostgreSQL, Auth, RLS)
- **Styling**: CSS Modules, Global CSS, Tailwind CSS 4.1 (PostCSS)
- **Infrastructure**: Docker, Nginx, GitHub Actions (CI/CD)
- **Testing**: Vitest

## 🧠 コアコンセプト

### 1. 保護レベル (Protection Levels)
システムとブラウザの競合を考慮し、データベースレベルで3段階の保護レベルを管理しています。
- `fullscreen-preventable`: 全画面モードでキャプチャ可能なショートカット（例: Win+Tab）。
- `always-protected`: OSによって予約されており、ブラウザではキャプチャできないもの（例: Cmd+Tab）。
- OS別設定: Windows/macOS ごとに個別の保護フラグを保持。

### 2. 難易度体系 (Difficulty)
- 🌟 **Basic**: 日常的な基本操作（Ctrl+C, Ctrl+V 等）。
- ⚡ **Standard**: 標準的なショートカット。
- 🔥 **Hard**: 3キー以上の組み合わせや、専門的な機能。
- 💀 **Madmax**: 複雑な順押しナビゲーションや、マクロ、VBA操作。

### 3. 入力判定エンジン
`useKeyboardShortcuts` フックと `quizEngine.ts` が以下の入力を高度に判定します。
- **同時押し**: `Ctrl + Shift + P` 等。
- **順押し (Sequential)**: `Alt -> H -> O -> I` 等のシーケンス入力をリアルタイムで追跡。
- **代替キー対応**: `Ctrl + C` と `Ctrl + Insert` を同一アクションとして認識。

### 4. 全画面モードと Keyboard Lock API
Keyboard Lock API を使用して、システムショートカットの競合を最小限に抑えます。全画面モード時には、通常ブラウザに奪われるキー（Winキー等）の入力を取得可能です。

### 5. マイページ改善 (2026年2月)
学習データを詳細に分析し、ユーザーの成長を可視化します。
- **StatCards**: 総回答数、正解率、最長連続正解数などのサマリー。
- **WeakShortcuts**: `quiz_history` から正解率の低い項目を自動抽出し、重点的な復習を促す。
- **AppStatsTable**: アプリケーション別の習熟度チャート。
- **RecentSessions**: 過去のプレイ履歴と詳細な正誤ログ。

## 📂 ディレクトリ構造 (Master Index)

```text
src/
├── components/          # UIコンポーネント
│   ├── AppHeader/       # ヘッダー・タイトル
│   ├── MyPage/          # 統計・分析ダッシュボード
│   └── KeyboardLayout/  # 仮想キーボード表示ロジック
├── context/             # 状態管理 (Auth, Quiz, Settings, Shortcut, UI)
├── hooks/               # カスタムフック (useKeyboardShortcuts, useShortcuts 等)
├── utils/               # ユーティリティ (quizEngine, aiOptimization, fullscreen)
├── constants/           # 定数 (keys.ts: 物理キーマッピング)
└── types/               # TypeScript 型定義 (src/types/index.ts)
supabase/
└── migrations/          # SQL マイグレーション (Source of Truth)
scripts/                 # DBメンテナンス・データ調整スクリプト
```

## ⚙️ 主要スクリプト (package.json)

| コマンド | 内容 |
| :--- | :--- |
| `npm run dev` | 開発サーバーの起動 |
| `npm run build` | プロダクションビルド |
| `npm run test` | Vitest によるテスト実行 |
| `npm run db:migrate` | 新しいマイグレーションファイルの作成 |
| `npm run db:run-migration` | データベースへのマイグレーション適用 |
| `npm run db:export-csv` | ショートカットデータのバックアップエクスポート |

## 🔄 開発ワークフロー

1. **環境構築**: `npm install` または `docker-compose up`。
2. **データ管理**: ショートカットの追加・変更は `supabase/migrations` を通じて行い、`scripts/` のツールで整合性を確認。
3. **テスト**: 判定ロジックの変更時は `npm test` を実行。
4. **デプロイ**: `main` ブランチへの Push により GitHub Actions が起動。

## 🤖 AI 推論ルール (開発者向け)

このプロジェクトを AI (Cursor/Gemini 等) で編集する際のルールです。
1. **命名規則**: コンポーネントは `PascalCase`、フックとユーティリティは `camelCase`。
2. **型安全**: `src/types/index.ts` を厳守し、`any` の使用を禁止。
3. **ロジックの配置**:
   - グローバル状態は `Context`。
   - 複雑なロジックは `Hooks`。
   - UI 表示は `Components` (CSS Modules 使用)。
4. **パフォーマンス**: アニメーションは `useAdaptivePerformance` が管理する `--animation-speed` 変数を使用すること。

---

## 🍏 macOS使用時の注意事項

macOSでは一部のシステムショートカット（`Cmd + Space` 等）をWebから完全には制御できません。
- **対策**: 右上の「⛶ 全画面モード」を使用し、Keyboard Lock API を有効にしてください。
- **設定**: システム設定で「F1、F2などのキーを標準のファンクションキーとして使用」をオンにすることを推奨します。

---

**Made with ❤️ and ⌨️**
