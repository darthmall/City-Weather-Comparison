'use strict';

module.exports = function () {
  var _line = d3.svg.line()
    .x(function (d) { return d.x; })
    .y(function (d) { return d.y; });

  var _className   = null;

  function stroke(d) {
    return d.color;
  }

  function chart(selection) {
    selection
      .transition()
      .duration(300)
      .attr('d', function (d) { return _line(d.values); })
      .style('stroke', stroke);

    selection.enter()
      .append('path')
      .attr('d', function (d) { return _line(d.values); })
      .style({
        'stroke'  : stroke,
        'opacity' : 0,
        'fill'    : 'none'
      });

    selection
      .attr('class', _className)
      .transition()
      .duration(300)
      .style('opacity', 1);

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
