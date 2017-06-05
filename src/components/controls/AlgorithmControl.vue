<template>
	<div class="control">
		<span class="control-label">Algorithm</span>
		<select @change="changed($event)">
			<option v-for="_alg in algorithms"
			        :value="_alg"
			        :selected="_alg === algorithm">
				{{_alg}}
			</option>
		</select>
	</div>
</template>

<script>
	import {eventBus} from '../../main';

	export default {
		data() {
			return {
				algorithms: ['Koch', 'Dragon']
			}
		},
		props: {
			algorithm: String
		},
		methods: {
			changed(evt) {
				eventBus.setAlgorithm(evt.target.value);
			}
		}
	}
</script>