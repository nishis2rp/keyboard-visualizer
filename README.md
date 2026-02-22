# ⌨️ Keyboard Visualizer

**アプリケーション別のキーボードショートカットをリアルタイムで視覚化し、クイズ形式でマスターできるWebアプリケーション**

1,300以上のショートカットデータを Supabase で管理し、タイピング体験を通じて効率的な学習をサポートします。

[![Version](https://img.shields.io/badge/version-3.24.0-blue)](https://github.com/nishis2rp/keyboard-visualizer)
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

### 主な機能

- **✨ ランディングページ**: Canvas API による動的な幾何学背景とグラスモーフィズムを採用した洗練された導入画面
- **⌨️ ビジュアライザーモード**: 修飾キーに応じたショートカット候補の動的表示
- **⚠️ ブラウザ競合警告**: Chrome以外のアプリ使用時に競合するブラウザショートカットを自動検出・表示
- **🎯 クイズモード**: 順押し（Sequential）を含む複雑なショートカットの対話的学習
- **📊 マイページ**: プレイ履歴に基づいた「苦手なショートカット」の分析と統計の可視化
- **👥 ユーザー認証**: Google、GitHub、メール/パスワードによる学習履歴の保存
- **💬 ソーシャルプルーフ**: 実際のユーザーの声を掲載した信頼性の高いUI
- **🌐 SEO最適化**: 動的メタタグ管理と多言語対応（英語/日本語）による国際的なリーチ向上
- **🎨 高解像度対応**: 1500px以上の高解像度ディスプレイでも美しく表示されるレスポンシブデザイン

## 🛠 技術スタック

- **Frontend**: React 18.3, TypeScript 5.9, Vite 5.4, React Context API
- **Backend**: Supabase (PostgreSQL, Auth, RLS)
- **Styling**: CSS Modules, Global CSS, Tailwind CSS 4.1 (PostCSS)
- **Infrastructure**: Docker, Nginx, GitHub Actions (CI/CD)
- **Testing**: Vitest

## 🧠 コアコンセプト

### 1. 保護レベル (Protection Levels)
システムとブラウザの競合を考慮し、データベースレベルで3段階の保護レベルを管理しています。
- `preventable_fullscreen`: 全画面モードでキャプチャ可能なショートカット（例: Ctrl+T, Win+Tab）。ブラウザ競合検出の対象。
- `always-protected`: OSによって予約されており、ブラウザではキャプチャできないもの（例: Alt+F4, Cmd+Q）。
- `browser-conflict`: Chrome以外のアプリ使用時に、Chromeのショートカットと競合する可能性があるもの（例: Ctrl+1〜9）を自動検出して警告表示。
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
keyboard-visualizer/
├── public/                          # 静的アセット
│   ├── icons/                       # アプリアイコン (PWA対応)
│   ├── keyboard.svg                 # キーボードアイコン
│   ├── manifest.json                # PWAマニフェスト
│   ├── robots.txt                   # SEO設定
│   ├── sitemap.xml                  # サイトマップ
│   └── service-worker.js            # PWAサービスワーカー
│
├── src/
│   ├── components/                  # UIコンポーネント
│   │   ├── AppHeader/               # ヘッダー・タイトル・ナビゲーション
│   │   ├── AppSelector/             # アプリケーション選択セレクター
│   │   ├── Auth/                    # 認証関連コンポーネント
│   │   │   ├── AuthModal.tsx        # ログイン/サインアップモーダル
│   │   │   └── UserMenu.tsx         # ユーザーメニュードロップダウン
│   │   ├── common/                  # 共通UIコンポーネント
│   │   │   ├── AppIcon.tsx          # アプリケーションアイコン
│   │   │   ├── HeaderLogo.tsx       # ヘッダーロゴ
│   │   │   ├── SEO.tsx              # SEOメタタグ管理コンポーネント
│   │   │   ├── Selector.tsx         # セレクター共通コンポーネント
│   │   │   └── StyledButton.tsx     # スタイル付きボタン
│   │   ├── DifficultyFilter/        # 難易度フィルターコンポーネント
│   │   ├── KeyboardLayout/          # 仮想キーボード表示
│   │   ├── KeyboardLayoutSelector/  # キーボードレイアウト選択
│   │   ├── KeyDisplay/              # キー表示とショートカットリスト
│   │   │   ├── KeyDisplay.tsx       # メインキー表示コンポーネント
│   │   │   ├── PressedKeysIndicator.tsx  # 押下キーインジケーター
│   │   │   └── ShortcutsList.tsx    # ショートカット一覧表示
│   │   ├── LanguageSelector/        # 言語切り替えセレクター
│   │   ├── MyPage/                  # マイページ・統計ダッシュボード
│   │   │   ├── AccountSettings.tsx  # アカウント設定 (メール変更、パスワード変更、アカウント削除)
│   │   │   ├── AppPerformanceChart.tsx  # アプリ別パフォーマンスチャート
│   │   │   ├── AppStatsTable.tsx    # アプリ別統計テーブル
│   │   │   ├── ProfileSection.tsx   # プロフィールセクション
│   │   │   ├── RecentSessions.tsx   # 最近のクイズセッション履歴
│   │   │   ├── StatCards.tsx        # 統計カード (正解率、総問題数等)
│   │   │   └── WeakShortcuts.tsx    # 苦手なショートカット分析
│   │   ├── Quiz/                    # クイズモード関連コンポーネント
│   │   │   ├── QuestionCard.tsx     # クイズ問題カード
│   │   │   ├── QuizProgressBar.tsx  # クイズ進捗バー
│   │   │   ├── ResultModal.tsx      # 結果表示モーダル
│   │   │   ├── ScoreBoard.tsx       # スコアボード
│   │   │   └── SmartHint.tsx        # スマートヒント表示
│   │   ├── SetupScreen/             # 初期設定画面
│   │   ├── ShortcutCard/            # ショートカットカード表示
│   │   ├── SystemShortcutWarning/   # システムショートカット警告表示
│   │   ├── ErrorBoundary.tsx        # エラーバウンダリー
│   │   ├── NormalModeView.tsx       # 通常モードビュー
│   │   ├── QuizModeView.tsx         # クイズモードビュー
│   │   └── SessionDetailModal.tsx   # セッション詳細モーダル
│   │
│   ├── context/                     # グローバル状態管理 (Context API)
│   │   ├── AuthContext.tsx          # 認証状態管理 (Supabase Auth)
│   │   ├── LanguageContext.tsx      # 多言語対応状態管理
│   │   ├── QuizContext.tsx          # クイズ状態管理
│   │   ├── QuizReducer.ts           # クイズステートリデューサー
│   │   ├── SettingsContext.tsx      # 設定状態管理
│   │   ├── ShortcutContext.tsx      # ショートカットデータ状態管理 (旧版)
│   │   ├── UIContext.tsx            # UI状態管理
│   │   └── index.ts                 # Context エクスポート
│   │
│   ├── hooks/                       # カスタムフック
│   │   ├── useAdaptivePerformance.ts  # アダプティブパフォーマンス最適化
│   │   ├── useFullscreen.ts         # 全画面モード制御
│   │   ├── useKeyboardShortcuts.ts  # キーボード入力検出・ショートカットマッチング
│   │   ├── useLocalizedData.ts      # ローカライズデータ取得
│   │   ├── useLocalStorage.ts       # ローカルストレージ永続化
│   │   ├── useQuizInputHandler.ts   # クイズ入力ハンドリング
│   │   ├── useQuizProgress.ts       # クイズ進捗・履歴管理 (Supabase連携)
│   │   ├── useShortcuts.ts          # ショートカットデータ取得 (Supabase)
│   │   └── index.ts                 # Hooks エクスポート
│   │
│   ├── utils/                       # ユーティリティ関数
│   │   ├── aiOptimization.ts        # AI最適化ユーティリティ
│   │   ├── analytics.ts             # アナリティクス関数
│   │   ├── authErrors.ts            # 認証エラーメッセージマッピング
│   │   ├── authErrors.test.ts       # 認証エラーテスト
│   │   ├── csvExport.ts             # CSVエクスポート機能
│   │   ├── fullscreen.ts            # 全画面モード・Keyboard Lock API
│   │   ├── i18n.ts                  # 国際化ヘルパー
│   │   ├── keyboard.ts              # キーボード処理ユーティリティ
│   │   ├── keyMapping.ts            # 物理キーコードとキー名のマッピング
│   │   ├── keyUtils.ts              # キー関連ユーティリティ
│   │   ├── os.ts                    # OS検出ユーティリティ
│   │   ├── quizEngine.ts            # クイズエンジン (判定ロジック、正規化)
│   │   ├── sequentialShortcuts.ts   # 順押しショートカット処理
│   │   ├── shortcutUtils.ts         # ショートカット関連ユーティリティ
│   │   ├── validation.ts            # バリデーション (パスワード強度、メール検証)
│   │   └── index.ts                 # Utils エクスポート
│   │
│   ├── constants/                   # 定数定義
│   │   ├── alternativeShortcuts.ts  # 代替ショートカット定義
│   │   ├── app.ts                   # アプリケーション定義 (旧版、現在はDB管理)
│   │   ├── categoryTranslations.ts  # カテゴリ翻訳
│   │   ├── descriptionTranslations.ts  # 説明文翻訳
│   │   ├── icons.ts                 # アイコン定義
│   │   ├── keys.ts                  # 物理キーマッピング
│   │   ├── releases.ts              # リリースノート定義
│   │   ├── setup.ts                 # セットアップ定数
│   │   ├── systemProtectedShortcuts.ts  # システム保護ショートカット (旧版)
│   │   └── index.ts                 # Constants エクスポート
│   │
│   ├── data/                        # データファイル
│   │   └── layouts/                 # キーボードレイアウトデータ
│   │       ├── macJis.ts            # Mac JISレイアウト
│   │       ├── macUs.ts             # Mac USレイアウト
│   │       ├── windowsJis.ts        # Windows JISレイアウト
│   │       ├── windowsUs.ts         # Windows USレイアウト
│   │       └── index.ts             # Layouts エクスポート
│   │
│   ├── config/                      # 設定ファイル
│   │   └── index.ts                 # アプリケーション設定
│   │
│   ├── lib/                         # 外部ライブラリ設定
│   │   └── supabase.ts              # Supabase クライアント初期化
│   │
│   ├── locales/                     # 多言語対応翻訳ファイル
│   │   ├── en.ts                    # 英語翻訳
│   │   ├── ja.ts                    # 日本語翻訳
│   │   └── index.ts                 # Locales エクスポート
│   │
│   ├── pages/                       # ページコンポーネント
│   │   ├── Home.tsx                 # ホームページ
│   │   ├── LandingPage.tsx          # ランディングページ
│   │   ├── MyPage.tsx               # マイページ
│   │   ├── PasswordReset.tsx        # パスワードリセットページ
│   │   └── ReleaseNotes.tsx         # リリースノートページ
│   │
│   ├── styles/                      # スタイルシート
│   │   ├── animations.css           # アニメーション定義
│   │   ├── components.css           # コンポーネントスタイル
│   │   ├── global.css               # グローバルスタイル
│   │   ├── keyboard.css             # キーボードスタイル
│   │   ├── quiz.css                 # クイズスタイル
│   │   ├── tailwind.css             # Tailwind CSS設定
│   │   ├── variables.css            # CSS変数定義
│   │   └── index.ts                 # Styles エクスポート
│   │
│   ├── tests/                       # テストファイル
│   │   ├── quizEngine.test.ts       # クイズエンジンテスト
│   │   ├── sequentialShortcuts.test.ts  # 順押しショートカットテスト
│   │   └── setup.ts                 # テストセットアップ
│   │
│   ├── types/                       # TypeScript型定義
│   │   └── index.ts                 # 型定義エクスポート
│   │
│   ├── App.tsx                      # メインAppコンポーネント
│   ├── main.tsx                     # エントリーポイント
│   ├── custom.d.ts                  # カスタム型定義
│   └── vite-env.d.ts                # Vite環境変数型定義
│
├── supabase/                        # Supabaseデータベース管理
│   └── migrations/                  # SQLマイグレーションファイル (Source of Truth)
│       ├── 001_create_shortcuts_table.sql
│       ├── 002_insert_data.sql
│       ├── ...
│       └── 045_create_applications_table.sql
│
├── scripts/                         # データベース・メンテナンススクリプト
│   ├── archive/                     # アーカイブされたスクリプト
│   ├── lib/                         # スクリプト共通ライブラリ
│   ├── check-categories.ts          # カテゴリ整合性チェック
│   ├── check-english-descriptions.ts  # 英語説明チェック
│   ├── export-shortcuts-csv.ts      # ショートカットCSVエクスポート
│   ├── generate-sql.ts              # SQLファイル生成
│   ├── list-shortcuts.ts            # ショートカット一覧表示
│   ├── migrate-supabase.ts          # Supabaseマイグレーション実行
│   ├── populate-english-data-pg.ts  # 英語データ投入
│   ├── run-migration.ts             # マイグレーション実行
│   ├── run-single-migration.ts      # 単一マイグレーション実行
│   ├── update-sort-order.ts         # ソート順更新
│   └── README.md                    # スクリプト説明書
│
├── .github/                         # GitHub Actions CI/CD設定
│   └── workflows/
│       └── deploy.yml               # デプロイワークフロー
│
├── docker-compose.yml               # Docker開発環境設定
├── docker-compose.prod.yml          # Docker本番環境設定
├── Dockerfile                       # Dockerイメージビルド設定
├── nginx.conf                       # Nginx設定 (本番環境)
│
├── vite.config.ts                   # Vite設定ファイル
├── tsconfig.json                    # TypeScript設定
├── tsconfig.node.json               # TypeScript Node.js設定
├── tsconfig.scripts.json            # TypeScript スクリプト設定
├── postcss.config.js                # PostCSS設定 (Tailwind CSS v4)
├── package.json                     # npm依存関係・スクリプト定義
├── index.html                       # HTMLエントリーポイント
│
├── README.md                        # プロジェクト説明 (このファイル)
├── CLAUDE.md                        # Claude Code用プロジェクトガイド
├── AUTH_SETUP.md                    # 認証セットアップガイド
├── DEPLOY.md                        # デプロイメントガイド
├── DOCKER.md                        # Docker使用ガイド
└── GEMINI.md                        # Gemini AI用ガイド
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
