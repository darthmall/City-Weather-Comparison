'use strict';

var d3 = require('d3');

module.exports = function () {
  var _className = null;

  function chart(selection) {
    var enter = selection.enter().append('g');
    enter.append('line');
    enter.append('circle');

    selection.attr({
      'transform' : function (d) {
        return 'translate(' + d.x + ',0)';
      },
      'class' : _className
    });

    selection.select('line')
      .attr({
        'stroke' : function (d) { return d.color; },
        'y1'     : function (d) { return d.y; }
      });

    selection.select('circle')
      .attr({
        'fill' : function (d) { return d.color; },
        'cy'   : function (d) { return d.y; },
        'r'    : function (d) { return d.r; }
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
