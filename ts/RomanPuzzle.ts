import {HTMLPuzzle} from "HTMLPuzzle";

const numerals: [number, string][] = [
	[10,    "X"],
	[9,     "IX"],
	[5,     "V"],
	[4,     "IV"],
	[1,     "I"]
];

function getRomanNumeral(n: number): string {
	let out = "";

	for (let tuple of numerals) {
		while (n >= tuple[0]) {
			n -= tuple[0];
			out += tuple[1];
		}
	}

	return out;
}

/**
 * A subclass of HTMLPuzzle that uses Roman numerals instead of decimal
 */
export class RomanPuzzle extends HTMLPuzzle {
	generateCellText(t: number): string {
		return getRomanNumeral(t);
	}
}