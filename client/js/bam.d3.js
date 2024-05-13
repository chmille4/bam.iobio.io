function bamD3(container, heightPct, color) {
  var margin = { top: 5, right: 30, bottom: 20, left: 30 },
    width = $(container).width() * 0.98 - margin.left - margin.right,
    height = $(container).height() * heightPct - margin.top - margin.bottom;
  // var width = $(container).width() * 0.98;
  // var height = $(container).height() * 0.85;
  var formatCount = d3.format(",.0f");

  var duration = 1000;

  var x = d3.scale.linear().range([0, width]);
  var svg = d3
    .select(container)
    .append("svg")
    .attr("width", "98%")
    .attr("height", parseInt(heightPct * 100) + "%")
    // .attr("width", width + margin.left + margin.right)
    // .attr("height", height + margin.top + margin.bottom)
    // .attr('viewBox',"0 0 794 173")
    .attr(
      "viewBox",
      "0 0 " +
        parseInt(width + margin.left + margin.right) +
        " " +
        parseInt(height + margin.top + margin.bottom),
    )
    .attr("preserveAspectRatio", "none")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  function my(values, options) {
    var minMax = d3.extent(values, function (elem) {
      return elem.position;
    });
    var avgDepth = d3.mean(values, function (elem) {
      return elem.length;
    });
    var numBins = 20;
    if (options != undefined) {
      minMax = options.minMax || minMax;
      numBins = options.numBins || numBins;
    }
    x.domain(minMax);
    if (x.domain()[0] == x.domain()[1])
      x.domain([x.domain()[0] - 10, x.domain()[1] + 10]);

    var data = d3.layout
      .histogram()
      .bins(x.ticks(numBins))
      .value(function (d) {
        return d.position;
      })(values);

    data.forEach(function (d) {
      d.y = d3.mean(d, function (elem) {
        return parseInt(elem.length * 100) / 100;
      });
    });

    var y = d3.scale
      .linear()
      .domain([
        d3.min(data, function (d) {
          return d.y - 2;
        }),
        d3.max(data, function (d) {
          return d.y + 2;
        }),
      ])
      .range([height, 0]);

    var lineFunction = d3.svg
      .line()
      .x(function (d) {
        return x(d.x) + x(x.domain()[0] + data[0].dx) / 2;
      })
      .y(function (d) {
        return y(d.y);
      })
      // .y(function(d) {
      //    var length = d3.sum(d, function(elem){ return elem.length });
      //    return y(d.y * length / d.x);
      // })
      .interpolate("linear");

    var xAxis = d3.svg
      .axis()
      .scale(x)
      .tickFormat(function (d) {
        if (d / 1000000 >= 1) d = d / 1000000 + "M";
        else if (d / 1000 >= 1) d = d / 1000 + "K";

        return d;
      })
      .orient("bottom");

    var yAxis = d3.svg
      .axis()
      .scale(y)
      .tickFormat(function (d) {
        if (parseInt(d) == d) return d + "X";
      })
      .orient("left");

    // handle new data
    var dot = svg.selectAll(".dot").data(data);

    if (svg.select("path").empty()) {
      svg
        .append("path")
        .attr("d", lineFunction(data))
        .attr("stroke", color)
        .attr("stroke-width", 2)
        .attr("fill", "none");
    } else {
      svg
        .select("path")
        .transition()
        .duration(duration)
        .attr("d", lineFunction(data));
    }

    if (svg.select(".avgdepth").empty()) {
      svg
        .append("line")
        .attr("class", "avgdepth")
        .attr("stroke-dasharray", "5,5")
        .attr("x1", 0)
        .attr("y1", y(0))
        .attr("x2", x(x.domain()[1]))
        .attr("y2", y(0))
        .attr("stroke", "#2687BE")
        .attr("stroke-width", 2)
        .attr("fill", "none");

      svg
        .append("text")
        .attr("id", "refText")
        .attr("dy", ".75em")
        .attr("y", 4)
        .attr("x", 4)
        .style("fill", "rgb(80,80,80)")
        .style("font-size", "11px")
        .attr("text-anchor", "left")
        .text("Sampled Avg");
    } else {
      svg
        .select(".avgdepth")
        .transition()
        .duration(duration)
        .attr("x1", 0)
        .attr("y1", y(avgDepth))
        .attr("x2", x(x.domain()[1]))
        .attr("y2", y(avgDepth));

      svg
        .select("#refText")
        .transition()
        .duration(duration)
        .attr("y", y(avgDepth) + 4);
    }

    var dotEnter = dot
      .enter()
      .append("g")
      .attr("class", "dot")
      .attr("transform", function (d) {
        return "translate(" + x(d.x) + ",0)";
      });

    dotEnter
      .append("circle")
      .attr("cx", x(x.domain()[0] + data[0].dx) / 2)
      .attr("cy", y(0))
      .attr("r", 5)
      .attr("fill", "white")
      .attr("stroke", "white")
      .attr("stroke-width", "2px");

    dot
      .select("circle")
      .transition()
      .duration(duration)
      .attr("cy", function (d) {
        return y(d.y);
      })
      .attr("r", function (d) {
        if (d.y == 0) {
          return 0;
        } else {
          return 5;
        }
      })
      .attr("fill", function (d) {
        if (d.y == 0) {
          return "white";
        } else {
          return color;
        }
      });

    dot.exit().remove();

    if (svg.select(".x.axis").empty()) {
      svg
        .append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .style("font-size", "9px")
        .call(xAxis);
    } else {
      svg.select(".x.axis").transition().duration(duration).call(xAxis);
    }

    if (svg.select(".y.axis").empty()) {
      svg
        .append("g")
        .attr("class", "y axis")
        .style("font-size", "9px")
        .call(yAxis);
    } else {
      svg.select(".y.axis").transition().duration(duration).call(yAxis);
    }
  }

  my.width = function (value) {
    if (!arguments.length) return width;
    width = value;
    return my;
  };
  return my;

  my.height = function (value) {
    if (!arguments.length) return height;
    height = value;
    return my;
  };
  return my;
}
