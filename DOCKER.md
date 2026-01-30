# Docker使用ガイド

このプロジェクトはDockerを使用して開発環境を構築できます。

## 前提条件

- Docker Desktop がインストールされていること
- Docker Compose がインストールされていること（Docker Desktop に含まれています）

## クイックスタート

### 1. 環境変数の設定

`.env.example` をコピーして `.env` ファイルを作成し、Supabase の接続情報を設定してください：

```bash
cp .env.example .env
```

`.env` ファイルを編集：
```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
DATABASE_URL=postgresql://postgres:your-password@db.your-project-id.supabase.co:5432/postgres
```

### 2. 開発サーバーの起動

```bash
# コンテナをビルドして起動
docker-compose up

# または、バックグラウンドで起動
docker-compose up -d

# ログを確認
docker-compose logs -f app
```

ブラウザで http://localhost:5173 にアクセスしてください。

### 3. 開発サーバーの停止

```bash
# コンテナを停止
docker-compose down

# コンテナとボリュームを削除
docker-compose down -v
```

## Docker コマンド

### 開発環境

```bash
# コンテナをビルド
docker-compose build

# コンテナを起動（フォアグラウンド）
docker-compose up

# コンテナを起動（バックグラウンド）
docker-compose up -d

# コンテナを停止
docker-compose down

# コンテナに入る
docker-compose exec app sh

# ログを確認
docker-compose logs -f app

# コンテナを再ビルドして起動
docker-compose up --build
```

### 本番環境（テスト用）

```bash
# 本番用コンテナをビルドして起動
docker-compose -f docker-compose.prod.yml up --build

# バックグラウンドで起動
docker-compose -f docker-compose.prod.yml up -d

# 停止
docker-compose -f docker-compose.prod.yml down
```

ブラウザで http://localhost:8080 にアクセスしてください。

### テストの実行

```bash
# コンテナ内でテストを実行
docker-compose exec app npm test

# ウォッチモードでテストを実行
docker-compose exec app npm run test:watch
```

### データベースマイグレーション

```bash
# コンテナ内でマイグレーションを実行
docker-compose exec app npm run db:migrate
```

## Docker構成

### Dockerfile

マルチステージビルドを使用：

1. **development**: 開発サーバー用（Node.js 20 Alpine）
2. **build**: プロダクションビルド用
3. **production**: Nginx で静的ファイルを配信

### docker-compose.yml（開発用）

- **ポート**: 5173 → 5173
- **ボリュームマウント**: ソースコードをマウント（ホットリロード対応）
- **環境変数**: `.env` ファイルから自動読み込み

### docker-compose.prod.yml（本番テスト用）

- **ポート**: 8080 → 80
- **Nginx**: 本番用の静的ファイル配信
- **最適化**: Gzip圧縮、キャッシュ設定、セキュリティヘッダー

## トラブルシューティング

### ポートが既に使用されている

```bash
# ポートを変更する場合は docker-compose.yml を編集
ports:
  - "3000:5173"  # ホスト側を3000に変更
```

### ホットリロードが動作しない

Vite の設定で `usePolling: true` を有効にしています（`vite.config.ts`）。
これにより、Docker ボリュームマウント時のファイル監視が正しく動作します。

### コンテナ内のファイルが更新されない

```bash
# コンテナを再ビルド
docker-compose up --build

# キャッシュを使わずにビルド
docker-compose build --no-cache
```

### 環境変数が反映されない

1. `.env` ファイルが正しく作成されているか確認
2. コンテナを再起動：
   ```bash
   docker-compose down
   docker-compose up
   ```

### node_modules の問題

```bash
# ボリュームを削除して再作成
docker-compose down -v
docker-compose up --build
```

## ベストプラクティス

### 開発時

- ソースコードの変更は自動的に反映されます（ホットリロード）
- `node_modules` はコンテナ内のものを使用（ホストとの競合を避けるため）
- `.dockerignore` により不要なファイルはコンテナに含まれません

### 本番ビルドのテスト

本番環境のビルドをローカルでテストする場合：

```bash
docker-compose -f docker-compose.prod.yml up --build
```

Nginx で配信される静的ファイルの動作を確認できます。

## パフォーマンス

### ビルド時間の最適化

- `.dockerignore` により不要なファイルを除外
- マルチステージビルドで最終イメージサイズを削減
- npm ci を使用して高速で確実な依存関係インストール

### 実行時パフォーマンス

- **開発**: Vite の HMR による高速なホットリロード
- **本番**: Nginx による高速な静的ファイル配信、Gzip 圧縮、キャッシュ最適化

## Docker Compose のオプション

```bash
# 特定のサービスのみ起動
docker-compose up app

# コンテナを再作成
docker-compose up --force-recreate

# ログの出力行数を制限
docker-compose logs --tail=100 app

# リアルタイムでリソース使用状況を確認
docker stats
```

## セキュリティ

- Alpine Linux ベースイメージを使用（軽量で脆弱性が少ない）
- `.env` ファイルは `.gitignore` に含まれており、Git にコミットされません
- 本番用 Nginx にはセキュリティヘッダーを設定済み
- `anon key` は公開しても安全（フロントエンドで使用）
- `service_role key` は絶対にコンテナに含めないでください

## CI/CD との統合

GitHub Actions などの CI/CD パイプラインで Docker を使用する場合：

```yaml
# .github/workflows/docker.yml
name: Docker Build

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Build Docker image
        run: docker build -t keyboard-visualizer .

      - name: Run tests in Docker
        run: docker run keyboard-visualizer npm test
```

## その他のコマンド

```bash
# イメージのサイズを確認
docker images keyboard-visualizer

# 使用していないイメージを削除
docker image prune

# すべてのコンテナとイメージを削除（注意！）
docker system prune -a
```

## サポート

問題が発生した場合は、[Issues](https://github.com/nishis2rp/keyboard-visualizer/issues) でお知らせください。
