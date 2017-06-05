import {deg2Rad, rotatePt} from './_utils';

export default {

	getPointsBetween(pt1, pt2, flat, data, opts) {

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