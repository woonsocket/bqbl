import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tabs from '@mui/material/Tabs';
import CloseIcon from '@mui/icons-material/Close';
import { makeStyles } from '@mui/styles';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'react-recompose';
import * as FOOTBALL from '../../../constants/football';
import { LeagueSpecDataProxy } from '../../../middle/response';
import { useYear } from '../../AppState';
import { withFirebase } from '../../Firebase';
import { useUser } from '../../Firebase/firebase';
import TabPanel from '../../reusable/TabPanel/tab-panel';
import TeamIcon from '../../reusable/TeamIcon/team-icon';


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

DraftPageBase.propTypes = {
  firebase: PropTypes.object.isRequired,
  league: PropTypes.string.isRequired,
  year: PropTypes.string.isRequired,
}

function DraftPageBase(props) {
  let [isInLeague, setIsInLeague] = useState(false);
  // TODO: rename this
  let [value, setValue] = useState(0);
  let [takenTeams, setTakenTeams] = useState([]);
  let [successfulSnackbar, setSuccessfulSnackbar] = useState(false);
  let [draftList, setDraftList] = useState([]);
  let user = useUser();
  let year = useYear();
  
  useEffect(() => {
    let [lsPromise, unsub] = props.firebase.getLeagueSpec(props.league);
    lsPromise.then(data => {
      let lsdp = new LeagueSpecDataProxy(data, year);
      let uid = user ? user.uid : null;
      setIsInLeague(lsdp.isInLeague(uid));
      setTakenTeams(lsdp.getTakenTeams());
      setDraftList(lsdp.getDraftList());
    });
    return unsub
  }, [props.firebase, props.league, year, user]);

  function addUser() {
    // TODO(harveyj): Race conditions, not handling unsub
    let [lsPromise, unsub] = props.firebase.getLeagueSpec(props.league);
    lsPromise.then(data => {
      let lsdp = new LeagueSpecDataProxy(data, year);
      let uid = user ? user.uid : null;
      let newData = lsdp.addUser(uid);
      props.firebase.leagueSpecRef(props.league).update(newData);
    });
  }

  function selectCallback(team) {
    let params = { team: team, year: year, league: props.league };
    // I'm clearly holding this function invocation wrong. Need to figure out the es6y way.
    props.firebase.draftTeam()(params).then(() => {
      setSuccessfulSnackbar(true);
    }).catch(error => {
      alert(error);
    });
  }

  function handleChange(_event, newValue) {
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

  function handleClose(_event, reason) {
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
          <IconButton
            key="close"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
            size="large">
            <CloseIcon />
          </IconButton>,
        ]}
      />
    </div>
  );
}

DraftSuccessfulSnackbar.propTypes = {
  open: PropTypes.bool.isRequired,
}
function DraftSuccessfulSnackbar({ open }) {

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open={open}
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
