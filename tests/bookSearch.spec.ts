import { test } from '@playwright/test';
import { BookStorePage } from '../pages/book-store-page';

/**
 * Book Store search functionality tests.
 * Verifies that searching the Book Store returns only books matching the
 * given keyword, case-insensitively.
 */
test.describe('Book Search Functionality', () => {

    let bookStorePage: BookStorePage;

    test.beforeEach(async ({ page }) => {
        bookStorePage = new BookStorePage(page);
    });

    // Keywords to test for case-insensitive matching behavior.
    const keywords = ['Design', 'design'];

    for (const keyword of keywords) {
        test(`Search book with "${keyword}" returns only books matching the keyword (case-insensitive)`, async () => {
            await bookStorePage.searchBook(keyword);
            await bookStorePage.verifyOnlyMatchingBooks(keyword);
        });
    }
});
