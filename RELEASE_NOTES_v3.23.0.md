# Release Notes - v3.23.0

**リリース日**: 2026年2月21日

## 🎯 新機能

### 1. 苦手克服ドリル (Weakness Drill) 🔥

ユーザーの苦手なショートカットに特化した集中練習モードを追加しました。

**機能詳細**:
- マイページの「重点復習ショートカット」セクションに「🔥 苦手克服ドリルを開始」ボタンを追加
- 間違えたショートカットのみを対象にした特別なクイズセッションを開始
- カスタムショートカットIDリストを指定してクイズを生成する機能を実装

**実装内容**:
- `generateQuestion()` 関数に `customIds` パラメータを追加（`quizEngine.ts:232`）
- `useQuizGame` フックで `customIds` サポートを実装
- `WeakShortcuts` コンポーネントにドリル開始ボタンを統合

**ユーザー体験**:
- 苦手なショートカットを効率的に反復練習
- 正答率の低い項目に集中して学習
- 学習効率の大幅な向上

### 2. 入力ミスの可視化 (Detailed Feedback) 📊

間違えた際に「どのキーが正しくて、どのキーが間違っていたか」を視覚的にフィードバックする機能を追加しました。

**機能詳細**:
- **緑色のキー**: ユーザーの入力が正解と一致
- **赤色のキー（取り消し線）**: 余計なキー（押す必要がなかった）
- **点線のキー**: 不足しているキー（押すべきだったが押されていない）

**実装内容**:
- `compareShortcuts()` 関数を新規実装（`quizEngine.ts:115-154`）
  - `correct`: 一致したキーのリスト
  - `missing`: 不足しているキーのリスト
  - `extra`: 余計なキーのリスト
  - `isEquivalent`: 代替ショートカットとの一致判定
- `QuestionCard` コンポーネントでエラー比較を視覚化
- CSS アニメーション `pulse-missing` を追加

**ユーザー体験**:
- 何が間違っていたのか一目で理解
- 学習のフィードバックループを改善
- ミスの原因分析が容易に

### 3. ブックマーク・お気に入り機能 (Bookmarks) ⭐

よく使うショートカットや覚えたいショートカットをブックマークして、後で集中的に練習できる機能を追加しました。

**機能詳細**:
- ショートカットカードに★/☆アイコンを追加（ログインユーザーのみ）
- マイページに「⭐ ブックマーク」セクションを新設
- ブックマークした項目のみでドリル練習が可能
- ブックマーク数は無制限

**データベース設計**:
```sql
CREATE TABLE user_bookmarks (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  shortcut_id BIGINT NOT NULL REFERENCES shortcuts(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, shortcut_id)
);
```

**実装内容**:
- `useBookmarks` カスタムフックを新規作成（`hooks/useBookmarks.ts`）
  - `toggleBookmark()`: ブックマークの追加/削除
  - `isBookmarked()`: ブックマーク状態の確認
  - `bookmarkedShortcuts`: ブックマーク済みショートカットの一覧
- `BookmarkedShortcuts` コンポーネントを新規作成
- Row-Level Security (RLS) ポリシーを設定
  - ユーザーは自分のブックマークのみ読み書き可能

**ユーザー体験**:
- 重要なショートカットを個人的にマーク
- 自分専用の練習セットを作成
- 学習の優先順位を自由に設定

## 🐛 バグ修正

### TypeScript型エラーの解決

1. **ProtectionLevel型の拡張**:
   - `'browser-conflict'` を `ProtectionLevel` 型に追加
   - `ShortcutCard` の型エラーを解決

2. **Context API使用方法の修正**:
   - `BookmarkedShortcuts` と `WeakShortcuts` で誤ったContext参照を修正
   - `setViewMode` → `setIsQuizMode` に変更
   - `settings.isFullscreen` → デフォルト値 `false` に変更

3. **型定義の統一**:
   - `effectiveProtectionLevel` の戻り値型を `ProtectionLevel` に統一

