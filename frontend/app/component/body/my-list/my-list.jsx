import React from 'react';
import Toastr from 'toastr';
import Cookies from 'react-cookie';

import Loading from '../loading.jsx';
import SwitchButton from './switch-button.jsx';

import ApiService from '../../../service/api-service';
import Session from '../../../service/session-service';
import {sort, ORDERS} from '../../../utils/sorter';

require('./my-list.scss');

const EXPIRATION = 1000 * 60 * 60 * 24 * 365;

class MyList extends React.Component {

  constructor(props) {
    super(props);

    // Get the settings if existing
    let settings;
    try {
      settings = JSON.parse(Cookies.select(/GSW-/)['GSW-my-list']);
    } catch(e) {
      console.warn('Cannot parse the cookie');
      settings = {
        show_movie: true,
        show_series: true,
        show_watched: true
      };
    }

    this.state = {
      movies: [],
      series: [],
      isAuthenticated: Session.isAuthenticated,
      last_items: [],
      order: ORDERS.ALPHANUMERIC,
      show_movie: settings.show_movie,
      show_series: settings.show_series,
      show_watched: settings.show_watched,
      error: false,
      loading: true,
      progress: 0
    };

    for (let i = 0; i < 20; i++) {
      this.state.last_items.push(<div key={i} className="my-list-item"/>);
    }

    Session.subscribe(this);

    this.handleOrderClick = this.handleOrderClick.bind(this);
    this.handleShowMovieClick = this.handleShowMovieClick.bind(this);
    this.handleShowSeriesClick = this.handleShowSeriesClick.bind(this);
    this.handleShowWatchedClick = this.handleShowWatchedClick.bind(this);
  }

  handleOrderClick(order) {
    this.setState({
      order: order
    });
  }

  handleShowMovieClick() {
    this.setState({
      show_movie: !this.state.show_movie
    });
  }

  handleShowSeriesClick() {
    this.setState({
      show_series: !this.state.show_series
    });
  }

  handleShowWatchedClick() {
    this.setState({
      show_watched: !this.state.show_watched
    });
  }

  persistSettings() {
    Cookies.save('GSW-my-list', JSON.stringify({
      show_movie: this.state.show_movie,
      show_series: this.state.show_series,
      show_watched: this.state.show_watched
    }), {
      expires: new Date(Date.now() + EXPIRATION)
    });
  }

  onLoginSuccess() {
    this.setState({
      isAuthenticated: true
    });
    this.loadData();
  }

  onLogoutSuccess() {
    this.setState({
      movies: undefined,
      series: undefined,
      isAuthenticated: false
    });
  }

  onLoginFailure() {
    this.setState({
      isAuthenticated: false
    });
  }

  componentWillMount() {
    if (this.state.isAuthenticated) {
      this.loadData();
    }
  }

  componentWillUpdate() {
    $(this._scroll).mCustomScrollbar('destroy');
  }

  componentDidMount() {
    this.initScroll();
  }

  componentDidUpdate() {
    this.initScroll();

    this.persistSettings();
  }

  initScroll() {
    $(this._scroll).mCustomScrollbar({
      mouseWheel: {
        scrollAmount: 200
      }
    });
  }

  render() {

    if (!this.state.isAuthenticated) {
      return (
        <div className="my-list-container">
          <div className="my-list" ref={(c) => this._scroll = c}>
            <div className="my-list-message">
              Create an account or sign in to use this feature
            </div>
          </div>
        </div>
      );
    }

    const medias = {};
    if (this.state.show_movie) {
      let movies = this.state.movies;
      if (!this.state.show_watched) {
        movies = filterWatchedMovies(movies);
      }

      sort(medias, movies, this.state.order);
    }

    if (this.state.show_series) {
      let series = this.state.series.slice();
      if (!this.state.show_watched) {
        series = filterWatchedSeries(series);
      }

      sort(medias, series, this.state.order, true);
    }

    const templates = Object.keys(medias).sort().map(function (key) {
      return (
        <div className="my-list-category" key={key}>
          <h4>{key}</h4>
          <div className="my-list-flex">
            {medias[key]}
          </div>
        </div>
      );
    });

    if (this.state.order === ORDERS.SCORE) {
      templates.reverse();
    }

    const menus = Object.keys(ORDERS).map((key) => {
      return <div key={key} onClick={() => this.handleOrderClick(ORDERS[key])} className={(() => {
        return 'l-menu-item ' + (this.state.order === ORDERS[key] ? 'active' : '')
      })()}>{ORDERS[key]}</div>
    });

    const progress = {
      width: `${Math.max(Math.ceil(100 * this.state.progress), 10)}%`
    };

    return (
      <div className="my-list-container">
        <div className="my-list-menu">
          <div>Sort by:</div>
          {menus}

          <div className="my-list-separator"></div>
          <div onClick={this.handleShowMovieClick}>
            <SwitchButton active={this.state.show_movie} /> Movies
          </div>
          <div onClick={this.handleShowSeriesClick}>
            <SwitchButton active={this.state.show_series}/> TV Shows
          </div>
          <div onClick={this.handleShowWatchedClick}>
            <SwitchButton active={this.state.show_watched} /> Watched
          </div>
        </div>

        <div className="my-list-progress"><div style={progress}/></div>

        <div className="my-list" ref={(c) => this._scroll = c}>
          {templates}
          {this.state.last_items} {/* Workaround for the last line alignment */}
        </div>
      </div>
    );
  }

  loadData() {
    /*
    ApiService.getBookmarks().then(
      (response) => this.setState({
        movies: response.movies,
        series: response.series
      }),
      () => {
        this.setState({
          error: true
        });
        Toastr.error('The server is overloaded', 'Oops')
      }
    );
    */

    const movies = this.state.movies.slice() || [];
    const series = this.state.series.slice() || [];
    let total = 0;

    let update = debounce(() => {
      this.setState({
        movies: movies,
        series: series,
        progress: (movies.length + series.length) / Math.max(total, 1)
      });
    }, 1000);

    let sse = ApiService.getAsyncBookmarks();

    sse.addEventListener("total", (event) => {
      total = Number(event.data);
    });

    sse.addEventListener("movie", (event) => {
      movies.push(JSON.parse(event.data));

      update();
    });

    sse.addEventListener("series", (event) => {
      series.push(JSON.parse(event.data));

      update();
    });

    sse.addEventListener("RESET", () => {
      movies.length = 0;
      series.length = 0;
    });

    sse.addEventListener("EOS", () => {
      this.setState({
        loading: false
      });

      sse.close();
    });
  }
}

export default MyList;

function filterWatchedMovies(medias) {
  return medias.filter((media) => typeof media.bookmark === 'undefined' || !media.bookmark.watched);
}

function filterWatchedSeries(series) {
  return series.filter((media) => {
    // Compare the total number of episodes minus the season 0 with the number of watched episodes
    const total = media.resume_seasons.reduce((prev, curr) => curr.season_number !== 0 ? prev + curr.episode_count : prev, 0);
    return media.total_episodes_watched < total;
  });
}

function debounce(func, wait, immediate) {
  let timeout;
  return function() {
    let context = this, args = arguments;
    let later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    let callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}