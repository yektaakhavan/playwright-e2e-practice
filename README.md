# Playwright E2E Practice

A small React app built to practice **end-to-end testing with [Playwright](https://playwright.dev)**.

The app itself is intentionally simple (login, todo list, language switch, product list). The point of this repo is the test suite: 14 tests covering user flows, RTL/multi-language behavior, responsive layout, and API error handling.


![Playwright report](/src/docs/report.png)

## What's tested

| Area               | Tests                                                                                             |
| ------------------ | ------------------------------------------------------------------------------------------------- |
| **Login**          | Successful login · wrong password shows an error · logout returns to the login form               |
| **Todos**          | Empty state · add a todo · empty input is ignored · complete and delete a todo                    |
| **Language / RTL** | Default Persian with `dir="rtl"` · switch to English (`dir="ltr"`) and back                       |
| **Responsive**     | Mobile menu opens and closes (375px) · menu button is hidden on desktop                           |
| **Products / API** | Products load · names switch with the language · mocked 500 error is shown and **Retry** recovers |

## Things this project demonstrates

- **Accessible locators** (`getByRole`, `getByLabel`) instead of brittle CSS selectors
- **API mocking** with `page.route()` to test the error state without a backend
- **Viewport testing** for mobile vs. desktop behavior
- **RTL / i18n assertions** on the `<html>` `dir` and `lang` attributes
- A shared `login()` helper to keep tests short and readable
- `webServer` config so `npx playwright test` starts the app by itself

## Tech stack

React 18 · Vite · Playwright Test · plain CSS

## Getting started

```bash
git clone https://github.com/yektaakhavan/playwright-e2e-practice
cd playwright-e2e-practice
npm install
npm run dev          # http://localhost:5173
```

Demo credentials:

```
email:    test@test.com
password: 1234
```

## Running the tests

```bash
npx playwright test            # run all tests (starts the dev server automatically)
npx playwright test --ui       # interactive UI mode with time-travel debugging
npx playwright test --headed   # watch the browser while tests run
npx playwright show-report     # open the HTML report
```

> **Note:** the config uses your locally installed Google Chrome (`channel: 'chrome'`), so no browser download is needed. To use Edge instead, switch the project in `playwright.config.js`. To use Playwright's bundled browsers, run `npx playwright install` and remove the `channel` option.

## Project structure

```
.
├── public/
│   └── products.json        # data the app fetches (mocked in one test)
├── src/
│   ├── App.jsx              # login, todos, products, language switch
│   ├── main.jsx
│   └── styles.css
├── tests/
│   ├── helpers.js           # shared login() helper
│   ├── login.spec.js
│   ├── todos.spec.js
│   ├── language.spec.js
│   ├── mobile-menu.spec.js
│   └── products.spec.js
├── playwright.config.js
└── package.json
```

## Example test

```js
test("An API error is shown and retry works", async ({ page }) => {
  // Mock: make the API return a 500 error
  await page.route("**/products.json", (route) =>
    route.fulfill({ status: 500, body: "error" }),
  );
  await login(page);
  await expect(page.getByRole("alert")).toContainText("خطا در دریافت محصولات");

  // Remove the mock so the next request hits the real file
  await page.unroute("**/products.json");
  await page.getByRole("button", { name: "تلاش دوباره" }).click();
  await expect(page.getByText("قهوه اسپرسو")).toBeVisible();
});
```

The UI text is in Persian, so locators match Persian labels while test titles stay in English for readable reports.

## What I learned

- Auto-waiting makes Playwright tests far less flaky than manual waits
- Semantic locators double as a light accessibility check
- Mocking network responses is the easiest way to test error states

## Next steps

- [ ] Visual regression tests with `toHaveScreenshot()`
- [ ] Accessibility checks with `@axe-core/playwright`
- [ ] Run the suite in GitHub Actions on every pull request
- [ ] Page Object Model for larger suites

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png" width="100%" alt="section divider" />

## 👨‍💻 Author

**Yekta Akhavan**

<p align="center">
  <a href="mailto:yekta.akhavan.dev@gmail.com">
    <img src="https://img.shields.io/badge/Gmail-yekta.akhavan.dev%40gmail.com-EA4335?style=for-the-badge&logo=gmail&logoColor=white&labelColor=0D1117" alt="Email" />
  </a>
  &nbsp;
  <a href="https://www.linkedin.com/in/yekta-akhavan/">
    <img src="https://img.shields.io/badge/LinkedIn-Yekta%20Akhavan-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white&labelColor=0D1117" alt="LinkedIn" />
  </a>
  &nbsp;
  <a href="https://www.instagram.com/yektaakhavan.dev?igsi=d2Vya2RqazhqZ2Z2">
    <img src="https://img.shields.io/badge/Instagram-yekta--akhavan-E4405F?style=for-the-badge&logo=instagram&logoColor=white&labelColor=0D1117" alt="Instagram" />
  </a>
  &nbsp;
  <a href="https://yekta-akhavan.vercel.app/">
    <img src="https://img.shields.io/badge/Portfolio-yekta--akhavan.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white&labelColor=0D1117" alt="Portfolio" />
  </a>
</p>
