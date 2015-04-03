'use strict';

var React           = require('react');

var LocationList    = require('components/LocationList.jsx');

var ForecastActions = require('actions/ForecastActions');
var ForecastStore   = require('stores/ForecastStore');

var CityWeatherApp = React.createClass({
  getInitialState : function () {
    return {
      locations : []
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
        <LocationList locations={this.state.locations} />
      </div>
    );
  },

  _onForecastChange : function () {

  },
});

React.render(<CityWeatherApp />, document.getElementById('app-container'));
