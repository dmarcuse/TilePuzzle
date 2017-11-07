import {Puzzle, Moves} from "Puzzle";
import {HashPuzzleSet, SortedHashPuzzleSet} from "Structures/PuzzleSet";
import {HashPuzzleMap, PuzzleMapWithDefault} from "Structures/PuzzleMap";
import _ from "lodash";

function reconstructPath(cameFrom: HashPuzzleMap<Puzzle>, cameFromMoves: HashPuzzleMap<Moves>, current: Puzzle): Moves[] {
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
export async function solve(start: Puzzle): Promise<Moves[]> {
	const startTime = _.now();

	start = new Puzzle(start.tiles);

	// nodes already evaluated
	let closedSet = new HashPuzzleSet();

	// node => node that it can most easily be reached from
	let cameFrom = new HashPuzzleMap<Puzzle>();
	// complementary map, node => move to node it can be most easily reached from
	let cameFromMoves = new HashPuzzleMap<Moves>();

	// node => cost to reach that node from start
	let gScore = new PuzzleMapWithDefault<number>(Infinity);
	gScore.put(start, 0);

	// node => cost to reach end from that node (partially heuristic, partially known)
	let fScore = new PuzzleMapWithDefault<number>(Infinity);
	fScore.put(start, start.solveHeuristic());

	// discovered but unexplored nodes
	let openSet = new SortedHashPuzzleSet(p => fScore.get(p), [start]);

	let ops = 0;

	while (openSet.length > 0) {
		let current = openSet.first();

		if (current.isSolved()) {
			// solution found
			let solution = reconstructPath(cameFrom, cameFromMoves, current);
			console.log(`Solution (length ${solution.length}) found after ${ops} ops, ${_.now() - startTime} ms`);
			return solution
		}

		openSet.remove(current);
		closedSet.add(current);

		for (let move of current.validMoves()) {
			const neighbor = new Puzzle(current.tiles);
			neighbor.move(move);

			if (closedSet.contains(neighbor)) continue; // ignore already evaluated neighbors

			let tentativeGScore = gScore.get(current) + 1;

			if (tentativeGScore > gScore.get(neighbor)) continue; // not a better path

			cameFrom.put(neighbor, current);
			cameFromMoves.put(neighbor, move);
			gScore.put(neighbor, tentativeGScore);
			fScore.put(neighbor, tentativeGScore + neighbor.solveHeuristic());

			if (!openSet.contains(neighbor)) openSet.add(neighbor); // discovered a new node
		}

		if (ops % 500 == 0) {
			console.log(`Solving, ${ops} operations`);

			if (_.now() - startTime > 5 * 1000) {
				throw new Error(`Solve failed - maximum time exceeded (${ops} ops, ${_.now() - startTime} ms)`)
			}
		}

		ops++;
	}

	throw new Error(`Solving failed - unsolvable`);
}