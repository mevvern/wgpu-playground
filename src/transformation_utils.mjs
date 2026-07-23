import { Vec2, Vec3, Vec4, Vector } from "./vector_utils.mjs"
import { Mat2, Mat3, Mat4, Matrix } from "./matrix_utils.mjs"

class Transformation extends Matrix {
	constructor() {
		let arr = new Float64Array(16);
		arr.fill(0);
		for (let i = 0; i < 4; i++) {
			arr[i * 4 + i] = 1;
		}
		super(4, 4, ...arr)
	}

	/**
	 * scales this matrix by the supplied xyz scale vector. MUTATES!!!!!
	 * 
	 * @param {Vec3} scale x, y, and z scale
	 */
	scale = (scale) => {
		this[0][0] *= scale.x;
		this[1][1] *= scale.y;
		this[2][2] *= scale.z;
	}

	/**
	 * scales this matrix by the supplied xyz scale vector. MUTATES!!!!!
	 * 
	 * @param {Quaternion} scale x, y, and z scale
	 */
	scale = (scale) => {
		if (!(scale instanceof Vec3)) {
			throw new TypeError("Scale operation only accepts Vector3")
		}
		this[0][0] *= scale.x;
		this[1][1] *= scale.y;
		this[2][2] *= scale.z;
	}
}

class Quaternion extends Vec4 {
	constructor(...components) {
		super(...components);
	}

	/**
	 * Returns this quaternion as a 4x4 transformation matrix that will achieve the resulting rotation
	 * 
	 * @returns {Transformation}
	 */
	toTransformation = () => {
		let quaternion = this.normalized();

		let q0 = quaternion.x;
		let q1 = quaternion.y;
		let q2 = quaternion.z;
		let q3 = quaternion.w;

		let m00 = 2.0 * (q0 * q0 + q1 * q1) - 1.0;
		let m01 = 2.0 * (q1 * q2 - q0 * q3);
		let m02 = 2.0 * (q1 * q3 + q0 * q2);

		let m10 = 2.0 * (q1 * q2 + q0 * q3);
		let m11 = 2.0 * (q0 * q0 + q2 * q2) - 1.0;
		let m12 = 2.0 * (q2 * q3 - q0 * q1);

		let m20 = 2.0 * (q1 * q3 - q0 * q2);
		let m21 = 2.0 * (q2 * q3 + q0 * q1);
		let m22 = 2.0 * (q0 * q0 + q3 * q3) - 1.0;

		return new Transformation(
			m00, m10, m20, 0,
			m01, m11, m21, 0,
			m02, m12, m22, 0,
			0, 0, 0, 0,
		);
	}
}

