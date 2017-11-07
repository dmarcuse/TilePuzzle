export interface List<T> {
	get(i: number): T;

	set(i: number, value: T): void;

	append(value: T): void;

	insert(i: number, value: T): void;

	remove(i: number): T;

	length: number;
}

/**
 * A list implementation backed by arrays
 */
export class ArrayList<T> implements List<T> {
	/**
	 * Max number of items in each array
	 * @type {number}
	 */
	public static readonly MAX_SIZE = 50;

	protected arrays: T[][];

	public constructor(values?: T[]) {
		this.arrays = [];
		(values || []).forEach(e => this.append(e));
	}

	public get length(): number {
		return this.arrays.reduce((a, b) => a + b.length, 0);
	}

	public getIndices(i: number): [number, number] {
		let j = 0;
		while (i >= this.arrays[j].length) {
			i -= this.arrays[j].length;
			j++;
		}
		return [j, i];
	}

	public get(i: number): T {
		const [j, k] = this.getIndices(i);

		return this.arrays[j][k];
	}

	public set(i: number, value: T): void {
		const [j, k] = this.getIndices(i);

		this.arrays[j][k] = value;
	}

	public remove(i: number): T {
		const [j, k] = this.getIndices(i);

		let [got] = this.arrays[j].splice(k, 1);

		if (this.arrays[j].length == 0) {
			this.arrays.splice(j, 1);
		}

		return got;
	}

	public append(value: T): void {
		if (this.arrays.length == 0) {
			this.arrays[0] = [value];
		} else {
			const j = this.arrays.length - 1;
			const a = this.arrays[j];
			a.push(value);

			if (a.length > ArrayList.MAX_SIZE) {
				const split = a.length / 2;
				let b = a.splice(Math.floor(split), Math.ceil(split));
				this.arrays.splice(j + 1, 0, b);
			}
		}
	}

	public insert(i: number, value: T): void {
		if (this.arrays.length == 0) {
			this.arrays[0] = [value];
		} else if (i >= this.length) {
			this.append(value);
		} else {
			const [j, k] = this.getIndices(i);

			this.arrays[j].splice(k, 0, value);
		}
	}
}