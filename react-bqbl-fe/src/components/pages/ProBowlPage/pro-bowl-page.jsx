import React, { useContext, useEffect, useState } from "react";

import * as FOOTBALL from "../../../constants/football";
import { FirebaseContext } from "../../Firebase";
import RequireLeague from "../../reusable/RequireLeague";
import TeamIcon from "../../reusable/TeamIcon/team-icon";

import Snackbar from "@mui/material/Snackbar";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { isInLeague } from "../../../redux/util";
import { useLeague, useYear } from "../../AppState/app-state";
import { useUser } from "../../Firebase/firebase";

import styles from './ProBowlPage.module.css'

const MAX_SELECTED_TEAMS = 6;
const TEAM_ICON_WIDTH = '80px';


function ProBowlPageBase() {
  let [selectedTeams, setSelectedTeams] = useState([]);
  let [snackbarMessage, setSnackbarMessage] = useState("");
  let [snackbarOpen, setSnackbarOpen] = useState(false);
  let user = useUser();
  let year = useYear();
  let league = useLeague();
  const firebase = useContext(FirebaseContext);
  const leagueSpec = useSelector((state) => state.league.spec);

  let inLeague = user && isInLeague(leagueSpec, user.uid, year);

  useEffect(() => {
    if (!user) {
      return;
    }
    const unsubStarts = firebase.getProBowlYearThen(
      user.uid,
      league,
      year,
      setSelectedTeams
    );
    return () => {
      unsubStarts();
    };
  }, [firebase, year, user, league]);

  function selectCallback(teams) {
    firebase
      .updateProBowlStarts(league, year, teams)
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

  return (
    <React.Fragment>
      <h2>Select {MAX_SELECTED_TEAMS} teams</h2>
      {inLeague ? (
        <TeamSelectionGrid
          selectCallback={selectCallback}
          errorCallback={errorCallback}
          selectedTeams={selectedTeams}
        />
      ) : (
        <div>You're not in this league.</div>
      )}
      <ErrorSnackbar
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </React.Fragment>
  );
}

function ProBowlPage() {
  return (
    <RequireLeague>
      <ProBowlPageBase />
    </RequireLeague>
  );
}

TeamSelectionGrid.propTypes = {
  selectedTeams: PropTypes.array.isRequired,
  selectCallback: PropTypes.func.isRequired,
  errorCallback: PropTypes.func.isRequired,
};

function TeamSelectionGrid({
  selectedTeams = [],
  selectCallback,
  errorCallback,
}) {
  function updateSelection(team) {
    if (selectedTeams.includes(team)) {
      // Deselect the team.
      selectCallback(selectedTeams.filter((t) => t !== team));
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
        <div className={styles.team + ' ' +  (selectedTeams.includes(team) ? styles.teamSelected : "")}
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
};

function ErrorSnackbar({ open, onClose, message }) {
  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      message={message}
      open={open}
      onClose={onClose}
      autoHideDuration={5000}
    />
  );
}

export default ProBowlPage;
