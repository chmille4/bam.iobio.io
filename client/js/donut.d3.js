function donutD3() {
	var radius = 90;

	var arc = d3.svg
		.arc()
		.outerRadius(radius - 10)
		.innerRadius(radius - 17);

	var formatter = d3.format(',.1f');
	var commaFormatter = d3.format(',0f');

	function my(selection) {
		// c = c || "rgb(45,143,193)";
		// var calpha = c.replace(")", ",0.2)").replace("rgb", "rgba");
		var g = selection.enter().append('g').attr('class', 'arc').attr('transform', 'translate(100,80)');

		if (g.data()[0] != undefined) var total = g.data()[0].data + g.data()[1].data;
		else var total = selection.data()[0].data + selection.data()[1].data;

		g.append('path')
			.attr('d', arc)
			.attr('class', function (d, i) {
				if (i == 1) return 'alpha';
				return 'fill';
			});

		selection.exit().remove();
		g.append('text')
			.attr('dy', '0.3em')
			.style('text-anchor', 'middle')
			.attr('class', 'percent')
			.text(function (d, i) {
				if (i == 0) return formatter((d.data / total) * 100) + '%';
			});
		g.append('text')
			.attr('dy', '1.9em')
			.style('text-anchor', 'middle')
			.attr('class', 'total')
			.text(function (d, i) {
				if (i == 0) return commaFormatter(d.data);
			});

		selection.select('path').attr('d', arc);

		selection.select('.percent').text(function (d, i) {
			if (i == 0) return formatter((d.data / total) * 100) + '%';
		});

		selection.select('.total').text(function (d, i) {
			if (i == 0) return commaFormatter(d.data);
		});
	}

	my.radius = function (value) {
		if (!arguments.length) return radius;
		radius = value;
		arc = d3.svg
			.arc()
			.outerRadius(radius - 10)
			.innerRadius(radius - 17);
		return my;
	};

	my.klass = function (value) {
		if (!arguments.length) return klass;
		klass = value;
		return my;
	};

	return my;
}
