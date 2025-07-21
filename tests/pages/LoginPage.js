const { expect } = require('@playwright/test');

exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;

    this.loginIcon = page.locator('#menuUserLink');
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('button:has-text("SIGN IN")');
    this.loggedInUser = page.locator('#menuUserLink > span');
    this.logoutLink = page.locator('label[translate="Sign_out"][role="link"]');

    this.errorMessageText = 'Incorrect user name or password.';
  }

  async ensureLoggedOut() {
    if (await this.loggedInUser.isVisible({ timeout: 3000 }).catch(() => false)) {
      await this.logout();
    }
  }

  async navigateToLogin() {
    await this.page.goto('https://www.advantageonlineshopping.com/#/', { waitUntil: 'load' });
    await expect(this.loginIcon).toBeVisible({ timeout: 10000 });
    await this.loginIcon.click();
    await expect(this.page.locator('.login')).toBeVisible({ timeout: 10000 });
    await expect(this.usernameInput).toBeVisible({ timeout: 10000 });
  }

  async loginExpectSuccess({ username, password }) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();

    const errorMessage = this.page.locator(`text="${this.errorMessageText}"`);
    await Promise.race([
      expect(this.loggedInUser).toBeVisible({ timeout: 10000 }),
      errorMessage.waitFor({ state: 'visible', timeout: 10000 }),
    ]);

    if (await errorMessage.isVisible()) {
      throw new Error('Login failed: Incorrect username or password.');
    }
  }

  async loginExpectFailure({ username, password }) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();

    const errorMessage = this.page.locator(`text="${this.errorMessageText}"`);
    await errorMessage.waitFor({ state: 'visible', timeout: 10000 });
    await expect(errorMessage).toBeVisible();
  }

  async logout() {
    await this.loginIcon.click();
    await this.page.waitForTimeout(500);

    if (!(await this.logoutLink.isVisible())) {
      await this.loginIcon.click();
    }

    await this.logoutLink.waitFor({ state: 'visible', timeout: 5000 });
    await this.logoutLink.click();
    await expect(this.loggedInUser).toBeHidden({ timeout: 5000 });
  }
};
