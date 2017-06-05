<template>
	<div class="control">
		<span class="control-label">Speed</span>
		<input type="range"
		       @change="changed($event)"
		       step="0.01"
		       min="0"
		       max="1"
		       :value="speed">
	</div>
</template>

<script>
	import {eventBus} from '../../main';

	export default {
		props: {
			speed: Number
		},
		methods: {
			changed(evt) {
				eventBus.setSpeed(+evt.target.value);
			}
		}
	}
</script>