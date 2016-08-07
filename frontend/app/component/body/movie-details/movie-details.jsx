import React from 'react';

import * as MediaApi from '../../../utils/media';
import ApiService from '../../../service/api-service';

require('./movie-details.scss');

export default class MovieDetails extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      movie: undefined,
      configuration: undefined
    }
  }

  componentWillMount() {
    ApiService.getMovie(this.props.params.id).then(
      (movie) => {
        ApiService.getConfiguration().then(
          (conf) => {
            this.setState({
              movie: movie,
              configuration: conf
            });
          }
        );
      }
    )
  }

  render() {

    const movie = this.state.movie;

    if (!movie) {
      return <div>LOADING...</div>;
    }

    const backdrop = MediaApi.backdrop(movie, this.state.configuration);
    const poster = MediaApi.poster(movie, this.state.configuration);
    const keywords = movie.keywords.map(function(keyword) {
      return (
        <span key={keyword} className="b-keyword">{keyword}</span>
      );
    });

    return (
      <div className="body-movie-details">
        <div className="movie-details">
          <div className="backdrop">
            <img src={backdrop} alt="Backdrop"/>
          </div>
          <div className="information">
            <div className="information-header">
              <div className="h-poster">
                <img src={poster} alt=""/>
              </div>
              <div className="h-title">{movie.title}</div>
            </div>

            <div className="information-body">
              <BBox title="Overview" suffix="overview" flex="3">
                {movie.overview}
              </BBox>
              <BBox title="Keywords" suffix="keywords" flex="3">
                {keywords}
              </BBox>
              <BBox title="Release Date">
                {movie.release_date}
              </BBox>
              <BBox title="Score">
                {movie.score_average} ({movie.score_total})
              </BBox>
            </div>
          </div>
        </div>
      </div>
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
        <h6>{this.props.title}</h6>
        <p>
          {this.props.children}
        </p>
      </div>
    );
  }
}