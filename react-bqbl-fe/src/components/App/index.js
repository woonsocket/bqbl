import React from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';

import * as ROUTES from '../../constants/routes';
import HomePage from '../Home/home';
import LineupPage from '../Lineup/lineup';
import Navigation from '../Navigation/navigation';
import PlayerScorePage from '../PlayerScorePage/player-score-page';
import PlayerStandingsPage from '../PlayerStandingsPage/player-standings-page';
import DraftPage from '../Draft/draft';
import ScorePage from '../TeamScorePage/team-score-page';
import SignIn from '../SignIn/sign-in';
import TeamStandingsPage from '../TeamStandingsPage/team-standings-page';
import './app.css'

import AppBar from '@material-ui/core/AppBar';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

function App() {

  // eslint-disable-next-line
  const [auth, setAuth] = React.useState(true);
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
          {auth && (
                <SignIn>Sign in</SignIn>
          )}
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

      <div>
        <Route path={ROUTES.HOME} component={HomePage} />
        <Route path={ROUTES.LINEUP} component={LineupPage} />
        <Route path="/player-scores/:year?/:week?" component={PlayerScorePage} />
        <Route path="/player-standings/:year?" component={PlayerStandingsPage} />
        <Route path="/team-scores/:year?/:week?" component={ScorePage} />
        <Route path="/team-standings/:year?" component={TeamStandingsPage} />
        <Route path="/draft" component={DraftPage} />
      </div>
    </Router>
  );
}
export default App;
