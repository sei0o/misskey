<template>
<mk-window class="mk-post-form-window" ref="window" is-modal @closed="onWindowClosed" :animation="animation">
	<span slot="header" class="mk-post-form-window--header">
		<span class="icon" v-if="geo">%fa:map-marker-alt%</span>
		<span v-if="!reply">%i18n:@note%</span>
		<span v-if="reply">%i18n:@reply%</span>
		<span class="count" v-if="files.length != 0">{{ '%i18n:@attaches%'.replace('{}', files.length) }}</span>
		<span class="count" v-if="uploadings.length != 0">{{ '%i18n:@uploading-media%'.replace('{}', uploadings.length) }}<mk-ellipsis/></span>
	</span>

	<div class="mk-post-form-window--body">
		<mk-note-preview v-if="reply" class="notePreview" :note="reply"/>
		<mk-post-form ref="form"
			:reply="reply"
			@posted="onPosted"
			@change-uploadings="onChangeUploadings"
			@change-attached-files="onChangeFiles"
			@geo-attached="onGeoAttached"
			@geo-dettached="onGeoDettached"/>
	</div>
</mk-window>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
	props: {
		reply: {
			type: Object,
			required: false
		},

		animation: {
			type: Boolean,
			required: false,
			default: true
		}
	},

	data() {
		return {
			uploadings: [],
			files: [],
			geo: null
		};
	},

	mounted() {
		this.$nextTick(() => {
			(this.$refs.form as any).focus();
		});
	},

	methods: {
		onChangeUploadings(files) {
			this.uploadings = files;
		},
		onChangeFiles(files) {
			this.files = files;
		},
		onGeoAttached(geo) {
			this.geo = geo;
		},
		onGeoDettached() {
			this.geo = null;
		},
		onPosted() {
			(this.$refs.window as any).close();
		},
		onWindowClosed() {
			this.$emit('closed');
			this.destroyDom();
		}
	}
});
</script>

<style lang="stylus" scoped>
.mk-post-form-window
	.mk-post-form-window--header
		.icon
			margin-right 8px

		.count
			margin-left 8px
			opacity 0.8

			&:before
				content '('

			&:after
				content ')'

	.mk-post-form-window--body
		.notePreview
				margin 16px 22px

</style>
