# Test Suite Overview

This document provides an overview of the three main Playwright test suites in the
`tests/` folder, explaining their purpose, how they are structured, and the Page
Object Models (POMs) they depend on.

---

## Table of Contents

1. [Common Structure](#common-structure)
2. [Book Search Functionality (`bookSearch.spec.ts`)](#book-search-functionality-booksearchspect)
3. [Book Delete (`bookDelete.spec.ts`)](#book-delete-bookdeletespect)
4. [Student Registration Form (`Registraion.spec.ts`)](#student-registration-form-registraionspect)
5. [How to Run](#how-to-run)

---

## Common Structure

All test suites follow the **Page Object Model (POM)** pattern:

- Test files live under `tests/`.
- Page Object classes live under `pages/`.
- Test data lives under `data/` as JSON files.
- Reusable element wrappers live in `core/elements/`.

Each test file uses a `test.describe(...)` block, sets up its page object(s) in a
`test.beforeEach(...)` hook, and keeps the actual test steps thin and declarative
by delegating actions and verification to the Page Objects.

---

## Book Search Functionality (`bookSearch.spec.ts`)

**Purpose**

Verify that searching for a book on the Book Store page returns *only* books
matching the given keyword, and that the matching is **case-insensitive**.

| Item | Details |
|------|---------|
| **File** | `tests/bookSearch.spec.ts` |
| **POM used** | `BookStorePage` (`pages/book-store-page.ts`) |
| **Data used** | Inline array of keywords: `['Design', 'design']` |

### Tests

- `Search book with "<keyword>" returns only books matching the keyword (case-insensitive)`
  - Iterates over `['Design', 'design']`, generating one test per keyword.
  - Searches for the keyword.
  - Calls `verifyOnlyMatchingBooks(keyword)` which asserts that:
    1. At least one result is returned (uses `expect.poll` for stability).
    2. Every returned book title contains the keyword (case-insensitive).

### Maintenance Notes

The assertion logic lives in `BookStorePage.verifyOnlyMatchingBooks(...)`, so if the
verification rules change, they are updated in one place. Adding more keywords to the
`keywords` array automatically generates more test cases.

---

## Book Delete (`bookDelete.spec.ts`)

**Purpose**

Verify the full delete flow: add a book to the logged-in user's collection, then
delete it from the profile and confirm it is no longer present.

| Item | Details |
|------|---------|
| **File** | `tests/bookDelete.spec.ts` |
| **POMs used** | `LoginPage`, `BookStorePage`, `ProfilePage` |
| **Data used** | `loginData.json` (credentials), `bookData.json` (book title) |

### Setup (`beforeEach`)

1. Instantiates `LoginPage`, `BookStorePage`, and `ProfilePage`.
2. Navigates to the login page.
3. Logs in using the valid account from `loginData.json`.

### Tests

- `Verify delete a book successfully`
  1. `BookStorePage.addBookToCollection(bookTitle)` – searches for and adds the book.
  2. `ProfilePage.searchBook(bookTitle)` – navigates to profile and filters for the book.
  3. `ProfilePage.verifyBookIsPresent(bookTitle)` – confirms the book is listed.
  4. `ProfilePage.deleteBook(bookTitle)` – deletes the book and confirms the modal.
  5. `ProfilePage.verifyBookIsGone(bookTitle)` – confirms the book is no longer listed.

### Maintenance Notes

The book title to delete is read from `data/bookData.json`
(`bookData.bookToDelete.title`), so changing the target book requires editing only the
JSON data file, not the test logic.

---

## Student Registration Form (`Registraion.spec.ts`)

**Purpose**

Verify that the student registration form can be submitted with **required** fields
only, and with **all** fields, and that the success modal correctly reflects the
submitted data.

> Note: The file name `Registraion.spec.ts` is a historical spelling; it is kept to
> avoid breaking existing CI/runner references.

| Item | Details |
|------|---------|
| **File** | `tests/Registraion.spec.ts` |
| **POM used** | `RegistrationPage` (`pages/registration-page.ts`) |
| **Data used** | `registerData.json` (`requiredFieldsData`, `allFieldsData`) |

### Tests

1. **`Register student with required fields`**
   - Fills required fields and submits.
   - Verifies the modal title and the submitted `Student Name`, `Student Email`,
     `Gender`, and `Mobile` values.

2. **`Register student with all fields`**
   - Fills all fields (including date of birth, subjects, hobbies, address,
     state, and city) and submits.
   - Verifies the modal title and all submitted values.

### Maintenance Notes

The repeated modal assertions are wrapped in two helpers on `RegistrationPage`:

- `verifyModalTitle(expectedTitle)`
- `verifySubmittedValue(labelName, expected)`

These keep the test bodies readable and DRY. The `getSubmittedValueByLabel(...)`
method returns a trimmed value, so callers do not need to call `.trim()` manually.

---

## How to Run

Run a single spec file:

```bash
npx playwright test tests/bookSearch.spec.ts
npx playwright test tests/bookDelete.spec.ts
npx playwright test tests/Registraion.spec.ts
```

Run all specs:

```bash
npx playwright test
```

Run with the headed browser for debugging:

```bash
npx playwright test --headed
```

---

## Dependency Map

| Test File | Page Objects | Data Files |
|-----------|--------------|------------|
| `bookSearch.spec.ts` | `BookStorePage` | – (inline keywords) |
| `bookDelete.spec.ts` | `LoginPage`, `BookStorePage`, `ProfilePage` | `loginData.json`, `bookData.json` |
| `Registraion.spec.ts` | `RegistrationPage` | `registerData.json` |
