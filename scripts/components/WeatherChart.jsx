'use strict';

var _     = require('lodash');
var d3    = require('d3');

var React = require('react');

var ForecastChartMixin = require('mixins/ForecastChartMixin');

var axis    = require('renderers/polarAxis');
var polygon = require('renderers/polarPolygon');

var WeatherChart = React.createClass({
  mixins : [ForecastChartMixin],

  componentDidMount : function () {
    this._redraw(this.props.forecast);
  },

  componentWillReceiveProps : function (nextProps) {
    this.setState({
      margin : 'translate(' + (nextProps.width / 2) + ',' + (nextProps.height / 2) + ')',
      xaxis  : ''
    });

    this._redraw(nextProps.forecast);
  },

  _redraw : function (forecast) {
    var domain = _(forecast)
      .pluck('data')
      .flatten()
      .pluck('icon')
      .uniq()
      .sortBy()
      .value();

    var range = [0, _(forecast)
      .pluck('data')
      .flatten()
      .countBy('icon')
      .values()
      .max()];

    if (domain.length < 3) {
      // FIXME: Need a special treatment for cases where there are fewer than
      // three weather categories, because that won't work well in a radar plot
      console.warn('Too few categories for an effective radar plot', domain);
    }

    var theta = d3.scale.ordinal()
      .domain(domain)
      .rangeBands([0, 2 * Math.PI]);

    var width = this.props.width - this.props.margin.left - this.props.margin.right;
    var height = this.props.height - this.props.margin.top - this.props.margin.bottom;

    var radius = d3.scale.linear()
      .domain(range)
      .range([0, Math.min(width, height) / 2]);

    var data = _.map(forecast, function (f) {
      return {
        name    : f.name,
        color   : f.color,
        opacity : 0.2,
        values : _(f.data)
          .countBy('icon')
          .reduce(function (result, count, weather) {
            result.push({
              theta : theta(weather),
              r     : radius(count)
            });

            return result;
          }, [])
      };
    });

    var svg = d3.select(React.findDOMNode(this.refs.svg));
    var g   = svg.select('.content');

    g.selectAll('.radar')
      .data(data)
      .call(polygon().className('radar'));

    var xTicks = svg.select('.x.axis')
      .call(axis()
        .scale(theta)
        .radius(radius.range()[1]));
  }
});

module.exports = WeatherChart;
