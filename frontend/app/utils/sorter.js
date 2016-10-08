import React from 'react';
import BookmarkCard from '../component/body/my-list/bookmark-card/bookmark-card.jsx'

export const ORDERS = {
  ALPHANUMERIC: 'Title',
  GENRE: 'Genre',
  SCORE: 'Score'
};

export function sort(container, medias, order) {
  medias.forEach(function(media) {
    let keys = [];
    if (order === ORDERS.ALPHANUMERIC) {
      keys = getAlphaKey(media);
    } else if (order === ORDERS.GENRE) {
      keys = getGenreKey(media);
    } else if (order === ORDERS.SCORE) {
      keys = getScoreKey(media);
    }

    keys.forEach(function(key) {
      if (!container.hasOwnProperty(key)) {
        container[key] = [];
      }

      container[`${key}`].push(
        <div className="my-list-item" key={media.id}>
          <BookmarkCard movie={media}/>
        </div>
      );
    });
  });
}

function getAlphaKey(media) {
  return [(media.title || '0').toLowerCase().charAt(0)];
}

function getGenreKey(media) {
  return media.genres;
}

function getScoreKey(media) {
  return [Math.ceil(media.score_average)];
}
