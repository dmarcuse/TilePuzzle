import {Moves} from "Puzzle";
import {HTMLPuzzle} from "HTMLPuzzle";
import {RomanPuzzle} from "RomanPuzzle";
import {solve} from "PuzzleSolver";

function newPuzzle(root: Element): HTMLPuzzle {
	while (root.children.length > 0) root.removeChild(root.children[0]);

	let container = document.createElement("div");

	let styleSelector = document.querySelector("#style") as HTMLSelectElement;
	let style = styleSelector.options[styleSelector.selectedIndex].value;


	let sizeSelector = document.querySelector("#size") as HTMLSelectElement;
	let size = parseInt(sizeSelector.options[sizeSelector.selectedIndex].value);

	let p: HTMLPuzzle;
	switch (style) {
		case "roman":
			p = new RomanPuzzle(container, size);
			break;
		case "standard":
		default:
			p = new HTMLPuzzle(container, size);
			break;
	}

	root.appendChild(container);

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
		p = newPuzzle(p.root.parentElement);
		p.render();
	}

	document.querySelector("#resetbtn").addEventListener("click", reset);
	document.querySelector("#style").addEventListener("change", reset);
	document.querySelector("#size").addEventListener("change", reset);

	document.querySelector("#shufflebtn").addEventListener("click", () => p.shuffle(50));

	document.querySelector("#solvebtn").addEventListener("click", () => solve(p)
		.then(m => p.applyMoves(m))
		.catch(e => {
			alert(e);
			console.log(e);
		}));

	// puzzle should start shuffled
	window.setTimeout(() => p.shuffle(50), 750);
});