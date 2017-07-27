import {deg2Rad, rotatePt} from './_utils';

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

		const numCells = Math.pow(4, data.N);
		const numRows = Math.sqrt(numCells);
		const size = Math.min(data.width, data.height) - 40;
		const cellSize = size / numRows;
		const halfCellSize = cellSize / 2;

		let points = [
			[halfCellSize, halfCellSize],
			[halfCellSize, 3 * halfCellSize],
			[3 * halfCellSize, 3 * halfCellSize],
			[3 * halfCellSize, halfCellSize]
		];

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

		for (let i = 2; i <= data.N; i++) {
			const currCellSpacing = cellSize * Math.pow(2, i - 1);
			const halfCurrCellSpacing = currCellSpacing / 2;
			points = [
				...flip(points, [halfCurrCellSpacing, halfCurrCellSpacing], -90),
				...translate(points, 0, currCellSpacing),
				...translate(points, currCellSpacing, currCellSpacing),
				...flip(translate(points, currCellSpacing, 0), [3 * halfCurrCellSpacing , halfCurrCellSpacing], 90)
			];
		}

		return points;

	}

};

export default Hilbert;