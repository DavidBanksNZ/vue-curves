<template>
	<div>
		<div class="vis-wrapper">
			<span class="vis-label"></span>
			<div class="vis"></div>
		</div>
		<div class="error-message"></div>
	</div>
</template>

<script>
	import {eventBus, EVENTS, CONFIG} from '../main';
	import {VisualisationService} from '../services/visualisation';
	import {WorkerService} from '../services/worker';

	export default {
		props: {
			algorithm: String,
			iterations: Number,
			speed: Number,
			angle: Number,
			mode: String
		},

		data() {
			return {
				container: null,
				svg: null,
				activePath: null,
				cancelFn: null
			}
		},

		mounted() {
			// Create SVG
			this.container = d3.select('.vis');
			this.svg = this.container.append('svg')
				.attr('width', CONFIG.WIDTH)
				.attr('height', CONFIG.HEIGHT);

			eventBus.$on(EVENTS.REPLAY, () => this.render({reuse: true}));

			this.render();
		},

		watch: {
			speed(v) {
				this.render({reuse: true});
			},
			algorithm(a) {
				this.render();
			},
			iterations(n) {
				let opts;
				if (this.mode === 'Morph') {
					opts = {
						reusePartial: true,
						prevN: WorkerService.data.lastResult.iterations
					};
				}
				this.render(opts);
			},
			angle(deg) {
				this.render();
			},
			mode(m) {
				if (m === 'Trace' && WorkerService.data.lastResult) {
					WorkerService.data.lastResult.data.get(this.iterations).then(
						d => {
							WorkerService.data.lastResult = {
								mode: 'Trace',
								data: d.actual
							};
							this.render({reuse: true});
						},
						err => this.render()
					);
				} else {
					this.render();
				}
			}
		},

		methods: {
			render(opts) {
				this.showError(null);
				const N = this.iterations;

				switch (this.mode) {
					case 'Trace':
						return this.renderTrace(opts).then(
							r => console.info(`Trace animation (N = ${N}) ${r ? 'completed' : 'cancelled'}`),
							e => {
								this.showError(e);
								console.error(`Trace animation (N = ${N}) failed`, e);
							}
						);
					case 'Morph':
						return this.renderMorph(opts).then(
							r => console.info(`Morph animation (N = ${N}) ${r ? 'completed' : 'cancelled'}`),
							e => {
								this.showError(e);
								console.error(`Morph animation failed (N = ${N})`, e);
							}
						);
					default:
						return Promise.reject(`Unknown mode: ${this.mode}`);
				}
			},
			renderMorph (_opts) {

				if (typeof this.cancelFn === 'function') {
					this.cancelFn();
					this.cancelFn = null;
				}

				return new Promise((resolve, reject) => {

					const opts = _opts || {};
					opts.reuse = opts.reuse ?
						WorkerService.data.lastResult && WorkerService.data.lastResult.mode === 'Morph' && this.algorithm === WorkerService.data.lastResult.algorithm :
						false;

					let i = 0;
					let cancelled = false;

					this.cancelFn = () => {
						if (this.activePath) {
							// Make sure any active transition is stopped
							this.activePath.transition();
						}
						cancelled = true;
						resolve(false);
					};

					const transition = (promises, pathElem) => {
						i += 1;
						const t0 = Date.now();
						return promises.get(i).then((data) => {
							const t1 = Date.now();
							const _delay = VisualisationService.getMorphDelay(this.speed);
							const delay = i > 1 ? Math.max(0, _delay - (t1 - t0)) : 0;
							const duration = VisualisationService.getMorphDuration(this.speed);

							return new Promise((_resolve, _reject) => {
								VisualisationService.morphPath(pathElem, data.flat.output, data.actual.output, this.algorithm, duration, delay)
									.on('start', () => {
										this.setIterationLabel(i);
									})
									.on('end', () => {
										if (!cancelled) {
											if (i < this.iterations) {
												_resolve(transition(promises, pathElem));
											} else {
												_resolve(true);
											}
										}
									});
							});
						});
					};

					WorkerService.dataReady(this.algorithm, this.mode, this.iterations, opts)
						.then(
							promises => {
								this.svg.select('path')
									.remove();

								this.activePath = VisualisationService.generatePathElem(this.svg, '');
								return transition(promises, this.activePath);
							}
						).then(
							finished => resolve(finished),
							err => reject(err)
						);

					const range = d3.range(1, this.iterations + 1);

					range.forEach(i => {
						// Only send the task to the worker if the data cannot be sourced from the
						// last result.  For instance in morph mode, jumping from 2 total iterations
						// to 3 with no other config changes means that the previous result can be
						// partially reused and only a task for N = 3 needs to be sent to the worker.
						if (!(opts && (opts.reuse || (opts.reusePartial && i <= opts.prevN)))) {
							WorkerService.sendTaskToWorker(this.algorithm, i,  true, {angle: this.angle});
							WorkerService.sendTaskToWorker(this.algorithm, i, false, {angle: this.angle});
						}
					});

				});

			},
			renderTrace (_opts) {
				console.log(_opts)

				if (typeof this.cancelFn === 'function') {
					this.cancelFn();
					this.cancelFn = null;
				}

				return new Promise((resolve, reject) => {

					const opts = _opts || {};
					opts.reuse = opts.reuse ?
						WorkerService.data.lastResult && WorkerService.data.lastResult.mode === 'Trace' && this.algorithm === WorkerService.data.lastResult.algorithm :
						false;

					if (this.activePath) {
						this.activePath.transition();
					}

					this.svg.select('path')
						.remove();

					this.setIterationLabel(this.iterations);

					let cancelled = false;

					this.cancelFn = () => {
						if (this.activePath) {
							// Make sure any active transition is stopped
							this.activePath.transition();
						}
						cancelled = true;
						resolve(false);
					};

					WorkerService.dataReady(this.algorithm, this.mode, this.iterations, opts).then(
						data => {
							const path = VisualisationService.definePath(this.algorithm, data.output);
							this.activePath = VisualisationService.generatePathElem(this.svg, path);

							VisualisationService.tracePath(this.activePath, VisualisationService.getTraceSpeed(this.speed))
								.on('end', () => {
									if (!cancelled) {
										resolve(true);
									}
								});

						},
						err => reject(err)
					);

					if (!opts.reuse) {
						WorkerService.sendTaskToWorker(this.algorithm, this.iterations, false, {angle: this.angle});
					}

				});
			},
			setIterationLabel(n) {
				d3.select('.vis-label')
					.text(`N = ${n}`);
			},
			showError(message) {
				d3.select('.error-message')
					.html(message ? `<b>An error occurred:</b><p><i>${message}</i></p>` : '');
			}
		}
	}
</script>

<style scoped>
	.vis-wrapper {
		position: relative;
		margin: 1rem 0 5rem 0;
	}

	.vis-label {
		position: absolute;
		font-style: italic;
		font-size: 2rem;
		color: #666;
	}

	.error-message {
		color: #cc3333;
	}
</style>