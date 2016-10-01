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

  render() {
    return (
      <div id="header">
        <User/>

        <Search/>

        <Menu/>

        <div className="h-attribution">
          <a href="https://www.themoviedb.org/">
            <img src={require('../../images/movie_db_attribution.png')} alt="TheMovieDB" />
          </a>
        </div>
      </div>
    );
  }
}