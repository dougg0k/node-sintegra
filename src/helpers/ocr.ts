import { createWorker, OEM, PSM } from "tesseract.js";

export async function processOcr(
	image: Tesseract.ImageLike,
	whitelistChars: string,
): Promise<string> {
	const worker = createWorker();
	try {
		await worker.load();
		await worker.loadLanguage("eng");
		await worker.initialize("eng");
		await worker.setParameters({
			tessedit_char_whitelist: whitelistChars,
			tessedit_pageseg_mode: PSM.SINGLE_LINE,
			tessedit_ocr_engine_mode: OEM.TESSERACT_LSTM_COMBINED,
		});
		const response = await worker.recognize(image);
		return response.data.text;
	} catch (err) {
		throw err;
	} finally {
		worker.terminate();
	}
}

export function formatOCRResult(text: string): string {
	return text.trim().replace(/[^0-9a-zA-Z]+/g, "");
}
