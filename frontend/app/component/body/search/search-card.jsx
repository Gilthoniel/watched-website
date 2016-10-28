import React from 'react';
import {browserHistory} from 'react-router';
import Toastr from 'toastr';

import BookmarkPin from '../media/bookmark-pin.jsx';
import SeriesBookmarkPin from '../media/series-bookmark-pin.jsx';

import * as MediaApi from '../../../utils/media';
import ApiService from '../../../service/api-service';
import Dates from '../../../utils/dates';

import MediaType from '../../../constants/media-type.js';

require('./search-card.scss');

const MAX_CHARACTER_OVERVIEW = 100;

export default class SearchCard extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      configuration: null
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
    if (typeof this.props.media === 'undefined') {
      return null;
    }

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
        {
          (() => {
            if (typeof poster !== 'undefined') {
              return <div className="search-card-poster" style={poster}></div>;
            }
          })()
        }

        <div className="search-card-body">
          {
            (() => {
              switch (media.media_type) {
                case MediaType.MOVIE:
                  return <BookmarkPin movie={media} blockClassName="search-card-pin"/>;
                case MediaType.TV_SERIES:
                  return <SeriesBookmarkPin series={media} blockClassName="search-card-pin"/>
                default:
                  return null;
              }
            })()
          }

          <h6>{media.title}</h6>
          <p>{Dates.format(media.release_date || media.air_date)}</p>
          <p>
            {overview}
          </p>
        </div>
      </div>
    );
  }
}