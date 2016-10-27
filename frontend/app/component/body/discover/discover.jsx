import React from 'react';
import MovieCard from '../media/movie-card.jsx';

import ApiService from '../../../service/api-service';
import Session from '../../../service/session-service';

import {SCREEN_SM} from '../../../constants/index';

import Loading from '../loading.jsx';

require('./discover.scss');

class Discover extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      movies: undefined,
      page: 1
    };

    Session.subscribe(this);
  }

  onLoginSuccess() {
    this.loadData();
  }

  onLogoutSuccess() {
    this.loadData();
  }

  onLoginFailure() {
    // Reload the data, this time without the session
    this.loadData();
  }

  componentWillMount() {
    this.loadData();
  }

  componentDidMount() {
    this.initScroll();
  }

  componentDidUpdate() {
    this.initScroll();
  }

  initScroll() {
    if (!this._scroll) {
      return;
    }

    let self = this;

    let params = {
      mouseWheel: {
        scrollAmount: 200
      },

      callbacks: {
        onTotalScroll() {
          if (self._loading) {
            return;
          }

          self.loadData();
        }
      }
    };

    if (window.innerWidth <= SCREEN_SM) {
      params.scrollInertia = 0;
      params.mouseWheel.scrollAmount = 300;
    }

    $(this._scroll).mCustomScrollbar(params);
  }

  render() {

    if (!this.state.movies) {
      return <Loading />;
    }

    const movies = [];
    this.state.movies.forEach(function(movie) {
      movies.push(
        <div key={movie.id} className="body-discover-card">
          <MovieCard movie={movie} />
        </div>
      );
    });

    return (
      <div className="body-discover" ref={(c) => this._scroll = c}>
        <div className="body-discover-container">
          {movies}
        </div>

        <div className="d-loading">
          <Loading />
        </div>
      </div>
    );
  }

  loadData() {
    let page = this.state.page || 1;
    this._loading = true;

    ApiService.getDiscover(page).then(
      (response) => {
        const movies = this.state.movies || [];

        this.setState({
          movies: movies.concat(response.results),
          page: page + 1
        });

        this._loading = false;
      },
      (xhr) => {
        console.log('Cannot get Discover', xhr);
      }
    );
  }
}

export default Discover;