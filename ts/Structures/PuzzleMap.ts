import {Puzzle} from "Puzzle";

/**
 * A map of puzzles to a given type
 */
export class HashPuzzleMap<T> {
	public map: { [hash: string]: T };

	public constructor(map?: { [hash: string]: T }) {
		this.map = map || {};
	}

	public containsKey(p: Puzzle): boolean {
		return p.hash() in this.map;
	}

	public put(p: Puzzle, t: T): void {
		this.map[p.hash()] = t;
	}

	public get(p: Puzzle): T {
		return this.map[p.hash()];
	}

	public remove(p: Puzzle): boolean {
		return delete this.map[p.hash()];
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