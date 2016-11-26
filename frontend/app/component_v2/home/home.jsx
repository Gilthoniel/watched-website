import React from 'react';

import ApiService from '../../service/api-service';
import Session from '../../service/session-service';

import Loading from '../loading/loading.jsx';
import MovieCard from './home-card/home-card.jsx';

require('./home.scss');

const MAXIMUM_LOADED_PAGE = 5;

export default class Home extends React.Component {

  constructor(props) {
    super(props);

    this._page = 1;
    this.state = {
      error: false,
      movies: undefined
    };

    this.handleScroll = this.handleScroll.bind(this);
  }

  handleScroll() {
    const p = $(window).scrollTop() / (this._scrollElement.height() - window.innerHeight);
    if (p > 0.9 && !this._loading) {
      this.loadData();
    }
  }

  componentDidMount() {
    Session.subscribe(this);

    this._scrollElement = $("#w-html");
    window.addEventListener('scroll', this.handleScroll);

    // Data will be loaded after authentication
    if (!Session.isAuthenticating) {
      this.loadData();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);

    Session.unsubscribe(this);
  }

  onLogoutSuccess() {
    this._page = 1;
    this.loadData();
  }

  onLoginFailure() {
    this._page = 1;

    // Reload the data, this time without the session
    this.loadData();
  }

  loadData() {
    let page = this._page || 1;
    this._loading = true;

    // Remove the scroll event when we reach the max number of pages
    if (page >= MAXIMUM_LOADED_PAGE) {
      window.removeEventListener('scroll', this.handleScroll);
    }

    ApiService.getDiscover(page).then(
      (response) => {

        const movies = this.state.movies || [];
        if (page === 1) {
          movies.length = 0;
        }

        this._page = this._page + 1;
        this.setState({
          movies: movies.concat(response.results),
          error: false
        });

        this._loading = false;
      },
      () => {
        this.setState({
          error: true
        });
      }
    );
  }

  render() {

    if (typeof this.state.movies === 'undefined') {
      return (
        <div id="w-home">
          <Loading error={this.state.error}/>
        </div>
      );
    }

    const movies = this.state.movies.map((movie) => {

      const key = movie.bookmark ? movie.bookmark.id : movie.id;

      return (
        <div key={key} className="w-home-item">
          <MovieCard movie={movie}/>
        </div>
      );
    });

    return (
      <div id="w-home" className="container">
        <div className="w-home-container">
          {movies}
        </div>

        {
          (() => {
            if (this._page < MAXIMUM_LOADED_PAGE) {
              return <Loading error={this.state.error}/>;
            }
          })()
        }
      </div>
    );
  }
}