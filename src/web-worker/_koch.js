import {deg2Rad, rotatePt, pairs} from './_utils';

const Koch = {

	calculatePoints (data) {

		const pt1 = [0, 0];
		const pt2 = [data.width, 0];
		let pts = [pt1, pt2];
		let i = 0;

		while (++i <= data.N) {
			let _pairs = pairs(pts);
			let numPairs = _pairs.length;
			let ptGroups = _pairs
				.map((pair, j) => {
					const getFlatValues = i < data.N ? false : data.flat;
					return Koch.getPointsBetween(pair[0], pair[1], getFlatValues, data.opts);
				})
				.map((pts, j) => {
					return (j + 1 < numPairs) ? pts.slice(0, -1) : pts
				});

			pts = Array.prototype.concat.apply([], ptGroups);
		}

		return pts;
	},

	getPointsBetween(pt1, pt2, flat, opts) {

		const dX = pt2[0] - pt1[0];
		const dY = pt2[1] - pt1[1];

		// angle between pt1 and pt2
		let theta = Math.atan(dY / dX);
		if (dX < 0) {
			theta += Math.PI;
		}

		// length of line joining pts
		const L = Math.sqrt(dX ** 2 + dY ** 2);

		const segmentLength = 0.5 * L / (1 + Math.sin(0.5 * deg2Rad(opts.angle)));
		const h = Math.sqrt(L * (segmentLength - L / 4));

		// Now calculate points along that straight line segment,
		// with pts translated such that pt1 is now at (0,0)
		const midPts = [
			[segmentLength, 0],
			[L / 2, flat ? 0 : h],
			[L - segmentLength, 0]
		];

		// Apply rotation
		const midPtsRotated = midPts.map(pt => rotatePt(pt, theta));

		// Translate back
		const midPtsTranslated = midPtsRotated.map(pt => {
			return [
				pt[0] + pt1[0],
				pt[1] + pt1[1]
			];
		});

		return [pt1, ...midPtsTranslated, pt2];
	}

};

export default Koch;