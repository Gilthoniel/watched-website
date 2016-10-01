import React from 'react';
import Toastr from 'toastr';

import ApiService from '../../../service/api-service';

export default class AccountConfirmation extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      // we use a query parameter because of the length of the JWT
      token: props.location.query.token,
      enabled: false
    };

    ApiService.confirm(this.state.token).then(
      () => this.setState({ enabled: true }),
      () => Toastr.error("Oops! It seems that we cannot confirm your email.")
    );
  }

  render() {
    if (this.state.enabled) {
      return <div>Congratulations! You can now sign in with your credentials</div>
    } else {
      return <div>Waiting for the confirmation... Please wait.</div>
    }
  }
}