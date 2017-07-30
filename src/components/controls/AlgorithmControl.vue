<template>
	<div class="control">
		<span class="control-label">Algorithm</span>
		<select @change="changed($event)">
			<option v-for="_alg in algorithms"
			        :value="_alg"
			        :selected="_alg === algorithm">
				{{getLabel(_alg)}}
			</option>
		</select>
	</div>
</template>

<script>
	import {eventBus, ALGORITHMS} from '../../main';

	export default {
		data() {
			return {
				algorithms: Object.keys(ALGORITHMS)
			}
		},
		props: {
			algorithm: String
		},
		methods: {
			changed(evt) {
				eventBus.setAlgorithm(evt.target.value);
			},
			getLabel(alg) {
				return ALGORITHMS[alg].LABEL;
			}
		}
	}
</script>