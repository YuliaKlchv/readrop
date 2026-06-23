import { Given, When, Then } from '@cucumber/cucumber';

Given('I open the login page', async function () {
  await this.visit('/login');
});

When('I enter valid credentials', async function () {
  const email = await this.findByTestId('login-email');
  const password = await this.findByTestId('login-password');
  await this.type(email, 'demo@readrop.app');
  await this.type(password, 'ReadropDemo123!');
});

When('I enter invalid credentials', async function () {
  const email = await this.findByTestId('login-email');
  const password = await this.findByTestId('login-password');
  await this.type(email, 'invalid@example.com');
  await this.type(password, 'WrongPass123!');
});

When('I submit the login form', async function () {
  const submit = await this.findByTestId('login-submit');
  await this.click(submit);
});

Then('I should be redirected to the dashboard', async function () {
  await this.driver.wait(async () => (await this.driver.getCurrentUrl()).includes('/dashboard'), 5000);
});

Then('I should see an invalid login error', async function () {
  const error = await this.findByText('p', 'Invalid email or password.');
  if (!error) throw new Error('Expected invalid login error');
});
