import React from 'react';

import EpisodeBookmarkPin from './../media/episode-bookmark-pin.jsx';

export default class EpisodesBox extends React.Component {

  render() {

    const style = {
      flex: 5
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
          <EpisodeItem episode={episode} season={season} key={episode.id}/>
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
        {seasons}
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
      <li className="episode">
        <div className="episode-info bookmark">
          <EpisodeBookmarkPin episode={episode} season={this.props.season}/>
        </div>
        <div className="episode-info number">{episode.episode_number}</div>
        <div className="episode-info name">{episode.name}</div>
      </li>
    );
  }

}