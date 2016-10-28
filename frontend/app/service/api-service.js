/**
 * Created by Gaylor on 31.07.2016.
 *
 */

const $ = require('jquery');
const url = process.env.NODE_ENV === 'production' ? 'https://grimsoft.ch' : 'http://localhost:9000';
const namespace = url + '/api';
const cache = {
  data: {},

  containsKey(key) {
    return this.data.hasOwnProperty(key);
  },

  getObject(key) {
    return this.data[key];
  },

  pushObject(key, promise) {
    // Remove from cache if the request fails
    $.when(promise).fail(() => cache.removeKey(key));
    this.data[key] = promise
  },

  removeKey(key) {
    delete this.data[key];
  },

  clear() {
    this.data = {};
  }
};

/* Session */

class ApiService {
  constructor() {
    this.token = '';
  }

  setupToken(token) {
    this.token = token;
  }

  destroyToken() {
    this.token = '';
    cache.clear();
  }

  getToken(username, password) {
    return $.ajax({
      method: 'post',
      url: url + '/oauth/token',
      contentType: 'application/x-www-form-urlencoded',
      headers: {
        Authorization: 'Basic ' + btoa('watched-website:secret')
      },
      data: $.param({
        username: username,
        password: password,
        client_id: 'watched-website',
        grant_type: 'password'
      })
    });
  }

  //-- SESSION

  register(username, password) {
    return $.ajax({
      method: 'post',
      url: namespace + '/account/register',
      contentType: 'application/json',
      data: JSON.stringify({
        email: username,
        password: password
      })
    })
  }

  confirm(token) {
    return $.ajax({
      method: 'post',
      url: namespace + '/account/confirm',
      data: token
    });
  }

  captcha(token) {
    return $.ajax({
      method: 'post',
      url: namespace + '/account/captcha',
      data: token
    })
  }

  getUser() {
    const key = 'session.user';
    if (!cache.containsKey(key)) {
      cache.pushObject(key, $.ajax(this.generateCredentials({
        method: 'get',
        url: namespace + '/users/me'
      })));
    }

    return cache.getObject(key);
  }

  getBookmarks() {
    return $.ajax(this.generateCredentials({
      method: 'get',
      url: namespace + '/users/me/bookmarks'
    }));
  }

  setBookmark(id, type, watched) {
    type = type || 'movies';

    return $.ajax(this.generateCredentials({
      method: 'post',
      url: namespace + '/users/me/' + type + '/' + id,
      data: {
        watched: watched
      }
    }));
  }

  removeBookmark(id, type) {
    type = type || 'movies';

    return $.ajax(this.generateCredentials({
      method: 'delete',
      url: namespace + '/users/me/' + type + '/' + id
    }));
  }

  setEpisodeBookmark(episode) {
    return $.ajax(this.generateCredentials({
      method: 'post',
      url: namespace + '/users/me/episodes/bookmark',
      contentType: 'application/json',
      data: JSON.stringify(episode)
    }));
  }

  removeEpisodeBookmark(episode) {
    return $.ajax(this.generateCredentials({
      method: 'delete',
      url: namespace + '/users/me/episodes/bookmark',
      contentType: 'application/json',
      data: JSON.stringify(episode)
    }))
  }

  //-- MEDIA

  search(query) {
    return $.ajax(this.generateCredentials({
      method: 'get',
      url: namespace + '/media/search',
      data: {
        query: query
      }
    }));
  }

  searchMovie(query) {
    return $.ajax(this.generateCredentials({
      method: 'get',
      url: namespace + '/media/search/movie',
      data: {
        query: query
      }
    }));
  }

  searchTv(query) {
    return $.ajax(this.generateCredentials({
      method: 'get',
      url: namespace + '/media/search/tv',
      data: {
        query: query
      }
    }));
  }

  getDiscover(page) {
    return $.ajax(this.generateCredentials({
      method: 'get',
      url: namespace + '/media/discover',
      data: {
        page: page || 1
      }
    }));
  }

  getMovie(id) {
    return $.ajax(this.generateCredentials({
      method: 'get',
      url: namespace + '/media/movie/' + id
    }));
  }

  getSeries(id) {
    return $.ajax(this.generateCredentials({
      method: 'get',
      url: namespace + '/media/series/' + id
    }));
  }

  getConfiguration() {
    const key = 'media.configuration';
    if (!cache.containsKey(key)) {
      cache.pushObject(key, $.ajax({
        method: 'get',
        url: namespace + '/media/configuration'
      }));
    }

    return cache.getObject(key);
  }

  //-- private

  generateCredentials(object) {
    if (this.token) {
      object.headers = {
        'Authorization': 'Bearer ' + this.token
      };
    }

    return object;
  }
}

export default new ApiService();