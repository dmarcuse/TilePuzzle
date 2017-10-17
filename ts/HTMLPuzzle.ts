import {Puzzle, Point, Moves} from "./Puzzle";

export class HTMLPuzzle extends Puzzle {
	public cellClicked(p: Point) {
	
	}

	private generateCell(p: Point) {
		let td = document.createElement("td");

		td.className = "puzzle-cell";

		let t = this.tileAt(p);
		if (t == 0) {
			td.innerHTML = "";
			td.className += " puzzle-cell-empty";
		} else {
			td.innerHTML = t.toString();
			td.className += " puzzle-cell-nonempty";
		}

		return td;
	}

	public generateHTML(): Element {
		let table = document.createElement("table");
		table.className = "puzzle";

		for (let y = 0; y < this.size; y++) {
			let tr = document.createElement("tr");
			tr.className = "puzzle-row";

			for (let x = 0; x < this.size; x++) {
				tr.appendChild(this.generateCell({x:x, y:y}));
			}

			table.appendChild(tr);
		}

		return table;
	}
}