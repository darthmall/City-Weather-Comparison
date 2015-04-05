'use strict';

function color(d) {
  return d.color;
}

module.exports = function () {
  var _className = null;
  var _radius    = 1;

  function chart(selection) {
    selection.each(function (d) {
      var g = d3.select(this);

      var dot = g.selectAll('.dot')
        .data(d.values);

      dot.enter().append('circle').attr('class', 'dot');

      dot.attr({
        'cx' : function (d) { return d.x; },
        'cy' : function (d) { return d.y; },
        'r'  : _radius
      });

      dot.exit().remove();
    });
  }

  chart.className = function (value) {
    if (!arguments.length) {
      return _className;
    }

    _className = value;
    return chart;
  };

  chart.radius = function (value) {
    if (!arguments.length) {
      return _radius;
    }

    _radius = value;
    return chart;
  };

  return chart;
};
