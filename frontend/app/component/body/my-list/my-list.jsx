import React from 'react';
import Toastr from 'toastr';

import Loading from '../loading.jsx';

import ApiService from '../../../service/api-service';
import Session from '../../../service/session-service';
import {sort, ORDERS} from '../../../utils/sorter';

require('./my-list.scss');

class MyList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      movies: undefined,
      series: undefined,
      isAuthenticated: Session.isAuthenticated,
      last_items: [],
      order: ORDERS.ALPHANUMERIC,
      show_movie: true,
      show_series: true,
      show_watched: true
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

  componentWillMount() {
    if (this.state.isAuthenticated) {
      this.loadData();
    }
  }

  componentDidMount() {
    $('.my-list-container').mCustomScrollbar();
  }

  componentDidUpdate() {
    $('.my-list-container').mCustomScrollbar();
  }

  render() {

    if (!this.state.isAuthenticated) {
      return (
        <div className="my-list-container">
          <div className="my-list">
            <div className="my-list-message">
              Create an account or sign in to use this feature
            </div>
          </div>
        </div>
      );
    }

    if (!this.state.movies || !this.state.series) {
      return <Loading />;
    }

    const medias = {};
    if (this.state.show_movie) {
      sort(medias, filterWatched(this.state.movies, this.state.show_watched), this.state.order);
    }

    if (this.state.show_series) {
      sort(medias, this.state.series, this.state.order, true);
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
        return this.state.order === ORDERS[key] ? 'active' : ''
      })()}>{ORDERS[key]}</div>
    });

    return (
      <div className="my-list-container">
        <div className="my-list-menu">
          <div>Sort by:</div>
          {menus}

          <div className="my-list-separator"></div>
          <div className={(() => this.state.show_movie ? 'active' : '')()} onClick={this.handleShowMovieClick}>Movies</div>
          <div className={(() => this.state.show_series ? 'active' : '')()} onClick={this.handleShowSeriesClick}>TV Shows</div>
          <div className={(() => this.state.show_watched ? 'active' : '')()} onClick={this.handleShowWatchedClick}>Already Watched</div>
        </div>
        <div className="my-list">
          {templates}
          {this.state.last_items} {/* Workaround for the last line alignment */}
        </div>
      </div>
    );
  }

  loadData() {
    ApiService.getBookmarks().then(
      (response) => this.setState({
        movies: response.movies,
        series: response.series
      }),
      () => Toastr.error('The server is overloaded', 'Oops')
    );
  }
}

export default MyList;

function filterWatched(medias, showWatched) {
  if (showWatched) {
    return medias;
  }

  return medias.filter((media) => typeof media.bookmark === 'undefined' || !media.bookmark.watched);
}