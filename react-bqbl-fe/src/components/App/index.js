import {
  Route,
  BrowserRouter as Router,
} from 'react-router-dom';
import React from 'react';

import {CURRENT_YEAR, WEEK_IDS, footballWeek} from '../../constants/football'
import DraftPage from '../pages/Draft/draft';
import HomePage from '../pages/Home/home';
import LineupPage from '../pages/Lineup/lineup';
import Navigation, {LINKS} from '../reusable/Navigation/navigation'
import PlayerScorePage from '../pages/PlayerScorePage/player-score-page';
import PlayerStandingsPage from '../pages/PlayerStandingsPage/player-standings-page';
import BenchingPage from '../pages/BenchingPage/benching-page';
import TwentyFourPage from '../pages/TwentyFourPage/twentyfour-page';
import ScorePage from '../pages/TeamScorePage/team-score-page';
import SignInToggle from '../reusable/SignIn/sign-in-toggle';
import TeamStandingsPage from '../pages/TeamStandingsPage/team-standings-page';

import { makeStyles } from '@material-ui/styles';
import AppBar from '@material-ui/core/AppBar';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import MenuIcon from '@material-ui/icons/Menu';
import NativeSelect from '@material-ui/core/NativeSelect';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

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

  const searchParams = new URLSearchParams(window.location.search);
  const [league, setLeague] = React.useState(searchParams.get("league") || '');
  const [year, setYear] = React.useState(searchParams.get("year") || '2019');
  const [week, setWeek] = React.useState(searchParams.get("week") || '1');
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [drawerActive, setDrawerActive] = React.useState(searchParams.get('league'));
  const weekSelector = WEEK_SELECTOR_PATHS.indexOf(window.location.pathname) !== -1;
  const yearSelector = YEAR_SELECTOR_PATHS.indexOf(window.location.pathname) !== -1;

  function handleDrawerOpen() {
    setDrawerOpen(true);
  }

  function handleDrawerClose() {
    setDrawerOpen(false);
  }
 
  const LeagueYearWeekRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={routeProps => (
        <Component {...routeProps} league={league} year={year} week={week} />
    )} />
  )

  setInterval(() => {
    let usp = new URLSearchParams(window.location.search);
    setLeague(usp.get('league'))
    setYear(usp.get('year') || CURRENT_YEAR)
    setWeek(usp.get('week') || footballWeek())
    setDrawerActive(usp.get('league'));
  }, 200);
  
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          {drawerActive &&
            <IconButton edge="start" color="inherit" aria-label="Menu"
              onClick={handleDrawerOpen}>
              <MenuIcon />
            </IconButton>
          }
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
            {["2017", "2018", "2019"].map(id =><option value={id} key={id}>{id}</option>)}
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
          <Navigation close={handleDrawerClose} league={league} year={year} week={week} />
        </Drawer>
      </AppBar>
      <div>
        <LeagueYearWeekRoute exact path="/" component={HomePage} />
        <LeagueYearWeekRoute path={LINKS.HOME.path} component={HomePage} />
        <LeagueYearWeekRoute path={LINKS.LINEUP.path} component={LineupPage} />
        <LeagueYearWeekRoute path={LINKS.PLAYER_SCORES.path} component={PlayerScorePage} />
        <LeagueYearWeekRoute path={LINKS.PLAYER_STANDINGS.path} component={PlayerStandingsPage} />
        <LeagueYearWeekRoute path={LINKS.TEAM_SCORES.path} component={ScorePage} />
        <LeagueYearWeekRoute path={LINKS.TEAM_STANDINGS.path} component={TeamStandingsPage} />
        <LeagueYearWeekRoute path={LINKS.DRAFT.path} component={DraftPage} />
        <LeagueYearWeekRoute path={LINKS.BENCHING.path} component={BenchingPage} />
        <LeagueYearWeekRoute path={LINKS.TWENTYFOUR.path} component={TwentyFourPage} />
      </div>
    </Router>
  );
}

export default App;
