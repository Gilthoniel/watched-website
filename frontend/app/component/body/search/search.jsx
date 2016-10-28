import React from 'react';
import Toastr from 'toastr';

import './search.scss';
import SearchCard from './search-card.jsx';

import ApiService from '../../../service/api-service';

import {SCREEN_SM} from '../../../constants/index';

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
    this.initScrollbar();
  }

  componentDidUpdate() {
    this.initScrollbar()
  }

  initScrollbar() {

    let params = {
      mouseWheel: {
        totalAmount: 300
      }
    };

    if (window.innerWidth <= SCREEN_SM) {
      params.scrollInertia = 0;
      params.mouseWheel.scrollAmount = 300;
    }

    $(this._scroll).mCustomScrollbar(params);
  }

  render() {
    const medias = this.state.medias.map((media) => {
      return (
        <div className="body-search-card" key={media.id}>
          <SearchCard media={media} />
        </div>
      );
    });

    return (
      <div className="body-search" ref={(c) => this._scroll = c}>
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