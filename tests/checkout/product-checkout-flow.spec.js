const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { RegisterPage } = require('../pages/RegisterPage');
const { CartPage } = require('../pages/CartPage');
const { generateUser } = require('../../utils/authHelper');

test('Complete product checkout flow - login or register as needed', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const registerPage = new RegisterPage(page);
  const cartPage = new CartPage(page);
  const userData = generateUser();

  await page.goto('https://www.advantageonlineshopping.com/');
  await page.locator('button:has-text("SEE OFFER")').click();
  await page.waitForURL(/#\/product\/3/, { timeout: 10000 });

  // Add product to cart
  const addToCartBtn = page.locator('button:has-text("ADD TO CART")');
  await expect(addToCartBtn).toBeVisible({ timeout: 10000 });
  await addToCartBtn.click();

  // Check login status
  await registerPage.registerIcon.click();
  const signOutLink = page.locator('label.option.roboto-medium[role="link"]', { hasText: 'Sign out' });
  const isLoggedIn = await signOutLink.isVisible().catch(() => false);

  // Register if not logged in
  if (!isLoggedIn) {
    await registerPage.navigateToRegister();
    await registerPage.registerUser(userData);
    await registerPage.registerIcon.click();
    await expect(signOutLink).toBeVisible({ timeout: 10000 });
  }

  // Go to cart and checkout
  await page.locator('a[href="#/shoppingCart"]').click();
  await expect(page).toHaveURL(/#\/shoppingCart/, { timeout: 10000 });

  const checkOutButton = page.locator('#checkOutButton');
  await expect(checkOutButton).toBeVisible({ timeout: 10000 });
  await checkOutButton.click();
  await page.waitForLoadState('networkidle');

  // Confirm order payment page
  await expect(page).toHaveURL(/#\/orderPayment/, { timeout: 15000 });
  const orderPaymentHeading = page.locator('h3:has-text("ORDER PAYMENT")');
  await orderPaymentHeading.waitFor({ state: 'visible', timeout: 10000 });
  await expect(orderPaymentHeading).toBeVisible();

  await page.waitForLoadState('networkidle');

  const nextButton = page.locator('button#next_btn.nextBtn');
  await expect(nextButton).toBeVisible({ timeout: 10000 });
  await expect(nextButton).toBeEnabled({ timeout: 10000 });
  await nextButton.click();

  // Select payment and enter details
  await cartPage.selectPaymentMethod('SafePay');
  await cartPage.enterSafePayCredentials({
    username: userData.username,
    password: userData.password,
  });

  // Submit order
  await cartPage.submitOrder();
  await page.waitForLoadState('networkidle');

  // Verify confirmation message is visible
  const confirmationMessage = page.locator('text=Thank you for buying with Advantage');
  await confirmationMessage.waitFor({ state: 'visible', timeout: 30000 });
  await expect(confirmationMessage).toBeVisible();
}, 60000);
