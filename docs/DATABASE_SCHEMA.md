# Database Schema Documentation

## 概要

Keyboard Visualizerは完全データベース駆動型のアーキテクチャを採用しており、すべての設定、ショートカットデータ、ユーザー情報をSupabase PostgreSQLデータベースで管理しています。

## テーブル一覧

### コアテーブル

1. **applications** - アプリケーション情報
2. **shortcuts** - ショートカットデータ
3. **app_settings** - アプリケーション固有の設定
4. **global_settings** - グローバル設定

### ユーザー関連テーブル

5. **user_profiles** - ユーザープロフィール
6. **quiz_sessions** - クイズセッション記録
7. **quiz_history** - 詳細な回答履歴

### ビュー

8. **user_quiz_stats** - ユーザーのクイズ統計（ビュー）

---

## テーブル詳細

### 1. applications

アプリケーションのメタデータを管理。

```sql
CREATE TABLE applications (
  id VARCHAR(50) PRIMARY KEY,           -- アプリID ('chrome', 'excel'など)
  name VARCHAR(100) NOT NULL,           -- 表示名（日本語）
  name_en VARCHAR(100),                 -- 表示名（英語）
  icon VARCHAR(50),                     -- 絵文字アイコン
  os VARCHAR(20) NOT NULL,              -- OS ('windows', 'mac', 'cross-platform')
  display_order INTEGER DEFAULT 0       -- 表示順序
);
```

**インデックス**:
- PRIMARY KEY on `id`

**Row Level Security**:
- Public read access enabled

**サンプルデータ**:
```sql
INSERT INTO applications (id, name, name_en, icon, os, display_order) VALUES
('windows11', 'Windows 11', 'Windows 11', '🪟', 'windows', 1),
('chrome', 'Chrome', 'Chrome', '🌐', 'cross-platform', 3),
('excel', 'Excel', 'Excel', '📊', 'cross-platform', 4);
```

---

### 2. shortcuts

すべてのショートカット情報を格納。

```sql
CREATE TABLE shortcuts (
  id BIGSERIAL PRIMARY KEY,
  application VARCHAR(50) NOT NULL,     -- アプリケーションID
  keys VARCHAR(100) NOT NULL,           -- ショートカットキー ('Ctrl + C')
  description TEXT NOT NULL,            -- 説明（日本語）
  description_en TEXT,                  -- 説明（英語）
  category VARCHAR(100),                -- カテゴリ（日本語）
  category_en VARCHAR(100),             -- カテゴリ（英語）
  difficulty VARCHAR(20),               -- 難易度 ('basic', 'standard', 'hard', 'madmax')
  platform VARCHAR(50),                 -- プラットフォーム
  windows_keys VARCHAR(100),            -- Windows固有のキー
  macos_keys VARCHAR(100),              -- macOS固有のキー
  windows_protection_level TEXT,        -- Windows保護レベル
  macos_protection_level TEXT,          -- macOS保護レベル
  press_type VARCHAR(20) DEFAULT 'simultaneous', -- 'simultaneous' or 'sequential'
  alternative_group_id INTEGER,         -- 代替ショートカットグループID
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(application, keys)
);
```

**インデックス**:
- `idx_shortcuts_application` on `application`
- `idx_shortcuts_keys` on `keys`

**保護レベル**:
- `none` - 保護なし
- `preventable_fullscreen` - 全画面モードでキャプチャ可能
- `always-protected` - 常に保護されている

**Row Level Security**:
- Public read access enabled

---

### 3. app_settings

アプリケーション固有の設定を動的に管理。

```sql
CREATE TABLE app_settings (
  id BIGSERIAL PRIMARY KEY,
  application_id VARCHAR(50) NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  setting_key VARCHAR(100) NOT NULL,   -- 設定キー
  setting_value TEXT,                   -- 設定値（文字列として保存）
  setting_type VARCHAR(20) DEFAULT 'string', -- 'string', 'number', 'boolean', 'json'
  description TEXT,                     -- 設定の説明
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(application_id, setting_key)
);
```

**インデックス**:
- `idx_app_settings_application` on `application_id`
- `idx_app_settings_key` on `setting_key`

**Row Level Security**:
- Public read access enabled

**設定例**:
```sql
INSERT INTO app_settings (application_id, setting_key, setting_value, setting_type, description) VALUES
('chrome', 'enable_browser_conflict_detection', 'true', 'boolean',
 'Enable detection of shortcuts that conflict with Chrome in other apps'),
('chrome', 'browser_conflict_protection_levels', '["preventable_fullscreen"]', 'json',
 'Protection levels that trigger browser conflict warnings'),
('windows11', 'default_layout', 'windows-jis', 'string',
 'Default keyboard layout for Windows 11');
```

**使用方法（フロントエンド）**:
```typescript
import { useAppSettings } from '../hooks/useSettings';

const { getSetting } = useAppSettings('chrome');
const enableConflictDetection = getSetting<boolean>('enable_browser_conflict_detection', false);
```

---

### 4. global_settings

アプリケーション全体のグローバル設定。

