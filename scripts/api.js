'use strict';

var _ = require('lodash');
var request = require('superagent');

/**
 * @private
 * Return a Promise for the results of an AJAX request.
 *
 * @param {String|Array} path The path of the AJAX request; if path is an Array
 *   a String will be created by joining each element with a '/'; all paths will
 *   be prefixed with a '/'
 * @param {Object} params Optional dictionary of query parameters for
 *   the request
 *
 * @return {Promise}
 */
function fetch(path, params) {
  return new Promise(function (fulfill, reject) {
    if (_.isArray(path)) {
      path = path.join('/');
    }

    if (path[0] !== '/') {
      path = '/' + path;
    }

    var req = request.get(path);

    if (params) {
      req.query(params);
    }

    req.end(function (err, res) {
      if (err) {
        reject(err);
      } else {
        var data = res.body;

        if (!data) {
          try {
            data = JSON.parse(res.text);
          } catch (e) {
            data = res.text;
          }
        }

        fulfill(data);
      }
    });
  });
}

/**
 * Return a Promise for forecast data from forecast.io.
 *
 * @param {Number|String} latitude
 * @param {Number|String} longitude
 */
exports.forecast = function (latitude, longitude) {
  return fetch(['forecast', latitude + ',' + longitude]);
};

/**
 * Return a Promise for geographic data about address.
 *
 * @param {String} address
 */
exports.geocode = function (address) {
  return fetch(['geocode', address ]);
}
