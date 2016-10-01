import React from 'react';
import {browserHistory} from 'react-router';

import Session from '../../../service/session-service';

require('./registration.scss');

export default class Registration extends React.Component {

  constructor(props) {
    super(props);

    Session.subscribe(this);

    this.state = {
      email: '',
      password: '',
      password2: '',
      registered: false,
      errorMsg: undefined
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();

    if (this.state.password2 !== this.state.password) {
      return;
    }

    Session.register(this.state.email, this.state.password).then(
      () => {
        this.setState({
          registered: true,
          errorMsg: undefined
        });
      },
      (xhr) => {
        const msg = JSON.parse(xhr.responseText);
        this.setState({
          errorMsg: msg
        });
      }
    );
  }

  // Events
  onLoginSuccess() {
    browserHistory.push('/');
  }

  render() {

    if (this.state.registered) {
      return (
        <div className="account-registration">
          <p>
            You're close ! You will receive soon a link by email to validate that you own
            this address.
          </p>
        </div>
      );
    }

    let error = typeof this.state.errorMsg !== 'undefined' ? 'form-group has-error' : 'form-group';

    let pwdState = "form-group";
    if (this.state.password.length > 0 && this.state.password2.length > 0) {
      if (this.state.password !== this.state.password2) {
        pwdState += ' has-error';
      }
    }

    return (
      <div className="account-registration">
        <p>
          Fill the different fields to create an account and have access to more features !
        </p>

        <form className="form-horizontal" onSubmit={this.handleSubmit}>
          <div className={error}>
            <label htmlFor="reg_email_input" className="col-sm-4 control-label">Email</label>
            <div className="col-sm-8">
              <input type="email" className="form-control" id="reg_email_input" placeholder="Email" required
                     onChange={(event) => this.setState({email: event.target.value})}/>
            </div>
            {
              (() => {
                if (this.state.errorMsg) {
                  return (
                    <span className="help-block col-sm-offset-4 col-sm-8">
                      The email is already used
                    </span>
                  );
                }
              })()
            }
          </div>

          <div className={pwdState}>
            <label htmlFor="reg_pwd_1" className="col-sm-4 control-label">Password</label>
            <div className="col-sm-8">
              <input type="password" className="form-control" id="reg_pwd_1" placeholder="Password" required
                     onChange={(event) => this.setState({password: event.target.value})}/>
            </div>
          </div>
          <div className={pwdState}>
            <label htmlFor="reg_pwd_2" className="col-sm-4 control-label">Repeat Password</label>
            <div className="col-sm-8">
              <input type="password" className="form-control" id="reg_pwd_2" placeholder="Password" required
                     onChange={(event) => this.setState({password2: event.target.value})}/>
            </div>
          </div>

          <div className="form-group">
            <div className="col-sm-offset-4 col-sm-8">
              <button type="submit" className="btn btn-success">Register</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}