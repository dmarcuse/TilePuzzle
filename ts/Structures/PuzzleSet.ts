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
 * A set of puzzles backed internally by a HashPuzzleMap
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
 * A sorted set of puzzles using both an array and hash for significant speed benefits
 */
export class SortedHashPuzzleSet implements PuzzleSet {
	protected hashes: { [hash: string]: boolean } = {};
	protected puzzles: Puzzle[] = [];
	protected quantifier: (p: Puzzle) => number;

	public constructor(quantifier: (p: Puzzle) => number, puzzles?: Puzzle[]) {
		this.quantifier = quantifier;
		this.puzzles = _.sortBy(puzzles, p => quantifier(p));
		this.puzzles.forEach(p => this.hashes[p.hash()] = true);
	}

	public contains(p: Puzzle): boolean {
		return p.hash() in this.hashes;
	}

	public add(p: Puzzle): boolean {
		if (this.contains(p)) return false;

		const i = _.sortedIndexBy(this.puzzles, p, this.quantifier);
		this.puzzles.splice(i, 0, p);
		this.hashes[p.hash()] = true;

		return true;
	}

	public remove(p: Puzzle): boolean {
		if (this.contains(p)) {
			const hash = p.hash();
			let i = _.sortedLastIndexBy(this.puzzles, p, this.quantifier) - 1;

			while (!this.puzzles[i].equals(p)) i--;

			this.puzzles.splice(i, 1);
			delete this.hashes[hash];

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