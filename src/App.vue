<template>
	<div class="app">

		<app-header></app-header>

		<app-controls
				:algorithm="algorithm"
				:iterations="iterations"
				:angle="angle"
				:speed="speed"
				:mode="mode"
		>
		</app-controls>

		<app-vis
				:algorithm="algorithm"
				:iterations="iterations"
				:angle="angle"
				:speed="speed"
				:mode="mode"
		></app-vis>

	</div>
</template>

<script>
	import {eventBus, EVENTS, ALGORITHMS} from './main';
	import Header from './components/Header.vue';
	import Controls from './components/Controls.vue';
	import Visualisation from './components/Visualisation.vue';

	export default {
		name: 'app',

		mounted() {
			eventBus.$on(EVENTS.ITERATIONS_CHANGED, v => this.iterations = v);
			eventBus.$on(EVENTS.ALGORITHM_CHANGED, v => {
				this.algorithm = v;
				// Make sure iterations gets reset properly
				this.iterations = Math.min(this.iterations, ALGORITHMS[v].MAX_ITERATIONS);
			});
			eventBus.$on(EVENTS.MODE_CHANGED, v => this.mode = v);
			eventBus.$on(EVENTS.ANGLE_CHANGED, v => this.angle = v);
			eventBus.$on(EVENTS.SPEED_CHANGED, v => this.speed = v);
		},

		data () {
			// Defaults
			return {
				algorithm: 'KOCH',
				iterations: 3,
				angle: 30, // Cesaro only
				speed: 0.4,
				mode: 'Trace'
			}
		},

		components: {
			appHeader: Header,
			appControls: Controls,
			appVis: Visualisation
		}
	}
</script>

<style scoped>
	.app {
		padding: 0 1rem;
		width: 700px;
		color: #333;
		font-family: -apple-system, BlinkMacSystemFont,
		"Segoe UI", "Roboto", "Oxygen",
		"Ubuntu", "Cantarell", "Fira Sans",
		"Droid Sans", "Helvetica Neue", sans-serif;
	}
</style>
