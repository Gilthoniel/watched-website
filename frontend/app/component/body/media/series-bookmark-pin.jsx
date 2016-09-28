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

    const pinClassName = 'bookmark-pin' + (this.state.selected ? ' active': '');

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