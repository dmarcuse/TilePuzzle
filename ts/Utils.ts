export function padRight(s: string, length: number, padding: string = " ") {
	return new String(s + padding.repeat(length)).slice(0, length);
}