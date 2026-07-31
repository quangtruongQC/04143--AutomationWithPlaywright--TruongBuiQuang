import { Page } from '@playwright/test';
import { Element } from '../core/elements/element';
import { BASE_URL,DEMOQA_ENDPOINT } from '../config/url';




export class ProfilePage {
    addBook(bookName: string) {
        throw new Error('Method not implemented.');
    }
    private searchBox: Element;
    private okModalButton: Element;

    constructor(private page: Page) {
        this.searchBox = new Element(this.page, '#searchBox', 'Search Box');
        this.okModalButton = new Element(this.page, '#closeSmallModal-ok', 'OK Confirmation Button');
    }

    async gotoProfilePage() {
        await this.page.goto(DEMOQA_ENDPOINT.PROFILE);
    }

    async searchBook(bookName: string) {
        await this.gotoProfilePage();
        await this.searchBox.fill(''); 
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
        const bookSelector = `//a[text()="${bookName}"]`;
        const bookElement = new Element(this.page, bookSelector, `Book Title: ${bookName}`);
        await bookElement.shouldBeVisible();
    }
    async verifyBookIsGone(bookName: string) {
        await this.searchBox.fill('');

        const bookSelector = `//a[text()="${bookName}"]`;
        const bookElement = new Element(this.page, bookSelector, `Book Title: ${bookName}`);
        await bookElement.shouldNotBeVisible();
    }
}