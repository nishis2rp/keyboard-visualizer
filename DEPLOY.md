# デプロイ手順

このプロジェクトは以下の2つの部分で構成されています：
- **フロントエンド**: GitHub Pagesで自動デプロイ
- **バックエンドAPI**: Railwayで手動デプロイ

## 1. バックエンドAPIのデプロイ (Railway)

### 前提条件
- GitHubアカウント
- Railwayアカウント（https://railway.app/ でサインアップ）

### 手順

#### ステップ1: Railwayプロジェクトの作成

1. [Railway](https://railway.app/)にアクセスしてログイン
2. 「New Project」をクリック
3. 「Deploy from GitHub repo」を選択
4. `nishis2rp/keyboard-visualizer` リポジトリを選択
5. プロジェクトが作成されます

#### ステップ2: 環境変数の設定（オプション）

デフォルトではPORT環境変数が自動的に設定されます。追加の設定は不要です。

必要に応じて以下を設定：
- `NODE_ENV`: `production`

#### ステップ3: デプロイ確認

1. Railwayダッシュボードで「Deployments」タブを開く
2. 最新のデプロイが成功していることを確認
3. 「Settings」→「Networking」→「Generate Domain」をクリック
4. 生成されたドメイン（例: `https://your-app.up.railway.app`）をコピー

#### ステップ4: デプロイされたAPIの動作確認

生成されたドメインにアクセスして確認：
```bash
curl https://your-app.up.railway.app/health
# 期待される結果: {"status":"ok","message":"API server is running"}

curl https://your-app.up.railway.app/api/applications
# アプリケーション一覧が返ってくることを確認
```

## 2. フロントエンドの環境変数更新

### GitHub Secretsの設定

1. GitHubリポジトリの「Settings」→「Secrets and variables」→「Actions」を開く
2. 「New repository secret」をクリック
3. 以下のシークレットを追加：
   - Name: `VITE_API_URL`
   - Value: Railwayで生成されたドメイン（例: `https://your-app.up.railway.app`）

### GitHub Actions ワークフローの更新

`.github/workflows/deploy.yml`の`Build`ステップに環境変数を追加：

```yaml
- name: Build
  run: npm run build
  env:
    VITE_API_URL: ${{ secrets.VITE_API_URL }}
```

変更をプッシュすると、GitHub Actionsが自動的にビルド・デプロイします。

## 3. 動作確認

1. **GitHub Pagesのデプロイ確認**
   - https://nishis2rp.github.io/keyboard-visualizer/ にアクセス
   - ローディング画面が表示され、その後アプリが正常に動作することを確認

2. **APIとの連携確認**
   - ブラウザの開発者ツール（F12）を開く
   - Networkタブで`/api/shortcuts`へのリクエストが成功していることを確認

## トラブルシューティング

### APIサーバーが起動しない
- Railwayのログを確認: Dashboard → Deployments → 最新のデプロイ → View Logs
- `npm run db:migrate`が成功しているか確認

### フロントエンドがAPIに接続できない
- CORS設定を確認（`src/server/api.ts`の`cors()`設定）
- ブラウザのコンソールにCORSエラーが表示されていないか確認
- `VITE_API_URL`が正しく設定されているか確認

### データベースが空
- マイグレーションが実行されているか確認
- Railwayのログで`Migration completed successfully!`が表示されているか確認

## コスト

**Railway無料プラン**:
- 月500時間の実行時間
- $5のクレジット
- 小規模なアプリには十分

**GitHub Pages**:
- 完全無料
- 帯域幅制限: 月100GB

## 更新方法

### バックエンドの更新
mainブランチにプッシュすると、Railwayが自動的に再デプロイします。

### フロントエンドの更新
mainブランチにプッシュすると、GitHub Actionsが自動的に再デプロイします。
