import React from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';

import './app.css'
import * as ROUTES from '../../constants/routes';
import DraftPage from '../pages/Draft/draft';
import HomePage from '../pages/Home/home';
import LineupPage from '../pages/Lineup/lineup';
import PlayerScorePage from '../pages/PlayerScorePage/player-score-page';
import PlayerStandingsPage from '../pages/PlayerStandingsPage/player-standings-page';
import ScorePage from '../pages/TeamScorePage/team-score-page';
import SignInToggle from '../reusable/SignIn/sign-in-toggle';
import TeamStandingsPage from '../pages/TeamStandingsPage/team-standings-page';

import AppBar from '@material-ui/core/AppBar';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';


function App() {

  const [drawerOpen, setDrawerOpen] = React.useState(false);

  function handleDrawerOpen() {
    setDrawerOpen(true);
  }

  function handleDrawerClose() {
    setDrawerOpen(false);
  }

  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="Menu"
            onClick={handleDrawerOpen}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className="title">
            BQBL
          </Typography>
           {/* TODO: add week selector */}
          <SignInToggle/>
        </Toolbar>

        <Drawer
          className="drawer"
          anchor="left"
          open={drawerOpen}
          classes={{
            paper: "drawerPaper",
          }}
        >
          <div className="drawerHeader">
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <Navigation close={handleDrawerClose}/>
        </Drawer>
      </AppBar>

 {/* TODO: Figure out how to get leagueid, year, week treated more rationally. They should be settable from app and percolate down to PlayerScorePage. */}
      <div>
        <Route path={ROUTES.HOME} component={HomePage} />
        <Route path="/lineup/:league?" component={LineupPage} />
        <Route path="/player-scores/:league?/:year?/:week?" component={PlayerScorePage} />
        <Route path="/player-standings/:league?/:year?" component={PlayerStandingsPage} />
        <Route path="/team-scores/:year?/:week?" component={ScorePage} />
        <Route path="/team-standings/:year?" component={TeamStandingsPage} />
        <Route path="/draft/:league?" component={DraftPage} />
      </div>
    </Router>
  );
}

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
      {LINKS.map((item, index) => (
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

export default App;
