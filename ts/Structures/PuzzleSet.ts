import {Puzzle} from "Puzzle";
import {HashPuzzleMap} from "./PuzzleMap";
import _ from "lodash";

/**
 * A base interface for a set of puzzles
 */
export interface PuzzleSet {
	contains(p: Puzzle): boolean;

	remove(p: Puzzle): boolean;

	add(p: Puzzle): void;

	length: number;
}

/**
 * An unsorted set of puzzles
 */
export class ArrayPuzzleSet implements PuzzleSet {
	protected puzzles: Puzzle[];

	public constructor(puzzles?: Puzzle[]) {
		this.puzzles = puzzles || [];
	}

	public contains(p: Puzzle): boolean {
		return _.some(this.puzzles, it => it.equals(p));
	}

	public remove(p: Puzzle): boolean {
		return _.remove(this.puzzles, it => it.equals(p)).length > 0;
	}

	public add(p: Puzzle): boolean {
		if (_.some(this.puzzles, it => it.equals(p))) {
			return false;
		}

		this.puzzles.push(p);
		return true;
	}

	public get length(): number {
		return this.puzzles.length;
	}

	public get(i: number): Puzzle {
		if (i < 0 || i > this.length) throw new RangeError(`Index ${i} is out of range`);

		return this.puzzles[i];
	}
}

/**
 * A sorted set of puzzles - sacrifices insertion efficiency for innate order
 */
export class SortedPuzzleSet extends ArrayPuzzleSet {
	protected quantifier: (p: Puzzle) => number;

	public constructor(quantifier: (p: Puzzle) => number, puzzles?: Puzzle[]) {
		super(_.sortBy(puzzles, quantifier));

		this.quantifier = quantifier;
	}

	public add(p: Puzzle): boolean {
		if (_.some(this.puzzles, it => it.equals(p))) {
			return false;
		}

		this.puzzles.splice(_.sortedIndexBy(this.puzzles, p, this.quantifier), 0, p);
		return true;
	}

	public first(): Puzzle {
		return this.puzzles[0];
	}
}

/**
 * A set of puzzles backed internally by a HashPuzzleMap
 * Faster to check if a value is contained
 */
export class HashPuzzleSet implements PuzzleSet {
	protected map: HashPuzzleMap<boolean>;

	public constructor(puzzles?: Puzzle[]) {
		this.map = new HashPuzzleMap();

		(puzzles || []).forEach(p => this.map.put(p, true));
	}

	public contains(p: Puzzle): boolean {
		return this.map.containsKey(p);
	}

	public remove(p: Puzzle): boolean {
		return this.map.remove(p);
	}

	public add(p: Puzzle): void {
		this.map.put(p, true);
	}

	public get length(): number {
		return this.map.length;
	}
}

/**
 * A sorted set of puzzles that also uses a hash object for faster contains calls
 */
export class SortedHashPuzzleSet implements PuzzleSet {
	protected locations: { [hash: string]: boolean } = {};
	protected puzzles: Puzzle[] = [];
	protected quantifier: (p: Puzzle) => number;

	public constructor(quantifier: (p: Puzzle) => number, puzzles?: Puzzle[]) {
		this.quantifier = quantifier;
		this.puzzles = _.sortBy(puzzles, p => quantifier(p));
		this.puzzles.forEach(p => this.locations[p.hash()] = true);
	}

	public contains(p: Puzzle): boolean {
		return p.hash() in this.locations;
	}

	public add(p: Puzzle): boolean {
		if (this.contains(p)) return false;

		const i = _.sortedIndexBy(this.puzzles, p, this.quantifier);
		this.puzzles.splice(i, 0, p);
		this.locations[p.hash()] = true;

		return true;
	}

	public remove(p: Puzzle): boolean {
		if (this.contains(p)) {
			const hash = p.hash();
			let i = _.sortedLastIndexBy(this.puzzles, p, this.quantifier) - 1;

			while (!this.puzzles[i].equals(p)) i--;

			this.puzzles.splice(i, 1);
			delete this.locations[hash];

			return true;
		}

		return false;
	}

	public first(): Puzzle {
		return this.puzzles[0];
	}

	public get length(): number {
		return this.puzzles.length;
	}
}