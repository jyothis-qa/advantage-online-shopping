# Playwright Test Automation for Advantage Online Shopping

This project uses **Playwright** to automate and validate core user journeys on the **Advantage Online Shopping** website.

## Key Features

- **User Authentication**
  - Registration
  - Login/Logout
  - Invalid login handling

- **Product Checkout Flow**
  - Adding items to the cart
  - Completing checkout (depending on user login state)

## Project Structure

advantage-online-shopping/
├── node\_modules/                  # Installed dependencies
├── playwright-report/             # Playwright HTML reports
├── test-results/                  # Raw test result output
│
├── tests/                         # Test specs organized by flow
│   ├── auth/
│   │   ├── user-auth-flow\.spec.js
│   │   └── data/
│   │       └── testUser.json
│   │
│   └── checkout/
│       └── product-checkout-flow\.spec.js
│
├── data/                          # Shared test data
│   └── testUser.json
│
├── pages/                         # Page Object Model (POM) classes
│   ├── CartPage.js
│   ├── LoginPage.js
│   ├── ProductPage.js
│   └── RegisterPage.js
│
├── utils/
│   └── authHelper.js              # Helper to generate fake users
│
├── after-checkout-click.png       # Screenshot / visual asset
├── playwright.config.js           # Playwright configuration
├── package.json                   # Project dependencies and scripts
├── package-lock.json              # Exact dependency versions
└── README.md                      # Project documentation


## Prerequisites

- Node.js (v16 or newer)
- npm or yarn
- Git

## Setup Instructions

Clone the repository:

git clone https://github.com/jyothis-qa/advantage-online-shopping.git
cd advantage-online-shopping

Install dependencies:

npm install

Install Playwright browsers:

npx playwright install

## Running Tests

Run **all tests** in Chromium:

npx playwright test --project=chromium

Run a **specific test file**:

npx playwright test tests/auth/user-auth-flow.spec.js

Run in **headed mode** for debugging:

npx playwright test --headed --project=chromium

## Test Scenarios

### `user-auth-flow.spec.js`

* Registers a new user
* Logs out and logs back in using valid credentials
* Attempts login with an invalid password and checks for failure message

### `product-checkout-flow.spec.js`

* Adds a product to the cart
* If user is not logged in, registers a new user during checkout
* Proceeds to checkout, fills payment info, and verifies the thank-you message

## Built With

* [Playwright Test Runner](https://playwright.dev)
* JavaScript
* Page Object Model (POM) Design Pattern

## Best Practices Followed

* Page Object Model for maintainability
* Explicit assertions for visibility, URL changes, and UI state
* Structured test data and modular utilities

## Notes

* All tests run in the **Chromium** browser
* Test user credentials are generated dynamically and stored in `/data/testUser.json`
* You can customize test data generation logic in `utils/authHelper.js`