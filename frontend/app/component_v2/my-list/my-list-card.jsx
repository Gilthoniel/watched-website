import React from 'react';
import {browserHistory} from 'react-router';
import Toastr from 'toastr';

import * as MediaApi from '../../utils/media';
import ApiService from '../../service/api-service';
import MediaType from '../../constants/media-type';
import Dates from '../../utils/dates';

import ScoreStar from '../score-star/score-star.jsx';

require('./my-list-card.scss');

const MAXIMUM_OVERVIEW_LENGTH = 100;

export default class MyListCard extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      configuration: undefined
    };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const media = this.props.media;

    let url = media.id;
    if (media.media_type === MediaType.MOVIE) {
      url = "/movie/" + url;
    } else if (media.media_type === MediaType.TV_SERIES) {
      url = "/series/" + url;
    }

    browserHistory.push(url);
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

    const overview = media.overview.length <= MAXIMUM_OVERVIEW_LENGTH ?
      media.overview : media.overview.substr(0, MAXIMUM_OVERVIEW_LENGTH) + '...';

    return (
      <div className="my-list-card" onClick={this.handleClick}>
        <div className="my-list-card-poster" style={poster}></div>
        <div className="my-list-card-body">
          <div className="title">{media.title}</div>
          <div className="date">
            <div className="score">
              <ScoreStar score={media.score_average}/>
            </div>

            {Dates.format(media.release_date)}
          </div>
          <div className="overview">{overview}</div>
        </div>
      </div>
    );
  }
}