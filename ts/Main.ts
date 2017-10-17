import {HTMLPuzzle} from "./HTMLPuzzle";

let p = new HTMLPuzzle(5);

function showPuzzle(p: HTMLPuzzle) {
	let w = document.querySelector("#puzzle-container");

	if (w) {
		while (w.hasChildNodes()) w.removeChild(w.lastChild);

		w.appendChild(p.generateHTML());
	}
}

document.addEventListener("DOMContentLoaded", () => showPuzzle(new HTMLPuzzle(4)));