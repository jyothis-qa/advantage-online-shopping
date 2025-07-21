exports.ProductPage = class ProductPage {
  constructor(page) {
    this.page = page;
    this.cartIcon = page.locator('a[title="Show Cart"]');
    this.productCard = (name) => page.locator(`.productName[data-name="${name}"]`);
    this.addToCartBtn = page.locator('button.add-to-cart');
  }

  async navigateTo(category) {
    await this.page.goto('https://www.advantageonlineshopping.com/');
    await this.page.click(`a:has-text("${category}")`);
  }

  async selectProductByName(name) {
    await this.productCard(name).click();
  }

  async addToCart() {
    await this.addToCartBtn.click();
  }
};
