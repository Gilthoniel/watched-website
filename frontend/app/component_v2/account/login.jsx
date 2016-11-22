import React from 'react';
import {Link, browserHistory} from 'react-router';

import Session from '../../service/session-service';
import Messages from '../../constants/messages';

require('./login.scss');

export default class Login extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      isSubmitting: false
    };

    Session.subscribe(this);

    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
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

  onLoginSuccess() {
    browserHistory.push("/");
  }

  onLoginFailure(xhr) {
    const msg = JSON.parse(xhr.responseText || '{}');

    this.setState({
      isSubmitting: false,
      message: Messages(msg.error)
    });
  }

  render () {
    return (
      <div id="w-login" className="container">
        <p>
          Sign in
        </p>

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
                          <Link to="/account/register">Registration</Link>
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

}