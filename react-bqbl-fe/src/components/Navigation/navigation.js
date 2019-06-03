import React from 'react';
import { Link } from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import * as ROUTES from '../../constants/routes';

const LINKS = [
  { to: ROUTES.SCORES, text: 'Scores' },
  { to: ROUTES.HOME, text: 'Home' },
  { to: ROUTES.LINEUP, text: 'Lineup' },
];

function Navigation(params) {
  return (
    <List>
      {
        LINKS.map((item, index) => (
          <Link to={item.to} onClick={params.close}>
            <ListItem button key={item.text}>
              <ListItemIcon></ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          </Link>
        ))
        }
    </List>
  )
        };

  export default Navigation;
