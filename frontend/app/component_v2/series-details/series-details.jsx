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

    this.state = {
      series: undefined,
      configuration: undefined
    };

    this.handleEpisodeBookmark = this.handleEpisodeBookmark.bind(this);
  }

  handleEpisodeBookmark(withTimeout) {
    if (withTimeout) {
      setTimeout(() => this.forceUpdate(), 500);
    } else {
      this.forceUpdate()
    }
  }

  onLoginSuccess() {
    this.loadData();
  }

  onLogoutSuccess() {
    this.loadData();
  }

  onLoginFailure() {
    this.loadData();
  }

  componentDidMount() {
    Session.subscribe(this);

    if (!Session.isAuthenticating) {
      this.loadData();
    }
  }

  componentWillUnmount() {
    Session.unsubscribe(this);
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

    const runtimes = series['runtime'].map((runtime) => {
      return <div key={runtime}>{runtime} Minutes</div>
    });

    const cast = series['credits']['cast'].slice(0, 4).map((person) => {
      const profile = {
        backgroundImage: `url(${MediaApi.profile(person, this.state.configuration)})`
      };

      return (
        <div className="profile" key={person.id}>
          <div className="profile-picture" style={profile}/>
          {person.name}
        </div>
      );
    });

    let nextEpisode = undefined;
    Object.keys(series.seasons).forEach((key) => {
      series.seasons[key].episodes.forEach((episode) => {
        if (!nextEpisode && typeof episode.bookmark === 'undefined') {
          nextEpisode = episode;
        }
      });
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
          <SeriesDetailsBox className="w-box-overview" flex="2">
            <SeriesDetailsBox title="Overview">
              {series['overview']}
            </SeriesDetailsBox>

            {
              (() => {
                if (cast.length > 0) {
                  return (
                    <SeriesDetailsBox title="Cast" className="w-box-cast">
                      {cast}
                    </SeriesDetailsBox>
                  );
                }
              })()
            }

            {
              (() => {
                if (Session.isAuthenticated && typeof nextEpisode !== 'undefined') {
                  return (
                    <SeriesDetailsBox title="Next Episode" className="w-box-next">
                      <div className="episode-card">
                        <BookmarkPin blockClassName="episode-pin" media={nextEpisode} onchange={() => this.handleEpisodeBookmark(true)} />
                        <div className="episode-number">S{nextEpisode.season_number}E{nextEpisode.episode_number}</div>
                        <div>{nextEpisode.name}</div>
                        <div className="episode-date">{Dates.format(nextEpisode.air_date)}</div>
                      </div>
                    </SeriesDetailsBox>
                  );
                }
              })()
            }
          </SeriesDetailsBox>

          <SeriesDetailsBox className="w-box-facts">
            <SeriesDetailsBox title="Genres" flex="2">
              {genres}
            </SeriesDetailsBox>

            <SeriesDetailsBox title="Release Date">
              {Dates.format(series.release_date)}
            </SeriesDetailsBox>

            <SeriesDetailsBox title="Score">
              {series.score_average} ({series.score_total})
            </SeriesDetailsBox>

            <SeriesDetailsBox title="Runtime">
              {runtimes}
            </SeriesDetailsBox>
          </SeriesDetailsBox>

          <EpisodesBox series={series} configuration={this.state.configuration} onchange={this.handleEpisodeBookmark} />
        </div>
      </div>
    );
  }
}