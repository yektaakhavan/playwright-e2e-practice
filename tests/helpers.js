export async function login(page) {
  await page.goto('/');
  await page.getByLabel('ایمیل').fill('test@test.com');
  await page.getByLabel('رمز عبور').fill('1234');
  await page.getByRole('button', { name: 'ورود' }).click();
}
