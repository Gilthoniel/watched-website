import React from 'react';
import Toastr from 'toastr';

import BookmarkCard from './bookmark-card/bookmark-card.jsx';

import ApiService from '../../../service/api-service';
import Session from '../../../service/session-service';

require('./my-list.scss');

class MyList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      movies: [],
      isAuthenticated: Session.isAuthenticated,
      last_items: []
    };

    for (let i = 0; i < 20; i++) {
      this.state.last_items.push(<div key={i} className="my-list-item"/>);
    }

    Session.subscribe(this);
  }

  onLoginSuccess() {
    this.setState({
      isAuthenticated: true
    });
    this.loadData();
  }

  onLogoutSuccess() {
    this.setState({
      movies: [],
      isAuthenticated: false
    });
  }

  componentWillMount() {
    if (this.state.isAuthenticated) {
      this.loadData();
    }
  }

  componentDidMount() {
    $('.my-list-container').mCustomScrollbar();
  }

  componentDidUpdate() {
    $('.my-list-container').mCustomScrollbar();
  }

  render() {

    if (!this.state.isAuthenticated) {
      return (
        <div className="my-list">
          <div className="alert alert-warning">
            <p>Create an account or sign in to use this feature</p>
          </div>
        </div>
      );
    }

    const movies = this.state.movies.map(function(movie) {
      return (
        <div className="my-list-item" key={movie.id}>
          <BookmarkCard movie={movie}/>
        </div>
      );
    });

    return (
      <div className="my-list-container">
        <div className="my-list">
          {movies}
          {this.state.last_items} {/* Workaround for the last line alignment */}
        </div>
      </div>
    );
  }

  loadData() {
    ApiService.getBookmarks().then(
      (response) => this.setState({ movies: response.movies }),
      () => Toastr.error('The server is overloaded', 'Oops')
    );
  }
}

export default MyList;