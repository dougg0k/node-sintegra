export function isObjectEmpty(obj: Record<string, unknown>): boolean {
	return Object.keys(obj).length < 1;
}
