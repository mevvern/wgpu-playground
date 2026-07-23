import { Vector } from "./vector_utils.mjs";

class Matrix {
	/**
	 * Constructs a row-major matrix of width and height with the supplied elements. if a single element argument is supplied, fill the matrix with that number
	 * 
	 * @param {number} width
	 * @param {number} height
	 * @param {...number} elements
	 */
	constructor(width, height, ...elements) {
		if (typeof width !== "number") {
			throw new TypeError(`incorrect type for matrix width: ${width.constructor.name}`);
		}
		if (typeof height !== "number") {
			throw new TypeError(`incorrect type for matrix height: ${width.constructor.name}`);
		}
		if (elements.every((elem) => { return typeof elem !== "number" })) {
			throw new TypeError("Cannot instantiate matrix. Matrix constructor only accepts numbers as elements");
		}
		//if a single number is supplied just fill the whole matrix with that number
		if (elements.length === 1) {
			let newElements = new Array(width * height);
			newElements.fill(elements[0]);
			elements = newElements;
		}
		if (elements.length !== width * height) {
			throw new RangeError(`incorrect number of input elements for ${width}x${height} matrix. expected ${width * height} elements but got ${elements.length} instead`);
		}
		this._data = new Float32Array(elements);
		this._width = Math.round(width);
		this._height = Math.round(height);

		return new Proxy(this, {
			get: (target, x) => {
				if (!isFinite(x) || x instanceof Symbol) {
					return Reflect.get(target, x);
				}
				return new Proxy({}, {
					get: (_unused_, y) => {
						x = parseInt(x);
						y = parseInt(y);
						return target._getValue(x, y);
					},
					set: (_unused_, y, value) => {
						x = parseInt(x);
						y = parseInt(y);
						target._setValue(x, y, value);
						return true;
					}
				})
			}
		})
	}

	// ---------- private methods ---------------
	_getValue = (x, y) => {
		if (x < 0 || x > this._width) {
			throw new RangeError(`Cannot get column ${x}; index out of bounds`);
		}
		if (y < 0 || y > this._height) {
			throw new RangeError(`Cannot get row ${y}; index out of bounds`);
		}
		return this._data[(y * this._width) + x];
	}

	_setValue = (x, y, value) => {
		if (x < 0 || x > this._width) {
			throw new RangeError(`Cannot set column ${x}; index out of bounds`);
		}
		if (y < 0 || y > this._height) {
			throw new RangeError(`Cannot set row ${y}; index out of bounds`);
		}
		if (typeof value !== "number") {
			throw new TypeError(`Matrix elements must only be numbers`);
		}
		this._data[(y * this._width) + x] = value;
	}

	// ---------- getters & setters ---------------
	/**
	 * Contains width and height of the matrix as x and y respectively
	 * 
	 * @returns {Object}
	 */
	get size() {
		return { x: width, y: height };
	}

	// ---------- static methods ---------------
	/**
	 * Returns the identity matrix of the supplied size
	 * 
	 * @param {number} size the size of the returned identity matrix
	 * @returns {Matrix}
	 */
	static identity(size) {
		if (typeof size !== "number") {
			throw new TypeError(`incorrect type for matrix width: ${width.constructor.name}`);
		}
		let matrix = new Matrix(size, size, 0);
		for (let i = 0; i < size; i++) {
			matrix[i][i] = 1;
		}
		return matrix;
	}

	/**
	 * Returns true if the widths and heights of the two supplied matrices are the same
	 * 
	 * @param {Matrix} a Matrix A
	 * @param {Matrix} b Matrix B
	 * @returns {Matrix}
	 */
	static sizeEqual = (a, b) => {
		if (!(a instanceof Matrix) || !(b instanceof Matrix)) {
			throw new TypeError(`Matrix operations only accept matrices`);
		}
		return a._height === b._height && a._width === b._width;
	}

	/**
	 * Adds matrices A and B together element-wise. Both matrices must be the same dimensions. If B is a scalar, adds B to each element of A instead.
	 * 
	 * @param {Matrix} a Matrix A
	 * @param {any} b Matrix B or scalar
	 * @return {Vector}
	 */
	static add = (a, b) => {
		if (a instanceof Matrix && b instanceof Matrix && Matrix.sizeEqual(a, b)) {
			let resultArr = new Float64Array(a._height * a._width);
			for (let i = 0; i < a._data.length; i++) {
				resultArr[i] = a._data[i] + b._data[i];
			}
			return new Matrix(a._width, a._height, ...resultArr);
		} else if (a instanceof Matrix && typeof b === "number") {
			let resultArr = new Float64Array(a._height * a._width);
			for (let i = 0; i < a._data.length; i++) {
				resultArr[i] = a._data[i] + b;
			}
			return new Matrix(a._width, a._height, ...resultArr);
		} else if (a instanceof Matrix && b instanceof Matrix && !(Matrix.sizeEqual(a, b))) {
			throw new RangeError(`Cannot add matrix of dimensions ${b._width}x${b._height} to matrix of dimensions ${a._width}x${a._height}. Matrix addition must use the same dimensions for a and b`)
		} else {
			const classA = a.constructor.name;
			const classB = b.constructor.name;
			let errorStr = classA === "Matrix" ? `b: ${classB}` : `a; ${classA}, b; ${classB}`;
			throw new TypeError(`invalid type(s) for Matrix operation: ${errorStr}`);
		}
	}

