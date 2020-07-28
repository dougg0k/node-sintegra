import { Browser, Page } from "puppeteer";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

export async function setupBrowser(): Promise<Browser> {
	puppeteer.use(StealthPlugin());
	const browser = await puppeteer.launch({
		headless: false,
		pipe: true,
		devtools: false,
		args: [
			"--disable-gpu",
			"--disable-setuid-sandbox",
			"--disable-gl-drawing-for-tests",
			"--disable-dev-shm-usage",
			"--disable-accelerated-2d-canvas",
			"--no-sandbox",
			"--no-first-run",
			"--no-zygote",
			"--hide-scrollbars",
			"--proxy-server='direct://'",
			"--proxy-bypass-list=*",
			"--cap-add=SYS_ADMIN",
			"--disable-extensions",
			"--disable-web-security",
			"--disable-features=IsolateOrigins,site-per-process",
			"--disable-crash-reporter",
			"--disable-breakpad",
		],
		defaultViewport: null,
	});
	return browser;
}

export async function setupPage(url: string, browser: Browser): Promise<Page> {
	const [page] = await browser.pages();
	await page.setRequestInterception(true);
	page.on("request", (request) => {
		if (
			request.resourceType() === "image" ||
			request.resourceType() === "stylesheet" ||
			request.resourceType() === "font"
		) {
			request.abort();
		} else {
			request.continue();
		}
	});
	await page.goto(url);
	return page;
}
