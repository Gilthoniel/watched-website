import React from 'react';
import Body from './component/body/body.jsx';
import Header from './component/header/header.jsx';
import Discover from './component/body/discover/discover.jsx';
import MovieDetails from './component/body/movie-details/movie-details.jsx';
import {Router, Route, browserHistory} from 'react-router';
import {render} from 'react-dom';

require('./style/app.scss');
require("jquery-mousewheel")($);
require('malihu-custom-scrollbar-plugin')($);

class App extends React.Component {

  componentDidMount() {
    $('#app').find('.body-scroll').mCustomScrollbar();
  }

  render() {
    return (
      <div id="watched-wrapper">
        <Header/>

        <div className="body-scroll">
          <Body>{this.props.children}</Body>
        </div>
      </div>
    );
  }
}

render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route path="/" component={Discover}/>
      <Route path="/discover" component={Discover}/>
      <Route path="/movie/:id" component={MovieDetails}/>
    </Route>
  </Router>
), document.getElementById('app'));
