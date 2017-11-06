import {Puzzle} from "Puzzle";

/**
 * A map of puzzles to a given type
 */
export class HashPuzzleMap<T> {
	public map: { [hash: string]: T };

	public constructor(map?: { [hash: string]: T }) {
		this.map = map || {};
	}

	private hash(p: Puzzle): string {
		return p.tiles.toString();
	}

	public containsKey(p: Puzzle): boolean {
		return this.hash(p) in this.map;
	}

	public put(p: Puzzle, t: T): void {
		this.map[this.hash(p)] = t;
	}

	public get(p: Puzzle): T {
		return this.map[this.hash(p)];
	}

	public remove(p: Puzzle): boolean {
		return delete this.map[this.hash(p)];
	}

	public get length(): number {
		return Object.keys(this.map).length;
	}
}

/**
 * A map of puzzles to a given type, with a given default value
 */
export class PuzzleMapWithDefault<T> extends HashPuzzleMap<T> {
	public readonly defaultValue: T;

	public constructor(defaultValue: T, map?: { [key: string]: T }) {
		super(map);
		this.defaultValue = defaultValue;
	}

	public get(p: Puzzle): T {
		let got = super.get(p);
		if (got == null) return this.defaultValue;
		return got;
	}
}