'use strict';

const Koch = require('./_koch').default;
const Dragon = require('./_dragon').default;

let algorithm = 'Koch';


/**
 * When a message is received, calculate the points requested and post the results
 * back to the requesting script.
 * @param e
 */
onmessage = e => {
	const d = e.data;
	algorithm = d.algorithm;
	try {
		const points = calculatePoints(
			[0, 0],
			[d.width, 0],
			d.N,
			d.flat,
			d.opts
		);
		send({
			input: d,
			output: points
		});
	} catch (error) {
		send({
			input: d,
			error: error.message
		});
	}
};


/**
 * Send a message back to the calling script.
 * @param data
 */
function send (data) {
	postMessage(JSON.stringify(data));
}


/**
 * Calculate all points between the start and end point for a given number of
 * iterations, and whether we want the 'flattened' state or not.
 * @param pt1  - start point
 * @param pt2  - end point
 * @param N    - # of iterations
 * @param flat - set to true to get the flattened state
 * @param opts - extra options to pass to the points generating function
 * @returns {Array<number[]>}
 */
function calculatePoints(pt1, pt2, N, flat, opts) {
	let pts = [pt1, pt2];
	let i = 0;

	while (++i <= N) {
		let _pairs = pairs(pts);
		let numPairs = _pairs.length;
		let ptGroups = _pairs
			.map((pair, j) => getPointsBetween(j, pair[0], pair[1], i, N, flat, opts))
			.map((pts, j) => {
				return (j + 1 < numPairs) ? pts.slice(0, -1) : pts
			});

		pts = Array.prototype.concat.apply([], ptGroups);
	}

	return pts;
}


/**
 * Runs the active algorithm, getting the points in between a pair of provided points.
 * @param index     - the current point index
 * @param pt1       - start poin
 * @param pt2       - end point
 * @param iteration - current iteration
 * @param N         - total iterations
 * @param flat      - set to true to get flattened state at iteration N
 * @param opts      - extra options to pass to algorithm
 * @returns {Array<number[]>}
 */
function getPointsBetween (index, pt1, pt2, iteration, N, flat, opts) {
	const getFlatValues = iteration < N ? false : flat;
	switch (algorithm) {
		case 'Dragon':
			return Dragon.getPointsBetween(pt1, pt2, getFlatValues, {right: index % 2 === 0}, opts);
		default:
			return Koch.getPointsBetween(pt1, pt2, getFlatValues, null, opts);
	}
}


/**
 * Return an array containing consecutive pairs of all points in the input
 * array.
 * @param arr
 * @returns {Array<any[]>}
 */
function pairs (arr) {
	return arr
		.map((val, i) => (i > 0 ? [arr[i - 1], arr[i]] : null))
		.slice(1);
}