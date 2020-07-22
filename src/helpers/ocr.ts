import Jimp from "jimp";
import Tesseract from "tesseract.js";

export async function processOcr(
	image: Tesseract.ImageLike,
): Promise<Tesseract.RecognizeResult> {
	return await Tesseract.recognize(
		await image.getBufferAsync(Jimp.MIME_PNG),
		"eng",
	);
}

export function formatOCRResult(text: string): string {
	return text.trim().replace(/[^0-9a-zA-Z]+/g, "");
}
