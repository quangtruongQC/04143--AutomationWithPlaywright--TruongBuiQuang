import { Page, expect } from '@playwright/test';
import { Element } from '../core/elements/element';
import { DEMOQA_ENDPOINT } from '../config/url';

export class BookStorePage {
    /**
     * Tuning values used by the search-result stabilization logic.
     * - MAX_STABILIZE_ATTEMPTS: max polling iterations waiting for results to settle.
     * - STABILIZE_INTERVAL_MS: delay (ms) between each snapshot.
     */
    private static readonly MAX_STABILIZE_ATTEMPTS = 20;
    private static readonly STABILIZE_INTERVAL_MS = 300;
    /** Sentinel string representing the "no rows found" state. */
    private static readonly NO_DATA_MARKER = '__NO_DATA__';

    private searchBox: Element;
    private addToCollectionBtn: Element;
    private bookItems: Element;

    constructor(private page: Page) {
        this.searchBox = new Element(this.page, '#searchBox', 'Book Search Input');
        this.addToCollectionBtn = new Element(this.page, 'button:has-text("Add To Your Collection")', 'Add To Collection Button');
        this.bookItems = new Element(this.page, 'table tbody tr td:nth-child(2) a', 'List of Book Titles');
    }


    async gotoBookStorePage() {
        await this.page.goto(DEMOQA_ENDPOINT.BOOKSTORE);
    }

    /**
     * Searches for a book by name (case-insensitive).
     *
     * NOTE: `fill()` automatically clears any previous value before typing,
     * so there is no need to clear the search box manually.
     *
     * @param bookName - The book title (or part of it) to search for.
     */
    async searchBook(bookName: string) {
        await this.gotoBookStorePage();
        await this.searchBox.fill(bookName);
        await this.waitForResultsToStabilize();
    }

    /**
     * Waits for the search results to finish updating before proceeding.
     *
     * The results table is re-rendered asynchronously after typing, so we poll a
     * snapshot of the current rows and consider the results "stable" once we observe
     * two identical consecutive snapshots, ignoring the transient empty state `[]`
     * that appears while data is being reloaded.
     *
     * @param maxAttempts - Maximum number of polling iterations.
     * @param intervalMs  - Delay (ms) between each snapshot.
     */
    private async waitForResultsToStabilize(
        maxAttempts = BookStorePage.MAX_STABILIZE_ATTEMPTS,
        intervalMs = BookStorePage.STABILIZE_INTERVAL_MS
    ) {
        let previousSnapshot: string | null = null;

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            await this.page.waitForTimeout(intervalMs);
            const snapshot = await this.getResultsSnapshot();

            // Skip the transient empty state while results are being reloaded.
            const isTransientLoadingState = snapshot === '[]';

            if (!isTransientLoadingState && snapshot === previousSnapshot) {
                // Two identical, non-empty snapshots -> results are stable.
                return;
            }
            previousSnapshot = snapshot;
        }
    }

    /**
     * Captures the current state of the search results as a serializable string.
     *
     * Returns `NO_DATA_MARKER` when the "no rows found" indicator is present;
     * otherwise returns a JSON string of all trimmed book titles.
     */
    private async getResultsSnapshot(): Promise<string> {
        const noDataCount = await this.page.getByText(/no rows found/i).count();
        if (noDataCount > 0) return BookStorePage.NO_DATA_MARKER;

        const texts = await this.bookItems.getAllTexts();
        return JSON.stringify(texts.map(text => text.trim()));
    }

    /**
     * Adds a specific book to the user's collection.
     * @param bookName - The exact book title to add to the collection.
     */
    async addBookToCollection(bookName: string) {
        await this.searchBook(bookName);

        const specificBookLink = new Element(
            this.page,
            `//span[@id='see-book-${bookName}']//a`,
            `Book Link: ${bookName}`
        );
        await specificBookLink.click();

        // The app shows a dialog (e.g. "Book added to your collection!"); accept it.
        this.page.once('dialog', async dialog => {
            console.log(`Alert message: ${dialog.message()}`);
            await dialog.accept();
        });

        await this.addToCollectionBtn.click();
    }

    /**
     * Returns the list of currently visible book titles in the search results.
     *
     * @returns An array of non-empty book title strings.
     */
    async getDisplayedBooks(): Promise<string[]> {
        const texts = await this.bookItems.getAllTexts();
        return texts.map(text => text.trim()).filter(text => text.length > 0);
    }

    /**
     * Verifies that the current search results contain at least one result AND
     * that every returned book matches the given keyword (case-insensitive).
     *
     * @param keyword - The keyword that was searched for.
     */
    async verifyOnlyMatchingBooks(keyword: string) {
        // Must have at least one result for the given keyword.
        await expect
            .poll(async () => (await this.getDisplayedBooks()).length)
            .toBeGreaterThan(0);

        const nonMatching = (await this.getDisplayedBooks()).filter(
            book => !book.toLowerCase().includes(keyword.toLowerCase())
        );

        await expect(
            nonMatching,
            `Expected ALL returned books to match "${keyword}", but found non-matching books: ${JSON.stringify(nonMatching)}`
        ).toEqual([]);
    }
}
