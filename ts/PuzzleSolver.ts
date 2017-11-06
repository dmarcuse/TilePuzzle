import {Puzzle, Moves} from "./Puzzle";
import _ from "lodash";

class PuzzleSet {
	public puzzles: Puzzle[];

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

class PuzzleMap<T> {
	public map: [Puzzle, T][];

	public constructor(map?: [Puzzle, T][]) {
		this.map = map || [];
	}

	public containsKey(p: Puzzle): boolean {
		return _.some(this.map, it => it[0].equals(p));
	}

	public contains(t: T): boolean {
		return _.some(this.map, it => it[1] === t);
	}

	public put(p: Puzzle, t: T): void {
		for (let it of this.map) {
			if (it[0].equals(p)) {
				it[1] = t;
				return;
			}
		}

		this.map.push([p, t]);
	}

	public get(p: Puzzle): T {
		for (let it of this.map) {
			if (it[0].equals(p)) return it[1];
		}

		return undefined;
	}

	public remove(p: Puzzle): void {
		_.remove(this.map, it => it[0].equals(p));
	}
}

class PuzzleMapWithDefault<T> extends PuzzleMap<T> {
	public readonly defaultValue: T;

	public constructor(defaultValue: T, map?: [Puzzle, T][]) {
		super(map);
		this.defaultValue = defaultValue;
	}

	public get(p: Puzzle): T {
		let got = super.get(p);
		if (got == null) return this.defaultValue;
		return got;
	}
}

function reconstructPath(cameFrom: PuzzleMap<Puzzle>, cameFromMoves: PuzzleMap<Moves>, current: Puzzle): Moves[] {
	let totalPath = [];
	while (cameFrom.containsKey(current)) {
		totalPath.unshift(cameFromMoves.get(current));

		current = cameFrom.get(current);
	}
	return totalPath;
}

/**
 * Solves a puzzle using A* search
 * @param {Puzzle} start
 */
export function solve(start: Puzzle): Moves[] {
	start = new Puzzle(start.tiles);

	// nodes already evaluated
	let closedSet = new PuzzleSet();

	// discovered but unexplored nodes
	let openSet = new PuzzleSet([start]);

	// node => node that it can most easily be reached from
	let cameFrom = new PuzzleMap<Puzzle>();
	let cameFromMoves = new PuzzleMap<Moves>();

	// node => cost to reach that node from start
	let gScore = new PuzzleMapWithDefault<number>(Infinity);
	gScore.put(start, 0);

	// node => cost to reach end from that node (partially heuristic, partially known)
	let fScore = new PuzzleMapWithDefault<number>(Infinity);
	fScore.put(start, start.solveHeuristic());

	while (openSet.length > 0) {
		let current = _.first(_.sortBy(openSet.puzzles, p => fScore.get(p)));

		if (current.isSolved()) return reconstructPath(cameFrom, cameFromMoves, current);

		openSet.remove(current);
		closedSet.add(current);

		for (let move of current.validMoves()) {
			const neighbor = new Puzzle(current.tiles);
			neighbor.move(move);

			if (closedSet.contains(neighbor)) continue; // ignore already evaluated neighbors

			if (!openSet.contains(neighbor)) openSet.add(neighbor); // discovered a new node

			let tentativeGScore = gScore.get(current) + 1;

			if (tentativeGScore > gScore.get(neighbor)) continue; // not a better path

			cameFrom.put(neighbor, current);
			cameFromMoves.put(neighbor, move);
			gScore.put(neighbor, tentativeGScore);
			fScore.put(neighbor, tentativeGScore + neighbor.solveHeuristic());
		}
	}

	throw new Error(`Solving failed`);
}