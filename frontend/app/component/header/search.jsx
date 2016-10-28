import React from 'react';
import {browserHistory} from 'react-router';
import './search.scss';

export default class Search extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      query: ''
    };

    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleKeyUp(event) {
    if (event.keyCode === 13) {
      browserHistory.push('/search/' + encodeURIComponent(event.target.value));
      this.props.closeMenu();
    }
  }

  handleClick() {
    browserHistory.push('/search/' + encodeURIComponent(this.state.query));
    this.props.closeMenu();
  }

  render() {
    return (
      <div className="header-search">
        <input type="text" value={this.state.query} placeholder="Search for movies or TV show"
               onChange={(event) => this.setState({query: event.target.value})}
               onKeyUp={this.handleKeyUp}/>

        <button onClick={this.handleClick}>
          <span className="glyphicon glyphicon-search" />
        </button>
      </div>
    );
  }
}