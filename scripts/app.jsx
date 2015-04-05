'use strict';

var React              = require('react');

var LocationList       = require('components/LocationList.jsx');
var Forecast           = require('components/Forecast.jsx');

var ForecastActions    = require('actions/ForecastActions');
var ForecastStore      = require('stores/ForecastStore');

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
          <h2>Current</h2>
          <LocationList locations={this.state.current} />
        </div>

        <div id="forecast">
          <h2>Forecast</h2>
          <Forecast forecast={this.state.forecast} />
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
