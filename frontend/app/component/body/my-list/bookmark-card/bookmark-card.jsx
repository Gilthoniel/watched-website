import React from 'react';
import {browserHistory} from 'react-router';
import Toastr from 'toastr';

import ApiService from '../../../../service/api-service';
import * as MediaApi from '../../../../utils/media';

require('./bookmark-card.scss');

export default class BookmarkCard extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      configuration: null
    };

    this.handleCardClick = this.handleCardClick.bind(this);
  }

  componentWillMount() {
    ApiService.getConfiguration().then(
      (conf) => this.setState({ configuration: conf }),
      () => Toastr.error('error')
    );
  }

  handleCardClick() {
    browserHistory.push('/movie/' + this.props.movie.id);
  }

  render() {

    const movie = this.props.movie;
    const poster = MediaApi.poster(movie, this.state.configuration);

    return (
      <div className="bookmark-card" onClick={this.handleCardClick}>
        <img src={poster} className="bookmark-bg" alt="" />
        <div className="bookmark-wrapper">
          <div className="bookmark-title">
            {movie.title}
          </div>
        </div>
      </div>
    );
  }
}