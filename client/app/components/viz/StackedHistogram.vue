<style type="text/css">
text {
  font-size: 11px;
  font-weight: 300;
}
.iobio-bar-1 {
  font-size: 8pt;
  font-weight: 300;
  padding: 0px;
  margin: 0px;
}
rect {
  fill: #2d8fc1;
  shape-rendering: crispEdges;
}
text.zoom-label {
  font-size: 8pt;
  font-weight: 300;
}
text.zoom-label-shadow {
  font-size: 8pt;
  stroke: white;
  stroke-width: 5px;
  font-weight: 300;
}
.noselect {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */
}
</style>

<template>
  <div>
    <define-axis-modal
      v-if="showAxisModal"
      :xMinOrig="xMin"
      :xMaxOrig="xMax"
      :yMinOrig="yMin"
      :yMaxOrig="yMax"
      :xAxisLabel="xAxisLabel"
      :yAxisLabel="yAxisLabel"
      @updateAxesRanges="updateAxesRanges"
      @close="showAxisModal = false"
    ></define-axis-modal>
  </div>
</template>

<script>
import DefineAxisModal from "../partials/DefineAxisModal.vue";

export default {
  components: { DefineAxisModal },
  name: "stacked-histogram",
  props: {
    data: {},
    width: {
      default: 750,
      type: Number,
    },
    height: {
      default: 167,
      type: Number,
    },
    xTickFormatter: {
      default: tickFormatter,
      type: Function,
    },
    yTickFormatter: {
      default: tickFormatter,
      type: Function,
    },
    tooltipFormatter: {
      default: tooltipFormatter,
      type: Function,
    },
    margin: {
      default() {
        return {
          top: 5,
          right: 20,
          bottom: 20,
          left: 50,
        };
      },
      type: Object,
    },
    sizeRatio: {
      default: 0.72,
      type: Number,
    },
    xAxisLabel: {
      default: "",
      type: String,
    },
    yAxisLabel: {
      default: "",
      type: String,
    },
  },
  data() {
    return {
      histogramChart: {},
      xMin: "",
      xMax: "",
      yMin: "",
      yMax: "",
      showAxisModal: false,
    };
  },
  created: function () {},
  mounted: function () {
    this.histogramChart = iobio.viz
      .barViewer()
      .xValue(function (d) {
        return d[0];
      })
      .yValue(function (d) {
        return d[1];
      })
      .wValue(function () {
        return 1;
      })
      .height(this.height)
      .width(this.width)
      .margin(this.margin)
      .sizeRatio(this.sizeRatio)
      .tooltip(this.tooltipFormatter);

    this.histogramChart.xAxis().tickFormat(this.xTickFormatter);
    this.histogramChart.yAxis().tickFormat(this.yTickFormatter);
  },
  methods: {
    draw: function () {
      var selection = d3.select(this.$el).datum(this.data);
      this.histogramChart(selection, this.getOptions());
    },
    getOptions: function () {
      var options = {};
      if (isNumeric(this.xMin)) options.xMin = this.xMin;
      if (isNumeric(this.xMax)) options.xMax = this.xMax;
      if (isNumeric(this.yMin)) options.yMin = this.yMin;
      if (isNumeric(this.yMax)) options.yMax = this.yMax;

      return options;
    },
    update: function () {
      this.draw();
      this.addAxisLabels();
    },
    updateAxesRanges: function (xmin, xmax, ymin, ymax) {
      this.showAxisModal = false;
      this.xMin = isNumeric(xmin) ? xmin : "";
      this.xMax = isNumeric(xmax) ? xmax : "";
      this.yMin = isNumeric(ymin) ? ymin : "";
      this.yMax = isNumeric(ymax) ? ymax : "";
      this.draw();
    },
    addAxisLabels: function () {
      // X axis
      // Select x axis divs if they exist.
      var xAxisLabelDiv = d3
        .select(this.$el)
        .select(".iobio-bar-1")
        .selectAll(".axis-label")
        .data([0]);
      // Otherwise, create it.
      var xAxisEnter = xAxisLabelDiv
        .enter()
        .append("div")
        .attr("class", "x axis-label noselect");

      // Add the label
      d3.select(this.$el)
        .select(".x.axis-label")
        .style("text-align", "center")
        .style("margin", "0 auto")
        .style("width", "100px")
        .style("cursor", "pointer")
        .attr("title", "Double click to define custom axis ranges.") //Tooltip
        .text(this.xAxisLabel);

      // Y Axis
      // Select the y axis label text element, if it exists.
      var chartSVG = d3
        .select(this.$el)
        .select("svg")
        .selectAll(".y.axis-label")
        .data([0]);
      // Otherwise, create it.
      var yAxisEnter = chartSVG
        .enter()
        .append("text")
        .attr("class", "y axis-label noselect");

      // Y axis label positions
      var yLabelX = (-this.height * this.sizeRatio) / 2;
      var yLabelY = 4;
      // Add the label
      d3.select(this.$el)
        .select(".y.axis-label")
        .attr("text-anchor", "middle")
        .attr("y", yLabelY)
        .attr("x", yLabelX)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .attr("title", "Double click to define custom axis ranges.")
        .style("cursor", "pointer")
        .text(this.yAxisLabel);

      // Tooltip for y axis label
      var ttElement = d3
        .select(this.$el)
        .select("svg")
        .select(".y.axis-label")
        .selectAll(".title")
        .data([0]);

      // Add listeners to axis labels
      d3.select(this.$el)
        .select(".x.axis-label")
        .on(
          "dblclick",
          function () {
            this.showAxisModal = true;
          }.bind(this),
        );

      d3.select(this.$el)
        .select(".y.axis-label")
        .on(
          "dblclick",
          function () {
            this.showAxisModal = true;
          }.bind(this),
        );

      this.addZoomHintLabel();
    },
    addZoomHintLabel: function () {
      // Select the axis text element, if it exists.
      var svgx = d3
        .select(this.$el)
        .select(".iobio-bar-2")
        .select("svg")
        .selectAll(".zoom-label")
        .data([0]);

      // Otherwise, create axis text element.
      var xEnter = svgx.enter().append("text").attr("class", "zoom-label");

      // Label positions
      var xLabelX = $(this.$el).width() / 2;
      var xLabelY = 40;

      // X axis
      d3.select(this.$el)
        .select(".zoom-label")
        .attr("text-anchor", "middle")
        .attr("x", xLabelX)
        .attr("y", xLabelY)
        .text("(drag to zoom)");
    },
  },
  watch: {
    data: function () {
      this.update();
    },
    xAxisLabel: function () {
      this.addAxisLabels();
    },
    yAxisLabel: function () {
      this.addAxisLabels();
    },
  },
};

function tickFormatter(d) {
  if (d / 1000000 >= 1) d = d / 1000000 + "M";
  else if (d / 1000 >= 1) d = d / 1000 + "K";
  return d;
}

function tooltipFormatter(d) {
  var yVal = d[1];

  if (yVal / 1000000 >= 1) yVal = precisionRound(yVal / 1000000, 1) + "M";
  else if (yVal / 1000 >= 1) yVal = precisionRound(yVal / 1000, 1) + "K";
  else yVal = precisionRound(yVal, 1);

  return d[0] + "," + yVal;
}

function precisionRound(number, precision) {
  var factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
</script>
