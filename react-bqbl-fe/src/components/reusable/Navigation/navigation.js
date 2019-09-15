import React from 'react';

import { Link } from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const HOME = '/home';
const LINEUP = '/lineup';
const PLAYER_SCORES = '/player-scores';
const PLAYER_STANDINGS = '/player-standings';
const TEAM_SCORES = '/team-scores';
const TEAM_STANDINGS = '/team-standings';
const DRAFT = '/draft';

export const LINKS = {
  HOME: { path: HOME, text: 'Home' },
  LINEUP: { path: LINEUP, text: 'Lineup' },
  PLAYER_SCORES: { path: PLAYER_SCORES, text: 'Player Scores' },
  PLAYER_STANDINGS: { path: PLAYER_STANDINGS, text: 'Player Standings' },
  TEAM_SCORES: { path: TEAM_SCORES, text: 'Team Scores' },
  TEAM_STANDINGS: { path: TEAM_STANDINGS, text: 'Team Standings' },
  DRAFT: { path: DRAFT, text: 'Draft' },
};

function Navigation(props) {
  return (
    <List>
      {Object.entries(LINKS).map(([item_key, item_val], index) => (
          <Link to={{pathname: item_val.path, search: new URLSearchParams([["week", props.week],["year", props.year], ['league', props.league]]).toString() }}
                onClick={props.close} key={"link" + index}>
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
