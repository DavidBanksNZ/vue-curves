import Vue from 'vue'
import App from './App.vue'


export const EVENTS = {
	ITERATIONS_CHANGED: 'ITERATIONS_CHANGED',
	ANGLE_CHANGED: 'ANGLE_CHANGED',
	SPEED_CHANGED: 'SPEED_CHANGED',
	MODE_CHANGED: 'MODE_CHANGED',
	ALGORITHM_CHANGED: 'ALGORITHM_CHANGED',
	REPLAY: 'REPLAY'
};


export const CONFIG = {
	WIDTH: 750,
	HEIGHT: 500,
	COLOR: '#3675AA'
};


export const ALGORITHMS = {
	KOCH: {
		MAX_ITERATIONS: 8,
		LABEL: 'Koch snowflake'
	},
	CESARO: {
		MAX_ITERATIONS: 8,
		LABEL: 'Cesàro fractal'
	},
	DRAGON: {
		MAX_ITERATIONS: 15,
		LABEL: 'Heighway dragon'
	},
	HILBERT: {
		MAX_ITERATIONS: 8,
		LABEL: 'Hibert curve'
	}
};


export const eventBus = new Vue({
	methods: {
		setIterations (n) {
			this.$emit(EVENTS.ITERATIONS_CHANGED, n);
		},
		setAngle(deg) {
			this.$emit(EVENTS.ANGLE_CHANGED, deg);
		},
		setSpeed(speed) {
			this.$emit(EVENTS.SPEED_CHANGED, speed);
		},
		setMode(mode) {
			this.$emit(EVENTS.MODE_CHANGED, mode);
		},
		setAlgorithm(alg) {
			this.$emit(EVENTS.ALGORITHM_CHANGED, alg);
		},
		replay() {
			this.$emit(EVENTS.REPLAY);
		}
	}
});


new Vue({
	el: '#app',
	render: h => h(App)
});