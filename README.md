# Playwright + TypeScript Automation Framework

[![Playwright Tests](https://github.com/quangtruongQC/04143--AutomationWithPlaywright--TruongBuiQuang/actions/workflows/playwright.yml/badge.svg)](https://github.com/quangtruongQC/04143--AutomationWithPlaywright--TruongBuiQuang/actions/workflows/playwright.yml)

An end-to-end test automation framework built with **Playwright** and **TypeScript**,
following the **Page Object Model (POM)** pattern. It targets the public
[DemoQA](https://demoqa.com) practice site and covers book store search/delete flows
and the student registration form, running cross-browser (Chromium, Firefox, WebKit)
on every push via GitHub Actions.

> 📄 Looking for a breakdown of individual test suites, what each one verifies, and
> the page objects/data files behind them? See [`TEST_OVERVIEW.md`](./TEST_OVERVIEW.md).

---

## Tech Stack

- **[Playwright](https://playwright.dev/)** — browser automation & test runner
- **TypeScript** (strict mode) — type-safe page objects and test data
- **GitHub Actions** — CI running the full suite on every push
- **Page Object Model** — custom `Element` wrapper + `BasePage` for shared navigation logic

---

## Project Structure

```
.
├── .github/workflows/
│   └── playwright.yml        # CI: install, run tests cross-browser, upload report
├── config/
│   └── url.ts                # Single source of truth for base URL & page endpoints
├── core/
│   ├── elements/
│   │   └── element.ts        # Thin wrapper around Playwright locators (click, fill,
│   │                          #  press, getAllTexts, visibility assertions...) with
│   │                          #  built-in action logging for easier debugging/tracing
│   └── types/
│       └── register-data.ts  # Typed shapes for registration test data
├── data/
│   ├── bookData.json
│   ├── loginData.json
│   └── registerData.json     # Test data kept out of test logic (edit data, not code)
├── pages/
│   ├── base-page.ts          # Shared navigation logic all page objects extend
│   ├── book-store-page.ts
│   ├── login-page.ts
│   ├── profile-page.ts
│   └── registration-page.ts
├── tests/
│   ├── bookDelete.spec.ts
│   ├── bookSearch.spec.ts
│   └── registration.spec.ts
├── playwright.config.ts
├── tsconfig.json
└── TEST_OVERVIEW.md           # Detailed per-suite documentation
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Install Playwright browsers (Chromium, Firefox, WebKit)
npx playwright install --with-deps
```

### Available scripts

| Command                | Description                                      |
|-------------------------|--------------------------------------------------|
| `npm test`             | Run the full suite headless, all 3 browsers       |
| `npm run test:headed`  | Run with a visible browser window (local debugging) |
| `npm run test:ui`      | Open Playwright's interactive UI mode             |
| `npm run test:report`  | Open the last HTML test report                    |
| `npm run typecheck`    | Run `tsc --noEmit` to type-check the project       |

Run a single spec file directly:
```bash
npx playwright test tests/bookSearch.spec.ts
```

---

## Continuous Integration

Every push runs the full suite headless across Chromium, Firefox, and WebKit via
GitHub Actions (see `.github/workflows/playwright.yml`), then uploads the HTML
report as a build artifact.

---

## Engineering Highlights

A few design decisions worth calling out (see [`TEST_OVERVIEW.md`](./TEST_OVERVIEW.md#engineering-notes)
for full details):

- **`BasePage`** centralizes navigation so every page object shares one
  `navigateTo()` implementation instead of duplicating `page.goto(...)`.
- **`Element` wrapper** standardizes common actions (`click`, `fill`, `press`,
  `getAllTexts`, visibility assertions) with consistent logging, so traces/reports
  read like a readable action log rather than raw Playwright calls.
- **`waitUntil: 'domcontentloaded'`** is used for navigation instead of the
  Playwright default (`'load'`), since DemoQA loads a number of third-party
  ads/analytics resources that delay the `'load'` event well beyond what's needed
  for the page to be interactive — this was the root cause of intermittent
  navigation timeouts on CI.
- **CI-only retries** are enabled because the suite exercises a real third-party
  website rather than a mocked environment, so a small, explicit retry budget is a
  deliberate trade-off against genuine external network flakiness.
- **Dialog handling on WebKit**: `page.waitForEvent('dialog')` is registered
  *before* the action that triggers it, avoiding a timing race that WebKit is more
  sensitive to than Chromium/Firefox.

---

## Author

**Truong Bui Quang**
