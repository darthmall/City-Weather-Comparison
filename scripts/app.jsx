'use strict';

var moment          = require('moment');

var React           = require('react');

var LocationList    = require('components/LocationList.jsx');
var Forecast        = require('components/Forecast.jsx');

var ForecastActions = require('actions/ForecastActions');
var ForecastStore   = require('stores/ForecastStore');

var CityWeatherApp = React.createClass({
  getInitialState : function () {
    return {
      date     : new Date(),
      current  : [],
      forecast : []
    };
  },

  componentDidMount : function () {
    ForecastStore.addChangeListener(this._onForecastChange);
  },

  render : function () {
    var date = moment(date).format('dddd, MMMM Do, YYYY');

    return (
      <div>
        <header className="row">
          <h1>{date}</h1>
        </header>
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
