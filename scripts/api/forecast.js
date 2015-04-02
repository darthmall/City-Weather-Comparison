'use strict'

var request = require('superagent');

var HOST = 'https://api.forecast.io/forecast';
var API_KEY  = '';

// Cache responses to avoid wasting calls to a request-limited free account
var _cache   = {};
var _fulfill = {};
var _reject  = {};

function fetch(location) {
  var script = document.createElement('script');
  script.setAttribute('src', [HOST, API_KEY, location].join('/') + '?callback=forecastReceived');

  document.body.appendChild(script);
}

window.forecastReceived = function (response) {
  var key = response.latitude + ',' + response.longitude;

  _fulfill[key](response);
}

/**
 * Return forecast for a location from forecast.io
 */
module.exports = function (latitude, longitude) {
  var key = latitude + ',' + longitude;

  if (!(key in _cache)) {
    var p = new Promise(function (fulfill, reject) {
      _fulfill[key] = fulfill;
      _reject[key] = reject;

      fetch(key);
    });

    _cache[key] = p;
  }

  return _cache[key];
};
