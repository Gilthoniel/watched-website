import React from 'react';

require('./loading.scss');

export default class Loading extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      error: false
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      error: props.error
    });
  }

  render() {

    let error = '';
    let message = 'Loading';
    if (this.state.error) {
      error = 'has-error';
      message = 'Oops, something goes wrong...'
    }

    let cName = 'w-loading-box ' + error;

    return (
      <div className={cName}>
        <div className="sk-folding-cube">
          <div className="sk-cube1 sk-cube"></div>
          <div className="sk-cube2 sk-cube"></div>
          <div className="sk-cube4 sk-cube"></div>
          <div className="sk-cube3 sk-cube"></div>
        </div>

        <h1>{message}</h1>
      </div>
    );
  }
}