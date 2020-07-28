import fetch from "node-fetch";

export async function fetchHtml(
	url: string,
	keyValues: { [key: string]: string },
): Promise<any> {
	const params = new URLSearchParams();
	for (const [key, value] of Object.entries(keyValues)) {
		params.append(key, value);
	}
	try {
		const response = await fetch(url, {
			method: "POST",
			body: params,
		});
		return await response.text();
	} catch (err) {
		throw err;
	}
}
