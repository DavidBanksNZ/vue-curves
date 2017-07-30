/**
 * Convert degrees to radians
 * @param deg
 * @returns {number}
 */
export function deg2Rad (deg) {
	return deg * Math.PI / 180;
}


/**
 * Rotate a point in 2D space about the given center point.
 * @param pt    - the point [x,y] to rotate
 * @param angle - anticlockwise rotation in radians
 * @param center - optional center point to rotate around, default is [0, 0]
 * @returns {number[]}
 */
export function rotatePt(pt, angle, center) {
	if (angle === 0) {
		return pt;
	}
	if (!center) {
		center = [0, 0];
	}
	const _cos = Math.cos(angle);
	const _sin = Math.sin(angle);
	const ptTranslated = [
		pt[0] - center[0],
		pt[1] - center[1]
	];
	const ptRotated = [
		_cos * ptTranslated[0] - _sin * ptTranslated[1],
		_sin * ptTranslated[0] + _cos * ptTranslated[1]
	];

	// translate back
	return [
		center[0] + ptRotated[0],
		center[1] + ptRotated[1]
	];
}

/**
 * Return an array containing consecutive pairs of all points in the input
 * array.
 * @param arr
 * @returns {Array<any[]>}
 */
export function pairs (arr) {
	return arr
		.map((val, i) => (i > 0 ? [arr[i - 1], arr[i]] : null))
		.slice(1);
}