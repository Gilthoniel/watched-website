import React from 'react';
import {browserHistory} from 'react-router';
import Toastr from 'toastr';

import * as MediaApi from '../../utils/media';
import Dates from '../../utils/dates';
import ApiService from '../../service/api-service';
import MediaType from '../../constants/media-type.js';

import ScoreStar from '../score-star/score-star.jsx';

require('./search-card.scss');

const MAX_CHARACTER_OVERVIEW = 255;

export default class SearchCard extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      configuration: undefined
    };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const media = this.props.media;
    if (typeof media === 'undefined') {
      return;
    }

    const id = media.id;
    switch (media.media_type) {
      case MediaType.MOVIE:
        browserHistory.push('/movie/' + id);
        break;
      case MediaType.TV_SERIES:
        browserHistory.push('/series/' + id);
        break;
      default:
        break;
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

    const media = this.props.media;

    let poster;
    if (media.poster !== null) {
      poster = {
        backgroundImage: `url(${MediaApi.poster(media, this.state.configuration)})`
      };
    }

    let overview = media.overview || 'No overview available';
    if (overview.length > MAX_CHARACTER_OVERVIEW) {
      overview = overview.substring(0, MAX_CHARACTER_OVERVIEW) + '...'
    }

    return (
      <div className="search-card" onClick={this.handleClick}>
        <div className="search-card-poster" style={poster}></div>
        <div className="search-card-body">
          <div className="title">{media.title}</div>
          <div className="date">
            <div className="score">
              <ScoreStar score={media.score_average}/>
            </div>

            {Dates.format(media.release_date)}
          </div>
          <div className="overview">
            {overview}
          </div>
        </div>
      </div>
    );
  }
}