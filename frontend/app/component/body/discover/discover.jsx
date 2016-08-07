import React from 'react';
import MovieCard from '../media/movie-card.jsx';

import ApiService from '../../../service/api-service';
import Session from '../../../service/session-service';

require('./discover.scss');

class Discover extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      movies: []
    };

    Session.subscribe(this);
  }

  onLoginSuccess() {
    ApiService.getDiscover().then(
      (response) => {
        this.setState({
          movies: response.results
        });
      },
      (xhr) => {
        console.log(xhr);
      }
    )
  }

  componentWillMount() {
    ApiService.getDiscover().then(
      (response) => {
        this.setState({
          movies: response.results
        });
      },
      (xhr) => {
        console.log(xhr);
      }
    )
  }

  render() {

    const movies = [];
    this.state.movies.forEach(function(movie) {
      movies.push(
        <div key={`${movie.id}:${movie.bookmark ? movie.bookmark.id : ''}`} className="body-discover-card">
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