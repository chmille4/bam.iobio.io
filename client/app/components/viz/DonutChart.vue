<style type="text/css"></style>

<template>
	<div></div>
</template>

<script>
export default {
	name: 'donut-chart',
	props: {
		data: {},
		radius: {
			default: 61,
			type: Number,
		},
	},
	data() {
		return {
			donutChart: {},
			pie: {},
		};
	},
	created: function () {},
	mounted: function () {
		this.pie = d3.layout.pie().sort(null);

		// var width = this.height;
		// var radius = Math.min(width, this.height) / 2;
		this.donutChart = iobio.viz
			.pie()
			.radius(this.radius)
			.innerRadius(50)
			.color(function (d, i) {
				if (i == 0) return '#2d8fc1';
				else return 'rgba(45,143,193,0.2)';
			});
	},
	methods: {
		draw: function () {
			var selection = d3.select(this.$el).datum(this.pie(this.data));
			this.donutChart(selection);
		},
		update: function () {
			this.draw();
		},
	},
	watch: {
		data: function () {
			this.update();
		},
	},
};
</script>
