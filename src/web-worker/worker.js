'use strict';

const Koch = require('./_koch').default;
const Dragon = require('./_dragon').default;
const Hilbert = require('./_hilbert').default;

/**
 * When a message is received, calculate the points requested and post the results
 * back to the requesting script.
 * @param e
 */
onmessage = e => {
	try {
		let points;
		switch (e.data.algorithm) {
			case 'HILBERT':
				points = Hilbert.calculatePoints(e.data);
				break;
			case 'KOCH':
			case 'CESARO':
				e.data.opts = {...e.data.opts, full: e.data.algorithm === 'KOCH'};
				points = Koch.calculatePoints(e.data);
				break;
			case 'DRAGON':
				points = Dragon.calculatePoints(e.data);
				break;
			default:
				points = [];
				break;
		}
		send({
			input: e.data,
			output: points
		});
	} catch (error) {
		send({
			input: e.data,
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
