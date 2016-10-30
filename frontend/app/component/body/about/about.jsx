import React from 'react';

require('./about.scss');

export default class About extends React.Component {
  render() {
    return (
      <div className="about">
        <p>
          This project is developed by an Engineering student at EPFL in Switzerland using
          the <a href="https://facebook.github.io/react/">React</a> library
          as the main framework and <a href="https://www.themoviedb.org/">The Movie Database</a> API for
          the data set.
        </p>

        <ul className="links">
          <li>
            <a href="mailto:contact@grimsoft.ch">
              <span className="glyphicon glyphicon-envelope" />
            </a>
          </li>
          <li>
            <a href="https://ch.linkedin.com/in/gaylor-bosson-988a6254">
              <span className="glyphicon glyphicon-user" />
            </a>
          </li>
        </ul>
      </div>
    );
  }
}