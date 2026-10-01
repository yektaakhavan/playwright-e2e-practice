import { test, expect } from '@playwright/test';
import { login } from './helpers.js';

test('Products are loaded and displayed', async ({ page }) => {
  await login(page);
  await expect(page.getByText('قهوه اسپرسو')).toBeVisible();
  await expect(page.getByText('قهوه ترک')).toBeVisible();
  await expect(page.getByText('لاته')).toBeVisible();
});

test('Product names switch to English with the language', async ({ page }) => {
  await login(page);
  await page.getByRole('button', { name: 'English' }).click();
  await expect(page.getByText('Espresso')).toBeVisible();
  await expect(page.getByText('Turkish Coffee')).toBeVisible();
});

test('An API error is shown and retry works', async ({ page }) => {
  // Mock: make the API return a 500 error
  await page.route('**/products.json', (route) =>
    route.fulfill({ status: 500, body: 'error' })
  );
  await login(page);
  await expect(page.getByRole('alert')).toContainText('خطا در دریافت محصولات');

  // Remove the mock so the next request hits the real file
  await page.unroute('**/products.json');
  await page.getByRole('button', { name: 'تلاش دوباره' }).click();
  await expect(page.getByText('قهوه اسپرسو')).toBeVisible();
  await expect(page.getByRole('alert')).toBeHidden();
});
