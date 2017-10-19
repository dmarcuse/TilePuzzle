import {HTMLPuzzle} from "./HTMLPuzzle";

document.addEventListener("DOMContentLoaded", () => {
	let p = new HTMLPuzzle(document.querySelector("table#puzzle"), 4);
	p.renderTable();
	
	console.log(p.cellAt(p.findTile(0)));
	console.log(p.cellAt(p.findTile(12)));
});