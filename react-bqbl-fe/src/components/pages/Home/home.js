import { Link } from 'react-router-dom';
import { FirebaseContext } from '../../Firebase';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Navigation from '../../reusable/Navigation/navigation'
import PropTypes from 'prop-types';
import React, { useEffect, useContext, useState } from 'react';
import SignIn from '../../reusable/SignIn/sign-in'

Home.propTypes = {
  league: PropTypes.string,
  year: PropTypes.string,
  week: PropTypes.string,
  leagues: PropTypes.array,
}

function Home(props) {
  const firebase = useContext(FirebaseContext);
  let [user, setUser] = useState(firebase.getCurrentUser());

  function authChanged(newUser) {
    setUser(newUser);
  }

  useEffect(() => {
    return firebase.addAuthListener(authChanged);
  });

  if (user && props.league) {
    return <Navigation year={props.year} league={props.league} week={props.week} />;
  } else if (user) {
    return <AllLeagues year={props.year} leagues={firebase.getAllLeagues()} week={props.week} />;
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

export default Home;
