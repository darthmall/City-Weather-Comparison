'use strict';

var React           = require('react');

var LocationList    = require('components/LocationList.jsx');

var ForecastActions = require('actions/ForecastActions');
var ForecastStore   = require('stores/ForecastStore');

var CityWeatherApp = React.createClass({
  getInitialState : function () {
    return {
      forecasts : []
    };
  },

  componentDidMount : function () {
    ForecastStore.addChangeListener(this._onForecastChange);

    ForecastActions.getForecast('london, uk');
    ForecastActions.getForecast('new york, usa');
  },

  render : function () {
    return (
      <div id="location-list">
        <LocationList locations={this.state.forecasts} />
      </div>
    );
  },

  _onForecastChange : function () {
    this.setState({ forecasts : ForecastStore.getCurrentWeather() });
  },
});

React.render(<CityWeatherApp />, document.getElementById('app-container'));
