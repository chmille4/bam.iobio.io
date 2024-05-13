<template>
  <div class="multi-minibar-chart" ref="container">
    <svg class="multi-minibar-chart__svg">
      <g class="content" :transform="translateStr(yAxisWidth, 0)">
        <g class="y-axis">
          <g class="y-axis__label" transform="translate(-40, 80) rotate(-90)">
            <text>Estimated Coverage</text>
          </g>
        </g>
        <g class="multi-minibar-chart_segments" :transform="translateStr(0, 0)">
          <g
            v-for="(points, i) in shownPoints"
            :key="ids[i]"
            :transform="segmentTransform(i)"
          >
            <MinibarSegment
              color="SteelBlue"
              :width="widths[i]"
              :height="segmentHeight"
              :index="i"
              :points="shownPoints[i]"
              :xAccessFunc="xAccessFunc"
              :yAccessFunc="yAccessFunc"
              :domain="shownDomains[i]"
              :range="range"
              :selected="ids[i] === selectedId"
            />
          </g>
        </g>
        <g class="mean-line">
          <line
            x1="0"
            :y1="yScale(average)"
            :x2="width"
            :y2="yScale(average)"
          />
        </g>
        <g
          v-if="shownPoints.length > 0"
          class="multi-minibar-chart__buttons"
          :transform="translateStr(0, 0)"
        >
          <g
            v-for="(id, i) in shownIds"
            :key="shownIds[i]"
            :transform="buttonTransform(i)"
          >
            <rect
              class="multi-minibar-chart__button"
              :width="widths[i]"
              :height="buttonHeight"
              :style="rectStyle(shownIds[i])"
              @click="buttonClick(shownIds[i])"
            />
            <text
              class="multi-minibar-chart__button__text"
              :x="widths[i] / 2"
              y="12"
              fill="#eee"
              text-anchor="middle"
              alignment-baseline="middle"
            >
              {{ shownIds[i] }}
            </text>
          </g>
        </g>
      </g>
    </svg>
  </div>
</template>

<script>
import MinibarSegment from "./MinibarSegment.vue";
import d3 from "d3";

