import sparticuz from '@sparticuz/chromium';
import { chromium, type Browser, type Page } from 'playwright-core';

/**
 * Browser for the agent's tools.
 *
 * On Vercel we first try the Chromium that `postinstall` bundles into node_modules
 * (PLAYWRIGHT_BROWSERS_PATH=0), and fall back to @sparticuz/chromium if that fails.
 * Locally, set CHROME_PATH or rely on the bundled Chromium.
 */
async function launch(): Promise<Browser> {
  const onServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
  if (!onServerless) {
    return chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || undefined });
  }
  try {
    process.env.PLAYWRIGHT_BROWSERS_PATH = '0';
    return await chromium.launch({ headless: true });
  } catch {
    return chromium.launch({
      headless: true,
      executablePath: await sparticuz.executablePath(),
      args: sparticuz.args,
    });
  }
}

/** A fresh browser for each tool call, so one bad page can't break the next call. */
export async function withPage<T>(fn: (page: Page) => Promise<T>): Promise<T> {
  const browser = await launch();
  try {
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await context.newPage();
    page.setDefaultTimeout(45_000);
    return await fn(page);
  } finally {
    await browser.close().catch(() => {});
  }
}
