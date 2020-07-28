import { Page } from "puppeteer";

export async function extractText(
	page: Page,
	selector: string,
	options?: {
		timeout?: number;
		visible?: boolean;
	},
): Promise<string | null> {
	try {
		const waitedEl = await page.waitForSelector(selector, {
			timeout: options?.timeout || 500,
			visible: options?.visible || true,
		});
		return await page.evaluate((element) => element.textContent, waitedEl);
	} catch (err) {
		return null;
	}
}

export async function extractValue(
	page: Page,
	selector: string,
): Promise<string | null> {
	try {
		const waitedEl = await page.waitForSelector(selector);
		return await page.evaluate((element) => element.value, waitedEl);
	} catch (err) {
		return null;
	}
}
