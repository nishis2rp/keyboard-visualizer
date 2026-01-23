import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// データベースファイルのパス（プロジェクトルートのdataディレクトリに保存）
const dataDir = path.join(__dirname, '../../data');
const dbPath = path.join(dataDir, 'shortcuts.db');

// dataディレクトリを作成（存在しない場合）
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

// データベース接続を作成
const db = new Database(dbPath);

// WALモードを有効化（パフォーマンス向上）
db.pragma('journal_mode = WAL');

export default db;
