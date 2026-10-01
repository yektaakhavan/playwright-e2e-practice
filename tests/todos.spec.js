import { test, expect } from '@playwright/test';
import { login } from './helpers.js';

test.beforeEach(async ({ page }) => {
  await login(page);
});

test('The todo list is empty at first', async ({ page }) => {
  await expect(page.getByText('هنوز کاری اضافه نشده')).toBeVisible();
});

test('Adding a new todo', async ({ page }) => {
  await page.getByLabel('کار جدید').fill('خرید قهوه');
  await page.getByRole('button', { name: 'افزودن' }).click();
  await expect(page.getByText('خرید قهوه')).toBeVisible();
  await expect(page.getByLabel('کار جدید')).toHaveValue('');
  await expect(page.getByText('هنوز کاری اضافه نشده')).toBeHidden();
});

test('An empty todo is not added', async ({ page }) => {
  await page.getByRole('button', { name: 'افزودن' }).click();
  await expect(page.getByText('هنوز کاری اضافه نشده')).toBeVisible();
});

test('Completing and deleting a todo', async ({ page }) => {
  await page.getByLabel('کار جدید').fill('خرید قهوه');
  await page.getByRole('button', { name: 'افزودن' }).click();

  await page.getByRole('checkbox').check();
  await expect(page.getByText('خرید قهوه')).toHaveClass(/done/);

  await page.getByRole('button', { name: 'حذف' }).click();
  await expect(page.getByText('خرید قهوه')).toBeHidden();
  await expect(page.getByText('هنوز کاری اضافه نشده')).toBeVisible();
});
