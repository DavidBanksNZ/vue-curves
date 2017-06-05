export default {

	getPointsBetween(pt1, pt2, flat, data, opts) {

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