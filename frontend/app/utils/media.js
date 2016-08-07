
export function poster(media, conf) {
  let poster = '';
  if (conf) {
    poster = conf.base_url;
    poster += conf.poster_sizes[3];
    poster += media.poster;
  }

  return poster;
}