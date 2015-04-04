'use strict';

var React            = require('react');

var LocationList     = require('components/LocationList.jsx');
var TemperatureChart = require('components/TemperatureChart.jsx');

var ForecastActions  = require('actions/ForecastActions');
var ForecastStore    = require('stores/ForecastStore');

var CityWeatherApp = React.createClass({
  getInitialState : function () {
    return {
      current  : [],
      forecast : []
    };
  },

  componentDidMount : function () {
    ForecastStore.addChangeListener(this._onForecastChange);

    ForecastActions.getForecast('london, uk');
    ForecastActions.getForecast('new york, usa');
  },

  render : function () {
    return (
      <div className="row">
        <div id="location-list">
          <LocationList locations={this.state.current} />
        </div>

        <div id="forecast">

          <div className="row">
            <div id="weather"></div>
            <div id="temperature">
              <TemperatureChart
                forecast={this.state.forecast}
                width={500}
                height={200} />
            </div>
          </div>

          <div className="row"></div>

        </div>
      </div>
    );
  },

  _onForecastChange : function () {
    this.setState({
      current  : ForecastStore.getCurrentWeather(),
      forecast : ForecastStore.getDailyForecast()
    });
  },
});

React.render(<CityWeatherApp />, document.getElementById('app-container'));
