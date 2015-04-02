'use strict';

var React           = require('react');

var LocationList    = require('components/LocationList.jsx');

var ForecastActions = require('actions/ForecastActions');

var ForecastStore   = require('stores/ForecastStore');
var LocationStore   = require('stores/LocationStore');

var CityWeatherApp = React.createClass({
  getInitialState : function () {
    return {
      locations : [{
        address_components : [{
          "long_name"  : "London",
          "short_name" : "London",
          "types"      : [ "locality", "political" ]
        },
        {
          "long_name"  : "United Kingdom",
          "short_name" : "GB",
          "types"      : [ "country", "political" ]
        }],
        geometry : {
          "location" : {
            "lat" : 51.5073509,
            "lng" : -0.1277583
          }
        }
      }, {
        address_components : [
          {
            "long_name"  : "New York",
            "short_name" : "NY",
            "types"      : [ "locality", "political" ]
          },
          {
            "long_name"  : "United States",
            "short_name" : "US",
            "types"      : [ "country", "political" ]
          }
        ],

        geometry : {
          "location" : {
            "lat" : 40.7127837,
            "lng" : -74.0059413
          }
        }
      }]
    };
  },

  componentDidMount : function () {
    ForecastStore.addChangeListener(this._onForecastChange);
    LocationStore.addChangeListener(this._onLocationChange);

    this.state.locations.forEach(function (location) {
      ForecastActions.add(
        location.geometry.location.lat,
        location.geometry.location.lng
      );
    });
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

  _onLocationChange : function () {

  }
});

React.render(<CityWeatherApp />, document.getElementById('app-container'));
