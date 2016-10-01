import React from 'react';
import { Link } from 'react-router';

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
  }

  onLoginSuccess() {
    this.setState({
      isSubmitting: false,
      message: undefined,
      user: Session.user
    });
  }

  onLoginFailure(xhr) {
    const msg = JSON.parse(xhr.responseText);

    this.setState({
      isSubmitting: false,
      message: msg.error_description
    });
  }

  onLogoutSuccess() {
    this.setState({
      user: undefined,
      message: undefined
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

  render() {
    const user = this.state.user;

    if (!user) {
      return (
        <div className="header__user">
          <form className="header_login" onSubmit={this.handleLogin}>
            <input type="email" name="username" placeholder="Email" value={this.state.username}
                   onChange={(event) => this.setState({username: event.target.value})}/>
            <input type="password" name="password" placeholder="Password" value={this.state.password}
                   onChange={(event) => this.setState({password: event.target.value})}/>

            {
              (() => {
                if (this.state.message) {
                  return (
                    <div className="h-error-msg">
                      {this.state.message}
                    </div>
                  );
                }
              })()
            }

            {
              (() => {
                if (this.state.isSubmitting) {
                  return (
                    <div className="h-user-loading">Loading</div>
                  );
                } else {
                  return (
                    <div className="h-user-actions">
                      <button type="submit" className="btn btn-success">Login</button>

                      <div>
                        <span>
                          <a href="">Password forgotten?</a>
                        </span><br/>
                        <span>
                          <Link to="/account/registration">Registration</Link>
                        </span>
                      </div>
                    </div>
                  );
                }
              })()
            }
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