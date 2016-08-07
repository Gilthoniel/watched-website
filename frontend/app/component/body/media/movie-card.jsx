import React from 'react';
import {browserHistory} from 'react-router';
import Toastr from 'toastr';

import * as MediaApi from '../../../utils/media';
import ApiService from '../../../service/api-service';
import Session from '../../../service/session-service';

require('./movie-card.scss');
require('../../../style/bookmark.scss');

class MovieCard extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      configuration: null,
      active: false,
      selected: props.movie.bookmark !== null
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleCardClick = this.handleCardClick.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  handleClick(event) {
    event.stopPropagation(); // avoid to handle click of the card

    this.setState({
      active: !this.state.active
    });
  }

  handleCardClick() {
    const id = this.props.movie.id;
    browserHistory.push('/movie/' + id);
  }

  handleSelect() {
    if (!Session.isAuthenticated) {
      Toastr.info('Create an account or sign in to have access to this functionality.', 'Session required');
      return;
    }

    const id = this.props.movie.id;
    if (this.state.selected) {
      this.removeBookmark(id);
    } else {
      this.addBookmark(id);
    }
  }

  handleMouseLeave() {
    this.setState({
      active: false
    });
  }

  componentWillMount() {
    ApiService.getConfiguration().then(
      (response) => {
        this.setState({
          configuration: response
        });
      },
      () => {
        Toastr.error('The server is overloaded. Please try later...');
      }
    )
  }

  componentWillUpdate(nextProps) {
    this.state.selected = nextProps.movie.bookmark !== null;
  }

  render() {
    const movie = this.props.movie;
    const poster = MediaApi.poster(movie, this.state.configuration);

    const bookmark = "bookmark-pin" + (this.state.selected ? " active" : "");
    const overviewBtn = 'movie-card-btn' + (this.state.active ? ' active' : '');

    return (
      <div className={(() => 'movie-card ' + (this.state.active ? 'movie-card--in' : ''))()}
           key={movie.id}
           onMouseLeave={this.handleMouseLeave}>

        {/* Background */}
        <div className="movie-card-bg" onClick={this.handleCardClick}>
          <img src={poster} alt=""/>
        </div>

        {/* Information panel */}
        <div className="movie-card-body">
          <div className="movie-card-select" onClick={this.handleSelect}>
            <div className={bookmark}/>
          </div>
          <div className="movie-card-title">{movie.title}</div>
          <div className={overviewBtn} onClick={this.handleClick}>
            <span className="glyphicon glyphicon-chevron-up"/>
          </div>

          <div className="movie-card-wrapper">
            <div className="movie-card-overview">
              {movie.overview}
            </div>
          </div>
        </div>
      </div>
    );
  }

  addBookmark(movieId) {
    ApiService.addBookmark(movieId).then(
      () => this.setState({ selected: true }),
      () => Toastr.error('The server is overloaded. Please try later...')
    );
  }

  removeBookmark(movieId) {
    ApiService.removeBookmark(movieId).then(
      () => this.setState({ selected: false }),
      () => Toastr.error('The server is overloaded. Please try later...')
    );
  }
}

export default MovieCard;