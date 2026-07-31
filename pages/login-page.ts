import { Page } from '@playwright/test';
import { Element } from '../core/elements/element';
import { DEMOQA_ENDPOINT } from '../config/url';
import { BasePage } from './base-page';

export class LoginPage extends BasePage {
    private usernameInput: Element;
    private passwordInput: Element;
    private loginButton: Element;

    constructor(page: Page) {
        super(page);
        this.usernameInput = new Element(this.page, '#userName', 'Username Input');
        this.passwordInput = new Element(this.page, '#password', 'Password Input');
        this.loginButton = new Element(this.page, '#login', 'Login Button');
    }

    async gotoLoginPage() {
        await this.navigateTo(DEMOQA_ENDPOINT.LOGIN);
    }

    async login(username: string, pass: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(pass);
        await this.loginButton.click();
        await this.page.waitForURL(DEMOQA_ENDPOINT.PROFILE); 
    }
}