import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SignIn from '../../reusable/SignIn/sign-in'
import { withFirebase } from '../../Firebase';
import Navigation from '../../reusable/Navigation/navigation'
import { Link } from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';

import "./home.css"

class HomeBase extends Component {
  constructor(props) {
    super(props);
    console.log(props)
    this.state = {
      user: this.props.firebase.getCurrentUser(),
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
    if (this.state.user && this.props.league) {
      return <Navigation year={this.props.year} league={this.props.league} week={this.props.week} />;
    } else if (this.state.user) {
      return <AllLeagues year={this.props.year} leagues={this.props.firebase.getAllLeagues()} week={this.props.week} />;
    }
    return <SignIn />;
  }
}

function AllLeagues(props) {

  function makeLeagueParams(league, year, week) {
    let usp = new URLSearchParams(window.location.search);
    usp.set('league', league);
    usp.set('year', year);
    week && usp.set('week', week);
    return usp.toString();
  }
  return (
    <List>
      {props.leagues.map((league, index) => (
        <Link to={{ pathname: `home`, search: makeLeagueParams(league, props.year, props.week) }}
          onClick={props.close} key={"link" + index}>
          <ListItem button key={league}>
            <ListItemText primary={league} />
          </ListItem>
        </Link>
      ))
      }
    </List>
  );
}

const Home = compose(
  withRouter,
  withFirebase,
)(HomeBase);

export default Home;
