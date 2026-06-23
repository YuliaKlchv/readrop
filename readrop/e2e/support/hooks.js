import { After } from '@cucumber/cucumber';

After(async function () {
  await this.close();
});
