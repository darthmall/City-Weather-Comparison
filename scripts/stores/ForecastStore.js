'use strict';

var _             = require('lodash');
var d3            = require('d3');
var EventEmitter  = require('events').EventEmitter;

var AppDispatcher = require('dispatcher/AppDispatcher');
var Events        = require('constants/Events');

var CHANGE_EVENT = 'change';

var _forecasts = [];

var _color = d3.scale.category10();

var ForecastStore = _.assign({}, EventEmitter.prototype, {
  getCurrentWeather : function () {
    return _.map(_forecasts, function (f) {
      return _.assign({
        name  : f.location,
        color : f.color
      }, f.forecast.currently);
    })
  },

  getDailyForecast : function () {
    return _.map(_forecasts, function (f) {
      return _.assign({
        name  : f.location,
        color : f.color
      }, f.forecast.daily);
    });
  },

  emitChange : function () {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener : function (cb) {
    this.on(CHANGE_EVENT, cb);
  },

  removeChangeListener : function (cb) {
    this.removeListener(CHANGE_EVENT, cb);
  }
});

var _handlers = {};

_handlers[Events.ADD_FORECAST] = function (action) {
  _forecasts.push({
      location : action.name,
      color    : _color(action.name),
      forecast : action.forecast
    });

  ForecastStore.emitChange();
};

AppDispatcher.register(function (action) {
  _handlers[action.actionType](action);
});

module.exports = ForecastStore;
