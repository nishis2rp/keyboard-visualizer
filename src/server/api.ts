import express, { Request, Response } from 'express';
import cors from 'cors';
import db from './db.js';

const app = express();
const PORT = process.env.PORT || 3001;

// ミドルウェア
app.use(cors());
app.use(express.json());

// ヘルスチェックエンドポイント
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'API server is running' });
});

// 全ショートカット取得 または 特定アプリのショートカット取得
// GET /api/shortcuts - 全てのショートカット
// GET /api/shortcuts?app=chrome - Chromeのショートカットのみ
app.get('/api/shortcuts', (req: Request, res: Response) => {
  try {
    const { app: application } = req.query;

    if (application && typeof application === 'string') {
      // 特定アプリのショートカットを取得
      const shortcuts = db.prepare(`
        SELECT id, application, keys, description, category
        FROM shortcuts
        WHERE application = ?
        ORDER BY id
      `).all(application);

      res.json({
        application,
        count: shortcuts.length,
        shortcuts
      });
    } else {
      // 全てのショートカットを取得
      const shortcuts = db.prepare(`
        SELECT id, application, keys, description, category
        FROM shortcuts
        ORDER BY application, id
      `).all();

      res.json({
        count: shortcuts.length,
        shortcuts
      });
    }
  } catch (error) {
    console.error('Error fetching shortcuts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// アプリケーション一覧取得
app.get('/api/applications', (_req: Request, res: Response) => {
  try {
    const applications = db.prepare(`
      SELECT DISTINCT application, COUNT(*) as count
      FROM shortcuts
      GROUP BY application
      ORDER BY application
    `).all();

    res.json({
      count: applications.length,
      applications
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 検索エンドポイント
// GET /api/shortcuts/search?q=コピー
app.get('/api/shortcuts/search', (req: Request, res: Response) => {
  try {
    const { q, app: application } = req.query;

    if (!q || typeof q !== 'string') {
      res.status(400).json({ error: 'Query parameter "q" is required' });
      return;
    }

    let query = `
      SELECT id, application, keys, description, category
      FROM shortcuts
      WHERE (keys LIKE ? OR description LIKE ?)
    `;
    const params: any[] = [`%${q}%`, `%${q}%`];

    if (application && typeof application === 'string') {
      query += ' AND application = ?';
      params.push(application);
    }

    query += ' ORDER BY application, id';

    const shortcuts = db.prepare(query).all(...params);

    res.json({
      query: q,
      application: application || 'all',
      count: shortcuts.length,
      shortcuts
    });
  } catch (error) {
    console.error('Error searching shortcuts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`API server is running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Shortcuts API: http://localhost:${PORT}/api/shortcuts`);
  console.log(`Applications API: http://localhost:${PORT}/api/applications`);
  console.log(`Search API: http://localhost:${PORT}/api/shortcuts/search?q=コピー`);
});
