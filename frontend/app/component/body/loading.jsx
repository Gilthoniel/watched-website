import React from 'react';

require('./loading.scss');

export default class Loading extends React.Component {
  render() {
    return (
      <div className="w-loading-box">
        <div className="sk-folding-cube">
          <div className="sk-cube1 sk-cube"></div>
          <div className="sk-cube2 sk-cube"></div>
          <div className="sk-cube4 sk-cube"></div>
          <div className="sk-cube3 sk-cube"></div>
        </div>

        <h1>Loading</h1>
      </div>
    );
  }
}