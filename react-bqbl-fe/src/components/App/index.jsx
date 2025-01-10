import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import NativeSelect from '@mui/material/NativeSelect';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import React, { useContext, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { WEEK_IDS } from '../../constants/football';
import { useLeague, useWeek, useYear } from '../AppState';
import { FirebaseContext } from '../Firebase';
import BenchingPage from '../pages/BenchingPage/benching-page';
import FumbleSixPage from '../pages/FumbleSixPage';
import HomePage from '../pages/Home/home';
import LineupPage from '../pages/Lineup/lineup';
import PlayerScorePage from '../pages/PlayerScorePage/player-score-page';
import PlayerStandingsPage from '../pages/PlayerStandingsPage/player-standings-page';
import ProBowlPage from '../pages/ProBowlPage/pro-bowl-page';
import ProBowlScorePage from '../pages/ProBowlScorePage/pro-bowl-score-page';
import SafetyPage from '../pages/SafetyPage';
import StartsAdminPage from '../pages/StartsAdminPage/starts-admin-page';
import TeamScorePage from '../pages/TeamScorePage/team-score-page';
import TeamStandingsPage from '../pages/TeamStandingsPage/team-standings-page';
import TwentyFourPage from '../pages/TwentyFourPage/twentyfour-page';
import Navigation, { LINKS } from '../reusable/Navigation/navigation';
import SignInToggle from '../reusable/SignIn/sign-in-toggle';
import styles from './App.module.css'

import store from '../../redux/store';

const WEEK_SELECTOR_PATHS = [LINKS.PLAYER_SCORES.path, LINKS.TEAM_SCORES.path, LINKS.BENCHING.path];
const YEAR_SELECTOR_PATHS = [LINKS.PLAYER_SCORES.path, LINKS.TEAM_SCORES.path, LINKS.PLAYER_STANDINGS.path, LINKS.TEAM_STANDINGS.path, LINKS.DRAFT.path];
function App() {
  const year = useYear();
  const week = useWeek();
  const league = useLeague();
  const firebase = useContext(FirebaseContext);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const pathname = window.location.pathname;
  const weekSelector = WEEK_SELECTOR_PATHS.includes(pathname);
  const yearSelector = YEAR_SELECTOR_PATHS.includes(pathname);

  useEffect(() => {
    store.dispatch({type: 'year/set', year: year, firebase: firebase});
    store.dispatch({type: 'league/set', leagueId: league, firebase: firebase});
    store.dispatch({type: 'scores/load', leagueId: league, year: year, firebase: firebase});
    store.dispatch({type: 'scores247/load', leagueId: league, year: year, firebase: firebase});
  }, [firebase, league, year]);

  const handleDrawerOpen = () => setDrawerOpen(true);
  const handleDrawerClose = () => setDrawerOpen(false);

  const handleYearChange = (event) => {
    const usp = new URLSearchParams(window.location.search);
    usp.set("year", event.target.value);
    window.location.search = usp.toString();
  };

  const handleWeekChange = (event) => {
    const usp = new URLSearchParams(window.location.search);
    usp.set("week", event.target.value);
    window.location.search = usp.toString();
  };

  const YEARS = ["2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"];

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
          <Typography variant="h6" className={styles.title}>
            BQBL
          </Typography>
          {yearSelector && (
            <NativeSelect
              value={year}
              className={styles.weekSelect}
              onChange={handleYearChange}
              input={<Input name="year" id="year-native-helper" />}
            >
              {YEARS.map(id => (
                <option value={id} key={id}>{id}</option>
              ))}
            </NativeSelect>
          )}

          {weekSelector && (
            <NativeSelect
              value={week}
              className={styles.weekSelect}
              onChange={handleWeekChange}
              input={<Input name="week" id="week-native-helper" />}
            >
              {WEEK_IDS.map(id => (
                <option value={id} key={id}>Week {id}</option>
              ))}
            </NativeSelect>
          )}
          <SignInToggle />
        </Toolbar>

        <Drawer className={styles.drawer} anchor="left" open={drawerOpen}>
          <div className={styles.drawerHeader}>
            <IconButton onClick={handleDrawerClose} size="large">
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <Navigation close={handleDrawerClose} />
        </Drawer>
      </AppBar>
      <Routes>
        <Route exact path="/" element={<HomePage/>} />
        <Route path={LINKS.HOME.path} element={<HomePage/>} />
        <Route path={LINKS.LINEUP.path} element={<LineupPage/>} />
        <Route path={LINKS.PROBOWL.path} element={<ProBowlPage/>} />
        <Route path={LINKS.PROBOWL_SCORES.path} element={<ProBowlScorePage/>} />
        <Route path={LINKS.PLAYER_SCORES.path} element={<PlayerScorePage/>} />
        <Route path={LINKS.PLAYER_STANDINGS.path} element={<PlayerStandingsPage/>} />
        <Route path={LINKS.TEAM_SCORES.path} element={<TeamScorePage/>} />
        <Route path={LINKS.TEAM_STANDINGS.path} element={<TeamStandingsPage/>} />
        <Route path={LINKS.BENCHING.path} element={<BenchingPage/>} />
        <Route path={LINKS.TWENTYFOUR.path} element={<TwentyFourPage/>} />
        <Route path={LINKS.FUMBLESIX.path} element={<FumbleSixPage/>} />
        <Route path="/safety" element={<SafetyPage/>} />
        <Route path={LINKS.STARTS_ADMIN.path} element={<StartsAdminPage/>} />
      </Routes>
    </div>
  );
}

export default App;
