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

    this.handleCardClick = this.handleCardClick.bind(this);
  }

  handleCardClick() {
    const id = this.props.movie.id;
    browserHistory.push('/movie/' + id);
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

    return (
      <div className="movie-card" key={movie.id} onClick={this.handleCardClick}>

        {/* Background */}
        <div className="movie-card-bg">
          <img src={poster} alt=""/>
        </div>

        {/* Information panel */}
        <div className="movie-card-body">
          <BookmarkPin movie={movie} blockClassName="movie-card-select"/>

          <div className="movie-card-title">{movie.title}</div>
        </div>
      </div>
    );
  }
}

export default MovieCard;