import { Page } from '@playwright/test';
import { Element } from '../core/elements/element';
import { BASE_URL,DEMOQA_ENDPOINT } from '../config/url';




export class ProfilePage {
    private searchBox: Element;
    private okModalButton: Element;

    constructor(private page: Page) {
        // Static elements defined once
        this.searchBox = new Element(this.page, '#searchBox', 'Search Box');
        this.okModalButton = new Element(this.page, '#closeSmallModal-ok', 'OK Confirmation Button');
    }

    async gotoProfilePage() {
        await this.page.goto(DEMOQA_ENDPOINT.PROFILE);
    }

    async searchBook(bookName: string) {

        await this.searchBox.fill(''); 
        await this.searchBox.fill(bookName);
    }

    async deleteBook(bookName: string) {
        this.page.once('dialog', async dialog => {
            console.log(`Dialog message: ${dialog.message()}`);
            await dialog.accept();
        });

        const deleteSelector = `.rt-tr-group:has-text("${bookName}") [id^="delete-record"]`;
        const deleteButton = new Element(this.page, deleteSelector, `Delete Icon for ${bookName}`);

        await deleteButton.click();
        await this.okModalButton.click();
        await this.searchBox.fill('');
        await this.page.waitForTimeout(500);
    }

    async verifyBookIsGone(bookName: string) {
        await this.searchBox.fill('');

        const rowSelector = `.rt-tr-group:has-text("${bookName}")`;
        const bookRow = new Element(this.page, rowSelector, `Row with book ${bookName}`);

        await bookRow.shouldNotBeVisible();
    }
}