import { Given, Then } from '@cucumber/cucumber';

Given('I open the books page', async function () {
  await this.visit('/books');
});

Then('I should see a book card', async function () {
  await this.driver.wait(async () => {
    const cards = await this.driver.findElements({ css: '[data-testid="book-card"]' });
    return cards.length > 0;
  }, 5000);
});
