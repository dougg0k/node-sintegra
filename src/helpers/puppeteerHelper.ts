import { Page } from "puppeteer";

export async function extractText(
	page: Page,
	selector: string,
): Promise<string | null> {
	try {
		const waitedEl = await page.waitForSelector(selector, {
			timeout: 500,
			visible: true,
		});
		return await page.evaluate((element) => element.textContent, waitedEl);
	} catch (err) {
		return null;
	}
}
