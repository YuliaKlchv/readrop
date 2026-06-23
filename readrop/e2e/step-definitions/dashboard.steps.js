import { Given, When, Then } from '@cucumber/cucumber';

Given('I open the dashboard page', async function () {
  await this.visit('/dashboard');
});

Then('I should see dashboard content', async function () {
  await this.driver.wait(async () => {
    const url = await this.driver.getCurrentUrl();
    return url.includes('/dashboard');
  }, 5000);
});
