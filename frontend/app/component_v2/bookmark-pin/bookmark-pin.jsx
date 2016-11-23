import React from 'react';
import Toastr from 'toastr';

import Session from '../../service/session-service';
import ApiService from '../../service/api-service';
import MediaType from '../../constants/media-type.js';

require('./bookmark-pin.scss');

export default class BookmarkPin extends React.Component {

  constructor(props) {
    super(props);

    if (!props.media && !props.season) {
      return;
    }

    let selected = false;
    let watched = false;

    if (this.props.season) {
      watched = this.props.season.episodes.every((e) => e.bookmark);
      selected = watched;
    } else {
      const bookmark = props.media.bookmark;

      switch (props.media.media_type) {
        case MediaType.MOVIE:
          selected = bookmark !== null;
          watched = bookmark ? bookmark.watched : false;
          break;
        case MediaType.TV_SERIES:
          selected = bookmark !== null;

          // Check the episodes
          watched = isSeriesWatched(props.media);

          break;
        default:
          selected = typeof bookmark !== 'undefined';
          watched = typeof bookmark !== 'undefined';
          break;
      }
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

    if (this.props.season) {
      manageSeasonBookmark.call(this, this.props.season);
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

    if (typeof media !== 'undefined') {
      if (media.media_type === MediaType.TV_SERIES && this.state.selected) {
        this.setState({
          watched: isSeriesWatched(media)
        });
      } else if (!media.media_type) {
        this.setState({
          watched: typeof media.bookmark !== 'undefined',
          selected: typeof media.bookmark !== 'undefined'
        });
      }
    }

    const season = props.season;
    if (typeof season !== 'undefined') {
      let watched = season.episodes.every((e) => e.bookmark);

      this.setState({
        watched: watched,
        selected: watched
      });
    }
  }

  addBookmark(media, type, watched, callback) {
    ApiService.setBookmark(media.season_number || media.id, type, watched).then(
      (bookmark) => {
        if (media.media_type === MediaType.MOVIE) {
          media.bookmark = bookmark;
        } else if (typeof media.media_type === 'undefined') {
          media.episodes.forEach((e) => e.bookmark = {});
        }

        if (typeof callback === 'function') {
          callback();
        }

        this.setState({
          selected: true,
          watched: watched
        });
      },
      () => Toastr.error('The server is overloaded. Please try later...')
    );
  }

  removeBookmark(media, type, callback) {
    ApiService.removeBookmark(media.season_number || media.id, type).then(
      () => {
        if (media.media_type === MediaType.MOVIE) {
          delete media.bookmark;
        } else if (typeof media.media_type === 'undefined') {
          media.episodes.forEach((e) => delete e.bookmark);
        }

        if (typeof callback === 'function') {
          callback();
        }

        this.setState({
          selected: false,
          watched: false
        });
      },
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
    if (!this.props.media && !this.props.season) {
      return <div className={this.props.blockClassName}>
        <div className="bookmark-pin"/>
      </div>;
    }

    const pinClassName = 'bookmark-pin' + (this.state.selected ? ' active' : '') + (this.state.watched ? ' watched' : '');

    return (
      <div className={this.props.blockClassName} onClick={this.handleSelect}>
        <div className={pinClassName}/>
      </div>
    );
  }
}

function manageMovieBookmark(movie) {
  if (this.state.selected && this.state.watched) {
    this.removeBookmark(movie, 'movies');
  } else if (this.state.selected && !this.state.watched) {
    this.addBookmark(movie, 'movies', true);
  } else {
    this.addBookmark(movie, 'movies', false);
  }
}

function manageSeriesBookmark(series) {
  if (this.state.selected) {
    this.removeBookmark(series, 'series');
  } else {
    this.addBookmark(series, 'series', isSeriesWatched(series));
  }
}

function manageSeasonBookmark(season) {
  function trigger() {
    const func = this.props.onchange;
    if (typeof func === 'function') {
      func();
    }
  }

  if (this.state.watched) {
    this.removeBookmark(season, `season/${season.series_id}`, trigger.bind(this));
  } else {
    this.addBookmark(season, `season/${season.series_id}`, true, trigger.bind(this));
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