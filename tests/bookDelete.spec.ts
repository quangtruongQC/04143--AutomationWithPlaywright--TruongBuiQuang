import { test } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { BookStorePage } from '../pages/book-store-page';
import { ProfilePage } from '../pages/profile-page';
import * as userData from '../data/loginData.json';
import bookData from '../data/bookData.json';

/**Book Delete functionality tests.*/
test.describe('Book Delete', () => {
    
    const bookToDelete = bookData.bookToDelete.title;

    let loginPage: LoginPage;
    let profilePage: ProfilePage;
    let bookStorePage: BookStorePage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        profilePage = new ProfilePage(page);
        bookStorePage = new BookStorePage(page);

        await loginPage.gotoLoginPage();
        await loginPage.login(userData.ValidAccount.username, userData.ValidAccount.password);
    });

    test('Verify delete a book successfully', async () => {
        await bookStorePage.addBookToCollection(bookToDelete);
        await profilePage.searchBook(bookToDelete);
        await profilePage.verifyBookIsPresent(bookToDelete);
        await profilePage.deleteBook(bookToDelete);
        await profilePage.verifyBookIsGone(bookToDelete);
    });
});

