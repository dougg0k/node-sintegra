import Tesseract from "tesseract.js";
import { getImageBuffer } from "./imageProcessing";

export async function processOcr(
	image: Tesseract.ImageLike,
): Promise<Tesseract.RecognizeResult> {
	return await Tesseract.recognize(await getImageBuffer(image), "eng");
}

export function formatOCRResult(text: string): string {
	return text.trim().replace(/[^0-9a-zA-Z]+/g, "");
}
