'use strict';

var React = require('react');

module.exports = React.createClass({
  render : function () {
    var name = this.props.data.address_components.map(function (comp) {
        return comp.long_name;
      })
      .join(', ');

    return (
      <li>{name}</li>
    );
  }
});
