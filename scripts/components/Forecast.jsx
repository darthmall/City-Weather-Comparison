'use strict';

var React = require('react');

var TemperatureChart   = require('components/TemperatureChart.jsx');
var WeatherChart       = require('components/WeatherChart.jsx');
var PrecipitationChart = require('components/PrecipitationChart.jsx');

var Forecast = React.createClass({
  getDefaultProps : function () {
    return {
      forecast : {}
    };
  },

  render : function () {
    return (
      <div>
        <div className="row">
          <div id="weather">
            <h3>Weather for the week</h3>
            <WeatherChart
              forecast={this.props.forecast}
              width={200}
              height={200}
              margin={{
                top    : 14,
                right  : 14,
                bottom : 14,
                left   : 14
              }} />
          </div>
          <div id="temperature">
            <h3>Temperature</h3>
            <TemperatureChart
              forecast={this.props.forecast}
              width={500}
              height={200}
              margin={{
                top    : 9,
                right  : 9,
                bottom : 14,
                left   :28
              }} />
          </div>
        </div>

        <div className="row">
          <div className="precipitation">
            <h3>Precipitation (in. / hr.)</h3>
            <PrecipitationChart
              forecast={this.props.forecast}
              width={500}
              height={200}
              margin={{
                top    : 9,
                right  : 9,
                bottom : 14,
                left   :28
              }} />
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Forecast;
