import { Given, When, Then } from '@cucumber/cucumber';

Given('I open the register page', async function () {
  await this.visit('/register');
});

When('I enter invalid registration details', async function () {
  const name = await this.driver.findElement({ css: '[data-testid="register-name"]' });
  const email = await this.driver.findElement({ css: '[data-testid="register-email"]' });
  const password = await this.driver.findElement({ css: '[data-testid="register-password"]' });
  const confirm = await this.driver.findElement({ css: '[data-testid="register-confirm"]' });

  await this.type(name, '');
  await this.type(email, 'invalid-email');
  await this.type(password, 'short');
  await this.type(confirm, 'mismatch');
});

When('I submit the registration form', async function () {
  const submit = await this.findByTestId('register-submit');
  await this.click(submit);
});

Then('I should see validation feedback', async function () {
  const feedback = await this.findByText('p', 'Please enter a valid email address');
  if (!feedback) throw new Error('Expected validation feedback message');
});
