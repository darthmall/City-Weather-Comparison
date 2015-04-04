'use strict';

var _      = require('lodash');
var d3     = require('d3');
var moment = require('moment');

var React  = require('react');

var ForecastChartMixin = require('mixins/ForecastChartMixin');

var dandelion = require('renderers/dandelion');

function formatTime(t) {
  return moment.unix(t).format('ddd DD MMM');
}

var PrecipitationChart = React.createClass({
  mixins : [ForecastChartMixin],

  componentDidMount : function () {
    this._redraw(this.props.forecast);
  },

  componentWillReceiveProps : function (nextProps) {
    var height = nextProps.height -
      nextProps.margin.top -
      nextProps.margin.bottom;

    this.setState({ yaxis : 'translate(0,' + height + ')' });
    this._redraw(nextProps.forecast);
  },

  _redraw : function (forecast) {
    var domain = _(forecast)
      .pluck('data')
      .flatten()
      .pluck('time')
      .sortBy()
      .map(formatTime)
      .uniq()
      .value();

    var range = [0, _(forecast)
      .pluck('data')
      .flatten()
      .pluck('precipProbability')
      .max()];

    var svg = d3.select(React.findDOMNode(this.refs.svg));
    var g   = svg.select('.content');

    var width = this.props.width -
      this.props.margin.left -
      this.props.margin.right;

    var height = this.props.height -
      this.props.margin.top -
      this.props.margin.bottom;

    var x = d3.scale.ordinal()
      .domain(domain)
      .rangeRoundBands([0, width]);

    var y = d3.scale.linear()
      .domain(range)
      .range([0, -height]);

    // Scale for mapping the precipitation intensity to the radious of the
    // circle. According to the Forecast API docs, 0.4 in/hr is heavy rainfall
    var r = d3.scale.pow()
      .exponent(2)
      .domain([0, 0.1])
      .range([0, Math.min(width, height)]);

    var data = _.map(forecast, function (f) {
        return {
          name : f.name,
          values : _.map(f.data, function (d) {
            return {
              color : f.color,
              x     : x(formatTime(d.time)),
              y     : y(d.precipProbability),
              r     : r(d.precipIntensity)
            };
          })
        };
      });

    var loc = g.selectAll('.location')
      .data(data, function (d) { return d.name; });

    loc.enter().append('g').attr('class', 'location');

    var step = x.rangeBand() / data.length;
    var shift = (x.rangeBand() - (step * (data.length - 1))) / 2

    loc.attr('transform', function (d, i) {
      return 'translate(' + ((i + 1) * step - shift) + ',' + height + ')';
    });

    loc.each(function (d) {
      d3.select(this)
        .selectAll('.precip')
        .data(d.values)
        .call(dandelion().className('precip dandelion'))
    });

    loc.exit().remove();

    svg.select('.x.axis')
      .call(d3.svg.axis()
        .scale(x)
        .outerTickSize(0)
        .tickSize(0));

    svg.select('.y.axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.svg.axis()
        .scale(y)
        .tickFormat(d3.format('%'))
        .orient('left')
        .tickSize(-width)
        .ticks(5));
  }
});

module.exports = PrecipitationChart;
