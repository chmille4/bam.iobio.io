function movingLineD3(container) {
	var margin = { top: 0, right: 30, bottom: 30, left: 30 },
		width = $(container).width() * 0.98 - margin.left - margin.right,
		height = $(container).height() * 0.6 - margin.top - margin.bottom;

	var numBins = 20;

	var x = d3.scale.linear().range([0, width]);

	var brush = d3.svg.brush().x(x);

	var svg = d3
		.select(container)
		.append('svg')
		.attr('width', '98%')
		.attr('height', '60%')
		.attr(
			'viewBox',
			'0 0 ' + parseInt(width + margin.left + margin.right) + ' ' + parseInt(height + margin.top + margin.bottom)
		)
		.attr('preserveAspectRatio', 'none')
		.append('g')
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

	function my(data, options) {
		var epsilonRate = 0.3;
		var epislon = parseInt((epsilonRate * (data[data.length - 1].pos - data[0].pos)) / width);
		var points = data.map(function (d) {
			return [d.pos, d.depth];
		});
		data = properRDP(points, epislon);
		// data = points;

		// var xMax = options.xMax;
		// x.domain([d3.min(data, function(d){ return d[0]; }), options.xMax])
		if (options && options.start != undefined) xMin = options.start;
		else
			xMin = d3.min(data, function (d) {
				return d[0];
			});

		if (options && options.end != undefined) xMax = options.end;
		else
			xMax = d3.max(data, function (d) {
				return d[0];
			});

		x.domain([xMin, xMax]);
		var y = d3.scale
			.linear()
			.domain([
				0,
				d3.max(data, function (d) {
					return d[1];
				}),
			])
			.range([height, 0]);

		var xAxis = d3.svg
			.axis()
			.scale(x)
			.tickFormat(function (d) {
				if (d / 1000000 >= 1) d = d / 1000000 + 'M';
				else if (d / 1000 >= 1) d = d / 1000 + 'K';
				return d;
			})
			.orient('bottom');

		// add mouseover
		var formatter = d3.format(',');
		svg
			.on('mouseover', function () {
				div.transition().duration(200).style('opacity', 0.9);
				div
					.html(formatter(parseInt(x.invert(d3.event.pageX - $(this).position().left))))
					.style('left', d3.event.pageX + 'px')
					.style('text-align', 'left')
					.style('top', d3.event.pageY - 24 + 'px');
			})
			.on('mousemove', function () {
				div
					.html(formatter(parseInt(x.invert(d3.event.pageX - $(this).position().left))))
					.style('left', d3.event.pageX + 'px')
					.style('top', d3.event.pageY - 24 + 'px');
			})
			.on('mouseout', function () {
				div.transition().duration(500).style('opacity', 0);
			});

		var line = d3.svg
			.line()
			.interpolate('linear')
			.x(function (d, i) {
				return parseInt(x(d[0]));
			})
			.y(function (d) {
				return parseInt(y(d[1]));
			});

		svg.select('.read-depth-path').remove();
		// if ( svg.select(".read-depth-path").empty() ) {
		var path = svg
			.append('path')
			.attr('class', 'read-depth-path')
			.attr('d', line(data))
			.attr('stroke', 'steelblue')
			.attr('stroke-width', '2')
			.attr('fill', 'none');

		var totalLength = path.node().getTotalLength();

		path
			.attr('stroke-dasharray', totalLength + ' ' + totalLength)
			.attr('stroke-dashoffset', totalLength)
			.transition()
			.duration(2000)
			.ease('linear')
			.attr('stroke-dashoffset', 0);
		// } else {
		//    // .transition()
		//    //             .duration(2000)
		//    //             .attr("d", line(data));
		// }

		// update x axis
		if (svg.select('.x.axis').empty()) {
			svg
				.append('g')
				.attr('class', 'x axis')
				.attr('transform', 'translate(0,' + height + ')')
				.call(xAxis);
		} else {
			svg.select('.x.axis').transition().duration(200).call(xAxis);
		}

		svg
			.append('g')
			.attr('class', 'x brush')
			.call(brush)
			.selectAll('rect')
			.attr('y', -6)
			.attr('height', height + 6);
	}

	my.on = function (ev, listener) {
		if (ev == 'brush' || ev == 'brushstart' || ev == 'brushend')
			brush.on(ev, function () {
				listener(x, brush);
			});
		return my;
	};

	my.brush = function (value) {
		if (!arguments.length) return brush;
		brush = value;
		return my;
	};

	return my;
}
