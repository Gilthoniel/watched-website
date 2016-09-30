import React from 'react';

import EpisodeBookmarkPin from './../media/episode-bookmark-pin.jsx';
import SeasonBookmarkPin from './../media/season-bookmark-pin.jsx';

export default class SeasonBox extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      collapsed: true,
      season: this.props.season
    };

    this.updatePins = this.updatePins.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.computeSeasonHeight();
  }

  componentDidUpdate() {
    this.computeSeasonHeight();
  }

  handleClick() {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  updatePins(season) {
    this.setState({
      season: season
    });
  }

  computeSeasonHeight() {
    const box = this._box;
    if (!box) {
      return;
    }

    const hTitle = $(box).find('h6').outerHeight(true);
    if (this.state.collapsed) {
      $(box).css('height', hTitle);
    } else {
      const hList = $(box).find('ul').outerHeight(true);
      $(box).css('height', hTitle + hList);
    }
  }

  render() {
    const season = this.state.season;

    if (!season) {
      return null;
    }

    const episodes = season.episodes.map((episode) => {
      return (
        <EpisodeItem
          episode={episode}
          season={season}
          series={this.props.series}
          onchange={this.updatePins}
          onover={this.props.onover}
          key={episode.id}/>
      );
    });

    return (
      <div className="season-box" ref={(c) => this._box = c}>
        <div className="season-box-pin">
          <SeasonBookmarkPin season={season} series={this.props.series} onchange={this.updatePins}/>
        </div>

        <h6 onClick={this.handleClick}>
          {
            (() => {
              if (this.state.collapsed) {
                return <span className="glyphicon glyphicon-chevron-up"/>
              } else {
                return <span className="glyphicon glyphicon-chevron-down"/>
              }
            })()
          }
          Season {season.season_number}
        </h6>
        <ul>
          {episodes}
        </ul>
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
          <EpisodeBookmarkPin
            episode={episode}
            season={this.props.season}
            series={this.props.series}
            onchange={this.props.onchange}/>
        </div>
        <div className="episode-info number">{episode.episode_number}</div>
        <div className="episode-info name">{episode.name}</div>
      </li>
    );
  }

}