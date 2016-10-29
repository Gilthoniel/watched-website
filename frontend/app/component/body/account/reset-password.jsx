import React from 'react';
import Toastr from 'toastr';

import Loading from '../loading.jsx';

import ApiService from '../../../service/api-service';

require('./reset-password.scss');

export default class ResetPassword extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      message: '',
      loading: false
    };

    this.handleSend = this.handleSend.bind(this);
  }

  handleSend() {

    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!this.state.email.match(re)) {
      Toastr.info('Please write a correct email');
      return;
    }

    this.setState({
      loading: true
    });

    ApiService.resetPassword(this.state.email).then(
      () => this.setState({
        loading: false,
        message: 'Please check your emails!'
      }),
      () => this.setState({
        loading: false,
        message: 'Hm, it seems you already requested a reset. Check again your emails or contact an administrator.'
      })
    );
  }

  render() {
    if (this.state.loading) {
      return <Loading />
    }

    if (this.state.message.length > 0) {
      return (
        <div className="reset-password">
          <p>{this.state.message}</p>
        </div>
      );
    }

    return (
      <div className="reset-password">

        <p>
          Please fill the input with the email of your account to receive an email with
          the link to reset your password.
        </p>

        <form className="form-horizontal">
          <div className="form-group">
            <label className="col-sm-4 control-label">Email</label>
            <div className="col-sm-8">
              <input type="email" className="form-control" placeholder="Type your email..."
                     value={this.state.email}
                     onChange={(event) => this.setState({email: event.target.value})} />
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-offset-4 col-sm-8">
              <button type="button" className="btn btn-success" onClick={this.handleSend}>Reset</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}