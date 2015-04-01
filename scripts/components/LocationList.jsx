'use strict';

var React = require('react');

var Location = require('components/Location.jsx');

module.exports = React.createClass({
  render : function () {
    var locations = this.props.locations.map(function (l) {
      return (
        <Location data={l} />
      );
    });

    return (
      <ul class="locations">
        {locations}
      </ul>
    );
  }
});
