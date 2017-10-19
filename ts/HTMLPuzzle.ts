import {Puzzle, Point} from "./Puzzle";

export class HTMLPuzzle extends Puzzle {
	protected tbl: Element;

	public constructor(tbl: Element, a: number[] | number) {
		super(a);
		this.tbl = tbl;
	}

	protected clearTable() {
		while (this.tbl.childElementCount > 0) this.tbl.removeChild(this.tbl.lastChild);
	}

	protected generateCell(t: number) {
		let td = document.createElement("td");
		td.className = "puzzle-cell";

		if (t != 0) {
			td.className += " puzzle-cell-nonempty";
			td.innerHTML = "" + t;
		} else {
			td.className += " puzzle-cell-empty"
		}

		return td;
	}

	public renderTable() {
		this.clearTable();

		for (let y = 0; y < this.size; y++) {
			let tr = document.createElement("tr");
			tr.className = "puzzle-row";

			for (let x = 0; x < this.size; x++) {
				tr.appendChild(this.generateCell(this.tileAt({x: x, y: y})));
			}

			this.tbl.appendChild(tr);
		}
	}

	public cellAt(p: Point) {
		this.checkBounds(p);
		return this.tbl.querySelectorAll("tr")[p.y].querySelectorAll("td")[p.x];
	}

	public swapTiles(p1: Point, p2: Point) {
		super.swapTiles(p1, p2);
		this.renderTable();

		let off = {x: p2.x - p1.x, y: p2.y - p1.y};

		let p1_cell = this.cellAt(p1);
		p1_cell.style.left = p1_cell.clientWidth * off.x + "px";
		p1_cell.style.top = p1_cell.clientHeight * off.y + "px";
		p1_cell.className += " puzzle-cell-animated";

		let p2_cell = this.cellAt(p2);
		p2_cell.style.left = p2_cell.clientWidth * -off.x + "px";
		p2_cell.style.top = p2_cell.clientWidth * -off.y + "px";
		p2_cell.className += " puzzle-cell-animated";

	}
}