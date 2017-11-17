import {Moves} from "Puzzle";
import {HTMLPuzzle} from "HTMLPuzzle";
import {RomanPuzzle} from "RomanPuzzle";
import {solve} from "PuzzleSolver";
import _ from "lodash";

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

	// handle of interval used for stopwatch in timed mode
	let timer: number;

	function disableTimedMode() {
		window.clearInterval(timer);
		document.querySelectorAll("#shufflebtn, #solvebtn, #timedbtn").forEach(b => b.removeAttribute("disabled"));
		document.querySelector("#timedbtn").innerHTML = "Timed Mode";
	}

	function reset() {
		disableTimedMode();
		p = newPuzzle(p.root.parentElement);
		p.render();
	}

	// timestamp for the first move in timed mode
	let timedModeStart: number;

	// shuffles board, sets up timed mode
	function enableTimedMode() {
		reset();
		p.shuffle(50);
		document.querySelectorAll("#shufflebtn, #solvebtn, #timedbtn").forEach(b => b.setAttribute("disabled", "disabled"));
		document.querySelector("#timedbtn").innerHTML = "0.00";

		function startTimer() {
			timer = window.setInterval(() => {
				document.querySelector("#timedbtn").innerHTML = ((_.now() - timedModeStart) / 1000).toFixed(2);
			}, 10);
		}

		function stopTimer() {
			window.clearInterval(timer);
		}

		timedModeStart = -1;
		p.addListener({
			moved(_m: Moves) {
				// only start the clock when the user moves the first piece
				if (timedModeStart === -1) {
					timedModeStart = _.now();
					startTimer();
				}
			},

			solved() {
				stopTimer();
				disableTimedMode();
				const secsTaken = ((_.now() - timedModeStart) / 1000);
				const n = p.sizeSq - 1; // n-puzzle

				if (p.size in localStorage) {
					// previously recorded time
					const prevBest = parseFloat(localStorage[p.size]);

					if (secsTaken < prevBest) {
						// beat previous best
						window.setTimeout(() => alert(`New record: ${secsTaken} seconds to solve the ${n}-puzzle! Previous record: ${prevBest} seconds.`), 500);
						localStorage[p.size] = secsTaken.toFixed(2);
					} else {
						// didn't beat previous best
						window.setTimeout(() => alert(`Time taken: ${secsTaken} seconds to solve the ${n}-puzzle. Record: ${prevBest} seconds.`), 500);
					}
				} else {
					// no previously recorded time
					window.setTimeout(() => alert(`New record: ${secsTaken} seconds to solve the ${n}-puzzle!`), 500);
					localStorage[p.size] = secsTaken.toFixed(2);
				}
			}
		});
	}

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

	document.querySelector("#resetbtn").addEventListener("click", reset);
	document.querySelector("#style").addEventListener("change", reset);
	document.querySelector("#size").addEventListener("change", reset);

	document.querySelector("#shufflebtn").addEventListener("click", () => p.shuffle(50));

	document.querySelector("#timedbtn").addEventListener("click", enableTimedMode);

	document.querySelector("#solvebtn").addEventListener("click", () => solve(p)
		.then(m => p.applyMoves(m))
		.catch(e => {
			alert(e);
			console.log(e);
		}));

	(window as any).cheat = () => solve(p).then(m => p.applyMoves(m)).catch(console.log);

	// puzzle should start shuffled
	window.setTimeout(() => p.shuffle(50), 750);
});