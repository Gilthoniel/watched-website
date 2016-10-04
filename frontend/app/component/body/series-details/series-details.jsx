import React from 'react';
import Toastr from 'toastr';

import SeriesBookmarkPin from '../media/series-bookmark-pin.jsx';
import EpisodesBox from './episodes-box.jsx';

import * as MediaApi from '../../../utils/media';
import ApiService from '../../../service/api-service';
import Session from '../../../service/session-service';

require('./series-details.scss');

export default class SeriesDetails extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      series: undefined,
      episode: undefined,
      configuration: undefined,
    };

    Session.subscribe(this);

    this.handleHoverEpisode = this.handleHoverEpisode.bind(this);
  }

  onLoginSuccess() {
    this.loadData();
  }

  onLogoutSuccess() {
    this.loadData();
  }

  componentWillMount() {
    $('.body-series-details').mCustomScrollbar();

    this.loadData();
  }

  handleHoverEpisode(episode) {
    this.setState({
      episode: episode
    });
  }

  render() {
    
    const series = this.state.series;

    if (!series) {
      return <div>LOADING...</div>;
    }
    
    const backdrop = MediaApi.backdrop(series, this.state.configuration);
    const poster = MediaApi.poster(series, this.state.configuration);

    const episode = this.state.episode;

    const details = typeof episode === 'undefined' ?
      (
        <div className="b-details">
          <BBox title="Overview" suffix="overview" flex="3">
            {series.overview}
          </BBox>
          <BBox title="Release Date">
            {series.release_date}
          </BBox>
          <BBox title="Score">
            {series.score_average} ({series.score_total})
          </BBox>
        </div>
      ) :
      (
        <div className="b-details">
          <h5>{episode.name}</h5>

          <BBox title="Overview" suffix="overview" flex="3">
            {episode.overview}
          </BBox>
          <BBox title="Air Date" oneliner={true}>
            <span>{episode.air_date}</span>
          </BBox>
          <BBox title="More" oneliner={true}>
            <span>
              Season {episode.season_number} Episode {episode.episode_number}
            </span>
          </BBox>
          <div className="b-new-line" />
          <BBox>
            <img src={MediaApi.backdrop(episode, this.state.configuration)} alt="" />
          </BBox>
        </div>
      );
    
    return (
      <div className="body-series-details">
        <div className="series-details">
          <div className="backdrop">
            <img src={backdrop} alt="Backdrop"/>
          </div>

          <div className="information">
            <div className="information-header">
              <div className="h-poster">
                <img src={poster} alt=""/>
              </div>

              <SeriesBookmarkPin series={series} blockClassName="h-select"/>

              <div className="h-title">{series.title}</div>
            </div>

            <div className="information-body">
              {details}
              <EpisodesBox series={series} onover={this.handleHoverEpisode} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  loadData() {
    ApiService.getSeries(this.props.params.id).then(
      (series) => {
        if (!this.state.conf) {
          ApiService.getConfiguration().then((conf) => this.setState({
            series: series,
            configuration: conf
          }));
        } else {
          this.setState({
            series: series
          });
        }
      },
      () => {
        Toastr.error('error');
      }
    );
  }
}

class BBox extends React.Component {
  render() {

    let style = {
      flex: this.props.flex || 1,
      whiteSpace: this.props.oneliner ? 'nowrap' : 'normal'
    };

    return (
      <div className={(() => 'b-box' + ` b-${this.props.suffix}`)()} style={style}>
        <h5>{this.props.title}</h5>
        <p>
          {this.props.children}
        </p>
      </div>
    );
  }
}