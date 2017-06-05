<template>
	<div class="controls">

		<app-control-algorithm :algorithm="algorithm"></app-control-algorithm>
		<app-control-iterations :maxIterations="maxIterations" :iterations="iterations"></app-control-iterations>
		<app-control-angle :angle="angle" v-if="showAngle"></app-control-angle>
		<app-control-speed :speed="speed"></app-control-speed>
		<app-control-mode :mode="mode"></app-control-mode>

		<div class="control">
			<button type="button" @click="replay">Replay</button>
		</div>

	</div>
</template>

<script>
	import {eventBus, ALGORITHMS} from '../main';
	import AlgorithmControl from './controls/AlgorithmControl.vue';
	import ModeControl from './controls/ModeControl.vue';
	import IterationsControl from './controls/IterationsControl.vue';
	import AngleControl from './controls/AngleControl.vue';
	import SpeedControl from './controls/SpeedControl.vue';

	export default {

		computed: {
			showAngle: function () {
				return this.algorithm === 'Koch';
			},
			maxIterations: function () {
				switch (this.algorithm) {
					case 'Koch':
						return ALGORITHMS.KOCH.MAX_ITERATIONS;
					case 'Dragon':
						return ALGORITHMS.DRAGON.MAX_ITERATIONS;
					default:
						return 5;
				}
			}
		},

		methods: {
			replay() {
				eventBus.replay();
			}
		},

		props: {
			algorithm: String,
			iterations:  Number,
			speed: Number,
			angle: Number,
			mode: String
		},

		components: {
			appControlAlgorithm: AlgorithmControl,
			appControlIterations: IterationsControl,
			appControlMode: ModeControl,
			appControlSpeed: SpeedControl,
			appControlAngle: AngleControl
		}
	}
</script>

<style>
	.controls {
		background-color: #F3F3F3;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.controls > .control {
		display: inline-block;
		flex: 1 1 auto;
		padding: 1rem;
	}

	.control-label {
		margin-right: 0.5rem;
		font-size: 0.75rem;
		display: block;
	}

	.control > input[type="range"] {
		width: 5rem;
	}
</style>