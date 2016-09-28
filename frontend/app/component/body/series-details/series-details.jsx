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
      configuration: undefined,
    };

    Session.subscribe(this);
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

  componentDidMount() {
    $('.body-series-details').mCustomScrollbar();
  }

  componentDidUpdate() {
    $('.body-series-details').mCustomScrollbar();
  }

  render() {
    
    const series = this.state.series;

    if (!series) {
      return <div>LOADING...</div>;
    }
    
    const backdrop = MediaApi.backdrop(series, this.state.configuration);
    const poster = MediaApi.poster(series, this.state.configuration);
    
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
              <BBox title="Overview" suffix="overview" flex="3">
                {series.overview}
              </BBox>
              <BBox title="Release Date">
                {series.release_date}
              </BBox>
              <BBox title="Score">
                {series.score_average} ({series.score_total})
              </BBox>
              <EpisodesBox seasons={series.seasons}/>
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

    const style = {
      flex: this.props.flex || 1
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