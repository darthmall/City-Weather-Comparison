'use strict';

var React = require('react');

/**
 * Mixin that handles the common properties and SVG format for charts.
 *
 * All forecast charts will accept the same basic properties and render an SVG
 * that implements the D3 margin convention. Chart components need only
 * implement componentDidUpdate to handle resizing and componentWillReceiveProps
 * to rerender the data in the chart.
 */
module.exports = {
  propTypes : {
    chartType : React.PropTypes.string,
    forecast  : React.PropTypes.array,

    margin : React.PropTypes.shape({
      top    : React.PropTypes.number,
      right  : React.PropTypes.number,
      bottom : React.PropTypes.number,
      left   : React.PropTypes.number
    }),

    width  : React.PropTypes.number.isRequired,
    height : React.PropTypes.number.isRequired
  },

  getDefaultProps : function () {
    return {
      chartType : 'chart',
      forecast  : [],

      margin : {
        top    : 0,
        right  : 0,
        bottom : 0,
        left   : 0
      }
    }
  },

  shouldComponentUpdate : function (nextProps) {
    return nextProps.width !== this.props.width ||
      nextProps.height !== this.props.height ||
      nextProps.margin.left !== this.props.margin.left ||
      nextProps.margin.top !== this.props.margin.top ||
      nextProps.chartType !== this.props.chartType;
  },

  render : function () {
    var height = this.props.height -
      this.props.margin.top -
      this.props.margin.bottom;

    var viewBox = '0 0 ' + this.props.width + ' ' + this.props.height;
    var margin  = 'translate(' + this.props.margin.left + ',' + this.props.margin.top + ')';
    var xaxis   = 'translate(0,' + height + ')';

    return (
      <svg ref="svg" viewBox={viewBox}>
        <g transform={margin}>
          <g className="x axis" transform={xaxis}></g>
          <g className="y axis"></g>
          <g className="content"></g>
          <g className="annotation"></g>
        </g>
      </svg>
    );
  }
};
