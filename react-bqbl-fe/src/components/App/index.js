import AppBar from '@mui/material/AppBar';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import NativeSelect from '@mui/material/NativeSelect';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuIcon from '@mui/icons-material/Menu';
import { makeStyles } from '@mui/styles';
import React from 'react';
import { Route } from 'react-router-dom';
import { WEEK_IDS } from '../../constants/football';
import { useWeek, useYear } from '../AppState';
import BenchingPage from '../pages/BenchingPage/benching-page';
import DraftPage from '../pages/Draft/draft';
import HomePage from '../pages/Home/home';
import LineupPage from '../pages/Lineup/lineup';
import PlayerScorePage from '../pages/PlayerScorePage/player-score-page';
import PlayerStandingsPage from '../pages/PlayerStandingsPage/player-standings-page';
import ProBowlPage from '../pages/ProBowlPage/pro-bowl-page';
import ProBowlScorePage from '../pages/ProBowlScorePage/pro-bowl-score-page';
import TeamScorePage from '../pages/TeamScorePage/team-score-page';
import TeamStandingsPage from '../pages/TeamStandingsPage/team-standings-page';
import TwentyFourPage from '../pages/TwentyFourPage/twentyfour-page';
import Navigation, { LINKS } from '../reusable/Navigation/navigation';
import SignInToggle from '../reusable/SignIn/sign-in-toggle';
import SafetyPage from '../pages/SafetyPage';
import FumbleSixPage from '../pages/FumbleSixPage';



const WEEK_SELECTOR_PATHS = [LINKS.PLAYER_SCORES.path, LINKS.TEAM_SCORES.path, LINKS.BENCHING.path];
const YEAR_SELECTOR_PATHS = [LINKS.PLAYER_SCORES.path, LINKS.TEAM_SCORES.path, LINKS.PLAYER_STANDINGS.path, LINKS.TEAM_STANDINGS.path, LINKS.DRAFT.path];

const useStyles = makeStyles({
  weekSelect: {
    background: 'white',
    paddingRight: '30px',
    paddingLeft: '10px',
    marginRight: '5px',
  },
  title: { flexGrow: 1 }
});

function App() {
  const classes = useStyles();

  let year = useYear()
  let week = useWeek()
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const weekSelector = WEEK_SELECTOR_PATHS.indexOf(window.location.pathname) !== -1;
  const yearSelector = YEAR_SELECTOR_PATHS.indexOf(window.location.pathname) !== -1;

  function handleDrawerOpen() {
    setDrawerOpen(true);
  }

  function handleDrawerClose() {
    setDrawerOpen(false);
  }

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="Menu"
            onClick={handleDrawerOpen}
            size="large">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            BQBL
          </Typography>
          {yearSelector &&
            <NativeSelect
              value={year} className={classes.weekSelect}
              onChange={event => {
                let usp = new URLSearchParams(window.location.search);
                usp.set("year", event.target.value)
                window.location.search = usp.toString();
              }}
              input={<Input name="year" id="year-native-helper" />}
            >
              {/* ANNUAL */}
              {["2017", "2018", "2019", "2020", "2021"].map(id => <option value={id} key={id}>{id}</option>)}
            </NativeSelect>
          }

          {weekSelector &&
            <NativeSelect
              value={week} className={classes.weekSelect}
              onChange={event => {
                let usp = new URLSearchParams(window.location.search);
                usp.set("week", event.target.value)
                window.location.search = usp.toString();
              }}
              input={<Input name="week" id="week-native-helper" />}
            >
              {WEEK_IDS.map(id => <option value={id} key={id}>Week {id}</option>)}
            </NativeSelect>
          }
          <SignInToggle />
        </Toolbar>

        <Drawer className="drawer" anchor="left"
          open={drawerOpen}>
          <div className="drawerHeader">
            <IconButton onClick={handleDrawerClose} size="large">
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <Navigation close={handleDrawerClose} />
        </Drawer>
      </AppBar>
      <div>
        <Route exact path="/" component={HomePage} />
        <Route path={LINKS.HOME.path} component={HomePage} />
        <Route path={LINKS.LINEUP.path} component={LineupPage} />
        <Route path={LINKS.PROBOWL.path} component={ProBowlPage} />
        <Route path={LINKS.PROBOWL_SCORES.path} component={ProBowlScorePage} />
        <Route path={LINKS.PLAYER_SCORES.path} component={PlayerScorePage} />
        <Route path={LINKS.PLAYER_STANDINGS.path} component={PlayerStandingsPage} />
        <Route path={LINKS.TEAM_SCORES.path}><TeamScorePage /></Route>
        <Route path={LINKS.TEAM_STANDINGS.path} component={TeamStandingsPage} />
        <Route path={LINKS.DRAFT.path} component={DraftPage} />
        <Route path={LINKS.BENCHING.path} component={BenchingPage} />
        <Route path={LINKS.TWENTYFOUR.path} component={TwentyFourPage} />
        <Route path={LINKS.FUMBLESIX.path} component={FumbleSixPage} />
        <Route path="/safety" component={SafetyPage} />
      </div>
    </div>
  );
}

export default App;
