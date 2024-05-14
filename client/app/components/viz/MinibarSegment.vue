<template>
	<g>
		<g v-if="points">
			<rect v-for="(point, i) in screenPoints" :x="point.x" :y="point.y" width="1" :height="point.height" :key="i" />
		</g>
		<rect v-else class="minibar-segment__missing-data" :width="width" :height="height" />
	</g>
</template>

<script>
export default {
	props: ['width', 'height', 'points', 'color', 'index', 'xAccessFunc', 'yAccessFunc', 'selected', 'domain', 'range'],
	computed: {
		smoothed: function () {
			const numBins = this.width;
			if (numBins === 0) {
				return [];
			}

			const samplesPerBin = Math.max(1, Math.floor(this.points.length / numBins));

			const smoothed = [];
			for (let i = 0; i < this.points.length; i += samplesPerBin) {
				// TODO: get actual middle point
				const middlePoint = this.points[i];

				let sum = 0;
				for (let j = 0; j < samplesPerBin; j++) {
					sum += this.yAccessFunc(this.points[i]);
				}
				const mean = sum / samplesPerBin;
				smoothed.push({ x: middlePoint.pos, y: mean });
			}

			return smoothed;
		},
		screenPoints: function () {
			const points = this.smoothed;

			const screenPoints = [];

			for (let i = 0; i < points.length; i++) {
				const point = points[i];
				const x = point.x;
				const y = point.y;

				const spanX = this.domain.max - this.domain.min;
				const screenX = (x / spanX) * this.width;
				const spanY = this.range.max - this.range.min;
				const screenY = ((spanY - y) / spanY) * this.height;

				screenPoints.push({
					x: screenX,
					y: screenY,
					height: this.height - screenY,
				});
			}

			return screenPoints;
		},
	},
};
</script>

<style scoped>
.minibar-segment__missing-data {
	fill: #ccc;
}
</style>
