import {deg2Rad, rotatePt} from './_utils';


const translate = (points, x, y) => {
	return points.map(pt => [pt[0] + x, pt[1] + y]);
};

const rotate = (points, center, angle) => {
	const rad = deg2Rad(angle);
	return points.map(pt => rotatePt(pt, rad, center));
};

const flip = (points, center, angle) => {
	return rotate(points, center, angle).reverse();
};


const Hilbert = {

	calculatePoints (data) {

		if (data.flat) {
			// Get points for previous iteration...
			const prevPoints = Hilbert.calculatePoints({
				...data,
				flat: false,
				N: data.N - 1
			});
			// ... then replicate each point 4 times
			return Array.prototype.concat.apply(
				[],
				prevPoints.map(val => new Array(4).fill(val))
			);
		}

		const numRows = 2 ** data.N;
		const size = Math.min(data.width, data.height) - 20;
		const x0 = data.width / 2 - size / 2;
		const y0 = data.height / 2 - size / 2;

		const cellSize = size / numRows;
		const halfCellSize = cellSize / 2;

		let points = translate([
			[halfCellSize, halfCellSize],
			[halfCellSize, 3 * halfCellSize],
			[3 * halfCellSize, 3 * halfCellSize],
			[3 * halfCellSize, halfCellSize]
		], x0, y0);

		for (let i = 2; i <= data.N; i++) {
			const currCellSpacing = cellSize * 2 ** (i - 1);
			const halfCurrCellSpacing = currCellSpacing / 2;
			points = [
				...flip(points, [x0 + halfCurrCellSpacing, y0 + halfCurrCellSpacing], -90),
				...translate(points, 0, currCellSpacing),
				...translate(points, currCellSpacing, currCellSpacing),
				...flip(translate(points, currCellSpacing, 0), [x0 + 3 * halfCurrCellSpacing , y0 + halfCurrCellSpacing], 90)
			];
		}

		return points;

	}

};

export default Hilbert;