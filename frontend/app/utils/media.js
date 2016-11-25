
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
  if (conf && (media.backdrop || media.still_path)) {
    backdrop = conf.secure_base_url;
    backdrop += conf.backdrop_sizes[3];
    backdrop += media.backdrop || media.still_path;
  }

  return backdrop;
}

export function profile(person, conf) {
  let profile = '';
  if (conf && person.profile_path) {
    profile = conf.secure_base_url;
    profile += conf.profile_sizes[1];
    profile += person.profile_path;
  }

  return profile;
}