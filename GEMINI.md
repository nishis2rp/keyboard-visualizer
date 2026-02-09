# Gemini Memo (Keyboard Visualizer)

このドキュメントは、Keyboard Visualizer プロジェクトの構造、開発環境、および主要なコンポーネントを Gemini モデルが迅速に把握するためのメモです。

## プロジェクト概要

キーボード操作をリアルタイムで視覚化し、ショートカットキーを学習できる Web アプリケーション。
1,300 以上のショートカットデータを Supabase で管理し、クイズモードやビジュアライザーモードを提供します。

## 技術スタック

- **Frontend:** React 18.3, TypeScript 5.9, Vite 5.4
- **Backend:** Supabase (PostgreSQL, Auth, RLS)
- **State Management:** React Context API (Settings, Shortcut, UI, Auth, Quiz)
- **Styling:** CSS Modules, Global CSS
- **Testing:** Vitest
- **Infrastructure:** Docker, Nginx, GitHub Pages (CI/CD via GitHub Actions)

## 主要なディレクトリ構造

- `src/components/MyPage/`: マイページ専用コンポーネント。
  - `StatCards.tsx`: 視覚的な統計サマリー。
  - `WeakShortcuts.tsx`: 苦手な項目の分析表示。
  - `AppStatsTable.tsx`: アプリケーション別統計テーブル。
  - `RecentSessions.tsx`: 最近のプレイ履歴。
- `src/components/AppHeader/`: ヘッダーコンポーネント。
- `src/context/`: アプリケーションの状態管理。
  - `AuthContext.tsx`: ユーザー認証。
  - `QuizContext.tsx`: クイズのロジックと状態（reducer 使用）。
  - `SettingsContext.tsx`: アプリ、レイアウト、難易度設定。
  - `ShortcutContext.tsx`: ショートカットデータの管理。
  - `UIContext.tsx`: モード切り替え、全画面制御。
- `src/hooks/`: カスタムフック（`useKeyboardShortcuts`, `useShortcuts`, `useQuizProgress` など）。
- `src/utils/`: 共通ユーティリティ（キーマッピング、クイズエンジン、全画面制御）。
- `supabase/migrations/`: 46 個以上の SQL マイグレーションファイル。データベーススキーマとデータの変遷。
- `scripts/`: データベースメンテナンス用の TypeScript スクリプト。
  - `archive/`: 過去に使用されたメンテナンススクリプトの保管場所。

## データベース & マイグレーション

Supabase を使用して以下のデータを管理しています：
- `shortcuts`: ショートカットキー定義（キー、説明、難易度、プラットフォーム、保護レベルなど）。
- `applications`: 対応アプリケーションの定義。
- `user_profiles`, `quiz_sessions`, `quiz_answers`: ユーザーデータと学習履歴。

### マイグレーションの実行
- `npm run db:migrate`: 新しいマイグレーションファイルの作成。
- `npm run db:run-migration`: マイグレーションの適用。

## 主要なスクリプト (package.json)

- `npm run dev`: 開発サーバーの起動。
- `npm run build`: プロダクションビルド。
- `npm run test`: テストの実行（Vitest）。
- `npm run db:export-csv`: ショートカットデータの CSV エクスポート。
- `npm run db:update-sort-order`: ショートカットの表示順序の更新。
- その他、特定のショートカットデータのクリーンアップや難易度調整用スクリプトが多数定義されています。

## コアコンセプト

- **保護レベル (Protection Levels):**
  - `fullscreen-preventable`: 全画面モードで防げるショートカット。
  - `always-protected`: システムによって常に保護されており、ブラウザでキャプチャできないもの。
- **難易度 (Difficulty):** Basic, Standard, Hard, Madmax の 4 段階。
- **入力判定:** `useKeyboardShortcuts` フックと `quizEngine.ts` が、同時押しおよび順押し（Sequential）の入力を判定します。
- **全画面モード:** Keyboard Lock API を使用して、システムのショートカットキー競合を最小限に抑えます。
- **マイページ・ダッシュボード (2026年2月改善):**
  - 統計情報の視覚化（プログレスバー、バーチャート）。
  - 「苦手なショートカット」の自動分析（`quiz_history` から正解率の低い項目を抽出）。
  - 2カラムのダッシュボードレイアウト（メイン統計 + 設定サイドバー）。
  - コンポーネント分割による可読性と保守性の向上。

## 開発ワークフロー

1. **環境構築:** `npm install` または `docker-compose up`。
2. **データ管理:** `supabase/migrations` を確認し、必要に応じて `scripts/` のツールを使用してデータを調整。
3. **テスト:** 新しい判定ロジックやコンポーネントを追加した際は `npm test` で既存機能への影響を確認。

---

## Technical Dependency Map
- **Input Flow**: Window EventListener -> `useKeyboardShortcuts` -> `ShortcutContext` -> UI Display
- **Quiz Flow**: `QuizContext` -> `QuizReducer` -> `useQuizInputHandler` -> `quizEngine.ts`
- **Optimization Flow**: `useAdaptivePerformance` -> CSS Variables -> Components Rendering

## AI Inference Rules (Critical for ChatGPT/Gemini)
1. **Naming Convention**: Use PascalCase for components, camelCase for hooks and utils.
2. **Type Safety**: Strictly use `src/types/index.ts`. Avoid `any`.
3. **Logic Placement**: 
   - State should be in `Context`.
   - Complex logic should be in `Hooks`.
   - Pure UI should be in `Components` (using CSS Modules).
4. **Performance**: All animations must use the `--animation-speed` CSS variable managed by the Adaptive Performance Hook.

## Master Directory Index
- `src/constants/keys.ts`: Master list of physical key mappings.
- `src/utils/aiOptimization.ts`: AI Deduction logic.
- `supabase/migrations`: Source of truth for database schema.