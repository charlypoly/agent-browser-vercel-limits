import { tool } from 'ai';
import { z } from 'zod';
import type { Page } from 'playwright-core';
import { withPage } from '../browser/session';

async function capture(page: Page) {
  // Wait for the page to fully settle so the model sees everything.
  await page.waitForLoadState('networkidle');
  const screenshot = await page.screenshot({ fullPage: true, type: 'png' });
  return {
    url: page.url(),
    title: await page.title(),
    text: await page.locator('body').innerText(),
    screenshot: `data:image/png;base64,${screenshot.toString('base64')}`,
  };
}

export const browserTools = {
  browserOpen: tool({
    description: 'Open a URL and return the page text and a full-page screenshot',
    inputSchema: z.object({ url: z.string().url() }),
    execute: async ({ url }) =>
      withPage(async (page) => {
        await page.goto(url, { waitUntil: 'networkidle' });
        return capture(page);
      }),
  }),
  browserAct: tool({
    description:
      'Open a URL, then click an element (by visible text) and/or fill a field (by label), and return the resulting page',
    inputSchema: z.object({
      url: z.string().url(),
      click: z.string().optional(),
      fill: z.object({ field: z.string(), value: z.string() }).optional(),
      submit: z.boolean().optional(),
    }),
    execute: async ({ url, click, fill, submit }) =>
      withPage(async (page) => {
        await page.goto(url, { waitUntil: 'networkidle' });
        if (fill) {
          const field = page.getByLabel(fill.field).or(page.getByPlaceholder(fill.field)).first();
          await field.fill(fill.value);
          if (submit) await field.press('Enter');
        }
        if (click) await page.getByText(click, { exact: false }).first().click();
        return capture(page);
      }),
  }),
};
