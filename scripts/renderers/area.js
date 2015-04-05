'use strict';

var d3 = require('d3');

module.exports = function () {
  var _area = d3.svg.area()
    .x(function (d) { return d.x; })
    .y(function (d) { return d.y0 + d.y; })
    .y0(function (d) { return d.y0; });

  var _className = 'area';

  function fill(d) {
    return d.color;
  }

  function opacity(d) {
    return d.opacity;
  }

  function chart(selection) {
    selection.each(function (d) {
      var g = d3.select(this);

      var area = g.selectAll('.' + _className)
        .data([d.values]);

      area.enter()
        .append('path')
        .attr('class', _className);

      area.attr('d', _area)
        .style('fill', fill);

      // Fade out old paths
      selection.exit().remove();
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
      return _area.interpolate();
    }

    _area.interpolate(value);
    return chart;
  };

  chart.tension = function (value) {
    if (!arguments.length) {
      return _area.tension();
    }

    _area.tension(value);
    return chart;
  };

  return chart;
};
