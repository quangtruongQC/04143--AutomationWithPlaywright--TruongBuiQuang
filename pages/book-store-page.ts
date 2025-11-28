import { Page } from '@playwright/test';
import { Element } from '../core/elements/element';
import { BASE_URL,DEMOQA_ENDPOINT } from '../config/url';


export class BookStorePage {
    private searchBox: Element;
    private bookRows: Element;

    constructor(private page: Page) {
        this.searchBox = new Element(this.page, '#searchBox', 'Book Search Input');
        this.bookRows = new Element(this.page, '.rt-tr-group', 'Book Table Rows');
    }

    async gotoBookStorePage() {
        await this.page.goto(DEMOQA_ENDPOINT.BOOKSTORE);
    }

    async searchBook(keyword: string) {
        await this.searchBox.fill(keyword);
    }

    async getDisplayedBooks(): Promise<string[]> {
        return await this.bookRows.getAllTexts();
    }
}