import React from 'react';

import SeasonBox from './season-box.jsx';

const SCROLLBAR_MARGIN_BOTTOM = 50;

export default class EpisodesBox extends React.Component {

  componentDidMount() {
    this.initScrollbar();
  }

  componentDidUpdate() {
    this.initScrollbar();
  }

  initScrollbar() {
    const box = $(this._scrollbox);

    const height = window.innerHeight - box.offset().top - SCROLLBAR_MARGIN_BOTTOM;

    box.css('max-height', height+'px');
    box.mCustomScrollbar();
  }

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

        <div className="b-box-scroll" ref={(c) => this._scrollbox = c}>
          {seasons}
        </div>
      </div>
    );
  }
}