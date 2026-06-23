import { Given, Then, After } from '@cucumber/cucumber';
import assert from 'assert';

Given('I open the homepage', async function () {
  await this.launch();
  await this.page.goto('http://localhost:4173');
});

Then('I should see {string}', async function (text) {
  const body = await this.page.textContent('body');
  assert.ok(body.includes(text), `Expected page body to include ${text}`);
});

After(async function () {
  await this.close();
});
