import React from 'react';
import Toastr from 'toastr';

import './search.scss';
import MovieCard from '../media/movie-card.jsx';
import SeriesCard from '../media/series-card.jsx';

import ApiService from '../../../service/api-service';

const MENUS = ['Movies', 'TV Series'];

export default class Search extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      movies: [],
      series: [],
      menu: 0
    };

    this.handleMenuClick = this.handleMenuClick.bind(this);
  }

  componentWillMount() {
    this.loadData();
  }

  componentWillUpdate(nextProps) {
    if (nextProps.params.query !== this.props.params.query) {
      this.loadData(nextProps.params.query);
    }
  }

  handleMenuClick(index) {
    this.setState({
      menu: index
    });
  }

  render() {
    let medias;
    if (this.state.menu === 0) {
      medias = this.state.movies.map(function(movie) {
        return (
          <div key={movie.id} className="body-search-card">
            <MovieCard movie={movie} />
          </div>
        );
      });
    } else {
      medias = this.state.series.map(function(series) {
        return (
          <div key={series.id} className="body-search-card">
            <SeriesCard series={series} />
          </div>
        );
      });
    }

    const menus = MENUS.map((menu, index) => {
      const className = `search-menu-item ${index === this.state.menu ? 'active' : ''}`;
      return <div className={className} onClick={() => this.handleMenuClick(index)} key={index}>{menu}</div>;
    });

    return (
      <div className="body-search">
        <div className="body-search-menu">
          {menus}
        </div>

        {medias}
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