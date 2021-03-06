'use strict';

var React = require('react');

var Location = require('components/Location.jsx');

module.exports = React.createClass({
  render : function () {
    var locations = this.props.locations.map(function (l) {
      return (
        <Location key={l.name} name={l.name} temperature={l.temperature} color={l.color} />
      );
    });

    return (
      <div>
        <ul className="locations">
          {locations}
        </ul>
      </div>
    );
  }
});
