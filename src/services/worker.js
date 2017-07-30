import {CONFIG} from '../main';


export const WorkerService = {

	worker: require("worker-loader!../web-worker/worker.js")(),

	data: {
		lastResult: null
	},

	/**
	 * Get a promise that when resolved will return data to be used in a trace animation.
	 * @param algorithm
	 * @param opts - optional extra params
	 * @returns {Promise}
	 */
	dataReadyTrace (algorithm, opts) {
		return new Promise((resolve, reject) => {
			this.worker.onmessage = e => {
				const data = JSON.parse(e.data);
				if (data.error) {
					this.data.lastResult = null;
					reject(data.error);
				} else {
					this.data.lastResult = {
						algorithm,
						mode: 'Trace',
						data: data
					};
					resolve(data);
				}
			};
		});
	},

	/**
	 * Get a promise that when resolved will return a map of promises, with one entry for
	 * each iteration from 1 up to config.iterations. Each one of these inner promises
	 * resolves when the data required for that iteration has been received from the worker.
	 * @param algorithm
	 * @param iterations
	 * @param opts - optional extra params
	 * @returns {Promise}
	 */
	dataReadyMorph (algorithm, iterations, opts) {
		return new Promise((resolve, reject) => {

			const results = d3.map();
			const promises = d3.map();
			const resolveReject = d3.map();

			const range = d3.range(1, iterations + 1);

			range.forEach(i => {
				// Create new promise for each iteration. If we can partially reuse the last
				// result, keep the promises from the last result. Otherwise create new ones.
				if (opts.reusePartial && i <= opts.prevN) {
					promises.set(i, this.data.lastResult.data.get(i));
				} else {
					const p = new Promise((resolve, reject) => {
						resolveReject.set(i, {resolve, reject});
					});
					promises.set(i, p);
				}
			});

			Promise.all(promises.values()).catch(
				(error) => console.error(error)
			);

			this.data.lastResult = {
				algorithm,
				mode: 'Morph',
				data: promises
			};

			this.worker.onmessage = e => {
				const data = JSON.parse(e.data);
				const entry = results.get(data.input.N) || {};
				if (data.input.flat) {
					entry.flat = data;
				} else {
					entry.actual = data;
				}

				results.set(data.input.N, entry);

				if (entry.flat && entry.actual) {
					const actions = resolveReject.get(data.input.N);
					if (data.error) {
						actions.reject(data.error);
					} else {
						actions.resolve(entry);
					}
				}
			};

			resolve(promises);
		});
	},

	/**
	 * Get a promise that resolves when data has been received and the animation can begin.
	 * @param algorithm
	 * @param mode
	 * @param iterations
	 * @param opts
	 * @returns {Promise}
	 */
	dataReady (algorithm, mode, iterations, opts) {
		if (opts.reuse) {
			return Promise.resolve(this.data.lastResult.data);
		}

		switch (mode) {
			case 'Trace':
				return this.dataReadyTrace(algorithm, opts);
			case 'Morph':
				return this.dataReadyMorph(algorithm, iterations, opts);
			default:
				return Promise.reject(`Unknown mode: ${mode}`);
		}
	},

	/**
	 * Send a task to the web worker, requesting a calculation for a particular # of iterations.
	 * @param algorithm
	 * @param iterations - number of iterations to request data for
	 * @param flat       - set to true to calculate points for the flattened state
	 * @param opts       - extra options to send
	 */
	sendTaskToWorker (algorithm, iterations, flat, opts) {
		this.worker.postMessage({
			algorithm,
			N: iterations,
			width: CONFIG.WIDTH,
			height: CONFIG.HEIGHT,
			flat: flat || false,
			opts: opts || {}
		});
	}

};