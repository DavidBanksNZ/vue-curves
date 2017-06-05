<template>
	<div class="control">
		<span class="control-label">Iterations</span>
		<select @change="changed($event)">
			<option v-for="i in maxIterations"
			        :key="i"
			        :value="i"
			        :selected="i === iterations"
			>{{i}}</option>
		</select>
	</div>
</template>

<script>
	import {eventBus} from '../../main';

	export default {
		props: {
			iterations: Number,
			maxIterations: Number
		},
		methods: {
			changed(evt) {
				eventBus.setIterations(+evt.target.value);
			}
		}
	}
</script>