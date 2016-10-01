import React from 'react';

import Session from '../../service/session-service';

class User extends React.Component {

  constructor(props) {
    super(props);

    Session.subscribe(this);

    this.state = {
      user: Session.user,
      isSubmitting: Session.isAuthenticating,
      username: '',
      password: ''
    };

    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleRegistration = this.handleRegistration.bind(this);
  }

  onLoginSuccess() {
    this.setState({
      isSubmitting: false,
      user: Session.user
    });
  }

  onLoginFailure() {
    this.setState({
      isSubmitting: false
    });
  }

  onLogoutSuccess() {
    this.setState({
      user: null
    });
  }

  handleLogin(event) {
    event.preventDefault();

    this.setState({
      isSubmitting: true
    });

    Session.login(this.state.username, this.state.password);
  }

  handleLogout() {
    Session.logout();
  }

  handleRegistration() {
    Session.register(this.state.username, this.state.password);
  }

  render() {
    const user = this.state.user;

    if (this.state.isSubmitting) {
      return (
        <div className="header__user">
          <div className="header__user__loading">Loading</div>
        </div>
      );
    }

    if (!user) {
      return (
        <div className="header__user">
          <h3>Login</h3>

          <form className="header_login" onSubmit={this.handleLogin}>
            <input type="text" name="username" placeholder="Username/Email" value={this.state.username}
                   onChange={(event) => this.setState({username: event.target.value})}/>
            <input type="password" name="password" placeholder="Password" value={this.state.password}
                   onChange={(event) => this.setState({password: event.target.value})}/>

            <button type="button" className="btn btn-default" onClick={this.handleRegistration}>Register</button>
            <button type="submit" className="btn btn-success">Login</button>
          </form>
        </div>
      );
    }

    const gravatar = 'https://www.gravatar.com/avatar/' + user.hash;

    return (
      <div className="header__user">
        <div className="header__user__picture">
          <img src={gravatar}/>
        </div>
        <div className="header__user__name" onClick={this.handleLogout}>{user.email}</div>
      </div>
    );
  }
}

export default User;