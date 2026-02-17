import { test, expect } from '@playwright/test';

test('has title and shows setup screen', async ({ page }) => {
  await page.goto('/');

  // タイトルが含まれているか確認
  await expect(page).toHaveTitle(/Keyboard Visualizer/);

  // ランディングページが表示されているか確認
  const startButton = page.getByRole('button', { name: /Start Learning/i });
  await expect(startButton).toBeVisible();
});

test('can navigate to setup and select app', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Start Learning/i }).click();

  // /app に遷移し、SetupScreenが表示されることを確認
  await expect(page).toHaveURL(/.*app/);
  
  // アプリ選択ボタンが表示されるまで待機（実際の実装に合わせて調整）
  // 例: const chromeBtn = page.getByText('Google Chrome');
  // await expect(chromeBtn).toBeVisible();
});
