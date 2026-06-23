const assert = require("node:assert/strict");
const { execFile } = require("node:child_process");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const { promisify } = require("node:util");
const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const execFileAsync = promisify(execFile);

const DEFAULT_BASE_URLS = [
  "http://127.0.0.1:5173",
  "http://127.0.0.1:4173",
  "http://127.0.0.1:5174",
  "http://localhost:5173",
  "http://localhost:4173",
  "http://localhost:5174"
];
const BASE_URL = process.env.BASE_URL || "";
const EMAIL = process.env.READROP_LOGIN_EMAIL || "demo@readrop.app";
const PASSWORD = process.env.READROP_LOGIN_PASSWORD || "ReadropDemo123!";
const HEADLESS = process.env.HEADLESS !== "false";
const FILL_ONLY = process.env.FILL_ONLY === "true";
const TIMEOUT_MS = Number(process.env.TIMEOUT_MS || 15000);
const STEP_DELAY_MS = Number(
  process.env.STEP_DELAY_MS || (HEADLESS ? 0 : 900)
);
const KEEP_OPEN_MS = Number(
  process.env.KEEP_OPEN_MS || (HEADLESS ? 0 : 3000)
);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getSeleniumManagerPath() {
  const platformDir = process.platform === "darwin"
    ? "macos"
    : process.platform === "win32"
      ? "windows"
      : "linux";
  const binaryName = process.platform === "win32"
    ? "selenium-manager.exe"
    : "selenium-manager";

  return path.join(
    process.cwd(),
    "node_modules",
    "selenium-webdriver",
    "bin",
    platformDir,
    binaryName
  );
}

async function resolveDriverAndBrowserPaths() {
  const managerPath = getSeleniumManagerPath();
  const cachePath = path.join(os.tmpdir(), "readrop-selenium-cache");
  const args = [
    "--browser", "chrome",
    "--output", "json",
    "--skip-driver-in-path",
    "--cache-path", cachePath,
  ];

  const { stdout } = await execFileAsync(managerPath, args);
  const data = JSON.parse(stdout);
  const driverPath = data?.result?.driver_path;
  const browserPath = data?.result?.browser_path;

  if (!driverPath) {
    throw new Error("Selenium Manager could not resolve a compatible ChromeDriver.");
  }

  return { driverPath, browserPath };
}

async function resolveBaseUrl() {
  const candidates = BASE_URL ? [BASE_URL] : DEFAULT_BASE_URLS;

  for (const candidate of candidates) {
    try {
      const res = await fetch(candidate, { method: "GET" });
      const html = await res.text();
      if (res.ok && /readrop|<!doctype html/i.test(html)) {
        return candidate;
      }
    } catch {
      // Try the next candidate URL.
    }
  }

  throw new Error(
    `Could not reach the frontend. Start it first with "npm run dev" or Docker, then retry. Tried: ${candidates.join(", ")}`
  );
}

async function waitForVisible(driver, selector) {
  const element = await driver.wait(until.elementLocated(By.css(selector)), TIMEOUT_MS);
  await driver.wait(until.elementIsVisible(element), TIMEOUT_MS);
  return element;
}

async function saveFailureArtifacts(driver) {
  const outDir = path.join(process.cwd(), "test-documentation", "frontend");
  await fs.mkdir(outDir, { recursive: true });

  try {
    const screenshot = await driver.takeScreenshot();
    await fs.writeFile(
      path.join(outDir, "login-automation-failure.png"),
      screenshot,
      "base64"
    );
  } catch {
    // Ignore artifact write errors.
  }

  try {
    const html = await driver.getPageSource();
    await fs.writeFile(
      path.join(outDir, "login-automation-failure.html"),
      html,
      "utf8"
    );
  } catch {
    // Ignore artifact write errors.
  }
}

async function typeSlowly(element, value) {
  for (const char of value) {
    await element.sendKeys(char);
    if (STEP_DELAY_MS > 0) {
      await sleep(Math.min(200, STEP_DELAY_MS));
    }
  }
}

async function run() {
  const { driverPath, browserPath } = await resolveDriverAndBrowserPaths();

  const options = new chrome.Options();
  if (browserPath) {
    options.setChromeBinaryPath(browserPath);
  }

  if (HEADLESS) {
    options.addArguments(
      "--headless=new",
      "--disable-gpu",
      "--no-sandbox",
      "--window-size=1440,1200"
    );
  }

  const service = new chrome.ServiceBuilder(driverPath);
  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeService(service)
    .setChromeOptions(options)
    .build();

  try {
    const resolvedBaseUrl = await resolveBaseUrl();
    const loginUrl = new URL("/login", resolvedBaseUrl).toString();
    console.log(`Opening ${loginUrl}`);
    await driver.get(loginUrl);
    await driver.manage().window().maximize();
    await sleep(STEP_DELAY_MS);

    const emailInput = await waitForVisible(driver, '[data-testid="login-email"]');
    const passwordInput = await waitForVisible(driver, '[data-testid="login-password"]');
    const submitButton = await waitForVisible(driver, '[data-testid="login-submit"]');

    console.log("Typing email...");
    await emailInput.click();
    await emailInput.clear();
    await typeSlowly(emailInput, EMAIL);
    await sleep(STEP_DELAY_MS);

    console.log("Typing password...");
    await passwordInput.click();
    await passwordInput.clear();
    await typeSlowly(passwordInput, PASSWORD);
    await sleep(STEP_DELAY_MS);

    if (FILL_ONLY) {
      console.log(`Demo credentials filled for ${EMAIL}`);
      await sleep(KEEP_OPEN_MS);
      return;
    }

    console.log("Submitting login form...");
    await submitButton.click();

    await driver.wait(async () => {
      const currentUrl = await driver.getCurrentUrl();
      return currentUrl.includes("/dashboard");
    }, TIMEOUT_MS);

    const pageText = await driver.findElement(By.tagName("body")).getText();
    assert.match(pageText, /dashboard/i);

    console.log(`Login test passed for ${EMAIL}`);
    await sleep(KEEP_OPEN_MS);
  } catch (error) {
    await saveFailureArtifacts(driver);
    throw error;
  } finally {
    await driver.quit();
  }
}

run().catch((error) => {
  console.error("Login test failed.");
  console.error(error);
  process.exitCode = 1;
});
