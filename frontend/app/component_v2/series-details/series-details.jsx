import React from 'react';
import Toastr from 'toastr';

import * as MediaApi from '../../utils/media';
import ApiService from '../../service/api-service';
import Session from '../../service/session-service';
import Dates from '../../utils/dates';

import Loading from '../loading/loading.jsx';
import SeriesDetailsBox from './series-details-box.jsx';
import EpisodesBox from './episodes-box.jsx';
import BookmarkPin from '../bookmark-pin/bookmark-pin.jsx';

require('./series-details.scss');

export default class SeriesDetails extends React.Component {

  constructor(props) {
    super(props);

    Session.subscribe(this);

    this.state = {
      series: undefined,
      configuration: undefined
    };

    this.handleEpisodeBookmark = this.handleEpisodeBookmark.bind(this);
  }

  handleEpisodeBookmark() {
    this.forceUpdate();
  }

  componentDidMount() {
    this.loadData();
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

  render() {

    const series = this.state.series;

    if (!series) {
      return <Loading />;
    }

    const backdrop = MediaApi.backdrop(series, this.state.configuration);
    const backdropStyle = {
      backgroundImage: `url(${backdrop})`
    };

    const poster = MediaApi.poster(series, this.state.configuration);

    const genres = series['genres'].map((genre) => {
      return <span key={genre} className="series-details-label">{genre}</span>
    });

    return (
      <div className="w-series-details container">
        <div className="series-details-backdrop" style={backdropStyle}></div>

        <div className="series-details-header">
          <div className="poster">
            <img src={poster} alt="" />
          </div>

          <BookmarkPin blockClassName="series-details-pin" media={series} />

          <div className="title">
            {series.title}
          </div>
        </div>

        <div className="series-details-body">
          <SeriesDetailsBox title="Overview" flex="3">
            {series['overview']}
          </SeriesDetailsBox>

          <SeriesDetailsBox title="Genres" flex="2">
            {genres}
          </SeriesDetailsBox>

          <SeriesDetailsBox title="Release Date">
            {Dates.format(series.release_date)}
          </SeriesDetailsBox>

          <SeriesDetailsBox title="Score">
            {series.score_average} ({series.score_total})
          </SeriesDetailsBox>

          <EpisodesBox series={series} configuration={this.state.configuration} onchange={this.handleEpisodeBookmark} />
        </div>
      </div>
    );
  }
}