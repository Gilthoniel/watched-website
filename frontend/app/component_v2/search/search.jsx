import React from 'react';
import Toastr from 'toastr';

import ApiService from '../../service/api-service';

import SearchCard from './search-card.jsx';

require('./search.scss');

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

  render() {
    const medias = this.state.medias.map((media) => {
      return (
        <div className="search-container-item" key={media.id}>
          <SearchCard media={media} />
        </div>
      );
    });

    return (
      <div className="w-search container" ref={(c) => this._scroll = c}>
        <div className="search-container">
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