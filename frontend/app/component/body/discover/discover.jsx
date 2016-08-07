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
    this.loadData();
  }

  onLogoutSuccess() {
    this.loadData();
  }

  componentWillMount() {
    this.loadData();
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

  loadData() {
    ApiService.getDiscover().then(
      (response) => {
        this.setState({
          movies: response.results
        });
      },
      (xhr) => {
        console.log('Cannot get Discover', xhr);
      }
    );
  }
}

export default Discover;