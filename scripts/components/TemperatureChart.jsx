'use strict';

var _      = require('lodash');
var d3     = require('d3');
var moment = require('moment');
var React  = require('react');

var area   = require('renderers/area');
var line   = require('renderers/line');

var ForecastChartMixin = require('mixins/ForecastChartMixin');

function formatTime(t) {
  return moment.unix(t).format('ddd DD MMM');
}

/**
 * Renders the forecasted temperature range for one or more locations.
 */
var TemperatureChart = React.createClass({
  mixins : [ForecastChartMixin],

  componentWillReceiveProps : function (nextProps) {
    this._invalidateDisplay(nextProps.forecast);
  },

  componentDidMount : function () {
    this._invalidateDisplay(this.props.forecast);
  },

  /**
   * Rerender the chart data.
   */
  _invalidateDisplay : function (forecast) {
    var svg = d3.select(React.findDOMNode(this.refs.svg));
    var g   = svg.select('.content');

    var data = _(forecast)
      .pluck('data')
      .flatten()
      .value();

    var days = _(data)
      .pluck('time')
      .sortBy()
      .map(formatTime)
      .uniq()
      .value();

    var x = d3.scale.ordinal()
      .domain(days)
      .rangeRoundPoints([
        0,
        this.props.width - this.props.margin.left - this.props.margin.right
      ]);

    // The domain of the y-scale should be at least 0, but if there are negative
    // temperatures, we will use those.
    var y = d3.scale.linear()
      .domain([
        Math.min(0, d3.min(data, function (d) { return d.temperatureMin; })),
        d3.max(data, function (d) { return d.temperatureMax; })
      ])
      .range([this.props.height - this.props.margin.top - this.props.margin.bottom, 0]);

    var rangeData = _.map(forecast, function (f) {
      return {
        name    : f.name,
        color   : f.color,
        values  : _.map(f.data, function (d) {
          return {
            x  : x(formatTime(d.time)),
            y  : y(d.temperatureMax) - y(d.temperatureMin),
            y0 : y(d.temperatureMin)
          };
        })
      };
    });

    var range = g.selectAll('.range')
      .data(rangeData, function (d) { return d.name; })

    range.enter().append('g').attr('class', 'range');
    range
      .style({
        'fill'   : function (d) { return d.color; },
      })
      .call(area().interpolate('monotone'));
    range.exit().remove();

    var highs = _.map(forecast, function (f) {
      return {
        name   : f.name,
        color  : f.color,
        values : _.map(f.data, function (d) {
          return {
            x : x(formatTime(d.time)),
            y : y(d.temperatureMax)
          };
        })
      };
    });

    var high = g.selectAll('.high')
      .data(highs, function (d) { return d.name; });

    high.enter().append('g').attr('class', 'high');
    high
      .style({
        'fill'   : function (d) { return d.color; },
        'stroke' : function (d) { return d.color; }
      })
      .call(line().interpolate('monotone'));
    high.exit().remove();

    var lows = _.map(forecast, function (f) {
      return {
        name   : f.name,
        color  : f.color,
        values : _.map(f.data, function (d) {
          return {
            x : x(formatTime(d.time)),
            y : y(d.temperatureMin)
          };
        })
      };
    });

    var low = g.selectAll('.low')
      .data(lows, function (d) { return d.name });

    low.enter().append('g').attr('class', 'low');
    low
      .style({
        'fill'   : function (d) { return d.color; },
        'stroke' : function (d) { return d.color; }
      })
      .call(line().interpolate('monotone'));
    low.exit().remove()

    svg.select('.x.axis')
      .call(d3.svg.axis()
        .scale(x)
        .tickSize(0)
        .outerTickSize(0)
        .tickPadding(6));

    svg.select('.y.axis')
      .call(d3.svg.axis()
        .scale(y)
        .orient('left')
        .ticks(5)
        .tickSize(4)
        .tickFormat(function (d) {
          return d + 'º';
        }));
  }
});

module.exports = TemperatureChart;
