import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 375, height: 667 } });

test('The mobile menu opens and closes', async ({ page }) => {
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'main' });
  const menuBtn = page.getByRole('button', { name: 'منو' });

  await expect(menuBtn).toBeVisible();
  await expect(nav).toBeHidden();

  await menuBtn.click();
  await expect(nav).toBeVisible();
  await expect(menuBtn).toHaveAttribute('aria-expanded', 'true');

  await menuBtn.click();
  await expect(nav).toBeHidden();
});

test('The menu button is hidden on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'منو' })).toBeHidden();
  await expect(page.getByRole('navigation', { name: 'main' })).toBeVisible();
});
