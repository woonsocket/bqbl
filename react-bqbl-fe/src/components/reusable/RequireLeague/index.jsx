import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLeague, useWeek, useYear } from '../../AppState';
import { FirebaseContext } from '../../Firebase';

function RequireLeague(props) {
  let league = useLeague();
  let firebase = useContext(FirebaseContext);

  if (!league) {
    return <LeagueSelector leagues={firebase.getAllLeagues()}/>
  }
  return props.children;
}

function LeagueSelector(props) {
  let year = useYear();
  let week = useWeek();
  let location = useLocation();

  function makeLeagueParams(league, year, week) {
    let usp = new URLSearchParams(window.location.search);
    league && usp.set('league', league);
    year && usp.set('year', year);
    week && usp.set('week', week);
    return usp.toString();
  }

  return (
    <List>
      {props.leagues.map((league, index) => (
        <Link to={{ pathname: location.pathname, search: makeLeagueParams(league, year, week) }}
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



export default RequireLeague;
