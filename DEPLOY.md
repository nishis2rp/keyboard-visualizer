# デプロイ手順 (Supabase版)

このプロジェクトは以下の構成で動作します：
- **フロントエンド**: GitHub Pagesで自動デプロイ
- **データベース & API**: Supabaseで管理

## 1. Supabase プロジェクトのセットアップ

### 前提条件
- GitHubアカウント
- Supabaseアカウント（https://supabase.com/ でサインアップ）

### 手順

#### ステップ1: Supabase プロジェクトの作成

1. [Supabase Dashboard](https://supabase.com/dashboard)にアクセス
2. 「New Project」をクリック
3. プロジェクト情報を入力：
   - Name: `keyboard-visualizer`（任意）
   - Database Password: 強力なパスワードを生成（保存しておく）
   - Region: `Northeast Asia (Tokyo)` または最寄りのリージョン
4. 「Create new project」をクリック
5. プロジェクトの初期化を待つ（約2分）

#### ステップ2: データベーステーブルの作成

1. Supabase Dashboard で「SQL Editor」を開く
2. 「New query」をクリック
3. 以下のSQLを実行：

\`\`\`sql
-- Create shortcuts table
CREATE TABLE IF NOT EXISTS shortcuts (
  id BIGSERIAL PRIMARY KEY,
  application VARCHAR(50) NOT NULL,
  keys VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(application, keys)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_shortcuts_application ON shortcuts(application);
CREATE INDEX IF NOT EXISTS idx_shortcuts_keys ON shortcuts(keys);

-- Enable Row Level Security
ALTER TABLE shortcuts ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access" ON shortcuts
  FOR SELECT
  USING (true);
\`\`\`

4. 「Run」をクリックして実行

#### ステップ3: API認証情報の取得

1. Supabase Dashboard で「Settings」→「API」を開く
2. 以下の情報をコピー：
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon (public) key**: `eyJhbGciOiJIUzI1NiIs...`

#### ステップ4: データのマイグレーション

ローカル環境でデータを投入：

1. `.env`ファイルを作成（`.env.example`をコピー）：
\`\`\`bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
DATABASE_URL=postgresql://postgres:[your-password]@db.your-project-id.supabase.co:5432/postgres
\`\`\`

2. マイグレーションを実行：
\`\`\`bash
npm run db:migrate
\`\`\`

3. 成功すると「Migration completed successfully!」が表示される

4. Supabase Dashboard の「Table Editor」で`shortcuts`テーブルを確認
   - 866個のレコードが作成されているはず

## 2. フロントエンドの環境変数設定

### GitHub Secretsの設定

1. GitHubリポジトリの「Settings」→「Secrets and variables」→「Actions」を開く
2. 「New repository secret」をクリック
3. 以下のシークレットを追加：

**VITE_SUPABASE_URL**
- Name: `VITE_SUPABASE_URL`
- Value: Supabaseの Project URL（例: `https://xxxxx.supabase.co`）

**VITE_SUPABASE_ANON_KEY**
- Name: `VITE_SUPABASE_ANON_KEY`
- Value: Supabaseの anon key

### GitHub Actions ワークフローの更新

`.github/workflows/deploy.yml`の`Build`ステップに環境変数を追加：

\`\`\`yaml
- name: Build
  run: npm run build
  env:
    VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
    VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
\`\`\`

変更をプッシュすると、GitHub Actionsが自動的にビルド・デプロイします。

## 3. 動作確認

1. **GitHub Pagesのデプロイ確認**
   - https://nishis2rp.github.io/keyboard-visualizer/ にアクセス
   - ローディング画面が表示され、その後アプリが正常に動作することを確認

2. **Supabaseとの連携確認**
   - ブラウザの開発者ツール（F12）を開く
   - Networkタブでsupabase.coへのリクエストが成功していることを確認

## トラブルシューティング

### データベースが空
- マイグレーションが実行されているか確認
- Supabase Dashboard の Table Editor で shortcuts テーブルを確認
- マイグレーションスクリプトを再実行: `npm run db:migrate`

### フロントエンドがSupabaseに接続できない
- CORS設定を確認（Supabaseはデフォルトで全てのオリジンを許可）
- ブラウザのコンソールにエラーが表示されていないか確認
- 環境変数が正しく設定されているか確認
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

### Row Level Security (RLS) エラー
- Supabase Dashboard で「Authentication」→「Policies」を確認
- `shortcuts`テーブルに「Allow public read access」ポリシーが存在するか確認

## コスト

**Supabase 無料プラン**:
- データベース容量: 500MB
- 帯域幅: 5GB/月
- API リクエスト: 無制限
- Row Level Security
- 自動バックアップ: 7日間

**GitHub Pages**:
- 完全無料
- 帯域幅制限: 月100GB

小規模なアプリには十分です。

## 更新方法

### データの更新
1. ローカルで`src/data/shortcuts/`のファイルを編集
2. マイグレーションスクリプトを再実行: `npm run db:migrate`
3. Supabaseに自動的に反映されます

### フロントエンドの更新
mainブランチにプッシュすると、GitHub Actionsが自動的に再デプロイします。

## セキュリティ

- **anon key**は公開しても安全です（フロントエンドで使用）
- **service_role key**は絶対に公開しないでください
- Row Level Security (RLS)を使用して、データアクセスを制御
- 読み取り専用アクセスのみを許可（現在の設定）
