'use strict';

module.exports = function () {
  var _line = d3.svg.line()
    .x(function (d) { return d.x; })
    .y(function (d) { return d.y; });

  var _className = 'line';

  function stroke(d) {
    return d.color;
  }

  function chart(selection) {
    selection.each(function (d) {
      var g = d3.select(this);

      var line = g.selectAll('.' + _className)
        .data([d.values]);

      line.enter()
        .append('path')
        .attr('class', _className);

      line.transition()
        .duration(300)
        .attr('d', _line)
        .style('stroke', stroke);

      line.exit().remove();
    });
  }

  chart.className = function (value) {
    if (!arguments.length) {
      return _className;
    }

    _className = value;
    return chart;
  };

  chart.interpolate = function (value) {
    if (!arguments.length) {
      return _line.interpolate();
    }

    _line.interpolate(value);
    return chart;
  };

  chart.tension = function (value) {
    if (!arguments.length) {
      return _line.tension();
    }

    _line.tension(value);
    return chart;
  };

  return chart;
};
