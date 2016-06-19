import React from 'react';

export default class Details extends React.Component {
  render () {
    return (
      <div className="details">
        <h3>{this.props.title}</h3>
      </div>
    );
  }
}
