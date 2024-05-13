function histogramViewFinderD3() {
  var margin = { top: 25, right: 20, bottom: 20, left: 50 },
    width = 200,
    height = 100,
    focalHeightRatio = 0.83,
    globalHeightRatio = 0.12,
    xValue = function (d) {
      return d[0];
    },
    yValue = function (d) {
      return d[1];
    },
    x = d3.scale.linear(),
    y = d3.scale.linear(),
    xAxis = d3.svg.axis().scale(x).orient("bottom"),
    yAxis = d3.svg.axis().scale(y).orient("left"),
    focalChart = histogramD3().margin({
      top: 0,
      right: 0,
      bottom: 20,
      left: 0,
    }),
    globalChart = histogramD3()
      .margin({ top: 5, right: 0, bottom: 5, left: 0 })
      .yAxis(function () {}); // empty function to remove y axis
  var globalChartOptions = { averageLine: false };

  yAxis = focalChart.yAxis();
  xAxis = focalChart.xAxis();
  globalChart.xAxis(xAxis);

  function chart(selection, options) {
    var innerHeight = height - margin.top - margin.bottom;
    var innerWidth = width - margin.left - margin.right;
    $.extend(globalChartOptions, options);
    selection.each(function (data) {
      // Select the g element, if it exists.
      var g = selection.selectAll("g").data([0]);

      // Otherwise, create the g element
      var gEnter = g.enter().append("g");

      // Update the margin dimensions
      g.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // // Remove outliers
      // if ( !options.outliers )
      //  data = removeOutliers(data);

      // Select the focal panel if it exits
      var gFocus = g.selectAll("g.focal-panel").data([data]);

      // Otherwise create it
      gFocus.enter().append("g").attr("class", "focal-panel");

      // Update focal chart dimensions
      focalChart.height(innerHeight * focalHeightRatio).width(innerWidth);

      // Call focal panel chart
      focalChart(gFocus, options);

      // Select the global panel if it exits
      var gGlobal = g.selectAll("g.global-panel").data([data]);

      // Otherwise create it
      gGlobal
        .enter()
        .append("g")
        .attr("class", "global-panel")
        .attr(
          "transform",
          "translate(0," +
            parseInt(innerHeight - innerHeight * globalHeightRatio) +
            ")",
        )
        .append("text")
        .attr("dy", innerHeight * globalHeightRatio + 18)
        .attr("dx", innerWidth / 2)
        .attr("text-anchor", "middle")
        .attr("class", "instruction")
        .text("(drag to select region)");

      // Update global chart dimensions
      globalChart.height(innerHeight * globalHeightRatio).width(innerWidth);

      // Call global panel chart
      globalChart(gGlobal, globalChartOptions);

      // Setup brush for globalChart
      globalChart.brush().on("brush", function () {
        var x2 = globalChart.x(),
          brush = globalChart.brush();
        var x = brush.empty() ? x2.domain() : brush.extent();
        var datum = gGlobal.datum().filter(function (d) {
          return d[0] >= x[0] && d[0] <= x[1];
        });
        focalChart(gFocus.datum(datum));
      });
    });
  }

  chart.margin = function (_) {
    if (!arguments.length) return margin;
    margin = _;
    return chart;
  };

  chart.width = function (_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
  };

  chart.height = function (_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
  };

  chart.xValue = function (_) {
    if (!arguments.length) return xValue;
    xValue = _;
    return chart;
  };

  chart.yValue = function (_) {
    if (!arguments.length) return yValue;
    yValue = _;
    return chart;
  };

  chart.x = function (_) {
    if (!arguments.length) return x;
    x = _;
    return chart;
  };

  chart.y = function (_) {
    if (!arguments.length) return y;
    y = _;
    return chart;
  };

  chart.xAxis = function (_) {
    if (!arguments.length) return xAxis;
    xAxis = _;
    return chart;
  };

  chart.yAxis = function (_) {
    if (!arguments.length) return yAxis;
    yAxis = _;
    return chart;
  };

  chart.setBrush = function (range) {
    var brush = globalChart.brush();
    // set brush region
    d3.select(".global-panel .brush").call(brush.extent(range));
    // trigger brush event
    brush.on("brush")();
  };

  chart.focalChart = function (_) {
    if (!arguments.length) return focalChart;
    focalChart = _;
    return chart;
  };

  chart.globalChart = function (_) {
    if (!arguments.length) return globalChart;
    globalChart = _;
    return chart;
  };

  return chart;
}
