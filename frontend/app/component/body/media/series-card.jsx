import React from 'react';
import {browserHistory} from 'react-router';
import Toastr from 'toastr';

import SeriesBookmarkPin from './series-bookmark-pin.jsx';

import * as MediaApi from '../../../utils/media';
import ApiService from '../../../service/api-service';

require('./series-card.scss');
require('../../../style/bookmark.scss');

class SeriesCard extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      configuration: null,
      active: false
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleCardClick = this.handleCardClick.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  handleClick(event) {
    event.stopPropagation(); // avoid to handle click of the card

    this.setState({
      active: !this.state.active
    });
  }

  handleCardClick() {
    const id = this.props.series.id;
    browserHistory.push('/series/' + id);
  }

  handleMouseLeave() {
    if (this.state.active) {
      this.setState({
        active: false
      });
    }
  }

  componentWillMount() {
    ApiService.getConfiguration().then(
      (response) => {
        this.setState({
          configuration: response
        });
      },
      () => {
        Toastr.error('The server is overloaded. Please try later...');
      }
    )
  }

  render() {
    const series = this.props.series;
    const poster = MediaApi.poster(series, this.state.configuration);
    const overviewBtn = 'series-card-btn' + (this.state.active ? ' active' : '');

    return (
      <div className={(() => 'series-card ' + (this.state.active ? 'series-card--in' : ''))()}
           key={series.id}
           onMouseLeave={this.handleMouseLeave}>

        {/* Background */}
        <div className="series-card-bg" onClick={this.handleCardClick}>
          <img src={poster} alt=""/>
        </div>

        {/* Information panel */}
        <div className="series-card-body">
          <SeriesBookmarkPin series={series} blockClassName="series-card-select"/>

          <div className="series-card-title">{series.title}</div>

          <div className={overviewBtn} onClick={this.handleClick}>
            <span className="glyphicon glyphicon-chevron-up"/>
          </div>

          <div className="series-card-wrapper">
            <div className="series-card-overview">
              {series.overview}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SeriesCard;