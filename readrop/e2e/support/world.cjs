const { setWorldConstructor } = require('@cucumber/cucumber');
const { execFile } = require('node:child_process');
const os = require('node:os');
const path = require('node:path');
const { promisify } = require('node:util');
const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const execFileAsync = promisify(execFile);

function getSeleniumManagerPath() {
  const platformDir = process.platform === 'darwin'
    ? 'macos'
    : process.platform === 'win32'
      ? 'windows'
      : 'linux';
  const binaryName = process.platform === 'win32'
    ? 'selenium-manager.exe'
    : 'selenium-manager';

  return path.join(
    process.cwd(),
    'node_modules',
    'selenium-webdriver',
    'bin',
    platformDir,
    binaryName
  );
}

async function resolveDriverAndBrowserPaths() {
  const managerPath = getSeleniumManagerPath();
  const cachePath = path.join(os.tmpdir(), 'readrop-selenium-cache');
  const args = [
    '--browser', 'chrome',
    '--output', 'json',
    '--skip-driver-in-path',
    '--cache-path', cachePath,
  ];

  const { stdout } = await execFileAsync(managerPath, args);
  const data = JSON.parse(stdout);
  const driverPath = data?.result?.driver_path;
  const browserPath = data?.result?.browser_path;

  if (!driverPath) {
    throw new Error('Selenium Manager could not resolve a compatible ChromeDriver.');
  }

  return { driverPath, browserPath };
}

class CustomWorld {
  constructor() {
    this.driver = null;
    this.baseUrl = process.env.BASE_URL || 'http://127.0.0.1:5173';
  }

  async ensureDriver() {
    if (this.driver) return this.driver;
    const { driverPath, browserPath } = await resolveDriverAndBrowserPaths();

    const headless = process.env.HEADLESS !== 'false';
    const options = new chrome.Options();
    if (browserPath) {
      options.setChromeBinaryPath(browserPath);
    }
    if (headless) {
      options.addArguments('--headless=new', '--disable-gpu', '--no-sandbox');
    }

    const service = new chrome.ServiceBuilder(driverPath);
    this.driver = await new Builder()
      .forBrowser('chrome')
      .setChromeService(service)
      .setChromeOptions(options)
      .build();

    return this.driver;
  }

  async visit(path) {
    const driver = await this.ensureDriver();
    await driver.get(`${this.baseUrl}${path}`);
  }

  async findByTestId(testId) {
    await this.ensureDriver();
    return this.driver.findElement({ css: `[data-testid="${testId}"]` });
  }

  async findByText(tag, text) {
    await this.ensureDriver();
    return this.driver.findElement({ xpath: `//${tag}[contains(normalize-space(.), "${text}")]` });
  }

  async click(element) {
    await this.ensureDriver();
    await element.click();
  }

  async type(element, value) {
    await this.ensureDriver();
    await element.clear();
    await element.sendKeys(value);
  }

  async close() {
    if (this.driver) await this.driver.quit();
  }
}

setWorldConstructor(CustomWorld);
