import React from 'react';
import Toastr from 'toastr';

import Session from '../../service/session-service';
import ApiService from '../../service/api-service';
import MediaType from '../../constants/media-type.js';

require('./bookmark-pin.scss');

export default class BookmarkPin extends React.Component {

  constructor(props) {
    super(props);

    if (!props.media) {
      return;
    }

    const bookmark = props.media.bookmark;
    let selected = false;
    let watched = false;

    switch (props.media.media_type) {
      case MediaType.MOVIE:
        selected = bookmark !== null;
        watched = bookmark ? bookmark.watched : false;
        break;
      case MediaType.TV_SERIES:
        selected = bookmark !== null;

        // Check the episodes
        let episodes = [];
        const series = props.media;
        Object.keys(series.seasons).forEach((key) => episodes = episodes.concat(series.seasons[key].episodes));

        watched = !episodes.some((episode) => typeof episode.bookmark === 'undefined');

        break;
      default:
        selected = typeof bookmark !== 'undefined';
        watched = typeof bookmark !== 'undefined';
        break;
    }

    this.state = {
      selected: selected,
      watched: watched
    };

    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect(event) {
    event.stopPropagation();

    if (!Session.isAuthenticated) {
      Toastr.info('Create an account or sign in to have access to this functionality.', 'Session required');
      return;
    }

    const media = this.props.media;

    switch (media.media_type) {
      case MediaType.MOVIE:
        manageMovieBookmark.call(this, media);
        break;
      case MediaType.TV_SERIES:
        manageSeriesBookmark.call(this, media);
        break;
      default:
        manageEpisodeBookmark.call(this, media);
        break;
    }
  }

  componentWillReceiveProps(props) {
    const media = props.media;

    if (media.media_type === MediaType.TV_SERIES) {
      console.log(media.seasons['1'].episodes[0].bookmark);
      this.setState({
        watched: isSeriesWatched(media)
      });
    }
  }

  addBookmark(movie, type, watched) {
    ApiService.setBookmark(movie.id, type, watched).then(
      (bookmark) => {
        movie.bookmark = bookmark;
        this.setState({
          selected: true,
          watched: watched
        })
      },
      () => Toastr.error('The server is overloaded. Please try later...')
    );
  }

  removeBookmark(movieId, type) {
    ApiService.removeBookmark(movieId, type).then(
      () => this.setState({
        selected: false,
        watched: false
      }),
      () => Toastr.error('The server is overloaded. Please try later...')
    );
  }

  addEpisodeBookmark(episode, callback) {
    ApiService.setEpisodeBookmark(episode).then(
      (bookmark) => {
        episode.bookmark = bookmark;
        this.setState({
          selected: true,
          watched: true
        });

        if (typeof callback === 'function') {
          callback();
        }
      }
    );
  }

  removeEpisodeBookmark(episode, callback) {
    ApiService.removeEpisodeBookmark(episode).then(
      () => {
        delete episode.bookmark;
        this.setState({
          selected: false,
          watched: false
        });

        if (typeof callback === 'function') {
          callback();
        }
      }
    );
  }

  render() {
    if (!this.props.media) {
      return <div className={this.props.blockClassName}><div className="bookmark-pin"/></div>;
    }

    const pinClassName = 'bookmark-pin' + (this.state.selected ? ' active': '') + (this.state.watched ? ' watched' : '');

    return (
      <div className={this.props.blockClassName} onClick={this.handleSelect}>
        <div className={pinClassName} />
      </div>
    );
  }
}

function manageMovieBookmark(movie) {
  const id = movie.id;

  if (this.state.selected && this.state.watched) {
    this.removeBookmark(id, 'movies');
  } else if (this.state.selected && !this.state.watched) {
    this.addBookmark(movie, 'movies', true);
  } else {
    this.addBookmark(movie, 'movies', false);
  }
}

function manageSeriesBookmark(series) {
  if (this.state.selected) {
    this.removeBookmark(series.id, 'series');
  } else {
    this.addBookmark(series, 'series');
  }
}

function manageEpisodeBookmark(episode) {
  function trigger() {
    const func = this.props.onchange;
    if (typeof func === 'function') {
      func();
    }
  }

  if (this.state.watched) {
    this.removeEpisodeBookmark(episode, trigger.bind(this));
  } else {
    this.addEpisodeBookmark(episode, trigger.bind(this));
  }
}

function isSeriesWatched(series) {
  let episodes = [];
  Object.keys(series.seasons).forEach((key) => episodes = episodes.concat(series.seasons[key].episodes));

  return !episodes.some((episode) => typeof episode.bookmark === 'undefined');
}