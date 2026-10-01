import { test, expect } from '@playwright/test';
import { login } from './helpers.js';

test('Successful login', async ({ page }) => {
  await login(page);
  await expect(page.getByText('خوش آمدی')).toBeVisible();
});

test('Logging in with the wrong password displays an error', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('ایمیل').fill('test@test.com');
  await page.getByLabel('رمز عبور').fill('wrong');
  await page.getByRole('button', { name: 'ورود' }).click();
  await expect(page.getByRole('alert')).toContainText('اشتباه است');
});

test('Logging out returns to the login form', async ({ page }) => {
  await login(page);
  await page.getByRole('button', { name: 'خروج' }).click();
  await expect(page.getByLabel('ایمیل')).toBeVisible();
  await expect(page.getByText('خوش آمدی')).toBeHidden();
});
