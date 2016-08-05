import React from 'react';
import MovieCard from '../media/movie-card.jsx';

import * as ApiService from '../../../service/api-service';

require('./discover.scss');

class Discover extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      movies: []
    };
  }

  componentWillMount() {
    ApiService.getDiscover().then(
      (response) => {
        this.setState({
          movies: response.entity.results
        });
      }
    )
  }

  render() {

    const movies = [];
    this.state.movies.forEach(function(movie) {
      movies.push(
        <div key={movie.id} className="body-discover-card">
          <MovieCard movie={movie} />
        </div>
      );
    });

    return (
      <div className="body-discover">
        {movies}
      </div>
    );
  }
}

export default Discover;