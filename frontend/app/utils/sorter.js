import React from 'react';

export const ORDERS = {
  ALPHANUMERIC: 'Title',
  GENRE: 'Genre',
  SCORE: 'Score'
};

export function createContainer() {
  const container = {};

  Object.keys(ORDERS).forEach((order) => container[order] = {});
  return container;
}

export function addMedia(container, media) {
  Object.keys(ORDERS).forEach((order) => {
    const wrapper = container[order];
    let keys = [];
    if (ORDERS[order] === ORDERS.ALPHANUMERIC) {
      keys = getAlphaKey(media);
    } else if (ORDERS[order] === ORDERS.GENRE) {
      keys = getGenreKey(media);
    } else if (ORDERS[order] === ORDERS.SCORE) {
      keys = getScoreKey(media);
    }

    keys.forEach(function(key) {
      if (!wrapper.hasOwnProperty(key)) {
        wrapper[key] = [];
      }

      wrapper[`${key}`].push(media);
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
