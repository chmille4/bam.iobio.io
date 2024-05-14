<style type="text/css">
#percents .percent {
	-webkit-flex: 1 1 30%;
	flex: 1 1 30%;
	position: relative;
}
#percents .percent svg {
	width: 100%;
	height: 180px;
}
#percents .percent .from-index {
	font-size: 10px;
	color: rgb(160, 160, 160);
	font-style: italic;
	margin-top: -17px;
	visibility: hidden;
}

.iobio-center-text .iobio-percent {
	fill: rgb(100, 100, 100);
	color: rgb(100, 100, 100);
	font-size: 23px;
}

.iobio-center-text .iobio-count {
	font-size: 10px;
	letter-spacing: 3px;
	font-weight: 400;
	fill: rgb(200, 200, 200);
	color: rgb(200, 200, 200);
}
</style>

<template>
	<div class="percent panel">
		{{ title }}
		<help-button :modalTitle="modalTitle" :tooltipText="helpTooltip">
			<template slot="body">
				<slot name="body"></slot>
			</template>
		</help-button>
		<div class="samplingLoader">Sampling <img src="../../../images/loading_dots.gif" /></div>
		<donut-chart :data="chartData"></donut-chart>
		<div class="from-index">{{ indexFootnote }}</div>
	</div>
</template>

<script>
import DonutChart from '../viz/DonutChart.vue';
import HelpButton from '../partials/HelpButton.vue';

export default {
	name: 'percent-chart-box',
	components: {
		DonutChart,
		HelpButton,
	},
	props: {
		title: '',
		modalTitle: '',
		helpTooltip: '',
		chartData: {},
		indexFootnote: '',
	},
	data() {
		return {};
	},
};
</script>
