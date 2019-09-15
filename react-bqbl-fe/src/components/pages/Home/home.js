import { Link } from 'react-router-dom';
import { withFirebase } from '../../Firebase';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Navigation from '../../reusable/Navigation/navigation'
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import SignIn from '../../reusable/SignIn/sign-in'

import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';

HomeBase.propTypes = {
  firebase: PropTypes.object.isRequired,
  league: PropTypes.string,
  year: PropTypes.string,
  leagues: PropTypes.array,
}

function HomeBase(props) {

  let [user, setUser] = useState(props.firebase.getCurrentUser());
  function authChanged(newUser) {
    setUser(newUser);
  }

  useEffect(() => {
    props.firebase.addAuthListener(authChanged)
  });

  if (user && props.league) {
    return <Navigation year={props.year} league={props.league} week={props.week} />;
  } else if (user) {
    return <AllLeagues year={props.year} leagues={props.firebase.getAllLeagues()} week={props.week} />;
  }
  return <SignIn />;
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
