import React from 'react';

require('./switch-button.scss');

export default class SwitchButton extends React.Component {
  render() {

    let activeClass = 'onoffswitch ' + (this.props.active ? 'active' : '');

    return (
      <div className={activeClass}>
        <input type="checkbox" name="onoffswitch" className="onoffswitch-checkbox" />
        <label className="onoffswitch-label" />
      </div>
    );
  }
}