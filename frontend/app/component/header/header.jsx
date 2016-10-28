/**
 * Created by Gaylor on 31.07.2016.
 *
 */
import React from 'react';
import User from './user.jsx';
import Menu from './menu.jsx';
import Search from './search.jsx';

require('./header.scss');

export default class Header extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      open: false
    };

    this.handleOpenClick = this.handleOpenClick.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
  }

  handleOpenClick() {
    console.log('test');
    this.setState({
      open: !this.state.open
    })
  }

  closeMenu() {
    this.setState({
      open: false
    });
  }

  render() {

    let headerClass = 'header-wrapper ' + (this.state.open ? 'active' : '');

    return (
      <div className={headerClass}>
        <MobileNavigation handleClick={this.handleOpenClick}/>

        <div id="header">
          <User/>

          <Search closeMenu={this.closeMenu}/>

          <Menu closeMenu={this.closeMenu} />

          <div className="h-attribution">
            <a href="https://www.themoviedb.org/">
              <img src={require('../../images/movie_db_attribution.png')} alt="TheMovieDB" />
            </a>
          </div>
        </div>
      </div>
    );
  }
}

class MobileNavigation extends React.Component {
  render() {
    return (
      <div id="mobile-navigation">
        <button onClick={this.props.handleClick}>
          <span className="glyphicon glyphicon-menu-hamburger"/>
        </button>

        <span className="m-nav-title">GrimSoft Watched &copy;</span>
      </div>
    );
  }
}