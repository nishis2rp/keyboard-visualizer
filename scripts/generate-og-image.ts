import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import * as fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function generateOGImage() {
  console.log('🎨 Generating OG image...');

  // Create HTML for OG image
  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 1200px;
      height: 630px;
      background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Segoe UI Symbol', sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }
    .grid {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image:
        linear-gradient(rgba(74, 85, 104, 0.3) 1px, transparent 1px),
        linear-gradient(90deg, rgba(74, 85, 104, 0.3) 1px, transparent 1px);
      background-size: 40px 40px;
      z-index: 0;
    }
    .content {
      position: relative;
      z-index: 1;
      width: 100%;
      padding: 80px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .left {
      flex: 1;
    }
    .keyboard-icon {
      display: grid;
      grid-template-columns: repeat(8, 50px);
      gap: 10px;
      margin-bottom: 40px;
    }
    .key {
      width: 50px;
      height: 50px;
      background: #2d3748;
      border: 3px solid #4299e1;
      border-radius: 8px;
      position: relative;
      background: linear-gradient(180deg, rgba(66, 153, 225, 0.3) 0%, rgba(66, 153, 225, 0) 100%);
    }
    .key::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: #2d3748;
      border-radius: 5px;
      z-index: -1;
    }
    h1 {
      font-size: 64px;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 20px;
      letter-spacing: -1px;
    }
    .subtitle {
      font-size: 28px;
      color: #a0aec0;
      margin-bottom: 30px;
      line-height: 1.4;
    }
    .accent-line {
      width: 300px;
      height: 4px;
      background: #4299e1;
      border-radius: 2px;
      margin-bottom: 20px;
    }
    .url {
      font-size: 18px;
      color: #718096;
      font-family: 'Courier New', monospace;
    }
    .badges {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .badge {
      background: rgba(66, 153, 225, 0.15);
      border: 2px solid #4299e1;
      border-radius: 12px;
      padding: 20px 30px;
      display: flex;
      align-items: center;
      gap: 20px;
      min-width: 280px;
    }
    .badge-icon {
      font-size: 48px;
      line-height: 1;
    }
    .badge-content {
      flex: 1;
    }
    .badge-number {
      font-size: 32px;
      font-weight: 700;
      color: #ffffff;
      line-height: 1;
      margin-bottom: 5px;
    }
    .badge-label {
      font-size: 18px;
      color: #a0aec0;
    }
  </style>
</head>
<body>
  <div class="grid"></div>
  <div class="content">
    <div class="left">
      <div class="keyboard-icon">
        ${Array(24).fill(0).map((_, i) => {
          if (i >= 8 && i < 12) return '';
          if (i >= 16 && i < 18) return '';
          return '<div class="key"></div>';
        }).join('')}
      </div>
      <h1>Keyboard Visualizer</h1>
      <div class="subtitle">
        1,300+ Shortcuts<br>
        Interactive Quiz | Real-time Visualization
      </div>
      <div class="accent-line"></div>
      <div class="url">nishis2rp.github.io/keyboard-visualizer</div>
    </div>
    <div class="badges">
      <div class="badge">
        <div class="badge-icon">⌨️</div>
        <div class="badge-content">
          <div class="badge-number">1,300+</div>
          <div class="badge-label">Shortcuts</div>
        </div>
      </div>
      <div class="badge">
        <div class="badge-icon">🎯</div>
        <div class="badge-content">
          <div class="badge-number">9 Apps</div>
          <div class="badge-label">Supported</div>
        </div>
      </div>
      <div class="badge">
        <div class="badge-icon">📊</div>
        <div class="badge-content">
          <div class="badge-number">4 Levels</div>
          <div class="badge-label">Difficulty</div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 }
  });

  await page.setContent(html);

  const outputPath = join(__dirname, '../public/og-image.png');
  await page.screenshot({
    path: outputPath,
    type: 'png'
  });

  await browser.close();

  console.log('✅ OG image generated:', outputPath);
  console.log('   Size: 1200x630px');

  // Check file size
  const stats = fs.statSync(outputPath);
  console.log(`   File size: ${(stats.size / 1024).toFixed(2)} KB`);
}

generateOGImage().catch(console.error);