export default {
  props: [
    "xAccessFunc",
    "yAccessFunc",
    "ids",
    "selectedId",
    "offsets",
    "domains",
    "totalLength",
    "allPoints",
    "colorFunc",
    "range",
    "yAxisRange",
  ],
  data: function () {
    return {
      width: 0,
      height: 0,
      buttonHeight: 20,
      buttonPadding: 5,
      yAxisWidth: 60,
      yAxis: d3.svg.axis(),
      averages: [],
      weightedAverage: 0,
    };
  },
  components: {
    MinibarSegment,
  },
  computed: {
    segmentHeight: function () {
      return this.height - (this.buttonHeight + this.buttonPadding);
    },
    shownPoints: function () {
      if (this.selectedId === "all") {
        return this.ids.map((id, i) => {
          return this.allPoints[i] === undefined ? null : this.allPoints[i];
        });
      } else {
        const index = this.indicesForId[this.selectedId];
        return [this.allPoints[index]];
      }
    },
    shownIds: function () {
      if (this.selectedId === "all") {
        return this.ids;
      } else {
        return [this.selectedId];
      }
    },
    shownDomains: function () {
      if (this.selectedId === "all") {
        return this.domains;
      } else {
        const index = this.indicesForId[this.selectedId];
        return [this.domains[index]];
      }
    },
    indicesForId: function (id) {
      const indices = {};
      for (let i = 0; i < this.ids.length; i++) {
        const id = this.ids[i];
        indices[id] = i;
      }
      return indices;
    },
    widths: function () {
      if (this.selectedId === "all") {
        const widths = [];
        let totalWidth = 0;
        for (let i = 0; i < this.ids.length; i++) {
          const domain = this.domains[i];
          const length = domain.max - domain.min;
          const width = (length / this.totalLength) * this.width;
          totalWidth += width;
          widths.push(width);
        }

        return widths;
      } else {
        // if a single id is selected, it gets allocated all the space
        return [this.width];
      }
    },
    average: function () {
      if (this.selectedId === "all") {
        return this.weightedAverage;
      } else {
        const index = this.indicesForId[this.selectedId];
        if (this.averages[index]) {
          return this.averages[index];
        } else {
          return 0;
        }
      }
    },
  },
  watch: {
    allPoints: function () {
      for (let i = 0; i < this.allPoints.length; i++) {
        if (this.allPoints[i] && !this.averages[i]) {
          const points = this.allPoints[i];
          this.averages[i] = this.calcAverage(points);
          this.updateAverage();
        }
      }
    },
    yAxisRange: function () {
      const scale = d3.scale
        .linear()
        .domain([this.yAxisRange.min, this.yAxisRange.max])
        .range([this.segmentHeight, 0]);

      const g = d3.select(this.$el).select(".y-axis");

      const defaultFormatter = d3.format();

      this.yAxis = d3.svg
        .axis()
        .scale(scale)
        .orient("left")
        .tickFormat((d) => defaultFormatter(d) + "x")
        .outerTickSize(4)
        .innerTickSize(8);
      this.yAxis(g);
    },
  },
  mounted: function () {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  },
  methods: {
    segmentTransform: function (i) {
      const offsetRatio = this.offsets[i] / this.totalLength;
      const pixelOffset = offsetRatio * this.width;
      //const yOffset = -this.buttonHeight - this.buttonPadding;
      const yOffset = 0;
      return "translate(" + pixelOffset + ", " + yOffset + ")";
    },
    buttonTransform: function (i) {
      const offsetRatio = this.offsets[i] / this.totalLength;
      const pixelOffset = offsetRatio * this.width;
      const yOffset = this.height - this.buttonHeight;
      return "translate(" + pixelOffset + ", " + yOffset + ")";
    },
    translateStr: function (x, y) {
      return "translate(" + x + ", " + y + ")";
    },
    buttonClick: function (id) {
      this.$emit("setSelectedId", id);
    },
    rectStyle: function (id) {
      const color = this.colorFunc(id);
      const rule = "fill: " + color + ";";
      return rule;
    },
    handleResize: function () {
      const dim = this.$refs.container.getBoundingClientRect();
      this.width = dim.width - this.yAxisWidth;
      this.height = dim.height;
    },
    yScale: function (value) {
      return this.segmentHeight - (value / this.range.max) * this.segmentHeight;
    },
    calcAverage: function (points) {
      let sum = 0;
      let len = 0;
      // first average
      for (const point of points) {
        sum += this.yAccessFunc(point);
      }

      const average = sum / points.length;
      return average;
    },
    updateAverage: function () {
      let totalLength = 0;
      for (let i = 0; i < this.allPoints.length; i++) {
        if (this.allPoints[i] && this.averages[i]) {
          totalLength += this.allPoints[i].length;
        }
      }

      let weightedAverage = 0;
      for (let i = 0; i < this.allPoints.length; i++) {
        if (this.allPoints[i] && this.averages[i]) {
          const weight = this.allPoints[i].length / totalLength;
          weightedAverage += weight * this.averages[i];
        }
      }

      this.weightedAverage = weightedAverage;
    },
  },
  beforeDestroy: function () {
    window.removeEventListener("resize", this.handleResize);
  },
};
</script>

<style scoped>
.multi-minibar-chart {
  height: 100%;
}

.multi-minibar-chart__svg {
  width: 100%;
  height: 100%;
}

.multi-minibar-chart__button:hover {
  stroke: red;
  cursor: pointer;
}

.multi-minibar-chart__button__text {
  pointer-events: none;
}

.mean-line {
  stroke: red;
  stroke-dasharray: 4 2;
  stroke-width: 3px;
  opacity: 0.6;
}

.y-axis {
  text-anchor: middle;
  fill: #000;
}
</style>
