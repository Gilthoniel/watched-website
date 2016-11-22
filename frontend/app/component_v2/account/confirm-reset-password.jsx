import React from 'react';
import {browserHistory} from 'react-router';
import Toastr from 'toastr';

import Loading from '../loading/loading.jsx';

import ApiService from '../../service/api-service';
import Session from '../../service/session-service';

require('./confirm-reset-password.scss');

export default class ConfirmResetPassword extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      password: '',
      password2: '',
      id: props.location.query.id,
      loading: false,
      message: ''
    };

    Session.subscribe(this);

    this.handleClick = this.handleClick.bind(this);
  }

  onLoginSuccess() {
    // Redirect the user to the home when he's logged
    browserHistory.push('/');
  }

  handleClick() {
    if (this.state.password !== this.state.password2 && this.state.password.length > 0) {
      Toastr.error('The passwords does not match.');
      return;
    }

    if (typeof this.state.id === 'undefined') {
      Toastr.error('Please use a correct link when trying to reset your password.');
      return;
    }

    this.setState({
      loading: true
    });

    ApiService.confirmResetPassword(this.state.id, this.state.password).then(
      () => this.setState({
        loading: false,
        message: 'Your password has been successfully reset!'
      }),
      () => this.setState({
        loading: false,
        message: 'Oops, something goes wrong.'
      })
    );
  }

  componentDidMount() {
    if (Session.isAuthenticated) {
      // Redirect the user to the home when he's logged
      browserHistory.push('/');
    }
  }

  render() {

    if (this.state.loading) {
      return <Loading />
    }

    if (this.state.message.length > 0) {
      return (
        <div className="confirm-reset-password">
          <p>{this.state.message}</p>
        </div>
      );
    }

    return (
      <div className="confirm-reset-password">

        <p>
          Please fill the following fields with your new password
        </p>

        <form action="#" className="form-horizontal">
          <div className="form-group">
            <div className="col-sm-12">
              <input type="password" className="form-control" placeholder="password"
                     value={this.state.password}
                     onChange={(event) => this.setState({password: event.target.value})} />
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-12">
              <input type="password" className="form-control" placeholder="password"
                     value={this.state.password2}
                     onChange={(event) => this.setState({password2: event.target.value})} />
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-12">
              <button type="button" className="btn btn-success" onClick={this.handleClick}>Reset</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}