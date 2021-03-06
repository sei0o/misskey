<template>
<x-column :menu="menu" :naked="true" :narrow="true" :name="name" :column="column" :is-stacked="isStacked" class="wtdtxvecapixsepjtcupubtsmometobz">
	<span slot="header">%fa:calculator%{{ name }}</span>

	<div class="gqpwvtwtprsbmnssnbicggtwqhmylhnq">
		<template v-if="edit">
			<header>
				<select v-model="widgetAdderSelected" @change="addWidget">
					<option value="profile">%i18n:common.widgets.profile%</option>
					<option value="analog-clock">%i18n:common.widgets.analog-clock%</option>
					<option value="calendar">%i18n:common.widgets.calendar%</option>
					<option value="timemachine">%i18n:common.widgets.timemachine%</option>
					<option value="activity">%i18n:common.widgets.activity%</option>
					<option value="rss">%i18n:common.widgets.rss%</option>
					<option value="trends">%i18n:common.widgets.trends%</option>
					<option value="photo-stream">%i18n:common.widgets.photo-stream%</option>
					<option value="slideshow">%i18n:common.widgets.slideshow%</option>
					<option value="version">%i18n:common.widgets.version%</option>
					<option value="broadcast">%i18n:common.widgets.broadcast%</option>
					<option value="notifications">%i18n:common.widgets.notifications%</option>
					<option value="users">%i18n:common.widgets.users%</option>
					<option value="polls">%i18n:common.widgets.polls%</option>
					<option value="post-form">%i18n:common.widgets.post-form%</option>
					<option value="messaging">%i18n:common.widgets.messaging%</option>
					<option value="memo">%i18n:common.widgets.memo%</option>
					<option value="hashtags">%i18n:common.widgets.hashtags%</option>
					<option value="posts-monitor">%i18n:common.widgets.posts-monitor%</option>
					<option value="server">%i18n:common.widgets.server%</option>
					<option value="donation">%i18n:common.widgets.donation%</option>
					<option value="nav">%i18n:common.widgets.nav%</option>
					<option value="tips">%i18n:common.widgets.tips%</option>
				</select>
			</header>
			<x-draggable
				:list="column.widgets"
				:options="{ animation: 150 }"
				@sort="onWidgetSort"
			>
				<div v-for="widget in column.widgets" class="customize-container" :key="widget.id" @contextmenu.stop.prevent="widgetFunc(widget.id)">
					<button class="remove" @click="removeWidget(widget)">%fa:times%</button>
					<component :is="`mkw-${widget.name}`" :widget="widget" :ref="widget.id" :is-customize-mode="true" platform="deck"/>
				</div>
			</x-draggable>
		</template>
		<template v-else>
			<component class="widget" v-for="widget in column.widgets" :is="`mkw-${widget.name}`" :key="widget.id" :ref="widget.id" :widget="widget" platform="deck"/>
		</template>
	</div>
</x-column>
</template>

<script lang="ts">
import Vue from 'vue';
import XColumn from './deck.column.vue';
import * as XDraggable from 'vuedraggable';
import * as uuid from 'uuid';

export default Vue.extend({
	components: {
		XColumn,
		XDraggable
	},

	props: {
		column: {
			type: Object,
			required: true
		},
		isStacked: {
			type: Boolean,
			required: true
		}
	},

	data() {
		return {
			edit: false,
			menu: null,
			widgetAdderSelected: null
		}
	},

	computed: {
		name(): string {
			if (this.column.name) return this.column.name;
			return '%i18n:common.deck.widgets%';
		}
	},

	created() {
		this.menu = [{
			icon: '%fa:cog%',
			text: '%i18n:@edit%',
			action: () => {
				this.edit = !this.edit;
			}
		}];
	},

	methods: {
		widgetFunc(id) {
			const w = this.$refs[id][0];
			if (w.func) w.func();
		},

		onWidgetSort() {
			this.saveWidgets();
		},

		addWidget() {
			this.$store.dispatch('settings/addDeckWidget', {
				id: this.column.id,
				widget: {
					name: this.widgetAdderSelected,
					id: uuid(),
					data: {}
				}
			});

			this.widgetAdderSelected = null;
		},

		removeWidget(widget) {
			this.$store.dispatch('settings/removeDeckWidget', {
				id: this.column.id,
				widget
			});
		},

		saveWidgets() {
			this.$store.dispatch('settings/saveDeck');
		}
	}
});
</script>

<style lang="stylus" scoped>
.wtdtxvecapixsepjtcupubtsmometobz
	.gqpwvtwtprsbmnssnbicggtwqhmylhnq
		> header
			padding 16px

			> *
				width 100%
				padding 4px

		.widget, .customize-container
			margin 8px

			&:first-of-type
				margin-top 0

		.customize-container
			cursor move

			> *:not(.remove)
				pointer-events none

			> .remove
				position absolute
				z-index 1
				top 8px
				right 8px
				width 32px
				height 32px
				color #fff
				background rgba(#000, 0.7)
				border-radius 4px

</style>

