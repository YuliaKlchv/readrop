import { Given, When, Then } from '@cucumber/cucumber';

Given('I open the discover page', async function () {
  await this.visit('/discover');
});

When('I attempt to claim a book', async function () {
  const button = await this.driver.findElement({ css: '[data-testid="claim-book-button"]' });
  await this.click(button);
});

Then('I should be redirected to the login page', async function () {
  await this.driver.wait(async () => (await this.driver.getCurrentUrl()).includes('/login'), 5000);
});

Then('I should see a claim confirmation', async function () {
  const el = await this.findByText('div', 'claimed!');
  if (!el) throw new Error('Expected claim confirmation');
});
