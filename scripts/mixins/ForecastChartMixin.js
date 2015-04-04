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

  getInitialState : function () {
    var height = this.props.height -
      this.props.margin.top -
      this.props.margin.bottom;

    return {
      viewBox : '0 0 ' + this.props.width + ' ' + this.props.height,
      margin  : 'translate(' + this.props.margin.left + ',' + this.props.margin.top + ')',
      xaxis   : 'translate(0,' + height + ')'
    };
  },

  shouldComponentUpdate : function (nextProps, nextState) {
    return nextState.viewBox !== this.state.viewBox ||
      nextState.margin !== this.state.margin ||
      nextState.xaxis !== this.state.xaxis ||
      nextProps.width !== this.props.width ||
      nextProps.height !== this.props.height ||
      nextProps.margin.left !== this.props.margin.left ||
      nextProps.margin.top !== this.props.margin.top ||
      nextProps.chartType !== this.props.chartType;
  },

  componentWillReceiveProps : function (nextProps) {
    var height = nextProps.height -
      nextProps.margin.top -
      nextProps.margin.bottom;

    this.setState({
      viewBox : '0 0 ' + nextProps.width + ' ' + nextProps.height,
      margin  : 'translate(' + nextProps.margin.left + ',' + nextProps.margin.top + ')',
      xaxis   : 'translate(0,' + height + ')'
    });
  },

  render : function () {
    return (
      <svg ref="svg" viewBox={this.state.viewBox}>
        <g transform={this.state.margin}>
          <g className="x axis" transform={this.state.xaxis}></g>
          <g className="y axis"></g>
          <g className="content"></g>
          <g className="annotation"></g>
        </g>
      </svg>
    );
  }
};
