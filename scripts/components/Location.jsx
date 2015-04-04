'use strict';

var React = require('react');

module.exports = React.createClass({
  render : function () {
    return (
      <li style={{backgroundColor: this.props.color}}>
        {this.props.name}, {this.props.temperature}º
      </li>
    );
  }
});
