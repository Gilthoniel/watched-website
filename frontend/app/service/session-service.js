import * as ApiService from './api-service';

const COOKIE_NAME = 'watched-session';

export class Session {

  constructor() {
    console.log('SESSION', 'Init session');

    this.isAuthenticated = false;
    this.isAuthenticating = true;
    this.user = null;

    this.observers = [];

    const token = localStorage.getItem(COOKIE_NAME);
    if (typeof token === 'string' && token !== "null") {
      setupSession.call(this, token);
    } else {
      this.isAuthenticating = false;
    }
  }

  login(username, password) {
    this.isAuthenticating = true;

    return ApiService.getToken(username, password).then(
      (response) => {
        localStorage.setItem(COOKIE_NAME, response.entity.access_token);

        setupSession.call(this, response.entity.access_token);
        return response;
      },
      () => {
        this.triggerObservers('onLoginFailure');
      }
    )
  }

  logout() {
    return ApiService.logout().then(
      () => {
        localStorage.removeItem(COOKIE_NAME);
        ApiService.destroyToken();

        this.isAuthenticated = false;
        this.user = null;

        this.triggerObservers('onLogoutSuccess');
      }
    )
  }

  subscribe(component) {
    this.observers = this.observers.filter((a) => typeof a !== 'undefined');

    if (this.observers.indexOf(component) < 0) {
      this.observers.push(component);
    }
  }

  triggerObservers(event) {
    this.observers.forEach((observer) => {
      if (typeof observer[event] === 'function') {
        observer[event]();
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
      this.user = response.entity;

      this.triggerObservers('onLoginSuccess');
    }
  )
}

export default new Session();