import { Page, expect } from '@playwright/test';
import { Element } from '../core/elements/element';
import { DEMOQA_ENDPOINT } from '../config/url';
import { RegisterFormData, FullRegisterFormData } from '../core/types/register-data';
import { BasePage } from './base-page';

export class RegistrationPage extends BasePage {
    private firstNameInput: Element;
    private lastNameInput: Element;
    private emailInput: Element;
    private mobileInput: Element;
    private dateInput: Element;
    private subjectInput: Element;
    private addressInput: Element;
    private stateInput: Element;
    private cityInput: Element;
    private submitBtn: Element;

    constructor(page: Page) {
        super(page);
        this.firstNameInput = new Element(this.page, '#firstName', 'First Name Input');
        this.lastNameInput = new Element(this.page, '#lastName', 'Last Name Input');
        this.emailInput = new Element(this.page, '#userEmail', 'Email Input');
        this.mobileInput = new Element(this.page, '#userNumber', 'Mobile Input');
        this.dateInput = new Element(this.page, '#dateOfBirthInput', 'Date of Birth Input');
        this.subjectInput = new Element(this.page, '#subjectsInput', 'Subjects Input');
        this.addressInput = new Element(this.page, '#currentAddress', 'Current Address Input');
        this.stateInput = new Element(this.page, '#state', 'State Dropdown');
        this.cityInput = new Element(this.page, '#city', 'City Dropdown');

        this.submitBtn = new Element(this.page, '#submit', 'Submit Button');
    }

    async gotoRegistrationPage() {
        await this.navigateTo(DEMOQA_ENDPOINT.REGISTRATION);
        await this.page.addStyleTag({
            content: `
                * {
                    transition: none !important;
                    animation: none !important;
                }
            `
        });
    }

    async fillRequiredFieldsForm(registerData: RegisterFormData) {
        await this.firstNameInput.fill(registerData.firstName);
        await this.lastNameInput.fill(registerData.lastName);
        await this.emailInput.fill(registerData.email);
        await this.page.locator(`label[for^="gender-radio"]:text-is("${registerData.gender}")`).click();
        await this.mobileInput.fill(registerData.mobile);
    }

    async selectDateOfBirth(dateStr: string) {
        await this.dateInput.click();
        await this.dateInput.press('Control+A');
        await this.dateInput.fill(dateStr);
        await this.dateInput.press('Enter');
    }

    async selectSubjects(subject: string) {
        await this.subjectInput.fill(subject);
        await this.subjectInput.press('Enter');
    }

    async selectHobbies(hobbies: string[]) {
        for (const hobby of hobbies) {
            await this.page.locator(`label:has-text("${hobby}")`).click();
        }
    }

    async fillAddress(address: string) {
        await this.addressInput.fill(address);
    }

    async selectStateAndCity(state: string, city: string) {
        await this.stateInput.click();
        await this.page.locator(`div[id^="react-select-3-option"]:text-is("${state}")`).click();

        await this.cityInput.click();
        await this.page.locator(`div[id^="react-select-4-option"]:text-is("${city}")`).click();
    }

    async fillAllFieldsForm(registerData: FullRegisterFormData) {
        await this.fillRequiredFieldsForm(registerData);
        await this.selectDateOfBirth(registerData.dateOfBirth);
        await this.selectSubjects(registerData.subject);
        await this.selectHobbies(registerData.hobbies);
        await this.fillAddress(registerData.address);
        await this.selectStateAndCity(registerData.state, registerData.city);
    }

    async submitForm() {
        await this.submitBtn.click();
    }

    async getModalTitle(): Promise<string> {
        const titleElement = this.page.locator('.modal-title');
        await titleElement.waitFor({ state: 'visible' });
        return await titleElement.textContent() || '';
    }

    async getSubmittedValueByLabel(labelName: string): Promise<string> {
        const valueCell = this.page.locator(`tbody tr:has(td:text-is("${labelName}")) td:nth-child(2)`);
        return (await valueCell.textContent() || '').trim();
    }

    /**
     * Verifies that the success modal appears with the given title.
     *
     * @param expectedTitle - The expected modal title text.
     */
    async verifyModalTitle(expectedTitle: string) {
        await expect(this.page.locator('.modal-title')).toContainText(expectedTitle);
    }

    /**
     * Verifies that a submitted field in the success modal equals the expected value.
     *
     * @param labelName - The label in the review table (e.g. "Student Name").
     * @param expected  - The expected value for that field.
     */
    async verifySubmittedValue(labelName: string, expected: string) {
        const actual = await this.getSubmittedValueByLabel(labelName);
        expect(actual).toBe(expected);
    }
}
