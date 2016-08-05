import React from 'react';

require('./body.scss');

class Body extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="body">{this.props.children}</div>
    );
  }
}

export default Body;