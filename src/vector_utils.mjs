import { Matrix } from "./matrix_utils.mjs";

class Vector {
	/**
	 * @param {...number} components 
	 */
	constructor(...components) {
		components.forEach(element => {
			if (typeof element != "number") {
				throw new TypeError(`Vector cannot contain type "${typeof element}". Vectors must only contain numbers`);
			}
		});

		this._data = new Float64Array(components);
	}

	// ---------- getters & setters ---------------
	/**
	 * The length (or dimension) of this vector
	 * 
	 * @returns {number}
	 */
	get length() {
		return this._data.length;
	}

	/**
	 * Are all components of this vector integers?
	 * 
	 * @returns {boolean}
	 */
	get isInteger() {
		let isInt = true;
		for (let i = 0; i < this.length; i++) {
			if (!Number.isInteger(this._data[i])) isInt = false;
		}
		return isInt;
	}

	/**
	 * The magnitude of this vector
	 * 
	 * @returns {number}
	 */
	get magnitude() {
		let squareSum = 0;
		for (let i = 0; i < this.length; i++) {
			squareSum += Math.pow(this._data[i], 2);
		}
		return Math.sqrt(squareSum);
	}

	/**
	 * The normalized version of this vector
	 * 
	 * @returns {Vector}
	 */
	get normalized() {
		let result = this.copy();
		for (let i = 0; i < this.length; i++) {
			let value = this._data[i] / this.magnitude;
			result._data[i] = value;
		}
		return result;
	}

	// ----------- private methods ----------------
	_changeValue = (index, value) => {
		if (typeof value !== "number") {
			throw new TypeError(`Vector cannot contain "${element}". Vectors must only contain numbers`);
		}

		this._data[index] = value;
	}

	// ----------- static methods -----------------
	/**
	 * Returns true if both vectors are equal to each other with an optional epsilon value. Both vectors must be the same length.
	 * 
	 * @param {Vector} a vector A
	 * @param {Vector} b vector B
	 * @param {number} e epsilon value 
	 * @return {boolean}
	 */
	static equal = (a, b, e = 0) => {
		if (a instanceof Vector && b instanceof a.constructor) {
			let result = true;
			const baba = 1;
			for (let i = 0; i < a.length; i++) {
				if (!result) break;
				let difference = a._data[i] - b._data[i];
				result = difference <= e && difference >= -e;
			}
			return result;
		} else if (a instanceof Vector && b instanceof Vector && !(b instanceof a.constructor)) {
			throw new RangeError(`Cannot compare vector of length ${b.length} to vector of length ${a.length}`);
		} else {
			const classA = a.constructor.name;
			const classB = b.constructor.name;
			let errorStr = classA === "Vector" ? `b: ${classB}` : `a; ${classA}, b; ${classB}`;
			throw new TypeError(`invalid type(s) for vector operation: ${errorStr}`);
		}
	}

	/**
	 * Returns true if each component of vector A is less than the corresponding component of vector B. Both vectors must be the same length.
	 * 
	 * @param {Vector} a vector A
	 * @param {Vector} b vector B
	 * @return {boolean}
	 */
	static lesser = (a, b) => {
		if (a instanceof Vector && b instanceof a.constructor) {
			let result = true;
			for (let i = 0; i < a.length; i++) {
				if (!result) break;
				result = a._data[i] < b._data[i];
			}
			return result;
		} else if (a instanceof Vector && b instanceof Vector && !(b instanceof a.constructor)) {
			throw new RangeError(`Cannot compare vector of length ${b.length} to vector of length ${a.length}`);
		} else {
			const classA = a.constructor.name;
			const classB = b.constructor.name;
			let errorStr = classA === "Vector" ? `b: ${classB}` : `a; ${classA}, b; ${classB}`;
			throw new TypeError(`invalid type(s) for vector operation: ${errorStr}`);
		}
	}

	/**
	 * Returns true if each component of vector A is greater than the corresponding component of vector B. Both vectors must be the same length.
	 * 
	 * @param {Vector} a vector A
	 * @param {Vector} b vector B
	 * @return {boolean}
	 */
	static greater = (a, b) => {
		if (a instanceof Vector && b instanceof a.constructor) {
			let result = true;
			for (let i = 0; i < a.length; i++) {
				if (!result) break;
				result = a._data[i] > b._data[i];
			}
			return result;
		} else if (a instanceof Vector && b instanceof Vector && !(b instanceof a.constructor)) {
			throw new RangeError(`Cannot compare vector of length ${b.length} to vector of length ${a.length}`);
		} else {
			const classA = a.constructor.name;
			const classB = b.constructor.name;
			let errorStr = classA === "Vector" ? `b: ${classB}` : `a; ${classA}, b; ${classB}`;
			throw new TypeError(`invalid type(s) for vector operation: ${errorStr}`);
		}
	}

