import React from 'react';
import {browserHistory} from 'react-router';
import Toastr from 'toastr';

import BookmarkPin from './bookmark-pin.jsx';

import * as MediaApi from '../../../utils/media';
import ApiService from '../../../service/api-service';

require('./movie-card.scss');
require('../../../style/bookmark.scss');

class MovieCard extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      configuration: null,
      active: false
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleCardClick = this.handleCardClick.bind(this);
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

  handleMouseLeave() {
    if (this.state.active) {
      this.setState({
        active: false
      });
    }
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

  render() {
    const movie = this.props.movie;
    const poster = MediaApi.poster(movie, this.state.configuration);
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
          <BookmarkPin movie={movie} blockClassName="movie-card-select"/>

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
}

export default MovieCard;