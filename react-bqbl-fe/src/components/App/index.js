import React from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';

import './app.css'
import DraftPage from '../pages/Draft/draft';
import HomePage from '../pages/Home/home';
import LineupPage from '../pages/Lineup/lineup';
import PlayerScorePage from '../pages/PlayerScorePage/player-score-page';
import PlayerStandingsPage from '../pages/PlayerStandingsPage/player-standings-page';
import ScorePage from '../pages/TeamScorePage/team-score-page';
import SignInToggle from '../reusable/SignIn/sign-in-toggle';
import TeamStandingsPage from '../pages/TeamStandingsPage/team-standings-page';
import Navigation, {LINKS} from '../reusable/Navigation/navigation'

import AppBar from '@material-ui/core/AppBar';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import NativeSelect from '@material-ui/core/NativeSelect';

export const WEEK_IDS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16"]

function App() {

  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const week = new URLSearchParams(window.location.search).get("week");
  const year = new URLSearchParams(window.location.search).get("year");

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
          <NativeSelect 
            value={year} className="week-select"
            onChange={event => {
              let usp = new URLSearchParams(window.location.search);
              usp.set("year", event.target.value)
              window.location.search = usp.toString();
            }}
            input={<Input name="year" id="year-native-helper" />}
          >
            {["2017", "2018", "2019"].map(id =><option value={id}>{id}</option>)}
          </NativeSelect>

          <NativeSelect 
            value={week} className="week-select"
            onChange={event => {
              let usp = new URLSearchParams(window.location.search);
              usp.set("week", event.target.value)
              window.location.search = usp.toString();
            }}
            input={<Input name="week" id="week-native-helper" />}
          >
            {WEEK_IDS.map(id =><option value={id}>Week {id}</option>)}
          </NativeSelect>
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
      <div>
        <Route exact path="/" component={HomePage} />
        <Route path={LINKS.HOME.path} component={HomePage} />
        <Route path={LINKS.LINEUP.path} component={LineupPage} />
        <Route path={LINKS.PLAYER_SCORES.path} component={PlayerScorePage} />
        <Route path={LINKS.PLAYER_STANDINGS.path} component={PlayerStandingsPage} />
        <Route path={LINKS.TEAM_SCORES.path} component={ScorePage} />
        <Route path={LINKS.TEAM_STANDINGS.path} component={TeamStandingsPage} />
        <Route path={LINKS.DRAFT.path} component={DraftPage} />
      </div>
    </Router>
  );
}

export default App;