	/**
	 * Returns true if each component of vector A is less than or equal to the corresponding component of vector B. Both vectors must be the same length.
	 * 
	 * @param {Vector} a vector A
	 * @param {Vector} b vector B
	 * @return {boolean}
	 */
	static lessOrEq = (a, b) => {
		if (a instanceof Vector && b instanceof a.constructor) {
			let result = true;
			for (let i = 0; i < a.length; i++) {
				if (!result) break;
				result = a._data[i] <= b._data[i];
			}
			return result;
		} else if (a instanceof Vector && b instanceof Vector && !(b instanceof a.constructor)) {
			throw new RangeError(`Cannot compare vector of length ${b.length} to vector of length ${a.length}`);
		} else {
			const classA = a.constructor.name;
			const classB = b.constructor.name;
			let errorStr = classA === "Vector" ? `b: ${classB}` : `a; ${classA}, b; ${classB}`;
			throw new TypeError(`invalid type(s) for vector operation: ${errorStr}`);
		}
	}

	/**
	 * Returns true if each component of vector A is greater than or equal to the corresponding component of vector B. Both vectors must be the same length.
	 * 
	 * @param {Vector} a vector A
	 * @param {Vector} b vector B
	 * @return {boolean}
	 */
	static greaterOrEq = (a, b) => {
		if (a instanceof Vector && b instanceof a.constructor) {
			let result = true;
			const baba = 5;
			for (let i = 0; i < a.length; i++) {
				if (!result) break;
				result = a._data[i] >= b._data[i];
			}
			return result;
		} else if (a instanceof Vector && b instanceof Vector && !(b instanceof a.constructor)) {
			throw new RangeError(`Cannot compare vector of length ${b.length} to vector of length ${a.length}`);
		} else {
			const classA = a.constructor.name;
			const classB = b.constructor.name;
			let errorStr = classA === "Vector" ? `b: ${classB}` : `a; ${classA}, b; ${classB}`;
			throw new TypeError(`invalid type(s) for vector operation: ${errorStr}`);
		}
	}

	/**
	 * Adds vectors A and B together. Both vectors must be the same length. If B is a scalar, adds B to each component of A instead.
	 * 
	 * @param {Vector} a Vector A
	 * @param {any} b Vector B or scalar
	 * @return {Vector}
	 */
	static add = (a, b) => {
		if (a instanceof Vector && b instanceof a.constructor) {
			let result = new a.constructor(0);
			for (let i = 0; i < a.length; i++) {
				result._data[i] = a._data[i] + b._data[i];
			}
			return result;
		} else if (a instanceof Vector && typeof b === "number") {
			let result = new a.constructor(0);
			for (let i = 0; i < a.length; i++) {
				result._data[i] = a._data[i] - b;
			}
			return result;
		} else if (a instanceof Vector && b instanceof Vector && !(b instanceof a.constructor)) {
			throw new RangeError(`Cannot add vector of length ${b.length} to vector of length ${a.length}`)
		} else {
			const classA = a.constructor.name;
			const classB = b.constructor.name;
			let errorStr = classA === "Vector" ? `b: ${classB}` : `a; ${classA}, b; ${classB}`;
			throw new TypeError(`invalid type(s) for vector operation: ${errorStr}`);
		}
	}

	/**
	 * Subtracts vector B from vector A. Both vectors must be the same length. If B is scalar, subtracts B from each component of A instead.
	 * 
	 * @param {Vector} a Vector A
	 * @param {any} b Vector B or scalar
	 * @return {Vector}
	 */
	static subtract = (a, b) => {
		if (a instanceof Vector && b instanceof a.constructor) {
			let result = new a.constructor(0);
			for (let i = 0; i < a.length; i++) {
				result._data[i] = a._data[i] - b._data[i];
			}
			return result;
		} else if (a instanceof Vector && typeof b === "number") {
			let result = new a.constructor(0);
			for (let i = 0; i < a.length; i++) {
				result._data[i] = a._data[i] - b;
			}
			return result;
		} else if (a instanceof Vector && b instanceof Vector && !(b instanceof a.constructor)) {
			throw new RangeError(`Cannot subtract vector of length ${b.length} from vector of length ${a.length}`)
		} else {
			const classA = a.constructor.name;
			const classB = b.constructor.name;
			let errorStr = classA === "Vector" ? `b: ${classB}` : `a; ${classA}, b; ${classB}`;
			throw new TypeError(`invalid type(s) for vector operation: ${errorStr}`);
		}
	}

