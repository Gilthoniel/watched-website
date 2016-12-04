import React from 'react';

require('./score-star.scss');

export default class ScoreStar extends React.Component {

  render() {

    if (typeof this.props.score === 'undefined') {
      return null;
    }

    const stars = [...new Array(5)].map((a, i) => <div key={i} className="star"></div>);

    const score = this.props.score || 0;
    const percent = Math.ceil(score/10 * 100);
    const clipping = {
      'WebkitClipPath': `polygon(0% 0%, ${percent}% 0%, ${percent}% 100%, 0% 100%)`,
      'clipPath': `polygon(0% 0%, ${percent}% 0%, ${percent}% 100%, 0% 100%)`
    };
    const bgClipping = {
      'WebkitClipPath': `polygon(${percent}% 0%, 100% 0%, 100% 100%, ${percent}% 100%)`,
      'clipPath': `polygon(${percent}% 0%, 100% 0%, 100% 100%, ${percent}% 100%)`
    };

    return (
      <div className="score-star-box">
        <div style={clipping}>
          {stars}
        </div>
        <div style={bgClipping}>
          {stars}
        </div>
      </div>
    );
  }
}