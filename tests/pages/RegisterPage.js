const { expect } = require('@playwright/test');

exports.RegisterPage = class RegisterPage {
  constructor(page) {
    this.page = page;

    this.registerIcon = page.locator('#menuUserLink');
    this.newUserButton = page.locator('a.create-new-account');

    this.usernameInput = page.locator('input[name="usernameRegisterPage"]');
    this.emailInput = page.locator('input[name="emailRegisterPage"]');
    this.passwordInput = page.locator('input[name="passwordRegisterPage"]');
    this.confirmPasswordInput = page.locator('input[name="confirm_passwordRegisterPage"]');
    this.firstNameInput = page.locator('input[name="first_nameRegisterPage"]');
    this.lastNameInput = page.locator('input[name="last_nameRegisterPage"]');
    this.phoneInput = page.locator('input[name="phone_numberRegisterPage"]');
    this.countryDropdown = page.locator('select[name="countryListboxRegisterPage"]');
    this.cityInput = page.locator('input[name="cityRegisterPage"]');
    this.addressInput = page.locator('input[name="addressRegisterPage"]');
    this.stateInput = page.locator('input[name="state_/_province_/_regionRegisterPage"]');
    this.postalCodeInput = page.locator('input[name="postal_codeRegisterPage"]');
    this.termsCheckbox = page.locator('input[name="i_agree"]');
    this.registerButton = page.getByRole('button', { name: 'REGISTER' });

    this.successUserName = page.locator('#menuUserLink > span');
    this.popupCloseBtn = page.locator('.loginPopUpCloseBtn');
    this.popupContainer = page.locator('div.PopUp');
    this.checkOutButton = page.locator('#checkOutButton');
  }

  async navigateToRegister() {
    await this.page.goto('https://www.advantageonlineshopping.com/#/');

    if (await this.popupContainer.isVisible({ timeout: 3000 }).catch(() => false)) {
      await this.popupCloseBtn.click();
      await this.popupContainer.waitFor({ state: 'hidden', timeout: 5000 });
    }

    await this.registerIcon.click();

    const signOutLink = this.page.locator('label.option.roboto-medium[role="link"]', { hasText: 'Sign out' });
    if (await signOutLink.isVisible()) {
      await signOutLink.click();
      await expect(this.successUserName).toBeHidden();
      await this.registerIcon.click();
    }

    await this.newUserButton.waitFor({ state: 'visible', timeout: 5000 });
    await this.newUserButton.click();
    await this.page.waitForSelector('input[name="usernameRegisterPage"]');
  }

  async registerUser(user) {
    await this.usernameInput.fill(user.username);
    await this.emailInput.fill(user.email);
    await this.passwordInput.fill(user.password);
    await this.confirmPasswordInput.fill(user.password);
    await this.firstNameInput.fill(user.firstName);
    await this.lastNameInput.fill(user.lastName);
    await this.phoneInput.fill(user.phone);
    await this.countryDropdown.selectOption({ label: user.country });
    await this.cityInput.fill(user.city);
    await this.addressInput.fill(user.address);
    await this.stateInput.fill(user.state);
    await this.postalCodeInput.fill(user.postalCode);
    await this.termsCheckbox.check();

    await expect(this.registerButton).toBeEnabled({ timeout: 5000 });
    await this.registerButton.click();

    await expect(this.successUserName).toHaveText(user.username, { timeout: 10000 });
  }

  async isLoggedIn() {
    await this.registerIcon.click();

    const signOutVisible = await this.page
      .locator('label.option.roboto-medium[role="link"]', { hasText: 'Sign out' })
      .isVisible();

    await this.registerIcon.click();
    return signOutVisible;
  }
};
