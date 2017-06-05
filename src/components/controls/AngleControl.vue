<template>
	<div class="control">
		<span class="control-label">Angle: <span data-control="angle" class="control-value">{{angle}}</span>°</span>
		<input type="range"
		       @change="changed($event)"
		       step="1"
		       :min="minAngle"
		       :max="maxAngle"
		       :value="angle">
	</div>
</template>

<script>
	import {eventBus} from '../../main';

	export default {
		props: {
			angle: Number,
			minAngle: Number,
			maxAngle: Number
		},
		methods: {
			changed(evt) {
				eventBus.setAngle(+evt.target.value);
			}
		}
	}
</script>