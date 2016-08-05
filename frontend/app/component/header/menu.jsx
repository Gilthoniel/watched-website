import React from 'react';
import {browserHistory, Link} from 'react-router';

require('./menu.scss');

class Menu extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    let items = [];
    for (let prop in Menu.MENU_ITEMS) {
      if (Menu.MENU_ITEMS.hasOwnProperty(prop)) {
        const [label, route] = Menu.MENU_ITEMS[prop].split(':');
        items.push(
          <li key={route}>
            <Link to={route} className="header-menu-link" activeClassName="active">{label}</Link>
          </li>
        );
      }
    }

    return (
      <ul className="header-menu">
        {items}
      </ul>
    );
  }
}

Menu.MENU_ITEMS = {
  MENU_HOME: 'Discover:/discover',
  MENU_ACCOUNT: 'My List:/my-list'
};

export default Menu;