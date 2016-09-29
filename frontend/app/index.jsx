import React from 'react';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
import {render} from 'react-dom';
import Toastr from 'toastr';


import Body from './component/body/body.jsx';
import Header from './component/header/header.jsx';
import Discover from './component/body/discover/discover.jsx';
import MovieDetails from './component/body/movie-details/movie-details.jsx';
import SeriesDetails from './component/body/series-details/series-details.jsx';
import MyList from './component/body/my-list/my-list.jsx';
import Search from './component/body/search/search.jsx';

require('./style/app.scss');
require("jquery-mousewheel")($);
require('malihu-custom-scrollbar-plugin')($);
require('malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.css');
require('toastr/toastr.scss');

class App extends React.Component {

  constructor(props) {
    super(props);

    // Configure Toastr
    Toastr.options.closeButton = true;
    Toastr.options.preventDuplicates = true;
    Toastr.options.positionClass = "toast-bottom-left";
  }

  render() {
    return (
      <div id="watched-wrapper">
        <Header/>

        <Body>{this.props.children}</Body>
      </div>
    );
  }
}

render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route path="/" />
      <IndexRoute component={Discover}/>
      <Route path="/discover" component={Discover}/>
      <Route path="/movie/:id" component={MovieDetails}/>
      <Route path="/series/:id" component={SeriesDetails}/>
      <Route path="/my-list" component={MyList}/>
      <Route path="/search/:query" component={Search}/>
    </Route>
  </Router>
), document.getElementById('app'));
