import {Puzzle} from "Puzzle";
import {HashPuzzleMap} from "./PuzzleMap";
import {ArrayList} from "./List";
//import _ from "lodash";

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
	protected puzzles: ArrayList<Puzzle> = new ArrayList();
	protected quantifier: (p: Puzzle) => number;

	public constructor(quantifier: (p: Puzzle) => number, puzzles?: Puzzle[]) {
		this.quantifier = quantifier;
		(puzzles || []).forEach(p => this.add(p));
	}

	public contains(p: Puzzle): boolean {
		return p.hash() in this.hashes;
	}

	protected sortedIndexBy(p: Puzzle): number {
		let low = 0;
		let high = this.puzzles.length;
		const value = this.quantifier(p);

		while (low < high) {
			const mid = Math.floor((low + high) / 2);
			const computed = this.quantifier(this.puzzles.get(mid));

			if (computed < value) {
				low = mid + 1;
			} else {
				high = mid;
			}
		}

		return high;
	}

	public add(p: Puzzle): boolean {
		if (this.contains(p)) return false;

		const i = this.sortedIndexBy(p);
		this.puzzles.insert(i, p);
		this.hashes[p.hash()] = true;

		return true;
	}

	public remove(p: Puzzle): boolean {
		if (this.contains(p)) {
			const hash = p.hash();

			let i: number;
			if (this.puzzles.get(0).equals(p)) {
				// sometimes elements end up at the start for some reason?
				i = 0;
			}  else {
				i = Math.max(0, this.sortedIndexBy(p) - 1);
				while (!this.puzzles.get(i).equals(p)) i++;
			}

			this.puzzles.remove(i);
			delete this.hashes[hash];

			return true;
		}

		return false;
	}

	public first(): Puzzle {
		return this.puzzles.get(0);
	}

	public get length(): number {
		return this.puzzles.length;
	}
}