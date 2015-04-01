'use strict';

var React = require('react');

var LocationList = require('components/LocationList.jsx');

var CityWeatherApp = React.createClass({
  getInitialState : function () {
    return {
      locations : [{
        name : 'London',
        country : 'United Kingdom'
      }, {
        name : 'New York',
        country : 'United States'
      }]
    };
  },

  render : function () {
    return (
      <LocationList locations={this.state.locations} />
    );
  }
});

React.render(<CityWeatherApp />, document.getElementById('app-container'));
