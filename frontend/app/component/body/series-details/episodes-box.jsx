import React from 'react';

import SeasonBox from './season-box.jsx';

export default class EpisodesBox extends React.Component {

  render() {

    const style = {
      flex: 1
    };

    if (!this.props.series.seasons || this.props.series.seasons.length == 0) {
      return (
        <div className="b-box b-episodes" style={style}>
          <h5>Episodes</h5>
          <p>
            No episodes found.
          </p>
        </div>
      )
    }

    const indices = Object.keys(this.props.series.seasons);
    const seasons = indices.map((i) => {
      const season = this.props.series.seasons[i];

      return (
        <SeasonBox season={season} series={this.props.series} key={season.id} onover={this.props.onover}/>
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