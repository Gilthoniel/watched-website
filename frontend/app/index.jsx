import React from 'react';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
import Helmet from 'react-helmet';
import {render} from 'react-dom';
import Toastr from 'toastr';

import Home from './component_v2/home/home.jsx';
import Body from './component_v2/body/body.jsx';

import About from './component_v2/about/about.jsx';
import MovieDetails from './component_v2/movie-details/movie-details.jsx';
import SeriesDetails from './component_v2/series-details/series-details.jsx';
import MyList from './component_v2/my-list/my-list.jsx';
import Search from './component_v2/search/search.jsx';
import Login from './component_v2/account/login.jsx';
import AccountConfirmation from './component_v2/account/confirm-account.jsx';
import Register from './component_v2/account/register.jsx';
import ResetPassword from './component_v2/account/reset-password.jsx';
import ConfirmResetPassword from './component_v2/account/confirm-reset-password.jsx';

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
      <Body>
        <Helmet
          title="GrimSoft | Watched"
          link={[
            {"rel": "icon", "type": "image/png", "href": require('./images/favicon.png')}
          ]} />

        {this.props.children}
      </Body>
    );
  }
}

render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home}/>
      <Route path="/about" component={About}/>
      <Route path="/movie/:id" component={MovieDetails}/>
      <Route path="/series/:id" component={SeriesDetails}/>
      <Route path="/my-list" component={MyList}/>
      <Route path="/search/:query" component={Search}/>
      <Route path="/account/login" component={Login}/>
      <Route path="/account/confirm" component={AccountConfirmation}/>
      <Route path="/account/register" component={Register}/>
      <Route path="/account/reset" component={ResetPassword}/>
      <Route path="/account/confirm-reset" component={ConfirmResetPassword}/>
    </Route>
  </Router>
), document.getElementById('app'));