## 📊 統計

### コード追加
- **新規ファイル**: 2
  - `src/hooks/useBookmarks.ts`
  - `src/components/MyPage/BookmarkedShortcuts.tsx`
- **新規マイグレーション**: 1
  - `supabase/migrations/058_create_user_bookmarks_table.sql`

### 変更ファイル
- **コンポーネント**: 3
  - `ShortcutCard.tsx`: ブックマークボタン追加
  - `QuestionCard.tsx`: 詳細フィードバック追加
  - `WeakShortcuts.tsx`: ドリルボタン追加
- **ユーティリティ**: 1
  - `quizEngine.ts`: `compareShortcuts()` 関数、`customIds` サポート
- **型定義**: 1
  - `types/index.ts`: `Bookmark` インターフェース、`ProtectionLevel` 型拡張
- **ローカライゼーション**: 2
  - `locales/ja.ts`, `locales/en.ts`

### 品質指標
- **ユニットテスト**: 89/89 パス ✅
- **TypeScript型チェック**: エラーなし ✅
- **ビルド**: 成功 ✅

## 🔧 技術的詳細

### 主な変更ファイル

**データベース**:
- `supabase/migrations/058_create_user_bookmarks_table.sql`: ブックマークテーブル作成

**カスタムフック**:
- `src/hooks/useBookmarks.ts`: ブックマーク管理
- `src/hooks/useQuizGame.ts`: `customIds` パラメータサポート追加

**コンポーネント**:
- `src/components/MyPage/BookmarkedShortcuts.tsx`: ブックマーク一覧と練習開始UI
- `src/components/MyPage/WeakShortcuts.tsx`: 苦手克服ドリルボタン
- `src/components/ShortcutCard/ShortcutCard.tsx`: ブックマークアイコン
- `src/components/Quiz/QuestionCard.tsx`: 詳細エラーフィードバック

**ユーティリティ**:
- `src/utils/quizEngine.ts`:
  - `compareShortcuts()`: キー比較ロジック
  - `generateQuestion()`: `customIds` サポート

**型定義**:
- `src/types/index.ts`:
  - `Bookmark` インターフェース追加
  - `ProtectionLevel` 型に `'browser-conflict'` 追加
  - `ShortcutComparison` インターフェース（`quizEngine.ts` で定義）

**スタイル**:
- `src/components/ShortcutCard/ShortcutCard.module.css`: `.bookmarkButton`, `.isBookmarked`
- `src/components/Quiz/QuestionCard.module.css`: `.kbdCorrect`, `.kbdExtra`, `.kbdMissing`

## 🚀 アップグレード方法

```bash
git pull origin main
npm install

# データベースマイグレーションを実行
npm run db:migrate

npm run build
```

**重要**: 新しいブックマーク機能を使用するには、データベースマイグレーション（`058_create_user_bookmarks_table.sql`）の実行が必要です。

## ⚠️ Breaking Changes

**なし** - すべての変更は新機能の追加であり、既存機能との互換性を維持しています。

## 🔄 互換性

- すべての既存機能は引き続き正常に動作します
- ユーザーはログインせずにアプリを使用可能（ブックマーク機能以外）
- 既存のクイズセッション、統計データに影響なし

## 🎯 次のステップ

今後の改善案として以下を検討中:

1. **忘却曲線（間隔反復学習）**: 復習タイミングをAIが提案
2. **コミュニティ機能**: 練習セットの共有
3. **詳細な統計グラフ**: 時系列での成長の可視化
4. **カスタム練習セット**: ユーザーが自由にショートカットを選択

## 🙏 謝辞

このリリースは、ユーザーの学習効率を最大化するための機能強化です。フィードバックに基づき、より効果的な学習体験を提供できるよう改善を続けてまいります。

---

**前回のリリース**: [v3.22.0](RELEASE_NOTES_v3.22.0.md)
