import {Moves, Point, Puzzle} from "Puzzle";
import _ from "lodash";

export class HTMLPuzzle extends Puzzle {
	public readonly tbl: Element;
	protected inputLocked = false;

	public constructor(tbl: Element, a: number[] | number) {
		super(a);
		this.tbl = tbl;
	}

	protected clearTable() {
		while (this.tbl.childElementCount > 0) this.tbl.removeChild(this.tbl.lastChild);
	}

	public userMove(m: Moves) {
		if (!this.inputLocked) {
			this.move(m);
		}
	}

	protected generateListener(p: Point) {
		return () => {
			let pe = this.findTile(0);

			if (pe.x == p.x && pe.y == p.y + 1 && this.canMove(Moves.UP)) {
				this.userMove(Moves.UP);
			} else if (pe.x == pe.x && pe.y == p.y - 1 && this.canMove(Moves.DOWN)) {
				this.userMove(Moves.DOWN);
			} else if (pe.x == p.x + 1 && pe.y == p.y && this.canMove(Moves.LEFT)) {
				this.userMove(Moves.LEFT);
			} else if (pe.x == p.x - 1 && pe.y == p.y && this.canMove(Moves.RIGHT)) {
				this.userMove(Moves.RIGHT);
			}
		};
	}

	protected generateCellText(t: number) {
		return t.toString();
	}

	protected generateCell(p: Point) {
		let t = this.tileAt({x: p.x, y: p.y});
		let cell = document.createElement("div");
		cell.className = "puzzle-cell";

		cell.innerHTML = this.generateCellText(t);
		if (t != 0) {
			cell.className += " puzzle-cell-nonempty";
		} else {
			cell.className += " puzzle-cell-empty";
		}

		cell.addEventListener("click", this.generateListener(p));

		return cell;
	}

	public renderTable() {
		this.clearTable();

		for (let y = 0; y < this.size; y++) {
			let row = document.createElement("div");
			row.className = "puzzle-row";

			for (let x = 0; x < this.size; x++) {
				row.appendChild(this.generateCell({x: x, y: y}));
			}

			this.tbl.appendChild(row);
		}
	}

	public cellAt(p: Point) {
		this.checkBounds(p);
		return this.tbl.querySelectorAll(".puzzle-row")[p.y].querySelectorAll(".puzzle-cell")[p.x];
	}

	public updateCell(p: Point) {
		let old = this.cellAt(p);
		let updated = this.generateCell(p);

		old.parentElement.replaceChild(updated, old);

		return updated;
	}

	public swapTiles(p1: Point, p2: Point) {
		super.swapTiles(p1, p2);
		let offset = {x: p2.x - p1.x, y: p2.y - p1.y};

		let p1_cell = this.updateCell(p1);
		p1_cell.style.left = p1_cell.clientWidth * offset.x + "px";
		p1_cell.style.top = p1_cell.clientHeight * offset.y + "px";
		p1_cell.className += " puzzle-cell-animated";

		let p2_cell = this.updateCell(p2);
		p2_cell.style.left = p2_cell.clientWidth * -offset.x + "px";
		p2_cell.style.top = p2_cell.clientWidth * -offset.y + "px";
		p2_cell.className += " puzzle-cell-animated";
	}

	public applyMoves(moves: Moves[]) {
		this.inputLocked = true;
		this.move(moves[0]);

		if (moves.length > 1) {
			window.setTimeout(() => this.applyMoves(_.tail(moves)), 500);
		} else {
			this.inputLocked = false;
		}
	}
}