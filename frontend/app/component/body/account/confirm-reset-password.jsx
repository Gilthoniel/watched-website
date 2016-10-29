import React from 'react';
import Toastr from 'toastr';

import Loading from '../loading.jsx';

import ApiService from '../../../service/api-service';

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

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    if (this.state.password !== this.state.password2) {
      Toastr.error('The passwords does not match.');
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