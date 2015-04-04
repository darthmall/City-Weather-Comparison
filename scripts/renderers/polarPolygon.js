'use strict';

function cartesian(d) {
  return {
    x : d.r * Math.cos(d.theta),
    y : d.r * Math.sin(d.theta)
  };
}

function polygon(d) {
  var coord = cartesian(d[0]);
  var path = 'M' + coord.x + ',' + coord.y;

  for (var i = 1, l = d.length; i < l; ++i) {
    coord = cartesian(d[i]);
    path += 'L' + coord.x + ',' + coord.y;
  }

  path += 'Z';

  return path;
}

function fill(d) {
  return d.color;
}

function stroke(d) {
  return d.color;
}

module.exports = function () {
  var _className = null;

  function chart(selection) {
    selection.enter().append('path');

    selection
      .attr({
        'class' : _className,
        'd'     : function (d) { return polygon(d.values); },
      })
      .style({
        'fill'    : fill,
        'stroke'  : stroke,
        'opacity' : function (d) { return d.opacity; }
      });

    selection.exit().remove();
  }

  chart.className = function (value) {
    if (!arguments.length) {
      return _className;
    }

    _className = value;
    return chart;
  };

  return chart;
};
