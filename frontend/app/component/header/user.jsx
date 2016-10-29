import React from 'react';
import {Link} from 'react-router';

import Session from '../../service/session-service';
import Messages from '../../constants/messages';

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
    const msg = JSON.parse(xhr.responseText || '{}');

    this.setState({
      isSubmitting: false,
      message: Messages(msg.error)
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

  handleLogout(event) {
    event.preventDefault();

    Session.logout();
  }

  render() {
    const user = this.state.user;

    if (!user) {
      return (
        <div className="header__user">
          <form className="form-horizontal" onSubmit={this.handleLogin}>
            <div className="form-group">
              <div className="col-xs-12">
                <input type="email" className="form-control" name="username" placeholder="Email"
                       value={this.state.username}
                       onChange={(event) => this.setState({username: event.target.value})}/>
              </div>
            </div>
            <div className="form-group">
              <div className="col-xs-12">
                <input type="password" className="form-control" name="password" placeholder="Password"
                       value={this.state.password}
                       onChange={(event) => this.setState({password: event.target.value})}/>
              </div>
            </div>

            {
              (() => {
                if (this.state.message) {
                  return (
                    <div className="form-group has-error">
                      <div className="col-xs-12">
                        <span className="help-block">{this.state.message}</span>
                      </div>
                    </div>
                  );
                }
              })()
            }

            <div className="form-group">
              <div className="col-xs-8">
                        <span>
                          <Link to="/account/reset">Password forgotten?</Link>
                        </span><br/>
                <span>
                          <Link to="/account/registration">Registration</Link>
                        </span>
              </div>
              <div className="col-xs-4 col-submit-btn">
                {
                  (() => {
                    if (this.state.isSubmitting) {
                      return <button className="btn btn-default">Loading...</button>;
                    } else {
                      return <button type="submit" className="btn btn-success">Login</button>;
                    }
                  })()
                }

              </div>
            </div>
          </form>
        </div>
      );
    }

    const gravatar = 'https://www.gravatar.com/avatar/' + user.hash;

    return (
      <div className="header__user">
        <div className="media">
          <div className="media-left">
            <a href="#">
              <img className="media-object" src={gravatar} alt="..."/>
            </a>
          </div>
          <div className="media-body">
            <h4 className="media-heading">{user.email}</h4>

            <a href="#" onClick={this.handleLogout}>
              Logout <span className="glyphicon glyphicon-log-out"/>
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default User;