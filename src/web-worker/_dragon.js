import {pairs} from './_utils';

const Dragon = {

	calculatePoints (data) {

		// Completed curve has aspect ratio 1.502

		const aspect = 1.502;
		let size; // refers to smaller dimension, height in this case

		if (data.width >= aspect * data.height) {
			size = data.height - 50;
		} else {
			size = (data.width - 50) /  aspect;
		}

		size /= aspect;

		// Theoretically use 0.5 to offset, but centroid gets skewed to top-left
		// because of the larger size changes caused by rotations during earlier
		// iterations. Using the below offsets gives a good center approximation
		const x0 = data.width / 2 - 0.42 * size * aspect;
		const y0 = data.height / 2 + 0.38 * size / aspect;

		const pt1 = [x0, y0];
		const pt2 = [x0 + size * aspect, y0];
		let pts = [pt1, pt2];
		let i = 0;

		while (++i <= data.N) {
			let _pairs = pairs(pts);
			let numPairs = _pairs.length;
			let ptGroups = _pairs
				.map((pair, j) => {
					const getFlatValues = i < data.N ? false : data.flat;
					return Dragon.getPointsBetween(pair[0], pair[1], getFlatValues, {right: j % 2 === 0});
				})
				.map((pts, j) => {
					return (j + 1 < numPairs) ? pts.slice(0, -1) : pts
				});

			pts = Array.prototype.concat.apply([], ptGroups);
		}

		return pts;
	},

	getPointsBetween(pt1, pt2, flat, data) {

		if (flat) {
			const center = [
				(pt1[0] + pt2[0]) / 2,
				(pt1[1] + pt2[1]) / 2
			];
			return [pt1, center, pt2];
		}

		const dX = pt2[0] - pt1[0];
		const dY = pt2[1] - pt1[1];

		const isAngled = dX !== 0 && dY !== 0;
		let midPoint;

		if (!isAngled) {
			const isVertical = dX === 0;
			let direction;
			if (isVertical) {
				direction = (dY < 0 && data.right) || (dY > 0 && !data.right) ? -1 : 1;
				midPoint = [
					pt1[0] + direction * Math.abs(dY) / 2,
					(pt1[1] + pt2[1]) / 2
				];
			} else {
				direction = (dX < 0 && data.right) || (dX > 0 && !data.right) ? 1 : -1;
				midPoint = [
					(pt1[0] + pt2[0]) / 2,
					pt1[1] + direction * Math.abs(dX) / 2,
				];
			}
		} else {
			const a = [pt1[0], pt2[1]];
			const b = [pt2[0], pt1[1]];
			const aIsEast = a[0] < b[0];
			if ((dY < 0 && data.right) || (dY > 0 && !data.right)) {
				midPoint = aIsEast ? a : b;
			} else {
				midPoint = aIsEast ? b : a;
			}
		}

		return [pt1, midPoint, pt2];

	}

};

export default Dragon;