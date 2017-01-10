import React from 'react';
import {browserHistory} from 'react-router';
import Cookies from 'react-cookie';

import ApiService from '../../service/api-service';
import Session from '../../service/session-service';
import {ORDERS, createContainer, addMedia} from '../../utils/sorter';
import MediaType from '../../constants/media-type';

import MyListCard from './my-list-card.jsx';
import SwitchButton from './switch-button.jsx';

require('./my-list.scss');

const EXPIRATION = 1000 * 60 * 60 * 24 * 365;

export default class MyList extends React.Component {

  constructor(props) {
    super(props);

    // Get the settings if existing
    let settings;
    try {
      settings = JSON.parse(Cookies.select(/GSW-/)['GSW-my-list']);
    } catch (e) {
      console.warn('Cannot parse the cookie');
      settings = {
        show_movie: true,
        show_series: true,
        show_watched: true
      };
    }

    this.state = {
      container: createContainer(),
      order: Object.keys(ORDERS)[0],
      reverse: false,
      progress: 0.01,
      show_movie: settings.show_movie,
      show_series: settings.show_series,
      show_watched: settings.show_watched,
    };

    this.handleOrderClick = this.handleOrderClick.bind(this);
    this.filterMedia = this.filterMedia.bind(this);
  }

  handleOrderClick(order) {
    if (this.state.order === order) {
      this.setState({
        reverse: !this.state.reverse
      });
    } else {
      this.setState({
        order: order,
        reverse: false
      });
    }
  }

  onLoginSuccess() {
    this.loadData();
  }

  onLogoutSuccess() {
    // Redirect the user at the Home if he logs out
    browserHistory.push("/");
  }

  onLoginFailure() {
    // The user needs to refresh the session
    browserHistory.push("/account/login");
  }

  filterMedia(media) {
    let mustBeShow = true;
    if (!this.state.show_movie && media.media_type === MediaType.MOVIE) {
      mustBeShow = false;
    } else if (!this.state.show_series && media.media_type === MediaType.TV_SERIES) {
      mustBeShow = false;
    }

    if (mustBeShow && !this.state.show_watched) {
      if (media.media_type === MediaType.MOVIE) {
        mustBeShow = !media.bookmark.watched;
      } else {
        // Compare the total number of episodes minus the season 0 with the number of watched episodes
        const total = media.resume_seasons.reduce((prev, curr) => curr.season_number !== 0 ? prev + curr.episode_count : prev, 0);
        return media.total_episodes_watched < total;
      }
    }

    return mustBeShow;
  }

  persistSettings() {
    Cookies.save('GSW-my-list', JSON.stringify({
      show_movie: this.state.show_movie,
      show_series: this.state.show_series,
      show_watched: this.state.show_watched
    }), {
      expires: new Date(Date.now() + EXPIRATION)
    });
  }

  componentWillMount() {
    if (!Session.isAuthenticated) {
      if (!Session.isAuthenticating) {
        browserHistory.push("/account/login");
      }

      return;
    }

    this.loadData();
  }

  componentDidMount() {
    Session.subscribe(this);
  }

  componentWillUnmount() {
    Session.unsubscribe(this);
  }

  loadData() {
    let container = createContainer();
    let total = 0;
    let current = 0;

    let update = () => {
      this.setState({
        container: container,
        progress: current / Math.max(total, 1)
      });
    };

    const sock = ApiService.getWebSocketBookmarks();
    sock.onopen = function () {
      // send message
      sock.send(Session.getToken());
    };

    sock.onmessage = function (e) {
      const data = JSON.parse(e.data);

      if (data.event === "TOTAL") {
        total = Number(data.payload);
      } else if (data.event === "MOVIE") {
        addMedia(container, data.payload);
        current++;
      } else if (data.event === "SERIES") {
        addMedia(container, data.payload);
        current++;
      }

      update();
    };
  }

  render() {

    this.persistSettings();

    const order = this.state.container[this.state.order];

    const sortOrders = Object.keys(ORDERS).map((key) => {
      let state = '';
      if (this.state.order === key) {
        if (this.state.reverse) {
          state = 'glyphicon glyphicon-sort-by-attributes-alt';
        } else {
          state = 'glyphicon glyphicon-sort-by-attributes';
        }
      }

      return (
        <li key={key} onClick={() => this.handleOrderClick(key)}>
          <span className={state}/> {ORDERS[key]}
        </li>
      );
    });

    const items = [];
    Object.keys(order).sort().forEach((key) => {
      const medias = order[key].filter(this.filterMedia).map((media) => {
        return (
          <div key={media.id} className="my-list-item">
            <MyListCard media={media}/>
          </div>
        );
      });

      if (medias.length > 0) {
        items.push(
          <div key={key} className="my-list-bloc">
            <h6>{key}</h6>
            <div className="my-list-sub-bloc">
              {medias}
            </div>
          </div>
        );
      }
    });

    if (this.state.reverse) {
      items.reverse();
    }

    const loadingStyle = {
      width: `${Math.ceil(this.state.progress * 100)}%`
    };

    return (
      <div className="w-my-list container">
        <div className="my-list-options">
          <ul className="my-list-switches">
            <li onClick={() => this.setState({show_movie: !this.state.show_movie})}>
              <SwitchButton active={this.state.show_movie}/> Movies
            </li>
            <li onClick={() => this.setState({show_series: !this.state.show_series})}>
              <SwitchButton active={this.state.show_series}/> TV Shows
            </li>
            <li onClick={() => this.setState({show_watched: !this.state.show_watched})}>
              <SwitchButton active={this.state.show_watched}/> Watched
            </li>
          </ul>

          <ul>
            {sortOrders}
          </ul>

          <div className="my-list-loading">
            <div style={loadingStyle}/>
          </div>
        </div>

        <div className="my-list-container">
          {items}
        </div>
      </div>
    );
  }
}

function debounce(func, wait, immediate) {
  let timeout;
  return function () {
    let context = this, args = arguments;
    let later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    let callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}