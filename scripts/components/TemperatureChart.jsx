'use strict';

var _     = require('lodash');
var d3    = require('d3');
var React = require('react');

var area  = require('renderers/area');
var line  = require('renderers/line');

var ForecastChartMixin = require('mixins/ForecastChartMixin');

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

    var x = d3.scale.linear()
      .domain(d3.extent(data, function (d) { return d.time; }))
      .range([0, this.props.width - this.props.margin.left - this.props.margin.right]);

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
        opacity : 0.2,
        values  : _.map(f.data, function (d) {
          return {
            x  : x(d.time),
            y  : y(d.temperatureMax) - y(d.temperatureMin),
            y0 : y(d.temperatureMin)
          };
        })
      };
    });

    g.selectAll('.range')
      .data(rangeData, function (d) { return d.name; })
      .call(area().className('range').interpolate('monotone'));

    var highs = _.map(forecast, function (f) {
      return {
        name   : f.name,
        color  : f.color,
        values : _.map(f.data, function (d) {
          return {
            x : x(d.time),
            y : y(d.temperatureMax)
          };
        })
      };
    });

    g.selectAll('.high')
      .data(highs, function (d) { return d.name; })
      .call(line().className('high').interpolate('monotone'));

    var lows = _.map(forecast, function (f) {
      return {
        name   : f.name,
        color  : f.color,
        values : _.map(f.data, function (d) {
          return {
            x : x(d.time),
            y : y(d.temperatureMin)
          };
        })
      };
    });

    g.selectAll('.low')
      .data(lows, function (d) { return d.name })
      .call(line().className('low').interpolate('monotone'));
  }
});

module.exports = TemperatureChart;
