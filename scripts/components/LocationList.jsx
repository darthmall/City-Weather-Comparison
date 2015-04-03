'use strict';

var React = require('react');

var Location = require('components/Location.jsx');

module.exports = React.createClass({
  render : function () {
    var locations = this.props.locations.map(function (l) {
      return (
        <Location name={l.name} temperature={l.temperature} />
      );
    });

    return (
      <div>
        <input type="text" placeholder="City, Country" />
        <ul class="locations">
          {locations}
        </ul>
      </div>
    );
  }
});
