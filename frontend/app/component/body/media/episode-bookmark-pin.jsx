import React from 'react';
import ApiService from '../../../service/api-service';

export default class EpisodeBookmarkPin extends React.Component {

  constructor(props) {
    super(props);

    if (!this.props.episode) {
      return;
    }

    this.state = {
      watched: typeof this.props.episode.bookmark !== 'undefined'
    };

    this.handleNumberClick = this.handleNumberClick.bind(this);
  }

  handleNumberClick() {
    if (this.state.watched) {
      this.removeBookmark(this.props.series.id, this.props.season, this.props.episode);
    } else {
      this.addBookmark(this.props.series.id, this.props.season, this.props.episode);
    }
  }

  addBookmark(seriesId, season, episode) {
    ApiService.setBookmark(`${seriesId}/${episode.id}`, 'episodes').then(
      (bookmark) => {
        episode.bookmark = bookmark;
        this.setState({
          watched: true
        });

        if (this.props.onchange) {
          this.props.onchange(season);
        }
      }
    );
  }

  removeBookmark(seriesId, season, episode) {
    ApiService.removeBookmark(`${seriesId}/${episode.id}`, 'episodes').then(
      () => {
        delete episode.bookmark;
        this.setState({
          watched: false
        });

        if (this.props.onchange) {
          this.props.onchange(season);
        }
      }
    );
  }

  componentWillReceiveProps(props) {
    this.setState({
      watched: typeof this.props.episode.bookmark !== 'undefined'
    });
  }

  render() {
    const names = "bookmark-pin active" + (this.state.watched ? ' watched' : '');

    return (
      <div className={names} onClick={this.handleNumberClick}></div>
    );
  }

}