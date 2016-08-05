import React from 'react';

import * as ApiService from '../../../service/api-service';

class MovieDetails extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      movie: undefined
    }
  }

  componentWillMount() {
    ApiService.getMovie(this.props.params.id).then(
      (response) => {
        this.setState({
          movie: response.entity
        })
      }
    )
  }

  render() {

    const movie = this.state.movie;

    if (!movie) {
      return <div>LOADING...</div>;
    }

    return (
      <div className="body-movie-details">
        <h1>{movie.title}</h1>
      </div>
    );
  }
}

export default MovieDetails;