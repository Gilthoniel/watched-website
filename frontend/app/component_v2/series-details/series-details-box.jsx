import React from 'react';

export default class SeriesDetailsBox extends React.Component {
  render() {

    const flex = this.props.width ? 'none' : this.props.flex || 1;
    const style = {
      flex: flex,
      width: this.props.width
    };

    return (
      <div className="w-box" style={style}>
        <h6>{this.props.title}</h6>
        <div>
          {this.props.children}
        </div>
      </div>
    );
  }
}