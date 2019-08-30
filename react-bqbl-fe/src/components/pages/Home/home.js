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
    this.state = {
      user: this.props.firebase.getCurrentUser()
    };
  }

  componentDidMount() {
    this.props.firebase.addAuthListener(this.authChanged.bind(this))
  }

  authChanged(user) {
    this.setState({user: user});
  }

  static propTypes = {
    firebase: PropTypes.object.isRequired,
  };

  render() {
    return (
      this.state.user ? <LeagueHome/> : <SignIn/>
    );
  }
}


LeagueHome.propTypes = {
}

function LeagueHome(props) {
  return (
    <Navigation/>
  );
}

const Home = compose(
  withRouter,
  withFirebase,
)(HomeBase);

export default Home;