	/**
	 * Multiplies matrices A and B together element-wise. Both matrices must be the same dimensions
	 * 
	 * @param {Matrix} a Matrix A
	 * @param {any} b Matrix B
	 * @return {Vector}
	 */
	static multElems = (a, b) => {
		if (a instanceof Matrix && b instanceof Matrix && Matrix.sizeEqual(a, b)) {
			let resultArr = new Float64Array(a._height * a._width);
			for (let i = 0; i < a._data.length; i++) {
				resultArr[i] = a._data[i] * b._data[i];
			}
			return new Matrix(a._width, a._height, ...resultArr);
		} else if (a instanceof Matrix && b instanceof Matrix && !(Matrix.sizeEqual(a, b))) {
			throw new RangeError(`Cannot element-wise multiply matrix of dimensions ${b._width}x${b._height} with matrix of dimensions ${a._width}x${a._height}. Element-wise matrix multiplication must use the same dimensions for a and b`)
		} else {
			const classA = a.constructor.name;
			const classB = b.constructor.name;
			let errorStr = classA === "Matrix" ? `b: ${classB}` : `a; ${classA}, b; ${classB}`;
			throw new TypeError(`invalid type(s) for Matrix operation: ${errorStr}`);
		}
	}

	/**
	 * The big one. the Real matrix multiplication. Accepts a vector or a matrix for both arguments. The width of argument A must equal the height of argument B. If a vector is supplied to argument A, it will be turned into a row vector, and if one is supplied to argument B, it will be turned into a column vector. If B is scalar, multiply each element of A by B instead.
	 * 
	 * @param {any} a Matrix A or vector
	 * @param {any} b Matrix B or vector or scalar
	 * @return {Vector}
	 */
	static mult = (a, b) => {
		if (a instanceof Vector) {
			a = a.toMatrix("row");
		}
		if (b instanceof Vector) {
			b = b.toMatrix("col");
		}
		if (a instanceof Matrix && b instanceof Matrix) {
			if (a._width !== b._height) {
				throw new RangeError(`Width of matrix A must equal height of matrix B`);
			}

			let result = new Matrix(b._width, a._height, 0);
			const n = a._width;

			for (let x = 0; x < b._width; x++) {
				for (let y = 0; y < a._height; y++) {
					let aRow = a.getRow(y);
					let bCol = b.getCol(x);
					let dot = 0;
					for (let i = 0; i < a._width; i++) {
						dot += aRow[i] * bCol[i];
					}
					result[x][y] = dot;
				}
			}

			return result;

		} else if (a instanceof Matrix && typeof b === "number") {
			let resultArr = new Float64Array(a._width * a._height);
			for (let i = 0; i < a._data.length; i++) {
				resultArr[i] = a._data[i] * b;
			}
			return new Matrix(a._width, a._height, ...resultArr);
		} else {
			const classA = a.constructor.name;
			const classB = b.constructor.name;
			let errorStr = classA === "Matrix" ? `b: ${classB}` : `a; ${classA}, b; ${classB}`;
			throw new TypeError(`invalid type(s) for Matrix operation: ${errorStr}`);
		}
	}

	/**
	 * Subtracts matrix B from matrix A element-wise. Both matrices must be the same dimensions. If B is a scalar, subtracts B from each element of A.
	 * 
	 * @param {Matrix} a Matrix A
	 * @param {any} b Matrix B or scalar
	 * @return {Vector}
	 */
	static sub = (a, b) => {
		if (a instanceof Matrix && b instanceof Matrix && Matrix.sizeEqual(a, b)) {
			let resultArr = new Float64Array(a._height * a._width);
			for (let i = 0; i < a._data.length; i++) {
				resultArr[i] = a._data[i] - b._data[i];
			}
			return new Matrix(a._width, a._height, ...resultArr);
		} else if (a instanceof Matrix && typeof b === "number") {
			let resultArr = new Float64Array(a._height * a._width);
			for (let i = 0; i < a._data.length; i++) {
				resultArr[i] = a._data[i] - b;
			}
			return new Matrix(a._width, a._height, ...resultArr);
		} else if (a instanceof Matrix && b instanceof Matrix && !(Matrix.sizeEqual(a, b))) {
			throw new RangeError(`Cannot subtract matrix of dimensions ${b._width}x${b._height} from matrix of dimensions ${a._width}x${a._height}. Matrix subtraction must use the same dimensions for a and b`)
		} else {
			const classA = a.constructor.name;
			const classB = b.constructor.name;
			let errorStr = classA === "Matrix" ? `b: ${classB}` : `a; ${classA}, b; ${classB}`;
			throw new TypeError(`invalid type(s) for Matrix operation: ${errorStr}`);
		}
	}

