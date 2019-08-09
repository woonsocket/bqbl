import React from 'react';

import { Link } from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import * as ROUTES from '../../constants/routes';

// TODO: Line up with parameterized routes?
const LINKS = [
  { to: ROUTES.HOME, text: 'Home' },
  { to: ROUTES.LINEUP, text: 'Lineup' },
  { to: ROUTES.PLAYER_SCORES, text: 'Player Scores' },
  { to: ROUTES.PLAYER_STANDINGS, text: 'Player Standings' },
  { to: ROUTES.TEAM_SCORES, text: 'Team Scores' },
  { to: ROUTES.TEAM_STANDINGS, text: 'Team Standings' },
  { to: ROUTES.DRAFT, text: 'Draft' },
];

function Navigation(params) {
  return (
    <List>
      {
        LINKS.map((item, index) => (
          <Link to={item.to} onClick={params.close} key={"link" + index}>
            <ListItem button key={item.text}>
              <ListItemText primary={item.text} />
            </ListItem>
          </Link>
        ))
      }
    </List>
  )
}

export default Navigation;
