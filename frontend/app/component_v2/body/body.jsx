import React from 'react';
import {browserHistory, Link, IndexLink} from 'react-router';

import Session from '../../service/session-service';

require('./body.scss');

export default class Body extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      searchQuery: ''
    };

    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  handleKeyUp(event) {
    if (event.keyCode === 13) {
      browserHistory.push('/search/' + encodeURIComponent(event.target.value));
    }
  }

  render() {
    return (
      <div id="w-html">
        <div id="w-header">
          <div className="container">
            <div className="h-menu">
              <IndexLink to="/" className="h-menu-item" activeClassName="active">Home</IndexLink>
              <Link to="/my-list" className="h-menu-item" activeClassName="active">My List</Link>
              <Link to="/about" className="h-menu-item" activeClassName="active">About</Link>

              <div className="h-menu-search">
                <UserHeader />

                <div className="w-search-bar">
                  <input type="text" placeholder="Search..." value={this.state.searchQuery}
                         onChange={(event) => this.setState({searchQuery: event.target.value})}
                         onKeyUp={this.handleKeyUp} />
                  <span className="glyphicon glyphicon-search"/>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="w-body">
          {this.props.children}
        </div>
      </div>
    );
  }
}

class UserHeader extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      user: Session.user
    };

    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout() {
    Session.logout();
  }

  componentDidMount() {
    Session.subscribe(this);
  }

  componentWillUnmount() {
    Session.unsubscribe(this);
  }

  onLoginSuccess() {
    this.setState({
      user: Session.user
    });
  }

  onLogoutSuccess() {
    this.setState({
      user: undefined
    });
  }

  render() {
    return !Session.isAuthenticated ? (
      <div className="h-menu-account">
        <Link to="/account/login">Login</Link> | <Link to="/account/register">Register</Link>
      </div>
    ) : (
      <div className="h-menu-account">
        <span className="" onClick={this.handleLogout} >Logout</span>
        <img src={"https://www.gravatar.com/avatar/" + this.state.user.hash} alt="" />
      </div>
    );
  }
}