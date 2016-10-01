import ApiService from './api-service';

const KEY_TOKEN = 'watched-session';

export class Session {

  constructor() {
    console.log('SESSION', 'Init session');

    this.isAuthenticated = false;
    this.isAuthenticating = true;
    this.user = null;

    this.observers = [];

    const token = localStorage.getItem(KEY_TOKEN);
    if (typeof token === 'string' && token !== '') {
      setupSession.call(this, token);
    } else {
      this.isAuthenticating = false;
    }
  }

  login(username, password) {
    this.isAuthenticating = true;

    return ApiService.getToken(username, password).then(
      (response) => {
        const token = response['access_token'];
        localStorage.setItem(KEY_TOKEN, token);

        setupSession.call(this, token);
        return response;
      },
      (xhr) => {
        this.isAuthenticating = false;
        this.triggerObservers('onLoginFailure', xhr);
      }
    )
  }

  logout() {
    localStorage.removeItem(KEY_TOKEN);
    ApiService.destroyToken();

    this.isAuthenticated = false;
    this.user = null;

    this.triggerObservers('onLogoutSuccess');
  }

  register(username, password) {
    return ApiService.register(username, password);
  }

  subscribe(component) {
    this.observers = this.observers.filter((a) => typeof a !== 'undefined');

    if (this.observers.indexOf(component) < 0) {
      this.observers.push(component);
    }
  }

  triggerObservers(event, params) {
    this.observers.forEach((observer) => {
      if (typeof observer[event] === 'function') {
        observer[event](params);
      }
    });
  }
}

function setupSession(token) {
  ApiService.setupToken(token);

  ApiService.getUser().then(
    (response) => {
      this.isAuthenticated = true;
      this.isAuthenticating = false;
      this.user = response;

      this.triggerObservers('onLoginSuccess');
    },
    (xhr) => {
      if (xhr.status === 401) {
        localStorage.removeItem(KEY_TOKEN);
        ApiService.destroyToken();

        this.isAuthenticating = false;
        this.isAuthenticated = false;
        this.triggerObservers('onLoginFailure');
      }
    }
  )
}

export default new Session();