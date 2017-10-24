import {HTMLPuzzle} from "HTMLPuzzle";
import {Moves} from "Puzzle";

document.addEventListener("DOMContentLoaded", () => {
	let p = new HTMLPuzzle(document.querySelector("table#puzzle"), 4);
	p.renderTable();

	document.querySelector("#shufflebtn").addEventListener("click", () => p.shuffle(50));

	document.body.addEventListener("keydown", e => {
		switch (e.key) {
			case "ArrowDown":
				if (p.canMove(Moves.UP)) p.userMove(Moves.UP);
				break;
			case "ArrowLeft":
				if (p.canMove(Moves.RIGHT)) p.userMove(Moves.RIGHT);
				break;
			case "ArrowUp":
				if (p.canMove(Moves.DOWN)) p.userMove(Moves.DOWN);
				break;
			case "ArrowRight":
				if (p.canMove(Moves.LEFT)) p.userMove(Moves.LEFT);
				break;
		}
	});
});