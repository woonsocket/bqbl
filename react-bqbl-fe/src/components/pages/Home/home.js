import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SignIn from '../../reusable/SignIn/sign-in'
import { withFirebase } from '../../Firebase';
import Navigation from '../../reusable/Navigation/navigation'

import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';

import "./home.css"

class HomeBase extends Component {
  constructor(props) {
    super(props);
    let params = new URLSearchParams(props.location.search);
    this.league = params.get('league');
    this.year = params.get('year');

    this.state = {
      user: this.props.firebase.getCurrentUser()
    };
  }

  componentDidMount() {
    this.props.firebase.addAuthListener(this.authChanged.bind(this))
  }

  authChanged(user) {
    this.setState({ user: user });
  }

  static propTypes = {
    firebase: PropTypes.object.isRequired,
  };

  render() {
    if (this.state.user && this.league) {
      return <LeagueHome year={this.year} league={this.league} />;
    } else if (this.state.user) {
      return <AllLeagues year={this.year} />;
    }
    return <SignIn />;
  }
}


LeagueHome.propTypes = {
}

function LeagueHome(props) {
  return (
    <Navigation />
  );
}

function AllLeagues(props) {
  return (
    "All leagues"
  );
}

const Home = compose(
  withRouter,
  withFirebase,
)(HomeBase);

export default Home;
