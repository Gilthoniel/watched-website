
export function poster(media, conf) {
  let poster = '';
  if (conf && media.poster) {
    poster = conf.secure_base_url;
    poster += conf.poster_sizes[3];
    poster += media.poster;
  }

  return poster;
}

export function backdrop(media, conf) {
  let backdrop = '';
  if (conf && media.backdrop) {
    backdrop = conf.secure_base_url;
    backdrop += conf.backdrop_sizes[3];
    backdrop += media.backdrop;
  }

  return backdrop;
}