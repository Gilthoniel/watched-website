import React from 'react';

import EpisodeBookmarkPin from './../media/episode-bookmark-pin.jsx';

const SCROLLBAR_MARGIN_BOTTOM = 50;

export default class EpisodesBox extends React.Component {

  componentDidMount() {
    this.initScrollbar();
  }

  componentDidUpdate() {
    this.initScrollbar();
  }

  initScrollbar() {
    const box = $('.b-box-scroll');

    const height = window.innerHeight - box.offset().top - SCROLLBAR_MARGIN_BOTTOM;

    box.css('max-height', height+'px');
    box.mCustomScrollbar();
  }

  render() {

    const style = {
      flex: 1
    };

    if (!this.props.seasons || this.props.seasons.length == 0) {
      return (
        <div className="b-box b-episodes" style={style}>
          <h5>Episodes</h5>
          <p>
            No episodes found.
          </p>
        </div>
      )
    }

    const indices = Object.keys(this.props.seasons);
    const seasons = indices.map((i) => {
      const season = this.props.seasons[i];
      const episodes = season.episodes.map((episode) => {
        return (
          <EpisodeItem episode={episode} season={season} onover={this.props.onover} key={episode.id}/>
        );
      });

      return (
        <div key={season.id}>
          <h6>Season {i}</h6>
          <ul>
            {episodes}
          </ul>
        </div>
      );
    });

    return (
      <div className="b-box b-episodes" style={style}>
        <h5>Episodes</h5>

        <div className="b-box-scroll">
          {seasons}
        </div>
      </div>
    );
  }
}

class EpisodeItem extends React.Component {

  render() {
    const episode = this.props.episode;
    if (!episode) {
      return null;
    }

    return (
      <li className="episode" onMouseEnter={(() => this.props.onover(episode))} onMouseLeave={(() => this.props.onover())}>
        <div className="episode-info bookmark">
          <EpisodeBookmarkPin episode={episode} season={this.props.season}/>
        </div>
        <div className="episode-info number">{episode.episode_number}</div>
        <div className="episode-info name">{episode.name}</div>
      </li>
    );
  }

}