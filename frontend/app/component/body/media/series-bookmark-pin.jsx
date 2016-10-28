import React from 'react';
import Toastr from 'toastr';

import ApiService from '../../../service/api-service';
import Session from '../../../service/session-service';

export default class SeriesBookmarkPin extends React.Component {

  constructor(props) {
    super(props);

    if (!props.series) {
      return;
    }

    const bookmark = props.series.bookmark;
    this.state = {
      selected: bookmark !== null
    };

    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect() {
    if (!Session.isAuthenticated) {
      Toastr.info('Create an account or sign in to have access to this functionality.', 'Session required');
      return;
    }

    const id = this.props.series.id;
    if (this.state.selected) {
      this.removeBookmark(id);
    } else {
      this.addBookmark(this.props.series);
    }
  }

  componentWillUpdate(nextProps) {
    const media = nextProps.series;
    this.state.selected = media.bookmark !== null;
  }

  render() {

    if (!this.props.series) {
      return <div className={this.props.blockClassName}><div className="bookmark-pin"/></div>;
    }

    let watched = true;
    const seasons = this.props.series.seasons;
    if (typeof seasons !== 'undefined') {
      Object.keys(seasons).forEach((key) => {
        const season = seasons[key];
        if (season.episodes.some((episode) => typeof episode.bookmark === 'undefined')) {
          watched = false;
        }
      });
    } else if (typeof this.props.series.resume_seasons !== 'undefined') {
      const resume = this.props.series.resume_seasons;
      const total = resume.reduce((prev, curr) => curr.season_number !== 0 ? prev + curr.episode_count : prev, 0);
      if (this.props.series.total_episodes_watched < total) {
        watched = false;
      }
    } else {
      watched = false;
    }

    const pinClassName = 'bookmark-pin' + (this.state.selected ? ' active ': '') + (watched ? ' watched' : '');

    return (
      <div className={this.props.blockClassName} onClick={this.handleSelect}>
        <div className={pinClassName}/>
      </div>
    );
  }

  addBookmark(series) {
    ApiService.setBookmark(series.id, 'series').then(
      (bookmark) => {
        series.bookmark = bookmark;
        this.setState({
          selected: true
        })
      },
      () => Toastr.error('The server is overloaded. Please try later...')
    );
  }

  removeBookmark(seriesId) {
    ApiService.removeBookmark(seriesId, 'series').then(
      () => this.setState({
        selected: false
      }),
      () => Toastr.error('The server is overloaded. Please try later...')
    );
  }
}