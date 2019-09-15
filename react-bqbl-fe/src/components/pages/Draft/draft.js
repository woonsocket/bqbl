import React, { useEffect, useState } from 'react';

import { withFirebase } from '../../Firebase';
import * as FOOTBALL from '../../../constants/football';
import { LeagueSpecDataProxy } from '../../../middle/response';
import TabPanel from '../../reusable/TabPanel/tab-panel'
import TeamIcon from '../../reusable/TeamIcon/team-icon'
import classNames from 'classnames/bind';

import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import Snackbar from '@material-ui/core/Snackbar';
import Tab from '@material-ui/core/Tab';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tabs from '@material-ui/core/Tabs';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
  gridContainer: { textAlign: 'center' },
  taken: { opacity: '.3' },
  team: {
    padding: '1em',
    minWidth: '1em',
    display: 'inline-block',
  },
  cell: {
    textAlign: 'center'
  },
  teamSelected: {
    background: 'lightblue'
  }
  
});

function DraftPageBase(props) {
  let [isInLeague, setIsInLeague] = useState(false);
  // TODO: rename this
  let [value, setValue] = useState(0);
  let [takenTeams, setTakenTeams] = useState([]);
  let [successfulSnackbar, setSuccessfulSnackbar] = useState(false);
  let [draftList, setDraftList] = useState([]);
  let [user, setUser] = useState(props.firebase.getCurrentUser());

  function authChanged(newUser) {
    setUser(newUser);
  }

  useEffect(() => {
    props.firebase.addAuthListener(authChanged)
  });

  useEffect(() => {
    props.firebase.getLeagueSpecPromise(props.league).then(data => {
      let lsdp = new LeagueSpecDataProxy(data, props.year);
      let uid = props.firebase.getCurrentUser() ? props.firebase.getCurrentUser().uid : null;
      setIsInLeague(lsdp.isInLeague(uid))
      setTakenTeams(lsdp.getTakenTeams());
      setDraftList(lsdp.getDraftList());
    });
  },  [props.firebase, props.league, props.year, user]);

  function addUser() {
    // TODO: Race conditions ahoy!
    props.firebase.league_spec(props.league).once('value').then(data => {
      let lsdp = new LeagueSpecDataProxy(data, props.year);
      let uid = props.firebase.getCurrentUser() ? props.firebase.getCurrentUser().uid : null;
      let newData = lsdp.addUser(uid);
      props.firebase.league_spec(props.league).update(newData);
    });
  }

  function selectCallback(team) {
    let params = { team: team, year: props.year, league: props.league };
    // I'm clearly holding this function invocation wrong. Need to figure out the es6y way.
    props.firebase.draftTeam()(params).then(() => {
      setSuccessfulSnackbar(true);
    }).catch(error => {
      alert(error);
    });
  }

  function handleChange(event, newValue) {
    setValue(newValue)
  }

  // TODO: Redirect away from this page entirely for signed-out users.
  return <React.Fragment>
    <Tabs value={value} onChange={handleChange} variant="fullWidth">
      <Tab label="Select" />
      <Tab label="History" />
    </Tabs>
    <TabPanel value={value} index={0}>
      {isInLeague ?
        <DraftSelectionGrid selectCallback={selectCallback}
          taken={takenTeams} />
        : <NotInLeagueUI addUser={addUser} />
      }
    </TabPanel>
    <TabPanel value={value} index={1}>
      <DraftSelectionList draftList={draftList} />
    </TabPanel>
    <DraftSuccessfulSnackbar open={successfulSnackbar} />
  </React.Fragment>
}

DraftSelectionGrid.propTypes = {
  taken: PropTypes.array.isRequired,
  selectCallback: PropTypes.func.isRequired,
}

function DraftSelectionGrid({ taken = [], selectCallback }) {
  const styles = useStyles();

  const [selectedTeam, setSelectedTeam] = useState("");

  function updateSelection(team) {
    if (!taken.includes(team)) {
      setSelectedTeam(team);
    }
  }

  return (
    <div className={styles.gridContainer}>
      {FOOTBALL.ALL_TEAMS.map(team =>
        <div className={classNames(styles.team, selectedTeam === team ? styles.teamSelected : "", taken.includes(team) ? styles.taken : "")}
          key={team} onClick={updateSelection.bind(null, team)}
        >
          <TeamIcon team={team} width='80px' />
          <div className="cell">
            {team}
          </div>
        </div>
      )}
      <DraftSnackbar selectedTeam={selectedTeam} selectCallback={selectCallback} setSelectedTeamCallback={setSelectedTeam} />
    </div>
  );
}

DraftSnackbar.propTypes = {
  selectedTeam: PropTypes.string.isRequired,
  selectCallback: PropTypes.func.isRequired,
  setSelectedTeamCallback: PropTypes.func.isRequired,
}

function DraftSnackbar({ selectedTeam, selectCallback, setSelectedTeamCallback }) {

  function handleConfirm(event, reason) {
    selectCallback(selectedTeam)
    handleClose(event, reason);
  }

  function handleClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }

    setSelectedTeamCallback('');
  }

  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={selectedTeam !== ""}
        onClose={handleClose}
        message={<span id="message-id">Confirm selection</span>}
        action={[
          <Button key="undo" color="secondary" size="small" onClick={handleConfirm}>
            DRAFT {selectedTeam}
          </Button>,
          <IconButton key="close" aria-label="close" color="inherit" onClick={handleClose}>
            <CloseIcon />
          </IconButton>,
        ]}
      />
    </div>
  );
}

function DraftSuccessfulSnackbar(props) {

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open={props.open}
      autoHideDuration={6000}
      message={<span id="message-id">Draft successful!</span>}
    />
  );
}


DraftSelectionList.propTypes = {
  draftList: PropTypes.array.isRequired,
}

function DraftSelectionList({ draftList = [{ team: 'DAL', uid: 15 }] }) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Pick #</TableCell>
          <TableCell>Player</TableCell>
          <TableCell>Team</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {draftList.map((row, idx) =>
          <TableRow key={idx}>
            <TableCell component="th" scope="row">
              {`Pick ${idx + 1}`}
            </TableCell>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.team &&
              <span> <TeamIcon width="20px" team={row.team} /> {row.team} </span>}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

NotInLeagueUI.propTypes = {
  addUser: PropTypes.func.isRequired,
}

function NotInLeagueUI(props) {
  return (
    <div>
      <Button onClick={props.addUser}>Join</Button>
    </div>
  );
}

const DraftPage = compose(
  withRouter,
  withFirebase,
)(DraftPageBase);

export default DraftPage;
