'use strict';

var AppDispatcher = require('dispatcher/AppDispatcher');
var Events        = require('constants/Events');

var forecast      = require('api/forecast');

module.exports = {

  /**
   * Load a forecast.
   */
  add : function (latitude, longitude) {
    forecast(latitude, longitude)
      .then(function (response) {
        console.debug(response);
        AppDispatcher.dispatch({
          actionType : Events.ADD_FORECAST,
          forecast   : response
        });
      }, function (err) {
        console.error(err);
      });
  }

};
