#!/usr/bin/env node --es-module-specifier-resolution=node

import { extractCookies, getBrowserAndPage, loginToSite } from "./puppeteer";
import { getEmailAndPassword } from "./inquirer";
import { log, LogTypes, startSpinner } from "./logger";
import { URL } from "./config";
import { Browser } from "puppeteer";
import { Ora } from "ora";

let browserReference: Browser | null = null;
let spinner: Ora | null = null;

const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

(async () => {
  try {
    const [{ email, password }, { browser, page }] = await Promise.all([
      getEmailAndPassword(),
      getBrowserAndPage({ url: URL }),
    ]);

    browserReference = browser;
    spinner = startSpinner(`Logging into ${URL}`, "💻");

    await loginToSite(page, email, password);
    await wait(1000);
    spinner.succeed();

    spinner = startSpinner(`Getting cookies`, "🍪");

    const { consent } = await extractCookies(page, [
      { key: "consent", name: "CONSENT" },
    ]);
    await wait(1000);
    spinner.succeed();

    spinner = startSpinner(`Taking screenshot`, "📸");

    await page.screenshot({ path: "./screenshot.png" });
    await wait(1000);
    spinner.succeed();

    console.log({ consent });
  } catch (e) {
    spinner?.fail();
    log(e.message, LogTypes.Error);
  } finally {
    await browserReference?.close();
  }
})();
