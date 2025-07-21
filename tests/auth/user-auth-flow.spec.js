const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');
const { RegisterPage } = require('../pages/RegisterPage');
const { LoginPage } = require('../pages/LoginPage');

test.describe('User Registration and Login Flow', () => {
  test('Register then login with new user', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const loginPage = new LoginPage(page);

    // Register new user
    await registerPage.navigateToRegister();
    const timestamp = Date.now().toString();
    const username = `user${timestamp}`.slice(0, 15);
    const user = {
      username,
      email: `${username}@testmail.com`,
      password: 'Test@1234',
      firstName: 'John',
      lastName: 'Doe',
      phone: '1234567890',
      country: 'India',
      city: 'Bangalore',
      address: '123 Test Street',
      state: 'KA',
      postalCode: '560001',
    };

    await registerPage.registerUser(user);
    await expect(registerPage.successUserName).toHaveText(user.username);

    // Save user data
    const dataDir = path.join(__dirname, '..', 'data');
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
    fs.writeFileSync(path.join(dataDir, 'testUser.json'), JSON.stringify(user, null, 2));

    // Ensure logged out before login
    await loginPage.ensureLoggedOut();

    // Login with valid credentials
    await loginPage.navigateToLogin();
    await loginPage.loginExpectSuccess({ username: user.username, password: user.password });
    await expect(loginPage.loggedInUser).toHaveText(user.username, { timeout: 10000 });

    // Logout
    await loginPage.logout();
    await expect(loginPage.loggedInUser).not.toBeVisible({ timeout: 5000 });

    // Login with invalid password
    await loginPage.navigateToLogin();
    await loginPage.loginExpectFailure({ username: user.username, password: 'WrongPass123' });
  });
});
