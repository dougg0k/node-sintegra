import Iconv from "iconv";

export function formatObjKey(key: string): string {
	const splitKey = key
		.trim()
		.replace(/[^a-zA-Z\s]/gi, "")
		.replace(/\b[a-z]/g, (match) => match.toUpperCase())
		.toString()
		.split(/\s/);
	const combination =
		splitKey.length > 1
			? splitKey.join("").charAt(0).toLowerCase() + splitKey.join("").slice(1)
			: splitKey.join("").toLowerCase();
	return combination;
}

export function formatTextWithAsciiValues(text: string | null): string | null {
	if (!text || text.length < 1) {
		return null;
	}
	const iconv = new Iconv.Iconv("UTF-8", "ASCII//TRANSLIT//IGNORE");
	const cleanText = text.trim().replace(/\s{2,}/g, "");
	return Buffer.from(iconv.convert(cleanText)).toString("utf-8");
}

export function removeUnwantedCharacterFromText(
	text: string | null,
): string | null {
	if (!text || text.length < 1) {
		return null;
	}
	return text.trim().replace(/\n/g, "").replace(/\t/g, "");
}
