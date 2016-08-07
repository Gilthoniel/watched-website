import React from 'react';
import {browserHistory} from 'react-router';

import * as MediaApi from '../../../utils/media';
import ApiService from '../../../service/api-service';

require('./movie-card.scss');

class MovieCard extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      configuration: undefined,
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
    const id = this.props.movie.id;

    if (this.state.selected) {
      ApiService.removeMovie(id).then(
        () => {
          this.setState({
            selected: false
          })
        }
      );
    } else {
      ApiService.addMovie(id).then(
        () => {
          this.setState({
            selected: true
          })
        }
      );
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
      }
    )
  }

  render() {
    const movie = this.props.movie;

    let poster = MediaApi.poster(movie, this.state.configuration);

    return (
      <div className={(() => 'movie-card ' + (this.state.active ? 'movie-card--in' : ''))()}
           key={movie.id}
           onMouseLeave={this.handleMouseLeave}>

        {/* Actions panel */}
        <div className="movie-card-actions">
          <div className="btn-select">
            <div className={(() => "movie-card-checkbox" + (this.state.selected ? ' active' : ''))()}
                 onClick={this.handleSelect}>
              <span/>
            </div>
          </div>
        </div>

        {/* Background */}
        <div className="movie-card-bg" onClick={this.handleCardClick}>
          <img src={poster} alt=""/>
        </div>

        {/* Information panel */}
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