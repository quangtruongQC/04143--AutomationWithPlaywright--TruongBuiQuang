import { Page } from '@playwright/test';
import { Element } from '../core/elements/element';
import { DEMOQA_ENDPOINT } from '../config/url';
import { BasePage } from './base-page';

export class ProfilePage extends BasePage {
    private searchBox: Element;
    private okModalButton: Element;

    constructor(page: Page) {
        super(page);
        this.searchBox = new Element(this.page, '#searchBox', 'Search Box');
        this.okModalButton = new Element(this.page, '#closeSmallModal-ok', 'OK Confirmation Button');
    }

    async gotoProfilePage() {
        await this.navigateTo(DEMOQA_ENDPOINT.PROFILE);
    }

    async searchBook(bookName: string) {
        await this.gotoProfilePage();
        await this.searchBox.fill(bookName);
    }

    async deleteBook(bookName: string) {
        await this.searchBook(bookName);

        const deleteXpath = `//tr[.//a[text()="${bookName}"]]//span[contains(@id, 'delete-record')]`;
        const deleteButton = new Element(this.page, deleteXpath, `Delete Icon for ${bookName}`);
        await deleteButton.click();
        await this.okModalButton.click();
    }

    async verifyBookIsPresent(bookName: string) {
        await this.bookLinkByTitle(bookName).shouldBeVisible();
    }

    async verifyBookIsGone(bookName: string) {
        await this.searchBox.fill('');
        await this.bookLinkByTitle(bookName).shouldNotBeVisible();
    }

    private bookLinkByTitle(bookName: string): Element {
        return new Element(this.page, `//a[text()="${bookName}"]`, `Book Title: ${bookName}`);
    }
}