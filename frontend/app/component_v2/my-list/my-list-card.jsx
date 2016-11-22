import React from 'react';
import {browserHistory} from 'react-router';
import Toastr from 'toastr';

import * as MediaApi from '../../utils/media';
import ApiService from '../../service/api-service';
import MediaType from '../../constants/media-type';

require('./my-list-card.scss');

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

    return (
      <div className="my-list-card" onClick={this.handleClick}>
        <div className="my-list-card-poster" style={poster}></div>
        <div className="my-list-card-body">
          <div className="title">{media.title}</div>
        </div>
      </div>
    );
  }
}