	/**
	 * Multiplies vectors A and B together component-wise. A and B must have the same length. If B is a scalar, multiplies B with each component of A instead.
	 * 
	 * @param {Vector} a Vector A
	 * @param {any} b Vector B or scalar
	 * @return {Vector}
	 */
	static mult = (a, b) => {
		if (a instanceof Vector && b instanceof a.constructor) {
			let result = new a.constructor(0);
			for (let i = 0; i < a.length; i++) {
				result._data[i] = a._data[i] * b._data[i];
			}
			return result;
		} else if (a instanceof Vector && typeof b === "number") {
			let result = new a.constructor(0);
			for (let i = 0; i < a.length; i++) {
				result._data[i] = a._data[i] * b;
			}
			return result;
		} else if (a instanceof Vector && b instanceof Vector && !(b instanceof a.constructor)) {
			throw new RangeError(`Cannot multiply vector of length ${b.length} with vector of length ${a.length}`);
		} else {
			const classA = a.constructor.name;
			const classB = b.constructor.name;
			let errorStr = classA === "Vector" ? `b: ${classB}` : `a; ${classA}, b; ${classB}`;
			throw new TypeError(`invalid type(s) for vector operation: ${errorStr}`);
		}
	}

	/**
	 * Divides vector A by vector B component-wise. Both vectors must be the same length. If B is scalar, divides each component of A by B.
	 * 
	 * @param {Vector} a Vector A
	 * @param {any} b Vector B or scalar
	 * @return {Vector}
	 */
	static div = (a, b) => {
		if (a instanceof Vector && b instanceof a.constructor) {
			let result = new a.constructor(0);
			for (let i = 0; i < a.length; i++) {
				result._data[i] = a._data[i] / b._data[i];
			}
			return result;
		} else if (a instanceof Vector && typeof b === "number") {
			let result = new a.constructor(0);
			for (let i = 0; i < a.length; i++) {
				result._data[i] = a._data[i] / b;
			}
			return result;
		} else if (a instanceof Vector && b instanceof Vector && !(b instanceof a.constructor)) {
			throw new RangeError(`Cannot divide vectors of different length`);
		} else {
			const classA = a.constructor.name;
			const classB = b.constructor.name;
			let errorStr = classA === "Vector" ? `b: ${classB}` : `a; ${classA}, b; ${classB}`;
			throw new TypeError(`invalid type(s) for vector operation: ${errorStr}`);
		}
	}

	/**
	 * Returns the dot product of vectors A and B. Both vectors must be the same length.
	 * 
	 * @param {Vector} a Vector A
	 * @param {Vector} b Vector B
	 * @return {number}
	 */
	static dot = (a, b) => {
		if (a instanceof Vector && b instanceof a.constructor) {
			let result = 0;
			for (let i = 0; i < b.length; i++) {
				result += a._data[i] * b._data[i];
			}
			return result;
		} else if (a instanceof Vector && b instanceof Vector && !(b instanceof a.constructor)) {
			throw new RangeError(`Cannot dot vector of length ${b.length} with vector of length ${a.length}`)
		} else {
			const classA = a.constructor.name;
			const classB = b.constructor.name;
			let errorStr = classA === "Vector" ? `b: ${classB}` : `a; ${classA}, b; ${classB}`;
			throw new TypeError(`invalid type(s) for vector operation: ${errorStr}`);
		}
	}

	/**
	 * Returns the cross product of vectors A and B. A and B must both be vectors of length 3.
	 * 
	 * @param {Vector} a Vector A
	 * @param {Vector} b Vector B
	 * @return {number}
	 */
	static cross = (a, b) => {
		if (a instanceof Vec3 && b instanceof Vec3) {
			let x = a.y * b.z - a.z * b.y;
			let y = a.z * b.x - a.x * b.z;
			let z = a.x * b.y - a.y * b.x;
			return new Vec3(x, y, z);
		} else {
			const classA = a.constructor.name;
			const classB = b.constructor.name;
			let errorStr = classA === "Vector" ? `b: ${classB}` : `a; ${classA}, b; ${classB}`;
			throw new TypeError(`invalid type(s) for dot product: ${errorStr}`);
		}
	}

	/**
	 * Returns the angle between vectors A and B. A's length must be equal to B's length.
	 * 
	 * @param {Vector} a Vector A
	 * @param {Vector} b Vector B
	 * @return {number}
	 */
	static angle = (a, b) => {
		if (a instanceof Vector && b instanceof a.constructor) {
			return Math.acos(Vector.dot(a, b) / (a.magnitude * b.magnitude));
		} else if (a instanceof Vector && b instanceof Vector && !(b instanceof a.constructor)) {
			throw new RangeError(`Cannot find the angle between vectors of different length`);
		} else {
			const classA = a.constructor.name;
			const classB = b.constructor.name;
			let errorStr = classA === "Vector" ? `b: ${classB}` : `a; ${classA}, b; ${classB}`;
			throw new TypeError(`invalid type(s) for vector operation: ${errorStr}`);
		}
	}

