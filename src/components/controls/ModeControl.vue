<template>
	<div class="control">
		<span class="control-label">Mode</span>
		<select @change="changed($event)">
			<option v-for="_mode in modes"
			        :value="_mode"
			        :selected="_mode === mode">
				{{_mode}}
			</option>
		</select>
	</div>
</template>

<script>
	import {eventBus} from '../../main';

	export default {
		data() {
			return {
				modes: ['Trace', 'Morph']
			}
		},
		props: {
			mode: String
		},
		methods: {
			changed(evt) {
				eventBus.setMode(evt.target.value);
			}
		}
	}
</script>