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

      api.forecast(result.geometry.location.lat, result.geometry.location.lng)
        .then(function (response) {
          AppDispatcher.dispatch({
            actionType : Events.ADD_FORECAST,
            name       : result.formatted_address,
            forecast   : response
          });
        },
        console.error);
    },
    console.error);
};
