<template>
	<div class="pie-chooser-chart">
		<svg class="pie-chooser-chart__svg">
			<g
				class="pie-chooser-chart__select-all-button"
				:transform="translateStr(width / 2, height / 2)"
				@click="setSelectedId('all')"
			>
				<circle cx="0" cy="0" r="25" fill="#f7f3ba" stroke="#ddd" stroke-width="2" />
				<text :y="fontSize / 2">All</text>
			</g>
			<g class="pie-chooser-chart__svg__arcs" :transform="translateStr(width / 2, height / 2)">
				<g class="pie-chooser-chart__arc" v-for="(d, i) in arcData" :key="data[i].id" :transform="arcTransform(i)">
					<path :fill="colors(data[i].id)" :d="pathGen(d)" @click="setSelectedId(data[i].id)" />
					<text :y="fontSize / 2" :transform="textTransform(i)">
						{{ d.data.id }}
					</text>
				</g>
			</g>
		</svg>
	</div>
</template>

<script>
import d3 from 'd3';

export default {
	name: 'pie-chooser-chart',
	props: ['data', 'selectedId'],
	data: function () {
		return {
			fontSize: 10,
			width: 0,
			height: 0,
			pie: d3.layout
				.pie()
				.sort(null)
				.value((d) => d.length),
			padding: 15,
			colors: d3.scale.category20b(),
		};
	},
	components: {},
	computed: {
		selecteds: function () {
			return this.data.map((d) => {
				return d.id === this.selectedId || this.selectedId === 'all';
			});
		},
		radius: function () {
			return (this.width > this.height ? this.height : this.width) / 2 - this.padding;
		},
		arcGen: function () {
			return d3.svg
				.arc()
				.innerRadius(this.radius - 40)
				.outerRadius(this.radius);
		},
		arcData: function () {
			return this.pie(this.data);
		},
	},
	watch: {},
	methods: {
		setSelectedId: function (id) {
			this.$emit('setSelectedId', id);
		},
		pathGen: function (arcData) {
			return this.arcGen(arcData);
		},
		handleResize: function () {
			//const dim = this.$refs.container.getBoundingClientRect();
			const dim = this.$el.getBoundingClientRect();
			this.width = dim.width;
			this.height = dim.height;
		},
		translateStr: function (x, y) {
			return 'translate(' + x + ', ' + y + ') ';
		},
		rotateStr: function (angleRadians) {
			const angleDegrees = angleRadians * (180 / Math.PI);
			return 'rotate(' + angleDegrees + ') ';
		},
		arcTransform: function (i) {
			if (this.selecteds[i]) {
				// translate out away from the center
				const arc = this.arcData[i];
				const middleAngle = (arc.startAngle + arc.endAngle) / 2;
				const distance = 10;
				const x = Math.sin(middleAngle) * distance;
				const y = -Math.cos(middleAngle) * distance;
				return this.translateStr(x, y);
			} else {
				return this.translateStr(0, 0);
			}
		},
		textTransform: function (i) {
			const arc = this.arcData[i];
			const middleAngle = (arc.startAngle + arc.endAngle) / 2;
			const distance = this.radius - 20;
			const x = Math.sin(middleAngle) * distance;
			const y = -Math.cos(middleAngle) * distance;
			return this.translateStr(x, y) + this.rotateStr(middleAngle - Math.PI / 2);
		},
	},
	mounted: function () {
		window.addEventListener('resize', this.handleResize);
		this.handleResize();
	},
	beforeDestroy: function () {
		window.removeEventListener('resize', this.handleResize);
	},
};
</script>

<style scoped>
.pie-chooser-chart {
	width: 100%;
	height: 90%;
}

.pie-chooser-chart__svg {
	width: 100%;
	height: 100%;
	margin: 0 auto;
}

.pie-chooser-chart__arc text {
	fill: #fff;
	text-anchor: middle;
	font-size: 10px;
	pointer-events: none;
}

.pie-chooser-chart__arc:hover path {
	stroke: red;
}

.pie-chooser-chart__select-all-button text {
	text-anchor: middle;
	pointer-events: none;
}

.pie-chooser-chart__select-all-button:hover circle {
	stroke: red;
}
</style>
