import {Moves} from "Puzzle";
import {HTMLPuzzle} from "HTMLPuzzle";
import {RomanPuzzle} from "RomanPuzzle";
import {solve} from "PuzzleSolver";

function newPuzzle(tbl: Element): HTMLPuzzle {
	let styleSelector = document.querySelector("#style") as HTMLSelectElement;
	let style = styleSelector.options[styleSelector.selectedIndex].value;


	let sizeSelector = document.querySelector("#size") as HTMLSelectElement;
	let size = parseInt(sizeSelector.options[sizeSelector.selectedIndex].value);

	let p: HTMLPuzzle;
	switch (style) {
		case "roman":
			p = new RomanPuzzle(tbl, size);
			break;
		case "standard":
		default:
			p = new HTMLPuzzle(tbl, size);
			break;
	}

	return p;
}

document.addEventListener("DOMContentLoaded", () => {
	let p = newPuzzle(document.querySelector("div#puzzle"));
	p.render();

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

	function reset() {
		p = newPuzzle(p.root);
		p.render();
	}

	document.querySelector("#shufflebtn").addEventListener("click", () => p.shuffle(50));
	document.querySelector("#resetbtn").addEventListener("click", reset);
	document.querySelector("#solvebtn").addEventListener("click", () => {
		try {
			p.applyMoves(solve(p));
		} catch (e) {
			alert(`Unexpected error - ${e.toString()}`);
			console.log(e);
		}
	});
	document.querySelector("#style").addEventListener("change", reset);
	document.querySelector("#size").addEventListener("change", reset);
});