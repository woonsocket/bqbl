import React, { Component, useState } from 'react';

// TODO: Every stylesheet in the source directory appears to be getting included.
import './draft.css'
import { withFirebase } from '../../Firebase';
import * as FOOTBALL from '../../../constants/football';
import {LeagueSpecDataProxy} from '../../../middle/response';
import TabPanel from '../../reusable/TabPanel/tab-panel'
import TeamIcon from '../../reusable/TeamIcon/team-icon'

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

class DraftPageBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inLeague: false,
      value: 0
    };
  }

  componentDidMount() {
    this.props.firebase.getLeagueSpecPromise(this.props.league).then(data => {
      let lsdp = new LeagueSpecDataProxy(data, this.props.year);
      let uid = this.props.firebase.getCurrentUser() ? this.props.firebase.getCurrentUser().uid : null;
      let isInLeague = lsdp.isInLeague(uid, data, this.props.year);
      let takenTeams = lsdp.getTakenTeams(data, this.props.year);
      let draftList = lsdp.getDraftList(data, this.props.year)
      this.setState({ inLeague: isInLeague, takenTeams: takenTeams, draftList: draftList });
    });
  }

  addUser() {
    // TODO: Race conditions ahoy!
    this.props.firebase.league_spec(this.props.league).once('value').then(data => {
      let lsdp = new LeagueSpecDataProxy(data, this.props.year);
      let uid = this.props.firebase.getCurrentUser() ? this.props.firebase.getCurrentUser().uid : null;
      let newData = lsdp.addUser(uid);
      this.props.firebase.league_spec(this.props.league).update(newData);
    });
  }

  selectCallback(team) {
    let params = { team: team, year: this.props.year, league: this.props.league };
    // I'm clearly holding this function invocation wrong. Need to figure out the es6y way.
    this.props.firebase.draftTeam()(params).then(result => {
      this.setState({successfulSnackbar: true})
    }).catch(error => {
      alert(error);
    });
  }

  handleChange(event, newValue) {
    this.setState({ value: newValue });
  }

  render() {
    // TODO: Redirect away from this page entirely for signed-out users.
    return <React.Fragment>
      <Tabs value={this.state.value} onChange={this.handleChange.bind(this)} variant="fullWidth">
        <Tab label="Select" />
        <Tab label="History" />
      </Tabs>
      <TabPanel value={this.state.value} index={0}>
        {this.state.inLeague ?
          <DraftSelectionGrid selectCallback={this.selectCallback.bind(this)}
            taken={this.state.takenTeams} />
          : <NotInLeagueUI addUser={this.addUser.bind(this)} />
        }
      </TabPanel>
      <TabPanel value={this.state.value} index={1}>
        <DraftSelectionList draftList={this.state.draftList} />
      </TabPanel>
      <DraftSuccessfulSnackbar open={this.state.successfulSnackbar}/>
    </React.Fragment>
  }
}

DraftSelectionGrid.propTypes = {
  taken: PropTypes.array.isRequired,
  selectCallback: PropTypes.func.isRequired,
}

function DraftSelectionGrid({ taken = [], selectCallback }) {
  const [selectedTeam, setSelectedTeam] = useState("");

  function updateSelection(team) {
    if (!taken.includes(team)) {
      setSelectedTeam(team);
    }
  }

  return (
    <div className="grid-container">
      {FOOTBALL.ALL_TEAMS.map(team =>
        // TODO: Clean up by using the classnames package.
        <div className={["team", selectedTeam === team ? "team-selected" : "", taken.includes(team) ? "taken" : ""].join(' ')}
          key={team} onClick={updateSelection.bind(this, team)}
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
  addUser: PropTypes.array.isRequired,
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
