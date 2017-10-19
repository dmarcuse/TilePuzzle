import {padRight} from "./Utils";

export class Puzzle {
	public tiles: number[];
	public size: number;

	public get sizesq(): number {
		return this.size * this.size;
	}

	public constructor(a: number[] | number) {
		if (typeof(a) == "number") {
			this.size = a;
			this.tiles = [];

			for (let i = 0; i < this.sizesq; i++) {
				this.tiles[i] = (i + 1) % (this.sizesq);
			}
		} else {
			this.size = Math.sqrt(a.length);
			this.tiles = [];
			Array.prototype.unshift.apply(this.tiles, a);
		}
	}

	public toString(): string {
		let out = "";

		for (let i = 0; i < this.sizesq; i++) {
			if (this.tiles[i] == 0) {
				out += "   ";
			} else {
				out += padRight(this.tiles[i] + "", 3);
			}

			if (i % this.size == this.size - 1) {
				out += "\n";
			} else {
				out += "|";
			}
		}

		return out;
	}

	public checkBounds(p: Point): void {
		if (p.x < 0 || p.x >= this.size) {
			throw new RangeError(`x coordinate must be in range 0 <= x < ${this.size}`);
		} else if (p.y < 0 || p.y >= this.size) {
			throw new RangeError(`y coordinate must be in range 0 <= y < ${this.size}`);
		}
	}

	public tileAt(p: Point): number {
		this.checkBounds(p);
		return this.tiles[p.y * this.size + p.x];
	}

	public findTile(t: number): Point {
		for (let i = 0; i < this.sizesq; i++) {
			if (this.tiles[i] == t) {
				return {x: i % this.size, y: Math.floor(i / this.size)};
			}
		}

		throw new RangeError(`Tile ${t} not present`);
	}

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

	public swapTiles(p1: Point, p2: Point) {
		let t1 = this.tileAt(p1);
		let t2 = this.tileAt(p2);

		let tmp = t1;
		t1 = t2;
		t2 = tmp;

		this.tiles[p1.y * this.size + p1.x] = t1;
		this.tiles[p2.y * this.size + p2.x] = t2;
	}

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