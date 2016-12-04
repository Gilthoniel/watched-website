import React from 'react';
import Toastr from 'toastr';

import * as MediaApi from '../../utils/media';
import ApiService from '../../service/api-service';
import Session from '../../service/session-service';
import Dates from '../../utils/dates';

import Loading from '../loading/loading.jsx';
import MovieDetailsBox from './movie-details-box.jsx';
import BookmarkPin from '../bookmark-pin/bookmark-pin.jsx';

require('./movie-details.scss');

export default class MovieDetails extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      movie: undefined,
      configuration: undefined
    };
  }

  onLoginSuccess() {
    this.loadData();
  }

  onLoginFailure() {
    this.loadData();
  }

  onLogoutSuccess() {
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
    ApiService.getMovie(this.props.params.id).then(
      (movie) => {
        if (!this.state.configuration) {
          ApiService.getConfiguration().then((conf) => this.setState({
            movie: movie,
            configuration: conf
          }));
        } else {
          this.setState({
            movie: movie
          });
        }
      },
      () => {
        Toastr.error('Oops! Something goes wrong...');
      }
    );
  }

  render() {

    const movie = this.state.movie;

    if (!movie) {
      return <Loading />;
    }

    const backdrop = MediaApi.backdrop(movie, this.state.configuration);
    const backdropStyle = {
      backgroundImage: `url(${backdrop})`
    };

    const poster = MediaApi.poster(movie, this.state.configuration);

    const genres = movie['genres'].map((genre) => {
      return <span className="movie-details-label" key={genre}>{genre}</span>
    });

    const cast = movie['cast'].slice(0, 5).map((person) => {
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

    return (
      <div className="w-movie-details container">
        <div className="movie-details-backdrop" style={backdropStyle}></div>

        <div className="movie-details-header">
          <div className="poster">
            <img src={poster} alt=""/>
          </div>

          <BookmarkPin blockClassName="movie-details-pin" media={movie}/>

          <div className="title">
            {movie.title}
          </div>
        </div>

        <div className="movie-details-body">
          <MovieDetailsBox flex="2" className="w-box-overview">
            <MovieDetailsBox title="Overview">
              {movie['overview']}
            </MovieDetailsBox>
          </MovieDetailsBox>

          <MovieDetailsBox title="" flex="1">
            <MovieDetailsBox title="Genres">
              {genres}
            </MovieDetailsBox>

            <MovieDetailsBox title="Release Date">
              {Dates.format(movie.release_date)}
            </MovieDetailsBox>

            <MovieDetailsBox title="Score">
              {movie.score_average} ({movie.score_total})
            </MovieDetailsBox>

            <MovieDetailsBox title="Runtime">
              {movie.runtime} Minutes
            </MovieDetailsBox>
          </MovieDetailsBox>

          <MovieDetailsBox width="100%" title="Cast" className="w-box-cast">
            <div className="movie-details-cast">
              {cast}
            </div>
          </MovieDetailsBox>
        </div>
      </div>
    );
  }
}