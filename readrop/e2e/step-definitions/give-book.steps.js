import { Given, When, Then } from '@cucumber/cucumber';

Given('I open the give book page', async function () {
  await this.visit('/give');
});

When('I fill in the new book form', async function () {
  await this.findByTestId('give-book-form');
  await this.type(await this.driver.findElement({ css: 'input[placeholder="e.g. Dune"]' }), 'Test Book Title');
  await this.type(await this.driver.findElement({ css: 'input[placeholder="e.g. Frank Herbert"]' }), 'Test Author');
  await this.driver.findElement({ css: 'select' }).sendKeys('Fiction');
  await this.driver.findElement({ css: 'input[placeholder="e.g. Vienna"]' }).sendKeys('Berlin');
});

When('I submit the give book form', async function () {
  const submit = await this.driver.findElement({ css: 'button[type="submit"]' });
  await this.click(submit);
});

Then('I should be redirected to the books page', async function () {
  await this.driver.wait(async () => (await this.driver.getCurrentUrl()).includes('/books'), 5000);
});
