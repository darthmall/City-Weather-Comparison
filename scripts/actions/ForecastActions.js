'use strict';

var _             = require('lodash');

var AppDispatcher = require('dispatcher/AppDispatcher');
var Events        = require('constants/Events');
var api           = require('api');

/**
 * Load a forecast.
 */
exports.getForecast = function (address) {
  api.geocode(address)
    .then(function (response) {

      // FIXME: This could use some more robust error handling. What if multiple
      // results were found? What if there were 0 results?
      var result = response.results[0];

      var name = _(result.address_components)
        .map(function (comp) {
          return comp.short_name;
        })
        .thru(function (address) {
          return address.join(', ');
        })
        .value();

      api.forecast(result.geometry.location.lat, result.geometry.location.lng)
        .then(function (response) {
          AppDispatcher.dispatch({
            actionType : Events.ADD_FORECAST,
            name       : name,
            forecast   : response
          });
        },
        console.error);
    },
    console.error);
};
