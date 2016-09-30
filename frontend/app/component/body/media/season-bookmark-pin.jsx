import React from 'react';
import ApiService from '../../../service/api-service';

export default class SeasonBookmarkPin extends React.Component {

  constructor(props) {
    super(props);

    if (!this.props.season) {
      return;
    }

    this.state = {
      watched: isSeasonWatched(this.props.season)
    };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    if (this.state.watched) {
      this.removeBookmark(this.props.season, this.props.series);
    } else {
      this.addBookmark(this.props.season, this.props.series);
    }
  }

  componentWillReceiveProps(props) {
    this.setState({
      watched: isSeasonWatched(props.season)
    });
  }

  addBookmark(season, series) {
    ApiService.setBookmark(`${series.id}/${season.season_number}`, 'season').then(
      (episodes) => {
        season.episodes = episodes;

        this.setState({
          watched: true
        });

        if (this.props.onchange) {
          this.props.onchange(season);
        }
      }
    );
  }

  removeBookmark(season, series) {
    ApiService.removeBookmark(`${season.id}/${series.id}`, 'season').then(
      (episodes) => {

        season.episodes = episodes;

        this.setState({
          watched: false
        });
      }
    );
  }

  render() {
    const names = "bookmark-pin active" + (this.state.watched ? ' watched' : '');

    return (
      <div className={names} onClick={this.handleClick}></div>
    );
  }

}

function isSeasonWatched(season) {
  if (!season) {
    return false;
  }

  return !season.episodes.some((episode) => {
    return typeof episode.bookmark === 'undefined'
  })
}