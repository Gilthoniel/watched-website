/**
 * Created by Gaylor on 31.07.2016.
 */
import React from 'react';
import User from './user.jsx';
import Menu from './menu.jsx';

import * as ApiService from '../../service/api-service';

require('./header.scss');

class Header extends React.Component {

  render() {
    return (
      <div id="header">
        <User/>

        <Menu/>
      </div>
    );
  }
}

export default Header;