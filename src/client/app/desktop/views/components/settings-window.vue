<template>
<mk-window ref="window" is-modal width="700px" height="550px" @closed="destroyDom">
	<span slot="header" :class="$style.header">%fa:cog%%i18n:@settings%</span>
	<mk-settings :initial-page="initialPage" @done="close"/>
</mk-window>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
	props: {
		initialPage: {
			type: String,
			required: false
		}
	},
	methods: {
		close() {
			(this as any).$refs.window.close();
		}
	}
});
</script>

<style lang="stylus" module>
.header
	> [data-fa]
		margin-right 4px

</style>
