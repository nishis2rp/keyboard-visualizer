import { test, expect } from '@playwright/test';

test.describe('Quiz Flow', () => {
  test('should allow user to start a quiz and see a question', async ({ page }) => {
    await page.goto('/app');

    // Setup Screenが表示されていることを確認
    await expect(page.getByText(/Select Mode/i)).toBeVisible();

    // クイズモードを選択
    await page.getByText('Quiz Mode').click();

    // アプリを選択 (Google Chromeなど)
    // 最初のアプリボタンをクリック
    await page.locator('.app-selector-grid button').first().click();

    // スタートボタンをクリック
    await page.getByRole('button', { name: /Start/i }).click();

    // クイズ画面に遷移したことを確認
    await expect(page.locator('.quiz-container')).toBeVisible();
    
    // 問題文が表示されていることを確認
    await expect(page.locator('.question-text')).toBeVisible();
  });
});
