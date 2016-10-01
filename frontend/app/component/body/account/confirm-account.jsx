import React from 'react';
import Toastr from 'toastr';

import ApiService from '../../../service/api-service';

require('./confirm-account.scss');

export default class AccountConfirmation extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      // we use a query parameter because of the length of the JWT
      token: props.location.query.token,
      enabled: false,
      error: false
    };

    ApiService.confirm(this.state.token).then(
      () => this.setState({ enabled: true }),
      () => this.setState({ error: true })
    );
  }

  render() {
    if (this.state.error) {
      return <div className="account-msg">Oops! It seems that we cannot confirm your email.</div>
    } else if (this.state.enabled) {
      return <div className="account-msg">Congratulations! You can now sign in with your credentials</div>
    } else {
      return <div className="account-msg">Waiting for the confirmation... Please wait.</div>
    }
  }
}