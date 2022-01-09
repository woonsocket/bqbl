import React, { useContext, useEffect, useState } from 'react';

import * as FOOTBALL from '../../../constants/football';
import { LeagueSpecDataProxy } from '../../../middle/response';
import TeamIcon from '../../reusable/TeamIcon/team-icon'
import classNames from 'classnames/bind';
import RequireLeague from '../../reusable/RequireLeague';
import { FirebaseContext } from '../../Firebase';

import { makeStyles } from '@mui/styles';
import { useUser } from '../../Firebase/firebase';
import { useLeague, useYear, useProBowlOverride } from '../../AppState';
import PropTypes from 'prop-types';
import Snackbar from '@mui/material/Snackbar';

const MAX_SELECTED_TEAMS = 6;
const TEAM_ICON_WIDTH = '80px';

const useStyles = makeStyles({
  gridContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  team: {
    padding: '1em',
    minWidth: TEAM_ICON_WIDTH,
    textAlign: 'center',
  },
  cell: {
    textAlign: 'center',
  },
  teamSelected: {
    background: 'lightblue',
  }
});

function ProBowlPageBase() {
  let [isInLeague, setIsInLeague] = useState(true);
  let [selectedTeams, setSelectedTeams] = useState([]);
  let [snackbarMessage, setSnackbarMessage] = useState('');
  let [snackbarOpen, setSnackbarOpen] = useState(false);
  let user = useUser();
  let year = useYear();
  let league = useLeague();
  let override = useProBowlOverride();
  const firebase = useContext(FirebaseContext);

  useEffect(() => {
    if (!user) {
      return;
    }
    const [leagueSpecPromise, unsubLeagueSpec] = firebase.getLeagueSpec(league)
    leagueSpecPromise.then(data => {
      let lsdp = new LeagueSpecDataProxy(data, year);
      let uid = user ? user.uid : null;
      setIsInLeague(lsdp.isInLeague(uid));
    });

    const [startsPromise, unsubStarts] = firebase.getProBowlYear(
        user.uid, league, override ? "2021-2" : year);
    startsPromise.then(setSelectedTeams);
    return () => {
      unsubLeagueSpec();
      unsubStarts();
    };
  }, [firebase, year, user, league, override]);

  function selectCallback(teams) {
    firebase.updateProBowlStarts(league, override ? "2021-2" : year, teams)
        .then(() => setSelectedTeams(teams))
        .catch((err) => {
          setSnackbarOpen(true);
          console.error(err);
        });
  }

  function errorCallback(err) {
    setSnackbarMessage(err);
    setSnackbarOpen(true);
  }

  function handleSnackbarClose() {
    setSnackbarOpen(false);
  }

  return <React.Fragment>
    <h2>Select {MAX_SELECTED_TEAMS} teams</h2>
    {isInLeague
        ? <TeamSelectionGrid
              selectCallback={selectCallback}
              errorCallback={errorCallback}
              selectedTeams={selectedTeams} />
        : <div>You're not in this league.</div>
    }
    <ErrorSnackbar
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        message={snackbarMessage} />
  </React.Fragment>
}

function ProBowlPage() {
  return <RequireLeague><ProBowlPageBase/></RequireLeague>;
}

TeamSelectionGrid.propTypes = {
  selectedTeams: PropTypes.array.isRequired,
  selectCallback: PropTypes.func.isRequired,
  errorCallback: PropTypes.func.isRequired,
}

function TeamSelectionGrid({ selectedTeams = [], selectCallback, errorCallback }) {
  const styles = useStyles();

  function updateSelection(team) {
    if (selectedTeams.includes(team)) {
      // Deselect the team.
      selectCallback(selectedTeams.filter(t => t !== team));
    } else {
      if (selectedTeams.length >= MAX_SELECTED_TEAMS) {
        errorCallback(`You can select at most ${MAX_SELECTED_TEAMS} teams.`);
      } else {
        selectCallback(selectedTeams.concat([team]));
      }
    }
  }

  return (
    <div className={styles.gridContainer}>
      {FOOTBALL.ALL_TEAMS.map(team =>
        <div className={classNames(styles.team, selectedTeams.includes(team) ? styles.teamSelected : "")}
            key={team}
            onClick={() => updateSelection(team)}>
          <TeamIcon team={team} width={TEAM_ICON_WIDTH} />
          <div className="cell">
            {team}
          </div>
        </div>
      )}
    </div>
  );
}

ErrorSnackbar.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
}

function ErrorSnackbar({ open, onClose, message }) {
  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      message={message}
      open={open}
      onClose={onClose}
      autoHideDuration={5000}
    />
  );
}

export default ProBowlPage;
