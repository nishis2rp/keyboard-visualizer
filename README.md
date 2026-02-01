# ⌨️ Keyboard Visualizer

**アプリケーション別のキーボードショートカットをリアルタイムで視覚的に表示し、クイズで学習できるWebアプリケーション**

バックエンドに **Supabase (PostgreSQL)** を使用し、1,146個以上のショートカットデータを動的に管理・提供しています。

[![GitHub Pages](https://img.shields.io/badge/demo-live-success)](https://nishis2rp.github.io/keyboard-visualizer/)
[![React](https://img.shields.io/badge/React-18.3.1-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E)](https://supabase.com/)
[![Docker](https://img.shields.io/badge/Docker-Supported-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

🔗 **Live Demo**: https://nishis2rp.github.io/keyboard-visualizer/

---

## ✨ 主な機能

### 🎹 キーボード入力の可視化
- **リアルタイム表示**: キーボード入力をリアルタイムで視覚的に表示
- **複数キー同時押し対応**: `Ctrl+Shift+A` などの組み合わせキーに完全対応
- **特殊キーの区別**: 修飾キー（Ctrl、Shift、Alt、Win/Meta）を視覚的に強調表示
- **順押し・同時押しの判別**: ショートカットの入力方法を自動検出
- **柔軟なアプリケーション選択**: キーボードレイアウトとアプリケーションを個別に選択可能（ビジュアライザーモード）

### 📚 クイズモード（学習機能）
- **インタラクティブ学習**: ショートカットを実際に入力して学習
- **リアルタイム判定**: 正誤を即座にフィードバック
- **順押し途中経過表示**: 順押しショートカット（Alt + H + O + I など）の入力途中をリアルタイムで表示
  - 正解キーは緑、不正解キーは赤でハイライト
  - 矢印（→）でシーケンスを視覚的に表現
- **4段階の難易度**:
  - 🌟 **Basic** - よく使われる基本的なショートカットのみ出題
  - ⚡ **Standard** - すべてのショートカットからランダムに出題
  - 🔥 **Hard** - やや上級者向けショートカットを含む
  - 💀 **MadMax** - あまり使わない上級者向けショートカットのみ出題
- **スコア追跡**: 正解率、回答速度、連続正解数を記録
- **詳細な統計**: 最速回答時間、平均速度などの詳細な分析
- **アプリ別学習**: 特定のアプリケーションのショートカットを集中的に練習
- **代替ショートカット対応**: 同じ処理を行う異なるショートカットも正解として認識（例: Ctrl+C / Ctrl+Insert）

### 🎯 対応アプリケーション (データはバックエンドサービスから動的に取得)

**総ショートカット数: 1,146個**

| アプリ | ショートカット数 | 難易度分布 | 特徴 |
|--------|-----------------|-----------|------|
| **macOS** | 290 | Basic, Standard, Hard | macOS固有のショートカット（Cmd+Space、Mission Controlなど） |
| **VS Code** | 279 | Basic~Madmax | 開発エディタ - 全難易度対応、編集、ナビゲーション、デバッグ、Git操作 |
| **Excel** | 179 | Basic, Standard, Hard | スプレッドシート操作（ピボット、マクロ、VBAなど高度な機能含む） |
| **Windows 11** | 151 | Basic, Standard, Hard | システムレベルショートカット（Win+X、仮想デスクトップなど） |
| **Chrome** | 91 | Basic, Standard, Hard | ブラウザショートカット（デベロッパーツール含む） |
| **Gmail** | 82 | Basic, Standard, Hard | メール操作（フィルタ、高度な検索など） |
| **Slack** | 74 | Basic, Standard, Hard | チャットアプリ（ワークスペース管理含む） |

**難易度分布（全体）:**
- 🌟 Basic: 約200個 (20-25%) - 日常的に使う基本操作
- ⚡ Standard: 約600個 (50-60%) - 標準的なショートカット
- 🔥 Hard: 約200個 (20-25%) - 高度な機能・専門的な操作
- 💀 Madmax: 64個 (5-6%) - VS Code専用、最上級者向け

### ⌨️ キーボード配列対応

- **Windows JIS配列** - 日本語キーボード（106/109キー）
- **Windows US配列** - 英語キーボード（101/104キー）
- **Mac JIS配列** - Mac日本語キーボード
- **Mac US配列** - Mac英語キーボード

### 🔒 全画面モード & セキュリティ

- **全画面モード**: ショートカットキーの競合を軽減
- **Keyboard Lock API**: ブラウザレベルでキーをキャプチャ（Win+Tabなども取得可能）
- **データベース駆動の保護レベル管理**:
  - 各ショートカットの保護レベルをデータベースで一元管理
  - Windows/macOS別の保護レベルを自動判定
  - 🔵 全画面表示で防げるショートカット（`fullscreen-preventable`）
  - 🔒 システム保護で防げないショートカット（`always-protected`）
  - OS固有の保護レベルに対応（Cmd+Tabなど）

### 💡 インテリジェントなショートカット表示

- **利用可能なショートカット一覧**: 修飾キーを押すと、続けて押せるショートカット候補を表示
- **優先順位付きソート**: 修飾キー数 → ファンクションキー → 数字キー → QWERTY順で整列
- **単独キーショートカット**: Gmail等で単独キーで操作できるショートカットを一覧表示
- **リアルタイム履歴**: 最近使用したショートカットの履歴を表示

### 🔐 ユーザー認証とデータ保存

- **オプショナルな認証**: アプリは未ログインでも完全に使用可能
- **メール/パスワード認証**: Supabase Authによる安全な認証システム
- **クイズ進捗の保存**: ログインユーザーのクイズセッション、スコア、回答履歴を自動保存
- **統計データの追跡**: 正解率、平均速度、総回答数などの詳細な学習データを記録
- **プロフィール管理**: 表示名とアバターのカスタマイズ
- **Row-Level Security (RLS)**: データベースレベルでのセキュリティ保護

---

## 🚀 クイックスタート

### 前提条件

- Node.js 18.0以上
- npm または yarn

### インストール

```bash
# リポジトリのクローン
git clone https://github.com/nishis2rp/keyboard-visualizer.git
cd keyboard-visualizer

# 依存パッケージのインストール
npm install
```

### 開発

#### ローカル環境

```bash
# 開発サーバーの起動（ホットリロード対応）
npm run dev

# TypeScript型チェック
npm run type-check

# テストの実行
npm test

# テストのウォッチモード
npm run test:watch
```

ブラウザで `http://localhost:5173/keyboard-visualizer/` にアクセス

#### Docker環境（推奨）

```bash
# Dockerコンテナで開発サーバーを起動
docker-compose up

# バックグラウンドで起動
docker-compose up -d
```

ブラウザで `http://localhost:5173` にアクセス

詳細は [DOCKER.md](DOCKER.md) を参照してください。

### ビルド & デプロイ

```bash
# プロダクションビルド
npm run build

# ビルド後のプレビュー
npm run preview

# GitHub Pagesへデプロイ
npm run deploy
```

---

## 💻 使い方

### 🔐 ユーザー認証（オプション）

アカウントを作成すると、クイズの進捗とスコアが自動的に保存されます。

1. **アカウント作成**
   - ヘッダーまたはセットアップ画面の「ログイン」ボタンをクリック
   - 「アカウント作成」タブを選択
   - 表示名、メールアドレス、パスワード（6文字以上）を入力
   - 確認メールが送信されるので、メール内のリンクをクリックして有効化

2. **ログイン**
   - 「ログイン」ボタンをクリック
   - メールアドレスとパスワードを入力

3. **プロフィール管理**
   - ログイン後、ヘッダーの表示名をクリック
   - 「ログアウト」でセッションを終了

**注意**: 認証は完全にオプションです。アプリはログインなしでも全機能を使用できます。

### 通常モード（ビジュアライザー）

1. **初回セットアップ**
   - **表示モード**: 全画面モード or ウィンドウモード を選択
   - **キーボードレイアウト**: Windows JIS / Mac JIS / Mac US から選択
   - **モード**: ビジュアライザーモード を選択
   - **アプリケーション**: Windows 11 / macOS / Chrome / VS Code / Excel / Slack / Gmail から選択

2. **キーを押す**
   - キーを押すと画面にリアルタイムで表示
   - 対応するショートカットがあれば説明が表示
   - 修飾キー（Ctrl、Shiftなど）を押すと利用可能なショートカット候補を表示

3. **全画面モードを活用（推奨）**
   - ブラウザのショートカット競合を回避
   - Keyboard Lock APIで Win+Tab などもキャプチャ可能

### クイズモード（学習モード）

1. **クイズモードに切り替え**
   - 初回セットアップ画面で「クイズモード」を選択
   - または、ヘッダーの「📝 クイズモード」ボタンをクリック

2. **出題設定**
   - **表示モード**: 全画面モード or ウィンドウモード（全画面推奨）
   - **キーボードレイアウト**: Windows JIS / Mac JIS / Mac US から選択
   - **モード**: クイズモード を選択
   - **難易度**: 学習レベルを選択
     - 🌟 Basic - 基本的なショートカットで練習
     - ⚡ Standard - 全てのショートカットでチャレンジ
     - 🔥 Hard - やや上級者向けショートカットを含む
     - 💀 MadMax - 上級者向けショートカットに挑戦
     - 🎲 All Range - 全難易度からランダム
   - **アプリケーション**: 学習したいアプリケーションを選択
     - 🎲 ランダム - すべてのアプリからランダムに出題
     - 個別アプリ - 特定のアプリのショートカットを集中学習（Windows 11 / macOS / Chrome / VS Code / Excel / Slack / Gmail）

3. **クイズに回答**
   - 画面に表示される問題文を読む
   - 正しいショートカットキーを押す
   - **順押しショートカットの場合**: 入力途中が画面に表示される（正解キーは緑、不正解は赤）
   - 正解/不正解が即座に表示される
   - 代替ショートカットも正解として認識（例: Ctrl+Insert でもコピーとして正解）
   - → または Enter キーで次の問題へ

4. **結果を確認**
   - スコアボードで正解率、平均速度を確認
   - 詳細な統計で最速回答、連続正解数などをチェック

---

## 🏗️ 技術スタック

### コア技術

- **React 18.3.1** - UIライブラリ
- **TypeScript 5.9** - 型安全性とコード品質の向上
- **Vite 5.4** - 高速ビルドツール & 開発サーバー
- **Supabase (PostgreSQL)** - バックエンドサービス
  - PostgreSQLデータベースによるショートカットデータの一元管理
  - リアルタイムデータ取得とマイグレーション管理
  - 1,146個以上のショートカット、保護レベル、難易度情報を管理
  - Supabase Auth - ユーザー認証とセッション管理
  - Row-Level Security (RLS) - データベースレベルのセキュリティ
- **Docker** - コンテナ化された開発環境
  - マルチステージビルドによる最適化
  - 開発・本番環境の一貫性確保
  - Nginxによる本番環境のサービング
- **Vitest** - 高速テストフレームワーク

### 主要API

- **Keyboard Lock API** - 全画面モード時のキーボードイベントキャプチャ
- **Fullscreen API** - 全画面表示機能
- **KeyboardEvent API** - キーボード入力の詳細な検出

### アーキテクチャ

- **Context API** - グローバル状態管理
- **Custom Hooks** - ロジックの再利用性向上
- **CSS Modules** - スコープ化されたスタイル
- **Memo最適化** - パフォーマンスの最適化

---

## 📁 プロジェクト構造

```
keyboard-visualizer/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions自動デプロイ設定
├── public/                         # 静的アセット
├── supabase/                       # Supabase関連ファイル
│   └── migrations/                 # データベースマイグレーション
├── src/
│   ├── components/                 # Reactコンポーネント
│   │   ├── common/                 # 共通コンポーネント
│   │   │   ├── Selector.tsx       # 汎用セレクター（リファクタリング済み）
│   │   │   └── StyledButton.tsx   # スタイル付きボタン
│   │   ├── Auth/                   # 認証関連コンポーネント
│   │   │   ├── AuthModal.tsx      # ログイン/サインアップモーダル
│   │   │   └── UserMenu.tsx       # ユーザーメニュー（プロフィール、ログアウト）
│   │   ├── Quiz/                   # クイズモード関連
│   │   │   ├── QuestionCard.tsx   # 問題カード
│   │   │   ├── ResultModal.tsx    # 結果表示モーダル
│   │   │   └── ScoreBoard.tsx     # スコアボード
│   │   ├── AppHeader/              # ヘッダーコンポーネント
│   │   ├── AppSelector/            # アプリケーション選択UI
│   │   ├── KeyboardLayoutSelector/ # キーボード配列選択UI
│   │   ├── KeyDisplay/             # キー表示とショートカット候補
│   │   ├── KeyboardLayout/         # キーボードレイアウト（パフォーマンス最適化済み）
│   │   ├── ShortcutCard/           # ショートカットカード
│   │   ├── NormalModeView.tsx      # 通常モード画面
│   │   └── QuizModeView.tsx        # クイズモード画面
│   ├── context/                    # Contextプロバイダー
│   │   ├── AppContext.tsx          # アプリケーション状態管理
│   │   ├── AuthContext.tsx         # 認証状態管理
│   │   └── QuizContext.tsx         # クイズ状態管理（reducer使用）
│   ├── config/                     # 設定ファイル
│   │   ├── apps.ts                 # アプリケーション定義
│   │   └── keyboards.ts            # キーボード配列定義
│   ├── constants/                  # 定数定義
│   │   ├── index.ts                # デフォルト設定
│   │   ├── alternativeShortcuts.ts # 代替ショートカットマッピング
│   │   ├── shortcutDifficulty.ts   # ショートカット難易度分類
│   │   └── systemProtectedShortcuts.ts  # システム保護ショートカット
│   ├── data/                       # データファイル
│   │   └── layouts/                # キーボードレイアウトデータ
│   │       ├── windowsJis.ts
│   │       ├── windowsUs.ts
│   │       ├── macJis.ts
│   │       ├── macUs.ts
│   │       └── index.ts
│   ├── lib/                        # ライブラリ、ユーティリティ
│   │   └── supabase.ts             # Supabaseクライアント初期化
│   ├── hooks/                      # カスタムフック
│   │   ├── useKeyboardShortcuts.ts # キーボード入力管理（リファクタリング済み）
│   │   ├── useLocalStorage.ts      # ローカルストレージ永続化
│   │   ├── useShortcuts.ts         # Supabaseからショートカットデータ取得
│   │   ├── useQuizProgress.ts      # クイズ進捗の保存と取得
│   │   └── index.ts
│   ├── styles/                     # スタイル
│   │   ├── global.css              # グローバルスタイル
│   │   ├── keyboard.css            # キーボードレイアウトスタイル
│   │   ├── quiz.css                # クイズモードスタイル
│   │   ├── variables.css           # CSS変数
│   │   └── animations.css          # アニメーション定義
│   ├── types/                      # TypeScript型定義
│   │   └── index.ts                # 共通型（リファクタリング済み）
│   ├── utils/                      # ユーティリティ関数
│   │   ├── keyUtils.ts             # キー関連ユーティリティ（統合済み）
│   │   ├── keyboard.ts             # キーボード処理ロジック
│   │   ├── keyMapping.ts           # キーコード→表示名マッピング
│   │   ├── quizEngine.ts           # クイズエンジン
│   │   ├── shortcutUtils.ts        # ショートカット検出
│   │   ├── fullscreen.ts           # 全画面モード制御
│   │   └── index.ts
│   ├── tests/                      # テストファイル
│   │   ├── quizEngine.test.ts
│   │   └── setup.ts
│   ├── App.tsx                     # ルートコンポーネント
│   └── main.tsx                    # エントリーポイント
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json                   # TypeScript設定
├── vite.config.ts                  # Vite設定
└── README.md
```

---

## 🎨 アーキテクチャの特徴

### リファクタリング成果

このプロジェクトは包括的なリファクタリングを実施しており、以下の改善が行われています：

#### ✅ コード品質の向上

1. **重複コードの削減**
   - 修飾キー定数を4箇所から1箇所に統合（`keyUtils.ts`）
   - `AppSelector` と `KeyboardLayoutSelector` を汎用 `Selector` に統合
   - 約180行以上の重複コードを削除

2. **型安全性の向上**
   - TypeScript化による完全な型チェック
   - 型定義の整合性確保（`QuizQuestion`, `ShortcutData` など）
   - 実装と型定義の不一致を解消

3. **パフォーマンス最適化**
   - `KeyboardLayout` コンポーネントで `useMemo` と `useCallback` を活用
   - 不要な再計算を防止し、レンダリングパフォーマンスを向上

4. **保守性の向上**
   - `useKeyboardShortcuts` フックで useRef の使用を5つから1つに削減
   - 適切な依存配列の設定でバグを防止
   - 単一の真実の源（Single Source of Truth）の確立

5. **クイズコンポーネントの簡素化**（2026年1月）
   - `QuizModeView.tsx` の useEffect を5つから3つに削減（40%減）
   - タイマーロジックと次の問題へ進むキー監視を `QuizContext` に移動
   - コンポーネントの責務を明確化（UI レンダリングとビジネスロジックの分離）

6. **データ駆動設計の徹底**
   - キーボードレイアウトリストを `src/data/layouts/index.ts` に集約
   - ハードコードされた設定をデータファイルに移行
   - 他のデータ（ショートカット、アプリ）と統一的なパターンに

7. **RichShortcut型リファクタリング**（2026年1月）
   - `RichShortcut` 型を新規定義し、データベースから取得したショートカット情報を詳細に表現
   - `useShortcuts` フックを拡張し、`AllShortcuts`（アプリ別グループ化）と`RichShortcut[]`（配列形式）の両方を提供
   - 型安全性を保ちながら、フィルタリングやソートが容易な設計に改善

8. **データベース駆動の保護レベル管理**（2026年1月）
   - ハードコードされた保護レベル定義をデータベースに移行
   - `windows_protection_level` と `macos_protection_level` カラムを追加
   - 各OSごとに異なる保護レベルを正確に管理（例: Win+TabはWindowsで保護、Cmd+TabはmacOSで保護）
   - `systemProtectedShortcuts.ts` のロジックを削除し、データベースから動的に取得する設計に変更
   - 保護レベルの追加・変更がデータベース更新のみで可能に

9. **ユーザー認証とデータ永続化**（2026年2月）
   - Supabase Authによる安全な認証システムの統合
   - メール/パスワード認証のサポート
   - Row-Level Security (RLS) によるデータベースレベルのセキュリティ
   - クイズ進捗、セッション、履歴の自動保存
   - オプショナルな認証設計（未ログインでも完全利用可能）

10. **Docker対応とインフラ整備**（2026年1-2月）
   - マルチステージDockerfileによるビルド最適化
   - docker-compose.ymlで開発環境の一貫性確保
   - 本番環境用のNginx設定とGzip圧縮
   - ホットリロード対応の開発環境コンテナ

### コンポーネント設計

- **関心の分離**: 各コンポーネントが単一の責務を持つ設計
- **React Hooks活用**: useState、useMemo、useCallbackで最適化
- **TypeScript**: 完全な型安全性の確保
- **memo最適化**: 不要な再レンダリングを防止

### 状態管理

- **Context API**: グローバル状態の一元管理
- **useReducer**: 複雑な状態遷移（クイズモード）
- **Local Storage**: 設定の永続化

### パフォーマンス

- **効率的なレンダリング**: useMemo と useCallback によるメモ化
- **Set/Map データ構造**: 高速な検索とマッチング O(1)
- **Vite HMR**: 開発時の高速なホットリロード
- **コード分割**: 動的インポートによる最適化

---

## 🔧 カスタマイズガイド

### データベース・デプロイメント

データベース構造、Supabaseのセットアップ、マイグレーション方法については、[DEPLOY.md](DEPLOY.md) を参照してください。

### 新しいアプリケーションの追加

新しいアプリケーションのショートカットを追加する手順：

1. **データベースにショートカットを追加:**
   ```sql
   INSERT INTO shortcuts (application, keys, description, difficulty, platform)
   VALUES ('my_app', 'Ctrl + N', '新規作成', 'basic', 'Cross-Platform');
   ```

2. **フロントエンド側の設定:**
   `src/config/apps.ts` に新しいアプリケーションの定義を追加：
   ```typescript
   export const apps: App[] = [
     // 既存のアプリ...
     {
       id: 'my_app', // Supabaseに登録したapplicationカラムの値と一致させる
       name: 'My App',
       icon: '🚀',
       os: 'cross-platform'  // または 'windows' | 'mac'
     },
   ]
   ```

詳細な手順とデータベース構造については [DEPLOY.md](DEPLOY.md) と [CLAUDE.md](CLAUDE.md) を参照してください。

### キーボードレイアウトの追加

`src/data/layouts/` に新しいレイアウトファイルを作成し、キー配置を定義してください。

---

## 🍎 macOS使用時の注意事項

### システムショートカットの競合

macOSでは、システムレベルのショートカット（`Cmd + Space`, `F3` など）はWebアプリケーションから無効化できません。

### 対策方法

#### 方法1: フルスクリーンモード（推奨）

1. 右上の「⛶ 全画面モード」ボタンをクリック
2. Keyboard Lock API が自動的に有効化
3. 一部のファンクションキーやCtrlキーの組み合わせが取得可能に

#### 方法2: システム設定でショートカットを無効化

**システム設定** → **キーボード** → **キーボードショートカット...**

競合する可能性があるカテゴリ：

| カテゴリ | 主な競合ショートカット |
|---------|-------------------|
| **Mission Control** | `Ctrl + ↑`, `Ctrl + ↓`, `F3` |
| **Launchpad** | `F4` |
| **キーボード** | `Ctrl + F2`, `Ctrl + F3` |
| **Spotlight** | `Cmd + Space` |

### 無効化できないシステムショートカット

以下はセキュリティのため無効化不可：

| ショートカット | 機能 |
|-------------|------|
| `Ctrl + Cmd + Q` | 画面をロック |
| `Cmd + Option + Escape` | 強制終了 |
| `Cmd + Tab` | アプリケーション切り替え |

### ファンクションキーについて

macOSでは、ファンクションキーがデフォルトで特殊機能に割り当てられています。

**標準機能として使用する設定**:
**システム設定** → **キーボード** → 「F1、F2などのキーを標準のファンクションキーとして使用」にチェック

---

## 🧪 テスト

```bash
# 全テストを実行
npm test

# ウォッチモードでテスト
npm run test:watch

# カバレッジレポートを生成
npm run test:coverage
```

---

## 🚢 デプロイ

### GitHub Pages（自動デプロイ）

`main` ブランチにpushすると GitHub Actions が自動的にビルド & デプロイを実行します。

### 手動デプロイ

```bash
npm run deploy
```

---

## 🤝 コントリビューション

コントリビューションを歓迎します！

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/AmazingFeature`)
3. 変更をコミット (`git commit -m 'Add some AmazingFeature'`)
4. ブランチにプッシュ (`git push origin feature/AmazingFeature`)
5. プルリクエストを作成

### コーディング規約

- TypeScript を使用
- ESLint ルールに従う
- コンポーネントには適切な型定義を付ける
- 複雑なロジックにはコメントを追加

---

## 📝 ライセンス

MIT License - 詳細は [LICENSE](LICENSE) ファイルを参照してください。

---

## 🙏 謝辞

このプロジェクトは以下の技術・ツールを活用しています：

- [React](https://react.dev/) - UIライブラリ
- [TypeScript](https://www.typescriptlang.org/) - 型安全性
- [Vite](https://vitejs.dev/) - 高速ビルドツール
- [Supabase](https://supabase.com/) - PostgreSQLバックエンドサービス
- [Vitest](https://vitest.dev/) - テストフレームワーク
- [MDN Web Docs](https://developer.mozilla.org/) - Keyboard Lock API / Fullscreen API リファレンス

---

## 📧 お問い合わせ

質問や提案がある場合は、[Issues](https://github.com/nishis2rp/keyboard-visualizer/issues) でお知らせください。

---

**Made with ❤️ and ⌨️**
