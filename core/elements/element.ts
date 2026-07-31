import { Locator, Page, expect } from '@playwright/test';

export class Element {
    protected page: Page;
    protected selector: string;
    protected description: string;
    protected locator: Locator;

    constructor(page: Page, selector: string, description: string) {
        this.page = page;
        this.selector = selector;
        this.description = description; 
        this.locator = this.page.locator(this.selector);
    }

    async click() {
        console.log(`Action: Clicking on '${this.description}'`);
        await this.locator.waitFor({ state: 'visible' });
        await this.locator.click();
    }

    async fill(value: string) {
        console.log(`Action: Filling '${this.description}' with value: ${value}`);
        await this.locator.waitFor({ state: 'visible' });
        await this.locator.fill(value);
    }

    async getText(): Promise<string> {
        console.log(`Action: Retrieving text from '${this.description}'`);
        await this.locator.waitFor({ state: 'visible' });
        return (await this.locator.innerText()).trim();
    }

    async isVisible(): Promise<boolean> {
        return await this.locator.isVisible();
    }

    async shouldBeVisible() {
        console.log(`Assertion: Verifying '${this.description}' is visible`);
        await expect(this.locator).toBeVisible();
    }

    async shouldNotBeVisible() {
        console.log(`Assertion: Verifying '${this.description}' is NOT visible`);
        await expect(this.locator).toBeHidden();
    }

    async waitForElementState(state: 'visible' | 'hidden' | 'attached' | 'detached', timeout = 5000) {
        console.log(`Action: Waiting for '${this.description}' to be '${state}'`);
        await this.locator.waitFor({ state, timeout });
    }

    async getAllTexts(): Promise<string[]> {
        console.log(`Action: Retrieving all text strings from list '${this.description}'`);
        return await this.locator.allInnerTexts();
    }
}