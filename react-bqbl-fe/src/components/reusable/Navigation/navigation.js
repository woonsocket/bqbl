import React from 'react';

import { Link } from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { useWeek, useYear, useLeague } from '../../AppState';

const HOME = '/home';
const LINEUP = '/lineup';
const PROBOWL = '/probowl';
const PROBOWL_SCORES = '/probowl-scores';
const PLAYER_SCORES = '/player-scores';
const PLAYER_STANDINGS = '/player-standings';
const TEAM_SCORES = '/team-scores';
const TEAM_STANDINGS = '/team-standings';
const DRAFT = '/draft';
const BENCHING = '/benching';
const TWENTYFOUR = '/247';

export const LINKS = {
  HOME: { path: HOME, text: 'Home' },
  LINEUP: { path: LINEUP, text: 'Lineup' },
  PROBOWL: { path: PROBOWL, text: 'Pro Bowl Lineup' },
  PROBOWL_SCORES: { path: PROBOWL_SCORES, text: 'Pro Bowl Scores' },
  PLAYER_SCORES: { path: PLAYER_SCORES, text: 'Player Scores' },
  PLAYER_STANDINGS: { path: PLAYER_STANDINGS, text: 'Player Standings' },
  TEAM_SCORES: { path: TEAM_SCORES, text: 'Team Scores' },
  TEAM_STANDINGS: { path: TEAM_STANDINGS, text: 'Team Standings' },
  DRAFT: { path: DRAFT, text: 'Draft' },
  BENCHING: { path: BENCHING, text: 'Benching' },
  TWENTYFOUR: { path: TWENTYFOUR, text: '24/7 Points' },
};

function Navigation(props) {
  let week = useWeek();
  let year = useYear();
  let league = useLeague();

  function makeParams(league, year, week) {
    let usp = new URLSearchParams(window.location.search);
    league && usp.set('league', league);
    year && usp.set('year', year);
    week && usp.set('week', week);
    return usp.toString();
  }

  return (
    <List>
      {Object.entries(LINKS).map(([_item_key, item_val], index) => (
          <Link to={{pathname: item_val.path, 
            search: makeParams(league, year, week)}}
                onClick={props.close} key={"link" + index}
>
            <ListItem button key={item_val.text}>
              <ListItemText primary={item_val.text} />
            </ListItem>
          </Link>
        ))
      }
    </List>
  )
}

export default Navigation;