	/**
	 * Divides matrix A by matrix B element-wise. Both matrices must be the same dimensions. If B is a scalar, divides each element of A by B.
	 * 
	 * @param {Matrix} a Matrix A
	 * @param {any} b Matrix B or scalar
	 * @return {Vector}
	 */
	static div = (a, b) => {
		if (a instanceof Matrix && b instanceof Matrix && Matrix.sizeEqual(a, b)) {
			let resultArr = new Float64Array(a._height * a._width);
			for (let i = 0; i < a._data.length; i++) {
				resultArr[i] = a._data[i] / b._data[i];
			}
			return new Matrix(a._width, a._height, ...resultArr);
		} else if (a instanceof Matrix && typeof b === "number") {
			let resultArr = new Float64Array(a._height * a._width);
			for (let i = 0; i < a._data.length; i++) {
				resultArr[i] = a._data[i] / b;
			}
			return new Matrix(a._width, a._height, ...resultArr);
		} else if (a instanceof Matrix && b instanceof Matrix && !(Matrix.sizeEqual(a, b))) {
			throw new RangeError(`Cannot divide matrix of dimensions ${a._width}x${a._height} by matrix of dimensions ${b._width}x${b._height}. Matrix division must use the same dimensions for a and b`)
		} else {
			const classA = a.constructor.name;
			const classB = b.constructor.name;
			let errorStr = classA === "Matrix" ? `b: ${classB}` : `a; ${classA}, b; ${classB}`;
			throw new TypeError(`invalid type(s) for Matrix operation: ${errorStr}`);
		}
	}

	// ---------- instance methods ---------------

	toString = () => {
		let str = `Mat${this._width}x${this._height}[\n`;
		for (let y = 0; y < this._height; y++) {
			for (let x = 0; x < this._width; x++) {
				str += `${this._getValue(x, y).toFixed(2)} `;
			}
			str += "\n";
		}
		str += "]";
		return str;
	}

	/**
	 * Returns a copy of this matrix.
	 * 
	 * @returns {Matrix}
	 */
	copy = () => {
		return new Matrix(this._width, this._height, ...this._data);
	}

	/**
	 * Returns the specified row of the matrix as a Float64Array 
	 * 
	 * @param {number} row the row to return as an array
	 * @returns {Float64Array}
	 */
	getRow = (row) => {
		let arr = new Float64Array(this._width)
		for (let i = 0; i < this._width; i++) {
			arr[i] = this._getValue(i, row);
		}
		return arr;
	}

	/**
	 * Sets the specified row of the matrix to the supplied array. The array must be the same length as the width of the matrix.
	 * 
	 * @param {number} row the row to return as an array
	 * @param arr the array to set the row to
	 * @returns {Float64Array}
	 */
	setRow = (row, arr) => {
		if (!(arr instanceof Array || arr instanceof Float64Array)) {
			throw new TypeError("Row must be set to an array");
		}
		if (arr instanceof Array && arr.every((elem) => { return typeof elem !== "number" })) {
			throw new TypeError("Cannot set row; array contains a non-number element");
		}
		for (let i = 0; i < this._width; i++) {
			this._setValue(i, row, arr[i]);
		}
	}

	/**
	 * Returns the specified column of the matrix as a Float64Array 
	 * 
	 * @param {number} row the row to return as an array
	 * @returns {Float64Array}
	 */
	getCol = (col) => {
		let arr = new Float64Array(this._width)
		for (let i = 0; i < this._width; i++) {
			arr[i] = this._getValue(col, i);
		}
		return arr;
	}

	/**
	 * Sets the specified column of the matrix to the supplied array. The array must be the same length as the height of the matrix.
	 * 
	 * @param {number} row the row to return as an array
	 * @param arr the array to set the row to
	 * @returns {Float64Array}
	 */
	setCol = (col, arr) => {
		if (!(arr instanceof Array || arr instanceof Float64Array)) {
			throw new TypeError("Column must be set to an array");
		}
		if (arr instanceof Array && arr.every((elem) => { return typeof elem !== "number" })) {
			throw new TypeError("Cannot set Column; array contains a non-number element");
		}
		for (let i = 0; i < this._width; i++) {
			this._setValue(col, i, arr[i]);
		}
	}
}

export { Matrix }