```sql
CREATE TABLE global_settings (
  id BIGSERIAL PRIMARY KEY,
  setting_key VARCHAR(100) NOT NULL UNIQUE, -- グローバル設定キー
  setting_value TEXT,                       -- 設定値
  setting_type VARCHAR(20) DEFAULT 'string', -- データ型
  description TEXT,                         -- 説明
  is_public BOOLEAN DEFAULT true,           -- 公開設定
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**インデックス**:
- `idx_global_settings_key` on `setting_key`

**Row Level Security**:
- Public read access for `is_public = true` settings only

**設定例**:
```sql
INSERT INTO global_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('setup_version', 'v2', 'string', 'Setup screen version - increments force re-setup', true),
('default_app', 'windows11', 'string', 'Default application for first-time users', true),
('enable_quiz_mode', 'true', 'boolean', 'Enable quiz mode feature', true),
('supported_languages', '["ja", "en"]', 'json', 'List of supported language codes', true);
```

**設定カテゴリ**:
1. **セットアップ設定**: `setup_version`, `default_app`, `default_layout`
2. **機能フラグ**: `enable_quiz_mode`, `enable_fullscreen_mode`, `enable_user_authentication`
3. **言語設定**: `supported_languages`, `default_language`
4. **UI設定**: `show_keyboard_layout`, `show_difficulty_badges`, `compact_mode_default`

**使用方法（フロントエンド）**:
```typescript
import { useGlobalSettingsContext } from '../context/GlobalSettingsContext';

const { getSetting } = useGlobalSettingsContext();
const setupVersion = getSetting<string>('setup_version', 'v1');
const enableQuizMode = getSetting<boolean>('enable_quiz_mode', true);
```

---

### 5. user_profiles

ユーザープロフィール情報（Supabase Authと連携）。

```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name VARCHAR(100),
  avatar_url TEXT,
  bio TEXT,
  goal TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Row Level Security**:
- Users can read and update only their own profiles

---

### 6. quiz_sessions

クイズセッションの記録。

```sql
CREATE TABLE quiz_sessions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  application VARCHAR(50) NOT NULL,
  difficulty VARCHAR(20),
  score NUMERIC(5,2),
  total_questions INTEGER,
  correct_answers INTEGER,
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);
```

**インデックス**:
- `idx_quiz_sessions_user` on `user_id`
- `idx_quiz_sessions_app` on `application`

---

### 7. quiz_history

詳細な回答履歴。

```sql
CREATE TABLE quiz_history (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  session_id BIGINT REFERENCES quiz_sessions(id) ON DELETE CASCADE,
  shortcut_id BIGINT REFERENCES shortcuts(id) ON DELETE CASCADE,
  was_correct BOOLEAN NOT NULL,
  answered_at TIMESTAMP DEFAULT NOW()
);
```

**インデックス**:
- `idx_quiz_history_user` on `user_id`
- `idx_quiz_history_session` on `session_id`
- `idx_quiz_history_shortcut` on `shortcut_id`

---

## マイグレーション履歴

| 番号 | ファイル名 | 説明 |
|-----|-----------|------|
| 045 | `create_applications_table.sql` | アプリケーションテーブル作成 |
| 050 | `add_internationalization_columns.sql` | 国際化カラム追加 |
| 055 | `add_app_settings_table.sql` | アプリ設定テーブル作成 |
| 056 | `add_global_settings_table.sql` | グローバル設定テーブル作成 |

---

## データベース駆動化のメリット

### 1. コード変更不要の設定変更

```sql
-- 新機能を有効化（デプロイ不要）
UPDATE global_settings
SET setting_value = 'true'
WHERE setting_key = 'enable_new_feature';
```

### 2. A/Bテストの容易な実施

```sql
-- アプリごとに異なる設定を試せる
UPDATE app_settings
SET setting_value = 'experimental'
WHERE application_id = 'chrome' AND setting_key = 'ui_theme';
```

### 3. ユーザーごとのカスタマイズ（将来対応）

```sql
-- ユーザー設定テーブル追加予定
CREATE TABLE user_settings (
  user_id UUID REFERENCES user_profiles(id),
  setting_key VARCHAR(100),
  setting_value TEXT,
  PRIMARY KEY (user_id, setting_key)
);
```

---

## セキュリティ

### Row Level Security (RLS)

すべてのテーブルでRLSが有効化されています：

```sql
-- 公開読み取りアクセス（アプリケーション、設定）
CREATE POLICY "Allow public read" ON applications
  FOR SELECT USING (true);

-- ユーザー自身のデータのみアクセス可能
CREATE POLICY "Users can read own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);
```

### 機密情報の保護

- `is_public = false`の設定は認証ユーザーのみアクセス可能
- ユーザーデータは`auth.uid()`で厳密に制限
- データベース管理者のみが書き込み権限を持つ

---

## パフォーマンス最適化

### インデックス戦略

```sql
-- 頻繁に検索されるカラムにインデックス
CREATE INDEX idx_shortcuts_application ON shortcuts(application);
CREATE INDEX idx_app_settings_key ON app_settings(setting_key);
```

### クエリ最適化

```typescript
// 必要なカラムのみ取得
const { data } = await supabase
  .from('shortcuts')
  .select('id, keys, description')
  .eq('application', 'chrome')
  .limit(100);
```

---

## 今後の拡張予定

### v3.0.0以降

1. **user_settings** - ユーザーごとのカスタム設定
2. **keyboard_layouts** - キーボードレイアウトのデータベース管理
3. **learning_paths** - 学習パスのカスタマイズ
4. **achievements** - 実績システム
5. **community_shortcuts** - ユーザー投稿ショートカット

---

## まとめ

このデータベーススキーマにより、Keyboard Visualizerは：

✅ **完全データベース駆動** - すべての設定とデータをデータベースで管理
✅ **柔軟な設定管理** - コード変更なしで機能を追加・変更可能
✅ **スケーラブル** - 新しいアプリやショートカットの追加が容易
✅ **ユーザー中心** - 個別のカスタマイズと進捗追跡をサポート
✅ **セキュア** - RLSによる厳密なアクセス制御

**作成日**: 2026-02-19
**バージョン**: 2.9.0
**最終更新**: Migration 056
