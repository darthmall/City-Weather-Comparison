'use strict';

var d3 = require('d3');

module.exports = function () {
  var _area = d3.svg.area()
    .x(function (d) { return d.x; })
    .y(function (d) { return d.y0 + d.y; })
    .y0(function (d) { return d.y0; });

  var _className   = null;

  function fill(d) {
    return d.color;
  }

  function opacity(d) {
    return d.opacity;
  }

  function chart(selection) {


    // Animate existing paths to their new location and fill color
    selection
      .transition()
      .duration(300)
      .attr('d', function (d) { return _area(d.values); })
      .style('fill', fill);

    // Create new paths fully transparent
    selection.enter()
      .append('path')
      .attr('d', function (d) { return _area(d.values); })
      .style({
        'fill'    : fill,
        'opacity' : 0
      });

    // Animate transparency, fading in new paths and updating existing
    selection
      .attr('class', _className)
      .transition()
      .duration(300)
      .style('opacity', opacity);

    // Fade out old paths
    selection.exit()
      .transition()
      .duration(300)
      .style('opacity', 0)
      .remove();
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
