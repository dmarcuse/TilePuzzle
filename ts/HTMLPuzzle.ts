import {Moves, Point, Puzzle} from "Puzzle";
import _ from "lodash";

/**
 * A subclass of Puzzle that renders as HTML
 */
export class HTMLPuzzle extends Puzzle {
	/**
	 * The root element for this puzzle
	 */
	public readonly root: Element;

	/**
	 * Whether user input is blocked (i.e. moves are being animated)
	 * @type {boolean}
	 */
	protected inputBlocked = false;

	public constructor(root: Element, a: number[] | number) {
		super(a);
		this.root = root;
	}

	/**
	 * Clears all elements from the root element
	 */
	protected clear() {
		while (this.root.childElementCount > 0) this.root.removeChild(this.root.lastChild);
	}

	/**
	 * Applies a move if input is not blocked
	 * @param {Moves} m
	 */
	public userMove(m: Moves) {
		if (!this.inputBlocked) {
			this.move(m);
		}
	}

	/**
	 * Generates a click event listener function for a cell, so that when a cell is clicked it will be moved if possible
	 * @param {Point} p
	 * @returns {() => any}
	 */
	protected generateListener(p: Point): () => void {
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

	/**
	 * Generates the display text for a given tile number
	 * @param {number} t
	 * @returns {string}
	 */
	protected generateCellText(t: number): string {
		return t.toString();
	}

	/**
	 * Generates the HTML element representing a cell, complete with a click listener
	 * @param {Point} p
	 * @returns {HTMLDivElement}
	 */
	protected generateCell(p: Point): HTMLDivElement {
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

	/**
	 * Clears and redraws the puzzle from scratch
	 */
	public render() {
		this.clear();

		for (let y = 0; y < this.size; y++) {
			let row = document.createElement("div");
			row.className = "puzzle-row";

			for (let x = 0; x < this.size; x++) {
				row.appendChild(this.generateCell({x: x, y: y}));
			}

			this.root.appendChild(row);
		}
	}

	/**
	 * Gets the HTML element for a given cell
	 * @param {Point} p
	 * @returns {Element}
	 */
	public cellAt(p: Point): HTMLDivElement {
		this.checkBounds(p);
		return this.root.querySelectorAll(".puzzle-row")[p.y].querySelectorAll(".puzzle-cell")[p.x] as HTMLDivElement;
	}

	/**
	 * Updates the given cell, redrawing it
	 * @param {Point} p
	 * @returns {HTMLDivElement}
	 */
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
		if (moves.length <= 0) return;
		
		this.inputBlocked = true;
		this.move(moves[0]);

		if (moves.length > 1) {
			window.setTimeout(() => this.applyMoves(_.tail(moves)), 500);
		} else {
			this.inputBlocked = false;
		}
	}
}