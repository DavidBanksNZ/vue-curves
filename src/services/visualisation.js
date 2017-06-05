import {CONFIG} from '../main';

export const VisualisationService = {

	generatePathElem (svg, d) {
		return svg.append('path')
			.attr('d', d)
			.style('stroke-width', '1px')
			.style('fill', 'none')
			.style('stroke', CONFIG.COLOR);
	},

	definePath(algorithm, pts) {
		const path = d3.path();

		// Start location of path
		let xOffset = algorithm === 'Dragon' ? 160 : 0;
		let yOffset = algorithm === 'Dragon' ? 110 : CONFIG.HEIGHT;
		path.moveTo(xOffset + pts[0][0], yOffset - pts[0][1]);

		// Now define the shape of the path
		for (let i = 1, N = pts.length; i < N; i++) {
			path.lineTo(xOffset + pts[i][0], yOffset - pts[i][1]);
		}

		return path;
	},

	morphPath(pathElem, pathData1, pathData2, algorithm, duration, delay) {
		return pathElem
			.attr('d', VisualisationService.definePath(algorithm, pathData1))
			.transition()
			.delay(delay)
			.duration(duration)
			.ease(d3.easeCubicInOut)
			.attr('d', VisualisationService.definePath(algorithm, pathData2));
	},

	tracePath(path, speed) {

		const totalLength = path.node().getTotalLength();

		return path
			.attr('stroke-dasharray', `${totalLength} ${totalLength}`)
			.attr('stroke-dashoffset', totalLength)
			.transition()
			.duration(totalLength / speed)
			.ease(d3.easeLinear)
			.attr('stroke-dashoffset', 0);
	},

	getTraceSpeed(speed) {
		return 0.1 + 4.9 * Math.pow(speed, 2);
	},

	getMorphDuration(speed) {
		return 100 + 2900 * (1 - Math.sqrt(speed));
	},

	getMorphDelay(speed) {
		return 500 * (1 - Math.sqrt(speed));
	}


};