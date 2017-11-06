import _ from "lodash";

/**
 * Represents a square sliding tile puzzle of variable size
 */
export class Puzzle {
	/**
	 * The tiles (as a flattened array) of this puzzle
	 */
	public readonly tiles: number[];

	/**
	 * The size (side length) of this puzzle
	 */
	public readonly size: number;

	/**
	 * Size squared
	 * @returns {number}
	 */
	public get sizeSq(): number {
		return this.size * this.size;
	}

	public constructor(a: number[] | number) {
		if (typeof(a) == "number") {
			this.size = a;
			this.tiles = [];

			for (let i = 0; i < this.sizeSq; i++) {
				this.tiles[i] = (i + 1) % (this.sizeSq);
			}
		} else {
			this.size = Math.sqrt(a.length);
			this.tiles = [];
			this.tiles.unshift(...a);
		}
	}

	/**
	 * Creates a visual representation of this puzzle
	 */
	public toString(): string {
		let out = "";

		for (let i = 0; i < this.sizeSq; i++) {
			if (this.tiles[i] == 0) {
				out += "   ";
			} else {
				out += _.pad(this.tiles[i] + "", 3);
			}

			if (i % this.size == this.size - 1) {
				out += "\n";
			} else {
				out += "|";
			}
		}

		return out;
	}

	/**
	 * Checks whether a given point is within the bounds of this puzzle
	 * @param {Point} p
	 */
	public checkBounds(p: Point): void {
		if (p.x < 0 || p.x >= this.size) {
			throw new RangeError(`x coordinate must be in range 0 <= x < ${this.size}`);
		} else if (p.y < 0 || p.y >= this.size) {
			throw new RangeError(`y coordinate must be in range 0 <= y < ${this.size}`);
		}
	}

	/**
	 * Gets the tile at the given point
	 * @param {Point} p
	 * @returns {number} The number of the tile - 0 represents an empty tile
	 */
	public tileAt(p: Point): number {
		this.checkBounds(p);
		return this.tiles[p.y * this.size + p.x];
	}

	/**
	 * Converts a tile index to coordinates
	 * @param {number} i
	 * @returns {Point}
	 */
	public idxToCoords(i: number): Point {
		return {x: i % this.size, y: Math.floor(i / this.size)};
	}

	/**
	 * Finds the position of a given tile
	 * @param {number} t The tile to search for - 0 represents an empty tile
	 * @returns {Point} The position of the first matching tile found
	 */
	public findTile(t: number): Point {
		for (let i = 0; i < this.sizeSq; i++) {
			if (this.tiles[i] == t) {
				return {x: i % this.size, y: Math.floor(i / this.size)};
			}
		}

		throw new RangeError(`Tile ${t} not present`);
	}

	/**
	 * Checks if a given move is valid for the current state of the puzzle
	 * @param {Moves} m
	 * @returns {boolean}
	 */
	public canMove(m: Moves): boolean {
		let p = this.findTile(0);

		switch (m) {
			case Moves.UP:
				return p.y > 0;
			case Moves.LEFT:
				return p.x > 0;
			case Moves.DOWN:
				return p.y < this.size - 1;
			case Moves.RIGHT:
				return p.x < this.size - 1;
			default:
				throw new Error(`Invalid move type '${m}'`);
		}
	}

	/**
	 * Gets an array of valid moves for the current state of the puzzle
	 * @returns {Moves[]}
	 */
	public validMoves(): Moves[] {
		let p = this.findTile(0);
		let valid = [];

		if (p.y > 0) valid.push(Moves.UP);
		if (p.x > 0) valid.push(Moves.LEFT);
		if (p.y < this.size - 1) valid.push(Moves.DOWN);
		if (p.x < this.size - 1) valid.push(Moves.RIGHT);

		return valid;
	}

	/**
	 * Swaps two tiles in the puzzle
	 * @param {Point} p1
	 * @param {Point} p2
	 */
	public swapTiles(p1: Point, p2: Point) {
		let t1 = this.tileAt(p1);
		let t2 = this.tileAt(p2);

		let tmp = t1;
		t1 = t2;
		t2 = tmp;

		this.tiles[p1.y * this.size + p1.x] = t1;
		this.tiles[p2.y * this.size + p2.x] = t2;
	}

	/**
	 * Performs a given move on this puzzle, throwing an error if it's not possible
	 * @param {Moves} m
	 */
	public move(m: Moves) {
		if (!this.canMove(m)) throw new Error(`Illegal move ${m}`);

		let p = this.findTile(0);

		switch (m) {
			case Moves.UP:
				this.swapTiles(p, {x: p.x, y: p.y - 1});
				break;
			case Moves.LEFT:
				this.swapTiles(p, {x: p.x - 1, y: p.y});
				break;
			case Moves.DOWN:
				this.swapTiles(p, {x: p.x, y: p.y + 1});
				break;
			case Moves.RIGHT:
				this.swapTiles(p, {x: p.x + 1, y: p.y});
				break;
		}
	}

	/**
	 * Applies a series of moves to this puzzle
	 * @param {Moves[]} moves
	 */
	public applyMoves(moves: Moves[]) {
		for (let m of moves) {
			this.move(m);
		}
	}

	/**
	 * Shuffles this puzzle, applying a given number of random moves
	 * @param {number} moves
	 */
	public shuffle(moves: number) {
		let last: Moves;

		for (let i = 0; i < moves; i++) {
			let m = _.without(this.validMoves(), last);

			this.move(last = m[Math.random() * m.length | 0]);
		}
	}

	/**
	 * Checks if the puzzle is solved
	 * @returns {boolean}
	 */
	public isSolved(): boolean {
		for (let i = 0; i < this.tiles.length; i++) {
			if (this.tiles[i] != (i + 1) % (this.sizeSq)) return false;
		}

		return true;
	}

	public solveHeuristic(): number {
		let score = 0;

		for (let i = 0; i < this.tiles.length; i++) {
			let gotTile = this.tiles[i];
			let wantTile = (i + 1) % this.sizeSq;

			// TODO: maybe more effective to use distance between tiles?
			if (gotTile != wantTile) score++;
		}

		return score;
	}

	public equals(p: Puzzle): boolean {
		if (p.size != this.size) return false;

		for (let i = 0; i < this.tiles.length; i++) {
			if (this.tiles[i] != p.tiles[i]) return false;
		}

		return true;
	}

	public hash(): string {
		return this.tiles.toString();
	}
}

export interface Point {
	x: number;
	y: number;
}

export enum Moves {
	UP,
	DOWN,
	RIGHT,
	LEFT
}