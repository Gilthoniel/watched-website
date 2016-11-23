import React from 'react';

import * as MediaApi from '../../utils/media';

import BookmarkPin from '../bookmark-pin/bookmark-pin.jsx';

require('./episodes-box.scss');

export default class EpisodesBox extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      season: undefined
    };

    this.handleEpisodeBookmark = this.handleEpisodeBookmark.bind(this);
    this.handleSeasonClick = this.handleSeasonClick.bind(this);
  }

  handleEpisodeBookmark() {
    const func = this.props.onchange;
    if (typeof func === 'function') {
      func();
    }
  }

  handleSeasonClick(key) {
    this.setState({
      season: key
    });
  }

  render() {

    const series = this.props.series;
    if (typeof series === 'undefined') {
      return null;
    }

    const keys = Object.keys(series.seasons)
      .filter((s) => Number(s) !== 0);

    if (typeof this.state.season === 'undefined') {
      this.state.season = keys[0];
    }

    const seasons = keys.map((key) => {
      const season = series.seasons[key];
      const state = key === this.state.season ? 'active' : '';

      return (
        <li key={season.id} className={state} onClick={() => this.handleSeasonClick(key)}>
          <BookmarkPin blockClassName="season-pin" season={season} onchange={this.handleEpisodeBookmark} />
          Season {season.season_number}
        </li>
      );
    });

    const episodes = series.seasons[this.state.season].episodes.map((episode) => {

      const still = MediaApi.backdrop(episode, this.props.configuration);

      return (
        <div key={episode.id}>
          <div className="episode-title">
            <BookmarkPin blockClassName="episode-pin" media={episode} onchange={this.handleEpisodeBookmark}/>
            <h6>{episode.name}</h6>
          </div>

          <div className="episode-body">
            <p>{episode.overview}</p>
          </div>

          <div className="episode-still">
            <img src={still} alt="" />
          </div>
        </div>
      );
    });

    return (
      <div className="episodes-box">
        <div className="episodes-box-seasons">
          <ul>
            {seasons}
          </ul>
        </div>

        <div className="episodes-box-episodes">
          {episodes}
        </div>
      </div>
    );
  }
}