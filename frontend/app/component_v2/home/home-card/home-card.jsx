import React from 'react';
import {browserHistory} from 'react-router';
import Toastr from 'toastr';

import * as MediaApi from '../../../utils/media';
import ApiService from '../../../service/api-service';
import Dates from '../../../utils/dates';

import ScoreStar from '../../score-star/score-star.jsx';
import BookmarkPin from '../../bookmark-pin/bookmark-pin.jsx';

require('./home-card.scss');

const MAX_CHARACTER_OVERVIEW = 255;

export default class MovieCard extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      configuration: null
    };

    this.handleClick = this.handleClick.bind(this);
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

  handleClick() {
    const media = this.props.movie;
    if (typeof media === 'undefined') {
      return;
    }

    browserHistory.push('/movie/' + media.id);
  }

  render() {

    const media = this.props.movie;
    if (typeof media === 'undefined') {
      return null;
    }

    const backdrop = MediaApi.backdrop(media, this.state.configuration);
    const style = {
      backgroundImage: `url(${backdrop})`
    };

    const poster = MediaApi.poster(media, this.state.configuration);

    let overview = media.overview || 'No overview available';
    if (overview.length > MAX_CHARACTER_OVERVIEW) {
      overview = overview.substring(0, MAX_CHARACTER_OVERVIEW) + '...'
    }

    return (
      <div className="home-card" onClick={this.handleClick}>
        <div className="home-card-bg" style={style} />

        <BookmarkPin blockClassName="home-card-pin" media={media} />

        <div className="home-card-wrapper">
          <div className="home-card-poster">
            <img src={poster} alt="" />
          </div>

          <div className="home-card-title">

            <div className="title">{media.title}</div>
            <div className="date">
              <div className="score">
                <ScoreStar score={media.score_average} />
              </div>

              {Dates.format(media.release_date)}
            </div>
            <div className="overview">
              {overview}
            </div>
          </div>
        </div>
      </div>
    );
  }

}