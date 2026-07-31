import { test } from '@playwright/test';
import { RegistrationPage } from '../pages/registration-page';
import * as registerData from '../data/registerData.json';

/**Student Registration Form functionality tests.*/
test.describe('Student Registration Form Functionality', () => {
    
    let registrationPage: RegistrationPage;

    test.beforeEach(async ({ page }) => {
        registrationPage = new RegistrationPage(page);
        await registrationPage.gotoRegistrationPage();
    });

    test('Register student with required fields', async () => {
        const data = registerData.requiredFieldsData;

        await test.step('Fill and submit registration form', async () => {
            await registrationPage.fillRequiredFieldsForm(data);
            await registrationPage.submitForm();
        });

        await test.step('Verify modal popup and submitted information', async () => {
            await registrationPage.verifyModalTitle('Thanks for submitting the form');

            await registrationPage.verifySubmittedValue('Student Name', `${data.firstName} ${data.lastName}`);
            await registrationPage.verifySubmittedValue('Student Email', data.email);
            await registrationPage.verifySubmittedValue('Gender', data.gender);
            await registrationPage.verifySubmittedValue('Mobile', data.mobile.toString());
        });
    });

    test('Register student with all fields', async () => {
        const data = registerData.allFieldsData;

        await test.step('Fill all fields and submit form', async () => {
            await registrationPage.fillAllFieldsForm(data);
            await registrationPage.submitForm();
        });

        await test.step('Verify modal popup and all submitted information', async () => {
            await registrationPage.verifyModalTitle('Thanks for submitting the form');

            await registrationPage.verifySubmittedValue('Student Name', `${data.firstName} ${data.lastName}`);
            await registrationPage.verifySubmittedValue('Student Email', data.email);
            await registrationPage.verifySubmittedValue('Gender', data.gender);
            await registrationPage.verifySubmittedValue('Mobile', data.mobile);
            await registrationPage.verifySubmittedValue('Subjects', data.subject);
            await registrationPage.verifySubmittedValue('Hobbies', data.hobbies.join(', '));
            await registrationPage.verifySubmittedValue('Address', data.address);
            await registrationPage.verifySubmittedValue('State and City', `${data.state} ${data.city}`);
        });
    });
});
