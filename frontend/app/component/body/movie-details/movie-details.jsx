import React from 'react';

import * as MediaApi from '../../../utils/media';
import ApiService from '../../../service/api-service';

require('./movie-details.scss');

class MovieDetails extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      movie: undefined,
      configuration: undefined
    }
  }

  componentWillMount() {
    ApiService.getMovie(this.props.params.id).then(
      (movie) => {
        ApiService.getConfiguration().then(
          (conf) => {
            this.setState({
              movie: movie,
              configuration: conf
            });
          }
        );
      }
    )
  }

  render() {

    const movie = this.state.movie;
    const poster = MediaApi.poster(movie, this.state.configuration);

    if (!movie) {
      return <div>LOADING...</div>;
    }

    return (
      <div className="body-movie-details">
        <div className="movie-details">
          <div className="poster">
            <img src={poster} alt="Poster" />
          </div>
          <div className="information">
            <div className="information-title">{movie.title}</div>
            <div className="information-overview">{movie.overview}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default MovieDetails;