'use strict';

var React = require('react');

var CityWeatherApp = React.createClass({
  getInitialState : function () {
    return {};
  },

  render : function () {
    return (
      <h1>Hello, World!</h1>
    );
  }
});

React.render(<CityWeatherApp />, document.getElementById('app-container'));
