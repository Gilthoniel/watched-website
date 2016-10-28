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
      medias: []
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
    const medias = this.state.medias.map((media) => {
      const card = media.media_type === 'MOVIES' ? <MovieCard movie={media}/> : <SeriesCard series={media}/>
      return (
        <div key={media.id} className="body-search-card">
          {card}
        </div>
      );
    });

    return (
      <div className="body-search">
        <div className="body-search-container">
          {medias}
        </div>
      </div>
    );
  }

  loadData(query) {
    ApiService.search(query || this.props.params.query).then(
      (response) => {
        this.setState({
          medias: response.medias
        });
      },
      () => {
        Toastr.error('Something goes wrong when trying to search the query');
      }
    );
  }
}