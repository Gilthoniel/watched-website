import React from 'react';
import Toastr from 'toastr';

import ApiService from '../../../service/api-service';
import Session from '../../../service/session-service';

export default class BookmarkPin extends React.Component {

  constructor(props) {
    super(props);

    if (!props.movie) {
      return;
    }

    const bookmark = props.movie.bookmark;
    this.state = {
      selected: bookmark !== null,
      watched: bookmark ? bookmark.watched : false
    };

    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect(event) {
    event.stopPropagation();

    if (!Session.isAuthenticated) {
      Toastr.info('Create an account or sign in to have access to this functionality.', 'Session required');
      return;
    }

    const id = this.props.movie.id;
    if (this.state.selected && this.state.watched) {
      this.removeBookmark(id);
    } else if (this.state.selected && !this.state.watched) {
      this.addBookmark(this.props.movie, true);
    } else {
      this.addBookmark(this.props.movie, false);
    }
  }

  componentWillUpdate(nextProps) {
    const media = nextProps.movie;
    this.state.selected = media.bookmark !== null;
    this.state.watched = media.bookmark ? media.bookmark.watched : false;
  }

  render() {

    if (!this.props.movie) {
      return <div className={this.props.blockClassName}><div className="bookmark-pin"/></div>;
    }

    const pinClassName = 'bookmark-pin' + (this.state.selected ? ' active': '') + (this.state.watched ? ' watched' : '');

    return (
      <div className={this.props.blockClassName} onClick={this.handleSelect}>
        <div className={pinClassName}/>
      </div>
    );
  }

  addBookmark(movie, watched) {
    ApiService.setBookmark(movie.id, 'movies', watched).then(
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

  removeBookmark(movieId) {
    ApiService.removeBookmark(movieId, 'movies').then(
      () => this.setState({
        selected: false,
        watched: false
      }),
      () => Toastr.error('The server is overloaded. Please try later...')
    );
  }
}