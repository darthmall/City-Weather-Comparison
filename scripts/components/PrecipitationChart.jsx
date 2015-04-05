'use strict';

var _      = require('lodash');
var d3     = require('d3');
var moment = require('moment');

var React  = require('react');

var ForecastChartMixin = require('mixins/ForecastChartMixin');

var dot  = require('renderers/dot');
var line = require('renderers/line');

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
      .rangeRoundPoints([0, width]);

    var y = d3.scale.linear()
      .domain(range)
      .range([height, 0]);

    var data = _.map(forecast, function (f) {
        return {
          name    : f.name,
          color   : f.color,
          values : _.map(f.data, function (d) {
            return {
              x  : x(formatTime(d.time)),
              y  : y(d.precipProbability),
            };
          })
        };
      });

    var series = g.selectAll('.precip')
      .data(data);

    series.enter().append('g').attr('class', 'precip');

    series
      .attr({
        'fill'   : function (d) { return d.color; },
        'stroke' : function (d) { return d.color; }
      })
      .call(line().interpolate('monotone'))
      .call(dot().radius(3));

    svg.select('.x.axis')
      .call(d3.svg.axis()
        .scale(x)
        .outerTickSize(0)
        .tickSize(0)
        .tickPadding(6));

    svg.select('.y.axis')
      .call(d3.svg.axis()
        .scale(y)
        .orient('left')
        .tickFormat(d3.format('.1f'))
        .tickSize(-width)
        .ticks(5));
  }
});

module.exports = PrecipitationChart;