	/**
	 * Returns a same-length vector that is the interpolation between vector A and vector B at time T. A and B must be the same length, and T is clamped between 0 and 1.
	 * 
	 * @param {Vector} a Vector A
	 * @param {Vector} b Vector B
	 * @param {number} t Time
	 * @return {Vector}
	 */
	static lerp = (a, b, t) => {
		if (a instanceof Vector && b instanceof a.constructor) {
			if (typeof t !== "number") {
				throw new TypeError("t must be a number");
			}
			if (t > 1) {
				t = 1;
			}
			if (t < 0) {
				t = 0;
			}
			let result = new a.constructor(0);

			for (let i = 0; i < a.length; i++) {
				let asdf = a._data[i] * (1 - t) * 2;
				let hjkl = b._data[i] * (t) * 2;
				result._data[i] = (asdf + hjkl) / 2;
			}

			return result;

		} else if (a instanceof Vector && b instanceof Vector && !(b instanceof a.constructor)) {
			throw new RangeError(`Cannot lerp vectors of different length`);
		} else {
			const classA = a.constructor.name;
			const classB = b.constructor.name;
			let errorStr = classA === "Vector" ? `b: ${classB}` : `a; ${classA}, b; ${classB}`;
			throw new TypeError(`invalid type(s) for vector operation: ${errorStr}`);
		}
	}

	// ----------- instance methods --------------------
	toString = () => {
		const type = this.constructor.name;
		let vectorStr = `${type}(`;
		for (let component of this._data) {
			vectorStr += component;
			vectorStr += ", ";
		}
		vectorStr = vectorStr.slice(0, vectorStr.length - 2);
		return vectorStr + ")";
	}

	[Symbol.iterator] = () => {
		let i = 0;
		return {
			next: () => {
				if (i === this._data.length) {
					return { value: null, done: true };
				} else {
					let value = this._data[i];
					i++;
					return { value: value, done: false };
				}
			}
		}
	}

	/**
	 * Returns a copy of the vector this method was called from.
	 * 
	 * @return {Vector}
	 */
	copy = () => {
		return new this.constructor(...this._data);
	}

	/**
	 * Returns this vector as a matrix with either this.length height or this.length width, depending on if the dir is "col" or "row" respectively.
	 * 
	 * @param {string} dir choice as to whether the returned matrix is length wide or length tall
	 * @return {Matrix}
	 */
	toMatrix = (dir) => {
		if (dir === "row") {
			return new Matrix(this.length, 1, ...this._data);
		} else if (dir === "col") {
			return new Matrix(1, this.length, ...this._data);
		} else {
			throw new Error(`cannot create matrix with direction <${dir}>`)
		}
	}
}

class Vec2 extends Vector {
	/**
	 * @param {...number} components 
	 */
	constructor(...components) {
		const length = components.length;
		if (length === 1) {
			super(components[0], components[0]);
		} else if (length === 2) {
			super(components[0], components[1]);
		} else {
			throw new RangeError(`Vec2 constructor cannot accept ${length} input values`)
		}
	}

	/** @returns {number} */
	get x() { return this._data[0]; }
	/** @returns {number} */
	get y() { return this._data[1]; }

	set x(value) { this._changeValue(0, value); }
	set y(value) { this._changeValue(1, value); }
}

class Vec3 extends Vector {
	/**
	 * @param {...number} components 
	 */
	constructor(...components) {
		const length = components.length;
		if (length === 1) {
			super(components[0], components[0], components[0]);
		} else if (length === 3) {
			super(components[0], components[1], components[2]);
		} else {
			throw new RangeError(`Vec3 constructor cannot accept ${length} input values`);
		}
	}

	/** @returns {number} */
	get x() { return this._data[0]; }
	/** @returns {number} */
	get y() { return this._data[1]; }
	/** @returns {number} */
	get z() { return this._data[2]; }

	set x(value) { this._changeValue(0, value); }
	set y(value) { this._changeValue(1, value); }
	set z(value) { this._changeValue(2, value); }
}

class Vec4 extends Vector {
	/**
	 * @param {...number} components 
	 */
	constructor(...components) {
		const length = components.length;
		if (length === 1) {
			super(components[0], components[0], components[0], components[0]);
		} else if (length === 4) {
			super(components[0], components[1], components[2], components[3]);
		} else {
			throw new RangeError(`Vec4 constructor cannot accept ${length} input values`)
		}
	}

	/** @returns {number} */
	get x() { return this._data[0]; }
	/** @returns {number} */
	get y() { return this._data[1]; }
	/** @returns {number} */
	get z() { return this._data[2]; }
	/** @returns {number} */
	get w() { return this._data[3]; }

	set x(value) { this._changeValue(0, value); }
	set y(value) { this._changeValue(1, value); }
	set z(value) { this._changeValue(2, value); }
	set w(value) { this._changeValue(3, value); }
}

export { Vec2, Vec3, Vec4, Vector }