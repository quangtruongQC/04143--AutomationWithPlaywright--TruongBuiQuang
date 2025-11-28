import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { ProfilePage } from '../pages/profile-page';
import { BookStorePage } from '../pages/book-store-page';
import * as bookData from '../data/bookData.json';


test.describe('Book Search Functionality', () => {
    
    let bookStorePage: BookStorePage;

    test.beforeEach(async ({ page }) => {
        bookStorePage = new BookStorePage(page);
        await bookStorePage.gotoBookStorePage();
    });

    test('Search book with multiple results (case-insensitive)', async () => {
        await test.step('Search with "Design"', async () => {
            await bookStorePage.searchBook('Design');
            
            const books = await bookStorePage.getDisplayedBooks();
            
            const hasMatch = books
                .filter(text => text.trim() !== '') 
                .some(book => book.toLowerCase().includes('design'));
            
            expect(hasMatch, 'Expected at least one book to match "Design"').toBeTruthy();
        });


        await test.step('Search with "design"', async () => {
            await bookStorePage.searchBook('design');
            const books = await bookStorePage.getDisplayedBooks();
            
            const hasMatch = books
                .filter(text => text.trim() !== '')
                .some(book => book.toLowerCase().includes('design'));

            expect(hasMatch, 'Expected at least one book to match "design"').toBeTruthy();
        });
    });
});