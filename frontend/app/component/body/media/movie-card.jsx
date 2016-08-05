import React from 'react';
import { browserHistory } from 'react-router';

import * as ApiService from '../../../service/api-service';

require('./movie-card.scss');

class MovieCard extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      configuration: undefined,
      active: false
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleCardClick = this.handleCardClick.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  handleClick() {
    this.setState({
      active: !this.state.active
    });
  }

  handleCardClick(id) {
    browserHistory.push('/movie/' + id);
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
          configuration: response.entity
        });
      }
    )
  }

  render() {
    const movie = this.props.movie;

    let poster = '';
    if (this.state.configuration) {
      poster = this.state.configuration.base_url;
      poster += this.state.configuration.poster_sizes[3];
      poster += movie.poster_path;
    }

    return (
      <div className={(() => 'movie-card ' + (this.state.active ? 'movie-card--in' : ''))()}
           key={movie.id}
           onMouseLeave={this.handleMouseLeave}
           onClick={() => this.handleCardClick(movie.id)}>

        <div className="movie-card-bg">
          <img src={poster} alt=""/>
        </div>
        <div className="movie-card-body">
          <div className="movie-card-title">{movie.title}</div>
          <div className="movie-card-btn" onClick={this.handleClick}>
            <span>{(() => this.state.active ? '❭' : '❬')()}</span>
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