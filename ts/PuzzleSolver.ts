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
}

class PuzzleMapWithDefault<T> extends PuzzleMap<T> {
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
 * Horribly inefficient but it works
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
	// complementary map, node => move to node it can be most easily reached from
	let cameFromMoves = new PuzzleMap<Moves>();

	// node => cost to reach that node from start
	let gScore = new PuzzleMapWithDefault<number>(Infinity);
	gScore.put(start, 0);

	// node => cost to reach end from that node (partially heuristic, partially known)
	let fScore = new PuzzleMapWithDefault<number>(Infinity);
	fScore.put(start, start.solveHeuristic());

	let ops = 0;

	while (openSet.length > 0) {
		let current = _.first(_.sortBy(openSet.puzzles, p => fScore.get(p)));

		if (current.isSolved()) {
			// solution found
			console.log(`Solution found after ${ops} operations`);
			return reconstructPath(cameFrom, cameFromMoves, current);
		}

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

		if (ops % 100 == 0) {
			console.log(`Solving, ${ops} operations`);
		}

		if (ops > 10000) {
			throw new Error(`Maximum operations exceeded (${ops})`);
		}

		ops++;
	}

	throw new Error(`Solving failed`);
}