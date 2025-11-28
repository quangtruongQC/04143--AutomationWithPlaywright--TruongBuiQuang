import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { ProfilePage } from '../pages/profile-page';
import * as userData from '../data/loginData.json';

test.describe('Book Delete', () => {
    

    let loginPage: LoginPage;
    let profilePage: ProfilePage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        profilePage = new ProfilePage(page);
        await loginPage.gotoLoginPage();
        await loginPage.login(userData.ValidAccount.username, userData.ValidAccount.password);
    });

    test('Verify delete a book successfully', async () => {
        const bookName = 'Learning JavaScript Design Patterns';

        await profilePage.gotoProfilePage();
        await profilePage.searchBook(bookName);
        await profilePage.deleteBook(bookName);
        await profilePage.verifyBookIsGone(bookName);
    });
});