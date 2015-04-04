'use strict';

var d3 = require('d3');

module.exports = function () {
  var _radius = 1;
  var _scale  = d3.scale.linear();

  function axis(selection) {
    selection.each(function () {
      var g     = d3.select(this);
      var ticks = _scale.ticks ? _scale.ticks() : _scale.domain();
      var deg   = d3.scale.linear().domain([0, 2 * Math.PI]).range([0, 360]);

      var tick = g.selectAll('.polar-tick')
        .data(ticks);

      var enter = tick.enter().append('g').attr('class', 'polar-tick');

      enter.append('line');
      enter.append('text').attr('text-anchor', 'middle');

      tick.select('line').attr('y1', -_radius);
      tick.select('text')
        .attr('y', -_radius)
        .text(String);

      tick.attr('transform', function (d) {
        return 'rotate(' + (90 + deg(_scale(d))) + ')';
      });

      tick.exit().remove();
    });
  }

  axis.radius = function (value) {
    if (!arguments.length) {
      return _radius;
    }

    _radius = value;
    return axis;
  };

  axis.scale = function (value) {
    if (!arguments.length) {
      return _scale;
    }

    _scale = value;
    return axis;
  };

  return axis;
}
