const { expect } = require('@playwright/test');

exports.CartPage = class CartPage {
  constructor(page) {
    this.page = page;
    this.cartIcon = page.locator('a[title="Show Cart"]');
    this.checkoutBtn = page.locator('button.checkout');
    this.nextShippingButton = page.locator('button:has-text("Next")');
  }

  async navigate() {
    await this.cartIcon.click();
  }

  async proceedToCheckout() {
    await this.checkoutBtn.click();
  }

  async proceedShipping() {
    await this.page.waitForSelector('form[name="shippingForm"]').catch(() => {});
    await this.nextShippingButton.click();
    await this.page.waitForSelector('form[name="paymentForm"]').catch(() => {});
  }

  async selectPaymentMethod(method) {
    if (method === 'SafePay') {
      await this.page.locator('input[type="radio"]').first().check();
    } else if (method === 'MasterCredit') {
      await this.page.locator('input[type="radio"]').nth(1).check();
    } else {
      throw new Error(`Unsupported payment method: ${method}`);
    }
  }

  async enterSafePayCredentials({ username, password }) {
    await this.page.locator('input[name="safepay_username"]').fill(username);
    await this.page.locator('input[name="safepay_password"]').fill(password);
  }

  async submitOrder() {
    const payNowButton = this.page.locator('#pay_now_btn_SAFEPAY');
    await expect(payNowButton).toBeVisible({ timeout: 10000 });
    await expect(payNowButton).toBeEnabled({ timeout: 10000 });
    await payNowButton.click();
  }
};
