import { Page } from '@playwright/test';

/**
 * Base class for all Page Objects.
 */
export abstract class BasePage {
    constructor(protected page: Page) {}

    protected async navigateTo(url: string) {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
}
}
