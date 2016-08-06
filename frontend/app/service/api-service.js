/**
 * Created by Gaylor on 31.07.2016.
 *
 */

const $ = require('jquery');
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
  }

  getToken(username, password) {
    return $.ajax({
      method: 'post',
      url: 'http://localhost:9000/oauth/token',
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

  addMovie(id) {
    return $.ajax(this.generateCredentials({
      method: 'post',
      url: namespace + '/users/me/movies/' + id
    }));
  }

  removeMovie(id) {
    return $.ajax(this.generateCredentials({
      method: 'delete',
      url: namespace + '/users/me/movies/' + id
    }));
  }

  //-- MEDIA

  getDiscover() {
    const key = 'media.discover';
    if (!cache.containsKey(key)) {
      cache.pushObject(key, $.ajax({
        method: 'get',
        url: namespace + '/media/discover'
      }));
    }

    return cache.getObject(key);
  }

  getMovie(id) {
    const key = `media.movie.${id}`;
    if (!cache.containsKey(key)) {
      cache.pushObject(key, $.ajax({
        method: 'get',
        url: namespace + '/media/movie/' + id
      }));
    }
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