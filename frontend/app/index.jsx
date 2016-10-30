import React from 'react';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
import {render} from 'react-dom';
import Toastr from 'toastr';


import Body from './component/body/body.jsx';
import Header from './component/header/header.jsx';
import About from './component/body/about/about.jsx';
import Discover from './component/body/discover/discover.jsx';
import MovieDetails from './component/body/movie-details/movie-details.jsx';
import SeriesDetails from './component/body/series-details/series-details.jsx';
import MyList from './component/body/my-list/my-list.jsx';
import Search from './component/body/search/search.jsx';
import AccountConfirmation from './component/body/account/confirm-account.jsx';
import Registration from './component/body/account/registration.jsx';
import ResetPassword from './component/body/account/reset-password.jsx';
import ConfirmResetPassword from './component/body/account/confirm-reset-password.jsx';

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
    Toastr.options.positionClass = "toast-bottom-right";
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
      <Route path="/about" component={About} />
      <Route path="/discover" component={Discover}/>
      <Route path="/movie/:id" component={MovieDetails}/>
      <Route path="/series/:id" component={SeriesDetails}/>
      <Route path="/my-list" component={MyList}/>
      <Route path="/search/:query" component={Search}/>
      <Route path="/account/confirm" component={AccountConfirmation} />
      <Route path="/account/registration" component={Registration} />
      <Route path="/account/reset" component={ResetPassword} />
      <Route path="/account/confirm-reset" component={ConfirmResetPassword} />
    </Route>
  </Router>
), document.getElementById('app'));
