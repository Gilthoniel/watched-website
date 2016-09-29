import React from 'react';
import Toastr from 'toastr';

import './search.scss';
import MovieCard from '../media/movie-card.jsx';
import SeriesCard from '../media/series-card.jsx';

import ApiService from '../../../service/api-service';

export default class Search extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      movies: [],
      series: []
    };
  }

  componentWillMount() {
    this.loadData();
  }

  componentWillUpdate(nextProps) {
    if (nextProps.params.query !== this.props.params.query) {
      this.loadData(nextProps.params.query);
    }
  }

  componentDidMount() {
    $('.body-search').mCustomScrollbar();
  }

  componentDidUpdate() {
    $('.body-search').mCustomScrollbar();
  }

  render() {
    const movies = this.state.movies.map(function(movie) {
      return (
        <div key={movie.id} className="body-search-card">
          <MovieCard movie={movie} />
        </div>
      );
    });
    const series = this.state.series.map(function(series) {
      return (
        <div key={series.id} className="body-search-card">
          <SeriesCard series={series} />
        </div>
      );
    });

    return (
      <div className="body-search">
        <div className="body-search-columns">
          <div className="body-search-column">
            <h6>Movies</h6>

            <div className="search-container">
              {movies}
            </div>
          </div>
          <div className="body-search-column">
            <h6>TV Shows</h6>

            <div className="search-container">
              {series}
            </div>
          </div>
        </div>
      </div>
    );
  }

  loadData(query) {
    ApiService.searchMovie(query || this.props.params.query).then(
      (response) => {
        this.setState({
          movies: response.results
        });
      },
      () => {
        Toastr.error('error');
      }
    );

    ApiService.searchTv(query || this.props.params.query).then(
      (response) => {
        this.setState({
          series: response.results
        });
      },
      () => {
        Toastr.error('error');
      }
    )
  }
}