/**
 * Created by Gaylor on 31.07.2016.
 *
 */

const rest = require('rest');
const mime = require('rest/interceptor/mime');
const oauth = require('rest/interceptor/oAuth');
let client = rest.wrap(mime);

const namespace = 'http://localhost:9000/api';

const cache = {
  data: {},

  containsKey(key) {
    return this.data.hasOwnProperty(key);
  },

  getObject(key) {
    return this.data[key];
  },

  pushObject(key, promise) {
    this.data[key] = promise;
  }
};

/* Session */

export function setupToken(token) {
  client = rest.wrap(mime).wrap(oauth, {
    token: 'Bearer ' + token
  });
}

export function destroyToken() {
  client = rest.wrap(mime);
}

export function getToken(username, password) {

  return client({
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    path: 'http://localhost:9000/oauth/token',
    entity: {
      username: username,
      password: password,
      grant_type: 'password'
    }
  })
}

export function logout() {
  return client({
    method: 'get',
    path: 'http://localhost:9000/logout',
    mixin: {
      withCredentials: true
    }
  });
}

export function getUser() {
  return client({
    path: namespace + '/users/me',
    mixin: {
      withCredentials: true
    }
  })
}

export function getPreference() {
  return client({
    path: namespace + '/users/me/preference',
    mixin: {
      withCredentials: true
    }
  });
}

/* TheMovieDB */

export function getConfiguration() {
  const key = 'media-configuration';

  if (this.containsKey(key)) {
    return this.getObject(key);
  }

  const promise = client({
    path: namespace + '/media/configuration',
    mixin: {
      withCredentials: true
    }
  });

  this.pushObject(key, promise);
  return promise;
}
getConfiguration = getConfiguration.bind(cache);

export function getDiscover() {
  const key = 'discover';

  if (this.containsKey(key)) {
    return this.getObject(key);
  }

  const promise = client({
    path: namespace + '/media/discover',
    mixin: {
      withCredentials: true
    }
  });

  this.pushObject(key, promise);
  return promise;
}
getDiscover = getDiscover.bind(cache);

export function getMovie(id) {
  return client({
    path: namespace + '/media/movie/' + id,
    mixin: {
      withCredentials: true
    }
  });
}